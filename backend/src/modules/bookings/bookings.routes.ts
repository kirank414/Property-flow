import { Router } from 'express';
import { BookingsController } from './bookings.controller';
import { requireAuth } from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import {
  createBookingSchema,
  updateBookingStatusSchema,
  bookingIdParamSchema,
  checkAvailabilitySchema,
} from './bookings.zod';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requirePermission('amenity_bookings:create'),
  validate(createBookingSchema),
  BookingsController.create,
);

router.get(
  '/',
  requirePermission('properties:view'),
  BookingsController.list,
);

router.get(
  '/check-availability',
  requirePermission('properties:view'),
  validate(checkAvailabilitySchema),
  BookingsController.checkAvailability,
);

router.patch(
  '/:id/status',
  requirePermission('amenity_bookings:approve'),
  validate(updateBookingStatusSchema),
  BookingsController.updateStatus,
);

router.post(
  '/:id/cancel',
  requirePermission('amenity_bookings:create'),
  validate(bookingIdParamSchema),
  BookingsController.cancel,
);

router.post(
  '/:id/checkin',
  requirePermission('properties:view'),
  validate(bookingIdParamSchema),
  BookingsController.checkIn,
);

router.post(
  '/:id/checkout',
  requirePermission('properties:view'),
  validate(bookingIdParamSchema),
  BookingsController.checkOut,
);

export const bookingsRoutes = router;
export default bookingsRoutes;
