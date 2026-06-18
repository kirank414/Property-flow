import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../config/redis';
import { AppError } from '../errors/AppError';

// 1. Authentication Limiter (Brute-force protection)
const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl:auth',
  points: 5, // 5 requests
  duration: 900, // Per 15 minutes (900 seconds)
  blockDuration: 900, // Block for 15 minutes if limit exceeded
});

// 2. Global API Limiter (Standard resource protection)
const apiLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl:api',
  points: 100, // 100 requests
  duration: 60, // Per minute
  blockDuration: 30, // Block for 30 seconds
});

const getLimiterMiddleware = (limiter: RateLimiterRedis) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // If Redis is not connected yet, or if we are in testing environment, bypass
    if (!redisClient.isOpen || process.env.NODE_ENV === 'test') {
      return next();
    }
    
    const key = (req as any).user?.id || req.ip;

    try {
      const rateLimiterRes = await limiter.consume(key);

      res.setHeader('X-RateLimit-Limit', limiter.points);
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());

      next();
    } catch (rejRes: any) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      res.setHeader('Retry-After', secs);
      next(new AppError(`Too many requests. Please try again in ${secs} seconds.`, 429));
    }
  };
};

export const limitAuth = getLimiterMiddleware(authLimiter);
export const limitApi = getLimiterMiddleware(apiLimiter);
