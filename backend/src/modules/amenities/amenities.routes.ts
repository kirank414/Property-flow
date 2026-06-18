import { Router } from 'express';
import { AmenitiesController } from './amenities.controller';
import { requireAuth } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import { createAmenitySchema, updateAmenitySchema } from './amenities.zod';

const router = Router();

// Any authenticated user (including tenants) can view amenities
router.get('/', requireAuth, AmenitiesController.list);
router.get('/:id', requireAuth, AmenitiesController.getById);

// Only managers and admins can create/update/delete amenities (guarded by properties:edit permission)
router.post(
  '/',
  requireAuth,
  requirePermission('properties:edit'),
  validate(createAmenitySchema),
  AmenitiesController.create
);

router.patch(
  '/:id',
  requireAuth,
  requirePermission('properties:edit'),
  validate(updateAmenitySchema),
  AmenitiesController.update
);

router.delete(
  '/:id',
  requireAuth,
  requirePermission('properties:edit'),
  AmenitiesController.delete
);

export const amenitiesRoutes = router;
export default amenitiesRoutes;
