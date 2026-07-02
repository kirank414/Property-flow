import { PropertiesRepository } from './properties.repository';
import { AppError } from '../../errors/AppError';
import { PropertyStatus } from '@prisma/client';
import { prisma } from '../../config/db';
import { logAudit } from '../../utils/audit';

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

export class PropertiesService {
  private repo = new PropertiesRepository();

  async createProperty(
    data: { 
      name: string; 
      address: string; 
      ownerId: string; 
      status: PropertyStatus;
      type?: string;
      units?: number;
      imageUrl?: string;
      image?: string;
    }, 
    userId?: string
  ) {
    try {
      // Verify owner exists in system
      const owner = await prisma.user.findFirst({
        where: { id: data.ownerId }});
      if (!owner) {
        throw new AppError('The specified owner user ID does not exist.', 400);
      }

      const payload: any = { ...data };
      if (payload.image !== undefined) {
        payload.imageUrl = payload.image;
        delete payload.image;
      }

      const property = await this.repo.create(payload);
      await logAudit({
        userId,
        action: 'CREATE',
        entity: 'Property',
        entityId: property.id,
        details: JSON.stringify(sanitizePayload(property))});
      return property;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProperty(
    id: string, 
    data: Partial<{ 
      name: string; 
      address: string; 
      ownerId: string; 
      status: PropertyStatus;
      type: string;
      units: number;
      imageUrl: string;
      image: string;
    }>, 
    userId?: string
  ) {
    const property = await this.repo.findById(id);
    if (!property) {
      throw new AppError('Property not found.', 404);
    }

    if (data.ownerId) {
      const owner = await prisma.user.findFirst({
        where: { id: data.ownerId }});
      if (!owner) {
        throw new AppError('The specified owner user ID does not exist.', 400);
      }
    }

    const payload: any = { ...data };
    if (payload.image !== undefined) {
      payload.imageUrl = payload.image;
      delete payload.image;
    }

    const updated = await this.repo.update(id, payload);
    await logAudit({
      userId,
      action: 'UPDATE',
      entity: 'Property',
      entityId: id,
      details: JSON.stringify(sanitizePayload(data))});
    return updated;
  }

  /**
   * Performs a cascading soft-delete on the property and its associated amenities and maintenance requests.
   */
  async deleteProperty(id: string, userId?: string) {
    return prisma.$transaction(async (tx) => {
      const property = await tx.property.findUnique({
        where: { id }});
      if (!property) {
        throw new AppError('Property not found.', 404);
      }

      // 1. Unlink users linked to this property
      await tx.user.updateMany({
        where: { propertyId: id },
        data: { propertyId: null }
      });

      // 2. Find and delete amenity bookings
      const amenities = await tx.amenity.findMany({
        where: { propertyId: id },
        select: { id: true }
      });
      const amenityIds = amenities.map(a => a.id);
      if (amenityIds.length > 0) {
        await tx.amenityBooking.deleteMany({
          where: { amenityId: { in: amenityIds } }
        });
      }

      // 3. Delete dependent amenities
      await tx.amenity.deleteMany({
        where: { propertyId: id }
      });

      // 4. Delete dependent maintenance requests
      await tx.maintenanceRequest.deleteMany({
        where: { propertyId: id }
      });

      // 5. Delete the main property
      const deleted = await tx.property.delete({
        where: { id }
      });

      await logAudit({
        userId,
        action: 'DELETE',
        entity: 'Property',
        entityId: id,
        details: 'Hard deleted property and cascaded dependencies'});

      return deleted;
    });
  }

  async getPropertyDetails(id: string) {
    const property = await this.repo.findById(id);
    if (!property) {
      throw new AppError('Property not found.', 404);
    }
    return property;
  }

  async listProperties(filters: { page?: number; limit?: number; search?: string; status?: PropertyStatus }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const items = await this.repo.findAll({
      skip,
      take: limit,
      search: filters.search,
      status: filters.status});

    const total = await prisma.property.count({
      where: {

        ...(filters.status && { status: filters.status }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search } },
            { address: { contains: filters.search } },
          ]})}});

    return {
      properties: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)}};
  }
}

export default PropertiesService;
