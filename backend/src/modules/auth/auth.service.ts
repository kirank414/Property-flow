import { AuthRepository } from './auth.repository';
import { CryptoService } from '../../utils/crypto';
import { TokenService } from '../../utils/tokens';
import { redisClient } from '../../config/redis';
import { AppError } from '../../errors/AppError';
import crypto from 'crypto';

export class AuthService {
  private repo = new AuthRepository();

  /**
   * Registers a new user, hashes password using Argon2id, and generates session tokens
   */
  async register(data: { email: string; passwordHash: string; firstName: string; lastName: string;  }) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new AppError('A user with this email address already exists.', 409);
    }

    const hashed = await CryptoService.hashPassword(data.passwordHash);
    const user = await this.repo.createUser({
      ...data,
      passwordHash: hashed});

    const tokens = await this.generateSessionTokens(user.id);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        
        role: 'TENANT' as const,
        propertyId: null},
      tokens};
  }

  /**
   * Validates user credentials, triggers on-the-fly Argon2id password rehashing for legacy BCrypt accounts, and returns tokens
   */
  async login(email: string, password: string) {
    let user = await this.repo.findByEmail(email);
    if (!user) {
      // Demo accounts fallback: Auto-seed DB if it's completely empty and user tries to log in
      const demoEmails = ['admin@propertyflow.com', 'manager@propertyflow.com', 'staff@propertyflow.com', 'tenant@propertyflow.com'];
      if (demoEmails.includes(email) && password === 'password123') {
        const userCount = await this.repo.count();
        if (userCount === 0) {
          console.log(`[Demo Auto-Seed] Database is empty. Seeding triggered by ${email}...`);
          try {
            const { runDemoSeed } = await import('../../scripts/demo-seed');
            await runDemoSeed();
            user = await this.repo.findByEmail(email);
          } catch (seedErr) {
            console.error('Auto-seed failed:', seedErr);
          }
        }
      }

      if (!user) {
        throw new AppError('Invalid email or password.', 401);
      }
    }

    const { isValid, needsRehash } = await CryptoService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    // On-the-fly password upgrade from legacy BCrypt to Argon2id
    if (needsRehash) {
      const updatedHash = await CryptoService.hashPassword(password);
      await this.repo.updatePassword(user.id, updatedHash).catch((err) => {
        console.error(`⚠️ Password migration to Argon2id failed for user ${user.id}:`, err);
      });
    }

    
    const role = user.role as 'ADMIN' | 'MANAGER' | 'STAFF' | 'TENANT';
    
    
    

    const tokens = await this.generateSessionTokens(user.id);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        
        avatarUrl: user.avatarUrl,
        role,
        propertyId: user.propertyId || null},
      tokens};
  }

  /**
   * Gets current user profile with roles loaded
   */
  async getCurrentUser(userId: string) {
    const user = await this.repo.findByIdWithRelations(userId);
    if (!user) {
      throw new AppError('User not found or deleted.', 404);
    }

    
    const role = user.role as 'ADMIN' | 'MANAGER' | 'STAFF' | 'TENANT';
    
    
    

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      
      avatarUrl: user.avatarUrl,
      role,
      propertyId: user.propertyId || null,
      createdAt: user.createdAt.toISOString()};
  }

  /**
   * Resolves a refresh token from Redis, handles rotation, and returns a new session token pair
   */
  async refresh(token: string) {
    const redisKey = `refresh_token:${token}`;
    const userId = await redisClient.get(redisKey);
    if (!userId) {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    const user = await this.repo.findById(userId);
    if (!user) {
      throw new AppError('User not found or deleted.', 401);
    }

    // Revoke old refresh token (Token Rotation Strategy)
    await redisClient.del(redisKey);

    const tokens = await this.generateSessionTokens(userId);
    return tokens;
  }

  /**
   * Revokes the refresh token from Redis, effectively logging out the session
   */
  async logout(token: string) {
    const redisKey = `refresh_token:${token}`;
    await redisClient.del(redisKey);
  }

  /**
   * Creates a password reset token in Redis and simulates sending an email
   */
  async forgotPassword(email: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      // Avoid enumerating email addresses; return success even if email doesn't exist
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const redisKey = `reset_token:${resetToken}`;
    
    // Store token mapping to user ID for 1 hour (3600 seconds)
    await redisClient.set(redisKey, user.id, { EX: 3600 });

    // In a real application, trigger background job via BullMQ to send recovery email
    console.log(`✉️ Password reset token generated for user ${user.id}: ${resetToken}`);
  }

  /**
   * Validates the password reset token, updates the database, and revokes the token
   */
  async resetPassword(token: string, newPassword: string) {
    const redisKey = `reset_token:${token}`;
    const userId = await redisClient.get(redisKey);
    if (!userId) {
      throw new AppError('Invalid or expired reset token.', 400);
    }

    const hashed = await CryptoService.hashPassword(newPassword);
    await this.repo.updatePassword(userId, hashed);

    // Revoke reset token
    await redisClient.del(redisKey);
  }

  /**
   * Directly resets the password for a user given their email address (demo immediate flow)
   */
  async resetPasswordImmediate(email: string, newPassword: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new AppError('No user found with the specified email address.', 404);
    }

    const hashed = await CryptoService.hashPassword(newPassword);
    await this.repo.updatePassword(user.id, hashed);
  }

  /**
   * Helper function generating access and refresh tokens, caching refresh token in Redis (7 days TTL)
   */
  private async generateSessionTokens(userId: string) {
    const accessToken = TokenService.signAccessToken({ id: userId });
    const refreshToken = TokenService.generateRefreshToken();

    // Cache: refresh_token:TOKEN -> USER_ID (Expires in 7 days)
    const redisKey = `refresh_token:${refreshToken}`;
    await redisClient.set(redisKey, userId, { EX: 7 * 24 * 3600 });

    return {
      accessToken,
      refreshToken};
  }
}

export default AuthService;
