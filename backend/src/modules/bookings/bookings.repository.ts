import { prisma } from '../../config/db';
import { BookingStatus } from '@prisma/client';

export class BookingsRepository {
  async create(data: {
    amenityId: string;
    tenantId: string;
    startTime: Date;
    endTime: Date;
  }) {
    return prisma.amenityBooking.create({
      data,
    });
  }

  async update(id: string, status: BookingStatus, additionalData: Partial<{ actualCheckInAt: Date | null; actualCheckOutAt: Date | null; checkedInBy: string | null; checkedOutBy: string | null }> = {}) {
    return prisma.amenityBooking.update({
      where: { id },
      data: {
        status,
        ...additionalData,
      },
    });
  }

  async findById(id: string) {
    return prisma.amenityBooking.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        amenity: true,
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  /**
   * Pre-check logic in JS to query for overlapping bookings
   */
  async checkOverlap(amenityId: string, startTime: Date, endTime: Date, excludeBookingId?: string) {
    return prisma.amenityBooking.findFirst({
      where: {
        amenityId,
        deletedAt: null,
        status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        // Mathematical overlap condition: (StartA < EndB) AND (EndA > StartB)
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
  }

  async findAll(options: { skip?: number; take?: number; tenantId?: string; amenityId?: string; status?: BookingStatus }) {
    const where: any = { deletedAt: null };

    if (options.tenantId) where.tenantId = options.tenantId;
    if (options.amenityId) where.amenityId = options.amenityId;
    if (options.status) where.status = options.status;

    return prisma.amenityBooking.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { startTime: 'asc' },
      include: {
        amenity: { select: { id: true, name: true, propertyId: true } },
        tenant: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }
}

export default BookingsRepository;
