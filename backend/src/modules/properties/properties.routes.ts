import { Router } from 'express';
import { PropertiesController } from './properties.controller';
import { requireAuth } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyIdParamSchema,
} from './properties.zod';

const router = Router();

// Apply authentication middleware to all properties endpoints
router.use(requireAuth);

router.post(
  '/',
  requirePermission('properties:create'),
  validate(createPropertySchema),
  PropertiesController.create,
);

router.get(
  '/',
  requirePermission('properties:view'),
  PropertiesController.list,
);

router.get(
  '/:id',
  requirePermission('properties:view'),
  validate(propertyIdParamSchema),
  PropertiesController.getById,
);

router.patch(
  '/:id',
  requirePermission('properties:edit'),
  validate(updatePropertySchema),
  PropertiesController.update,
);

router.delete(
  '/:id',
  requirePermission('properties:edit'),
  validate(propertyIdParamSchema),
  PropertiesController.delete,
);

export const propertiesRoutes = router;
export default propertiesRoutes;
