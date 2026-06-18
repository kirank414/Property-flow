import { Router } from 'express';
import { MaintenanceController } from './maintenance.controller';
import { requireAuth } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import {
  createRequestSchema,
  assignTechnicianSchema,
  updateStatusSchema,
  requestIdParamSchema,
} from './maintenance.zod';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requirePermission('maintenance:create'),
  validate(createRequestSchema),
  MaintenanceController.create,
);

router.get(
  '/',
  requirePermission('maintenance:view_all'),
  MaintenanceController.list,
);

router.get(
  '/sla',
  requirePermission('maintenance:view_all'),
  MaintenanceController.getSLA,
);

router.get(
  '/:id',
  requirePermission('properties:view'),
  validate(requestIdParamSchema),
  MaintenanceController.getById,
);

router.get(
  '/:id/timeline',
  requirePermission('properties:view'),
  validate(requestIdParamSchema),
  MaintenanceController.getTimeline,
);

router.patch(
  '/:id/assign',
  requirePermission('maintenance:assign'),
  validate(assignTechnicianSchema),
  MaintenanceController.assign,
);

router.patch(
  '/:id/status',
  requirePermission('maintenance:update_status'),
  validate(updateStatusSchema),
  MaintenanceController.updateStatus,
);

export const maintenanceRoutes = router;
export default maintenanceRoutes;
