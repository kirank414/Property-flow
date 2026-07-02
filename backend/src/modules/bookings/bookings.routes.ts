import { Router } from 'express';
import { BookingsController } from './bookings.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import {
  createBookingSchema,
  updateBookingStatusSchema,
  bookingIdParamSchema,
  checkAvailabilitySchema} from './bookings.zod';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(createBookingSchema),
  BookingsController.create,
);

router.get(
  '/',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  BookingsController.list,
);

router.get(
  '/check-availability',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(checkAvailabilitySchema),
  BookingsController.checkAvailability,
);

router.patch(
  '/:id/status',
  requireRoles(['ADMIN', 'MANAGER']),
  validate(updateBookingStatusSchema),
  BookingsController.updateStatus,
);

router.post(
  '/:id/cancel',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(bookingIdParamSchema),
  BookingsController.cancel,
);

router.post(
  '/:id/checkin',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(bookingIdParamSchema),
  BookingsController.checkIn,
);

router.post(
  '/:id/checkout',
  requireRoles(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
  validate(bookingIdParamSchema),
  BookingsController.checkOut,
);

export const bookingsRoutes = router;
export default bookingsRoutes;
