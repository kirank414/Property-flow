import { Router } from 'express';
import { AuditController } from './audit.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/rbac';

const router = Router();

// Only system-wide Admins can inspect the operational audit log
router.get('/', requireAuth, requireRole('Admin'), AuditController.list);

export const auditRoutes = router;
export default auditRoutes;
