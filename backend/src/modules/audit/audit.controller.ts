import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';

export class AuditController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const skip = (page - 1) * limit;

      const items = await prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true}}}});

      const total = await prisma.auditLog.count();

      res.status(200).json({
        status: 'success',
        data: {
          logs: items.map((log) => ({
            id: log.id,
            userId: log.userId,
            userEmail: log.user?.email || null,
            userName: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System',
            action: log.action,
            entity: log.entity,
            entityId: log.entityId,
            details: log.details,
            createdAt: log.createdAt.toISOString()})),
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)}}});
    } catch (error) {
      next(error);
    }
  }
}

export default AuditController;
