import { BookingsRepository } from './bookings.repository';
import { notificationQueue } from '../../queues/notification.queue';
import { socketService } from '../../sockets/socket.service';
import { AppError } from '../../errors/AppError';
import { prisma } from '../../config/db';
import { BookingStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class BookingsService {
  private repo = new BookingsRepository();

  /**
   * Submits a booking request. Catches database exclusion violations (overlapping bookings) at runtime.
   */
  async createBooking(data: { amenityId: string; tenantId: string; startTime: string; endTime: string }) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    // Verify amenity exists and is active
    const amenity = await prisma.amenity.findFirst({
      where: { id: data.amenityId, deletedAt: null },
      include: { property: true },
    });
    if (!amenity) {
      throw new AppError('The requested amenity does not exist.', 404);
    }
    if (amenity.status !== 'ACTIVE') {
      throw new AppError('This amenity is currently unavailable (closed or undergoing maintenance).', 400);
    }

    // Pre-check overlaps (Fast fail before transaction execution)
    const hasOverlap = await this.repo.checkOverlap(data.amenityId, start, end);
    if (hasOverlap) {
      throw new AppError('This time slot is already booked. Please select another time.', 409);
    }

    try {
      const booking = await this.repo.create({
        amenityId: data.amenityId,
        tenantId: data.tenantId,
        startTime: start,
        endTime: end,
      });

      // Notify Property Owner / Manager
      await notificationQueue.addNotification({
        userId: amenity.property.ownerId,
        title: 'New Booking Filed',
        message: `A new booking request for ${amenity.name} has been submitted.`,
        type: 'BOOKING',
        channels: ['IN_APP'],
      });

      // Dispatch global Socket.io dashboard cache invalidation
      socketService.broadcast('dashboard.invalidate', {});

      return booking;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const dbError = error.meta?.database_error as string | undefined;
        // P2010 represents raw constraint failures in Prisma.
        // PostgreSQL code '23P01' is EXCLUSION VIOLATION (overlaps constraint triggered concurrently)
        if (error.code === 'P2010' || (dbError && dbError.includes('exclude_booking_overlaps'))) {
          throw new AppError('This time slot has just been reserved by another user. Please select another time.', 409);
        }
      }
      throw error;
    }
  }

  /**
   * Approves or Rejects a booking request
   */
  async updateStatus(id: string, status: BookingStatus, performerId: string) {
    const booking = await this.repo.findById(id);
    if (!booking) {
      throw new AppError('Booking request not found.', 404);
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new AppError('Cannot update status of a cancelled booking.', 400);
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update Booking Status
      const updated = await tx.amenityBooking.update({
        where: { id },
        data: { status },
      });

      // 2. If approved, automatically reject all other overlapping bookings that are PENDING
      if (status === BookingStatus.APPROVED) {
        await tx.amenityBooking.updateMany({
          where: {
            amenityId: booking.amenityId,
            status: BookingStatus.PENDING,
            id: { not: id },
            startTime: { lt: booking.endTime },
            endTime: { gt: booking.startTime },
          },
          data: { status: BookingStatus.REJECTED },
        });
      }

      // Notify the tenant of state changes
      await notificationQueue.addNotification({
        userId: booking.tenantId,
        createdBy: performerId,
        title: `Booking Request ${status}`,
        message: `Your booking for ${booking.amenity.name} has been ${status.toLowerCase()}.`,
        type: 'BOOKING',
        channels: ['IN_APP', 'EMAIL'],
      });

      // Dispatch Socket.io update to tenant
      socketService.toUser(booking.tenantId, 'booking:updated', {
        id,
        status,
      });

      // Broadcast update globally to update reservation ledger and dashboards
      socketService.broadcast('booking.updated', { id, status });
      socketService.broadcast('dashboard.invalidate', {});

      return updated;
    });
  }

  /**
   * Cancels a booking (authorized to booking owner or managers)
   */
  async cancelBooking(id: string, tenantId: string) {
    const booking = await this.repo.findById(id);
    if (!booking) {
      throw new AppError('Booking not found.', 404);
    }

    // Verify performer is either the tenant who made it or has manager permission
    const isOwner = booking.tenantId === tenantId;
    
    // Check role/permissions of user in database if not owner
    if (!isOwner) {
      const userRoles = await prisma.userRole.findMany({
        where: { userId: tenantId },
        include: { role: true },
      });
      const isManager = userRoles.some((ur) => ['Admin', 'Property Manager'].includes(ur.role.name));
      if (!isManager) {
        throw new AppError('Forbidden: You are not authorized to cancel this booking.', 403);
      }
    }

    const updated = await this.repo.update(id, BookingStatus.CANCELLED);

    // Notify the tenant (if cancelled by manager)
    if (!isOwner) {
      await notificationQueue.addNotification({
        userId: booking.tenantId,
        title: 'Booking Cancelled by Management',
        message: `Your booking for ${booking.amenity.name} has been cancelled by management.`,
        type: 'BOOKING',
        channels: ['IN_APP', 'EMAIL'],
      });
    }

    // Dispatch Socket.io update to tenant
    socketService.toUser(booking.tenantId, 'booking:updated', {
      id,
      status: BookingStatus.CANCELLED,
    });

    // Broadcast cancellation globally to update reservation ledger and dashboards
    socketService.broadcast('booking.updated', { id, status: BookingStatus.CANCELLED });
    socketService.broadcast('dashboard.invalidate', {});

    return updated;
  }

  async checkAvailability(amenityId: string, startTime: string, endTime: string) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const overlap = await this.repo.checkOverlap(amenityId, start, end);
    return {
      available: !overlap,
    };
  }

  async listBookings(filters: { tenantId?: string; amenityId?: string; status?: BookingStatus }) {
    return this.repo.findAll(filters);
  }

  /**
   * Checks in a booking
   */
  async checkInBooking(id: string, userId: string) {
    const booking = await this.repo.findById(id);
    if (!booking) {
      throw new AppError('Booking not found.', 404);
    }

    if (booking.status !== BookingStatus.APPROVED) {
      throw new AppError(`Cannot check in a booking that is ${booking.status}. Only APPROVED bookings can be checked in.`, 400);
    }

    const now = new Date();
    const fifteenMinutesBefore = new Date(booking.startTime.getTime() - 15 * 60 * 1000);

    if (now < fifteenMinutesBefore) {
      throw new AppError('Cannot check in more than 15 minutes before the scheduled start time.', 400);
    }

    if (now > booking.endTime) {
      throw new AppError('Cannot check in after the scheduled end time.', 400);
    }

    if (booking.actualCheckInAt) {
      throw new AppError('Booking is already checked in.', 400);
    }

    const updated = await this.repo.update(id, BookingStatus.IN_USE, {
      actualCheckInAt: now,
      checkedInBy: userId,
    });

    // Notify the tenant
    await notificationQueue.addNotification({
      userId: booking.tenantId,
      createdBy: userId,
      title: 'Amenity Checked In',
      message: `You have checked in to ${booking.amenity.name}.`,
      type: 'BOOKING',
      channels: ['IN_APP'],
    });

    // Dispatch Socket.io update
    socketService.broadcast('booking.checkedin', { id, status: BookingStatus.IN_USE, actualCheckInAt: now, checkedInBy: userId });
    socketService.broadcast('dashboard.invalidate', {});

    return updated;
  }

  /**
   * Checks out a booking
   */
  async checkOutBooking(id: string, userId: string) {
    const booking = await this.repo.findById(id);
    if (!booking) {
      throw new AppError('Booking not found.', 404);
    }

    if (booking.status !== BookingStatus.IN_USE) {
      throw new AppError(`Cannot check out a booking that is ${booking.status}. Only IN_USE bookings can be checked out.`, 400);
    }

    if (!booking.actualCheckInAt) {
      throw new AppError('Cannot check out a booking that has not been checked in.', 400);
    }

    if (booking.actualCheckOutAt) {
      throw new AppError('Booking is already checked out.', 400);
    }

    const now = new Date();
    if (now < booking.actualCheckInAt) {
      throw new AppError('Cannot check out before the check-in time.', 400);
    }

    const updated = await this.repo.update(id, BookingStatus.COMPLETED, {
      actualCheckOutAt: now,
      checkedOutBy: userId,
    });

    // Notify the tenant
    await notificationQueue.addNotification({
      userId: booking.tenantId,
      createdBy: userId,
      title: 'Amenity Checked Out',
      message: `You have checked out of ${booking.amenity.name}.`,
      type: 'BOOKING',
      channels: ['IN_APP'],
    });

    // Dispatch Socket.io update
    socketService.broadcast('booking.checkedout', { id, status: BookingStatus.COMPLETED, actualCheckOutAt: now, checkedOutBy: userId });
    socketService.broadcast('dashboard.invalidate', {});

    return updated;
  }

  /**
   * Automatically transition APPROVED bookings that are unattended after a 30-minute grace period to NO_SHOW
   */
  async checkNoShowBookings() {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    // Find APPROVED bookings that should have started more than 30 minutes ago and have no check-in
    const unattendedBookings = await prisma.amenityBooking.findMany({
      where: {
        status: BookingStatus.APPROVED,
        startTime: { lt: thirtyMinutesAgo },
        actualCheckInAt: null,
        deletedAt: null,
      },
    });

    const updatedBookings = [];
    for (const booking of unattendedBookings) {
      const updated = await this.repo.update(booking.id, BookingStatus.NO_SHOW);
      updatedBookings.push(updated);

      // Dispatch Socket.io update
      socketService.broadcast('booking.updated', { id: booking.id, status: BookingStatus.NO_SHOW });
      socketService.broadcast('dashboard.invalidate', {});
    }

    return updatedBookings;
  }
}

export default BookingsService;
