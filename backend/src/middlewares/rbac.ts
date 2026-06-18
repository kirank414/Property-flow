import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import { prisma } from '../config/db';
import { AppError } from '../errors/AppError';

/**
 * Enforces that a user has a specific granular permission. Cached via Redis.
 */
export const requirePermission = (requiredPermission: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized: Access credentials required.', 401);
      }

      const cacheKey = `user:permissions:${userId}`;
      let permissions: string[] = [];

      // Try reading from Redis cache first
      if (redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          permissions = JSON.parse(cached);
        }
      }

      // Query database if not cached
      if (permissions.length === 0) {
        const userRoles = await prisma.userRole.findMany({
          where: { userId },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        });

        permissions = userRoles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.name),
        );

        // Cache user permissions for 1 hour
        if (redisClient.isOpen) {
          await redisClient.set(cacheKey, JSON.stringify(permissions), { EX: 3600 });
        }
      }

      if (!permissions.includes(requiredPermission)) {
        throw new AppError('Forbidden: Insufficient privileges.', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Enforces that a user belongs to a specific role. Cached via Redis.
 */
export const requireRole = (requiredRole: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized: Access credentials required.', 401);
      }

      const cacheKey = `user:roles:${userId}`;
      let roles: string[] = [];

      if (redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          roles = JSON.parse(cached);
        }
      }

      if (roles.length === 0) {
        const userRoles = await prisma.userRole.findMany({
          where: { userId },
          include: {
            role: true,
          },
        });

        roles = userRoles.map((ur) => ur.role.name);

        if (redisClient.isOpen) {
          await redisClient.set(cacheKey, JSON.stringify(roles), { EX: 3600 });
        }
      }

      if (!roles.includes(requiredRole)) {
        throw new AppError('Forbidden: Insufficient role assignment.', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Utility function to clear user authorization caches in Redis (called on user-role assignment changes)
 */
export const clearAuthCache = async (userId: string) => {
  if (redisClient.isOpen) {
    await redisClient.del(`user:permissions:${userId}`);
    await redisClient.del(`user:roles:${userId}`);
  }
};
