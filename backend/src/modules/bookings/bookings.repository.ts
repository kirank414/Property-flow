import { prisma } from '../../config/db';
import { BookingStatus } from '@prisma/client';

export class BookingsRepository {
  async create(data: {
    amenityId: string;
    tenantId: string;
    startTime: Date;
    endTime: Date;
    status?: BookingStatus;
  }) {
    return prisma.amenityBooking.create({
      data: {
        ...data
      }
    });
  }

  async update(id: string, status: BookingStatus, additionalData: Partial<{ actualCheckInAt: Date | null; actualCheckOutAt: Date | null; checkedInBy: string | null; checkedOutBy: string | null }> = {}) {
    // Destructure fields that are not in the Prisma schema to avoid crashing
    const { checkedInBy, checkedOutBy, ...prismaData } = additionalData;
    
    console.log(`[BookingRepo] Updating booking ${id} to status ${status}`);
    console.log(`[BookingRepo] Prisma payload:`, prismaData);

    const updated = await prisma.amenityBooking.update({
      where: { id },
      data: {
        status,
        ...prismaData
      }
    });
    
    console.log(`[BookingRepo] Successfully updated booking ${id}. New status: ${updated.status}`);
    return updated;
  }

  async findById(id: string) {
    return prisma.amenityBooking.findFirst({
      where: {
        id},
      include: {
        amenity: true,
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true }}}});
  }

  /**
   * Pre-check logic in JS to query for overlapping bookings
   */
  async checkOverlap(amenityId: string, startTime: Date, endTime: Date, excludeBookingId?: string) {
    return prisma.amenityBooking.findFirst({
      where: {
        amenityId,

        status: { in: [BookingStatus.APPROVED, BookingStatus.IN_USE] },
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        // Mathematical overlap condition: (StartA < EndB) AND (EndA > StartB)
        startTime: { lt: endTime },
        endTime: { gt: startTime }}});
  }

  async findAll(options: { skip?: number; take?: number; tenantId?: string; amenityId?: string; status?: BookingStatus }) {
    const where: any = { };

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
        tenant: { select: { id: true, firstName: true, lastName: true } }}});
  }
}

export default BookingsRepository;
