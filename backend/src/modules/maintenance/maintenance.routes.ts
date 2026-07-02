import { Router } from 'express';
import { MaintenanceController } from './maintenance.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import {
  createRequestSchema,
  assignTechnicianSchema,
  updateStatusSchema,
  requestIdParamSchema} from './maintenance.zod';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(createRequestSchema),
  MaintenanceController.create,
);

router.get(
  '/',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  MaintenanceController.list,
);

router.get(
  '/sla',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF']),
  MaintenanceController.getSLA,
);

router.get(
  '/:id',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(requestIdParamSchema),
  MaintenanceController.getById,
);

router.get(
  '/:id/timeline',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(requestIdParamSchema),
  MaintenanceController.getTimeline,
);

router.patch(
  '/:id/assign',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF']),
  validate(assignTechnicianSchema),
  MaintenanceController.assign,
);

router.patch(
  '/:id/status',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF']),
  validate(updateStatusSchema),
  MaintenanceController.updateStatus,
);

router.patch(
  '/:id/rate',
  requireRoles(['TENANT']),
  MaintenanceController.rateRequest,
);

export const maintenanceRoutes = router;
export default maintenanceRoutes;
