import { prisma } from '../config/db';
import { logger } from './logger';

export interface AuditLogPayload {
  userId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  details?: string | null;
}

export async function logAudit(payload: AuditLogPayload) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        userId: payload.userId || null,
        action: payload.action,
        entity: payload.entity,
        entityId: payload.entityId,
        details: payload.details || null,
      },
    });
    logger.info(`[Audit Log] ${payload.action} on ${payload.entity} (${payload.entityId}) by User: ${payload.userId || 'System'}`);
    return log;
  } catch (error) {
    logger.error('Failed to write audit log:', error);
  }
}
