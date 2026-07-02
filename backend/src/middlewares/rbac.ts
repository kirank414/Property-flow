import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const requireRoles = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Fetch the latest user from the DB
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
      }

      // Store the full user in req.user so downstream handlers can access role, etc.
      (req as any).user = { ...req.user, role: user.role };
      
      // In our PRD schema, role is directly on the user object
      if (!roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
