import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { requireAuth } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/rbac';

const router = Router();

router.use(requireAuth);

router.get(
  '/kpis',
  requirePermission('system:configure'),
  DashboardController.getKPIs,
);

export const dashboardRoutes = router;
export default dashboardRoutes;
