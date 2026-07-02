import { prisma } from '../../config/db';
import { PropertyStatus } from '@prisma/client';

function sanitizePayload(payload: any) {
  if (!payload) return payload;
  const sanitized = { ...payload };
  if (typeof sanitized.imageUrl === 'string' && sanitized.imageUrl.startsWith('data:')) {
    sanitized.imageUrl = sanitized.imageUrl.substring(0, 50) + '... [Base64 Data Truncated]';
  }
  if (typeof sanitized.image === 'string' && sanitized.image.startsWith('data:')) {
    sanitized.image = sanitized.image.substring(0, 50) + '... [Base64 Data Truncated]';
  }
  return sanitized;
}

export class PropertiesRepository {
  async create(data: { 
    name: string; 
    address: string; 
    ownerId: string; 
    status?: PropertyStatus;
    type?: string;
    units?: number;
    imageUrl?: string;
  }) {
    console.log('[PropertiesRepository.create] Payload before prisma create:', JSON.stringify(sanitizePayload(data), null, 2));
    const { status, ...prismaData } = data;
    console.log('[PropertiesRepository.create] Stripped Prisma create payload:', JSON.stringify(sanitizePayload(prismaData), null, 2));
    try {
      const created = await prisma.property.create({
        data: prismaData
      });
      return created;
    } catch (error: any) {
      console.error('[PropertiesRepository.create] ERROR during prisma.property.create execution:', error.stack || error);
      throw error;
    }
  }

  async update(id: string, data: Partial<{ 
    name: string; 
    address: string; 
    ownerId: string; 
    status: PropertyStatus;
    type: string;
    units: number;
    imageUrl: string;
  }>) {
    console.log(`[PropertiesRepository.update] Update payload for ID ${id}:`, JSON.stringify(sanitizePayload(data), null, 2));
    const { status, ...prismaData } = data;
    try {
      const updated = await prisma.property.update({
        where: { id },
        data: prismaData
      });
      return updated;
    } catch (error: any) {
      console.error(`[PropertiesRepository.update] ERROR during prisma.property.update execution for ID ${id}:`, error.stack || error);
      throw error;
    }
  }

  /**
   * Performs a cascading hard delete of a property and all dependent records.
   */
  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Unlink users (tenants) associated with this property
      await tx.user.updateMany({
        where: { propertyId: id },
        data: { propertyId: null }
      });

      // 2. Find all amenities belonging to this property
      const amenities = await tx.amenity.findMany({
        where: { propertyId: id },
        select: { id: true }
      });
      const amenityIds = amenities.map(a => a.id);

      // 3. Delete amenity bookings for those amenities
      if (amenityIds.length > 0) {
        await tx.amenityBooking.deleteMany({
          where: { amenityId: { in: amenityIds } }
        });
      }

      // 4. Delete amenities
      await tx.amenity.deleteMany({
        where: { propertyId: id }
      });

      // 5. Delete maintenance requests for this property
      await tx.maintenanceRequest.deleteMany({
        where: { propertyId: id }
      });

      // 6. Finally, hard delete the property itself
      return tx.property.delete({
        where: { id }
      });
    });
  }

  async findById(id: string) {
    return prisma.property.findFirst({
      where: {
        id},
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true}},
        amenities: {
          where: { }}}});
  }

  async findAll(options: { skip?: number; take?: number; search?: string; status?: PropertyStatus }) {
    const where: any = { };

    if (options.status) {
      where.status = options.status;
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search } },
        { address: { contains: options.search } },
      ];
    }

    return prisma.property.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'asc' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true}},
        amenities: {
          where: { }}}});
  }
}

export default PropertiesRepository;
