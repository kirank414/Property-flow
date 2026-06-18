import argon2 from 'argon2';
import bcrypt from 'bcrypt';

export class CryptoService {
  /**
   * Hashes a password using Argon2id
   */
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64MB
      timeCost: 3,       // 3 iterations
      parallelism: 4,     // 4 threads
    });
  }

  /**
   * Verifies password against stored hash. Supports checking for legacy bcrypt hashes.
   */
  static async verifyPassword(
    password: string,
    hash: string,
  ): Promise<{ isValid: boolean; needsRehash: boolean }> {
    const isLegacyBcrypt = hash.startsWith('$2a$') || hash.startsWith('$2b$');

    if (isLegacyBcrypt) {
      const isValid = await bcrypt.compare(password, hash);
      return { isValid, needsRehash: true };
    }

    try {
      const isValid = await argon2.verify(hash, password);
      return { isValid, needsRehash: false };
    } catch (_error) {
      return { isValid: false, needsRehash: false };
    }
  }
}
export default CryptoService;
