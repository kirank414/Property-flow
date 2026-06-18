import { createClient } from 'redis';
import { env } from './env';

export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      // Limit retries on initial boot to avoid blocking server startup if Redis is offline
      if (retries >= 2) {
        return new Error('Max Redis connection retries reached');
      }
      return 1000; // Retry after 1 second
    },
  },
});

redisClient.on('error', (err: any) => {
  // Suppress connection refuse errors in log output if Redis is offline to avoid terminal spam
  if (err && (err.code === 'ECONNREFUSED' || err.message?.includes('closed'))) {
    return;
  }
  console.error('❌ Redis Client Error:', err);
});
redisClient.on('connect', () => console.log('🔌 Redis Client Connected'));

// Separate connections for Socket.io Redis Adapter if needed, and BullMQ connection options
export const subClient = redisClient.duplicate();

export const redisConnection = {
  host: new URL(env.REDIS_URL).hostname,
  port: parseInt(new URL(env.REDIS_URL).port || '6379', 10),
  username: new URL(env.REDIS_URL).username || undefined,
  password: new URL(env.REDIS_URL).password || undefined,
};

// Initialize clients
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    if (!subClient.isOpen) {
      await subClient.connect();
    }
  } catch (error) {
    console.warn('⚠️ Redis connection failed. Bypassing Redis clustering and falling back to in-memory mode.', error);
  }
};
