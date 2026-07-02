import { Router } from 'express';
import { AuditController } from './audit.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';

const router = Router();

// Only system-wide Admins can inspect the operational audit log
router.get('/', requireAuth, requireRoles(['Admin']), AuditController.list);

export const auditRoutes = router;
export default auditRoutes;
