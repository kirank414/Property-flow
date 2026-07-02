import { Router } from 'express';
import { PropertiesController } from './properties.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyIdParamSchema} from './properties.zod';

const router = Router();

// Apply authentication middleware to all properties endpoints
router.use(requireAuth);

router.post(
  '/',
  requireRoles(['ADMIN', 'MANAGER']),
  validate(createPropertySchema),
  PropertiesController.create,
);

router.get(
  '/',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  PropertiesController.list,
);

router.get(
  '/:id',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(propertyIdParamSchema),
  PropertiesController.getById,
);

router.patch(
  '/:id',
  requireRoles(['ADMIN', 'MANAGER']),
  validate(updatePropertySchema),
  PropertiesController.update,
);

router.delete(
  '/:id',
  requireRoles(['ADMIN', 'MANAGER']),
  validate(propertyIdParamSchema),
  PropertiesController.delete,
);

export const propertiesRoutes = router;
export default propertiesRoutes;
