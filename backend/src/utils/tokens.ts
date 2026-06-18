import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { jwtKeys, env } from '../config/env';

export interface AccessTokenPayload {
  id: string;
}

export class TokenService {
  /**
   * Signs an Access JWT using private key (RS256)
   */
  static signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, jwtKeys.private, {
      algorithm: 'RS256',
      expiresIn: env.JWT_ACCESS_EXPIRATION as any,
    });
  }

  /**
   * Verifies an Access JWT using public key (RS256)
   */
  static verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, jwtKeys.public, {
      algorithms: ['RS256'],
    }) as AccessTokenPayload;
  }

  /**
   * Generates a secure random refresh token string
   */
  static generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }
}

export default TokenService;
