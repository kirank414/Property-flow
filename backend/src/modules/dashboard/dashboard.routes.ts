import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';

const router = Router();

router.use(requireAuth);

router.get(
  '/kpis',
  requireRoles(['ADMIN', 'MANAGER']),
  DashboardController.getKPIs,
);

export const dashboardRoutes = router;
export default dashboardRoutes;
