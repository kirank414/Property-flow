import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_PRIVATE_KEY_PATH: z.string().default('keys/jwt-private.key'),
  JWT_PUBLIC_KEY_PATH: z.string().default('keys/jwt-public.key'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(25),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().default('no-reply@zillow.com'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid Environment Variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;

// Generate or load JWT Private and Public Keys for RS256
let privateKey: string;
let publicKey: string;

const privateKeyPath = path.resolve(__dirname, '../../', env.JWT_PRIVATE_KEY_PATH);
const publicKeyPath = path.resolve(__dirname, '../../', env.JWT_PUBLIC_KEY_PATH);

if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
  privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  publicKey = fs.readFileSync(publicKeyPath, 'utf8');
} else {
  // Safe fallback for local development or testing: auto-generate keypair in memory
  console.warn('⚠️  JWT Key files not found. Auto-generating development keys in memory...');
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  privateKey = keyPair.privateKey;
  publicKey = keyPair.publicKey;
}

export const jwtKeys = {
  private: privateKey,
  public: publicKey,
};
