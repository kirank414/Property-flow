import { PropertiesRepository } from './properties.repository';
import { AppError } from '../../errors/AppError';
import { PropertyStatus } from '@prisma/client';
import { prisma } from '../../config/db';
import { logAudit } from '../../utils/audit';

export class PropertiesService {
  private repo = new PropertiesRepository();

  async createProperty(data: { name: string; address: string; ownerId: string; status: PropertyStatus }, userId?: string) {
    // Verify owner exists in system
    const owner = await prisma.user.findFirst({
      where: { id: data.ownerId, deletedAt: null },
    });
    if (!owner) {
      throw new AppError('The specified owner user ID does not exist.', 400);
    }

    const property = await this.repo.create(data);
    await logAudit({
      userId,
      action: 'CREATE',
      entity: 'Property',
      entityId: property.id,
      details: JSON.stringify(property),
    });
    return property;
  }

  async updateProperty(id: string, data: Partial<{ name: string; address: string; ownerId: string; status: PropertyStatus }>, userId?: string) {
    const property = await this.repo.findById(id);
    if (!property) {
      throw new AppError('Property not found.', 404);
    }

    if (data.ownerId) {
      const owner = await prisma.user.findFirst({
        where: { id: data.ownerId, deletedAt: null },
      });
      if (!owner) {
        throw new AppError('The specified owner user ID does not exist.', 400);
      }
    }

    const updated = await this.repo.update(id, data);
    await logAudit({
      userId,
      action: 'UPDATE',
      entity: 'Property',
      entityId: id,
      details: JSON.stringify(data),
    });
    return updated;
  }

  /**
   * Performs a cascading soft-delete on the property and its associated amenities and maintenance requests.
   */
  async deleteProperty(id: string, userId?: string) {
    return prisma.$transaction(async (tx) => {
      const property = await tx.property.findUnique({
        where: { id },
      });
      if (!property) {
        throw new AppError('Property not found.', 404);
      }

      const now = new Date();

      // Soft delete dependent amenities
      await tx.amenity.updateMany({
        where: { propertyId: id, deletedAt: null },
        data: { deletedAt: now },
      });

      // Soft delete dependent maintenance requests
      await tx.maintenanceRequest.updateMany({
        where: { propertyId: id, deletedAt: null },
        data: { deletedAt: now },
      });

      // Soft delete the main property
      const deleted = await tx.property.update({
        where: { id },
        data: { deletedAt: now },
      });

      await logAudit({
        userId,
        action: 'DELETE',
        entity: 'Property',
        entityId: id,
        details: 'Soft deleted property and cascade dependencies',
      });

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
      status: filters.status,
    });

    const total = await prisma.property.count({
      where: {
        deletedAt: null,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search } },
            { address: { contains: filters.search } },
          ],
        }),
      },
    });

    return {
      properties: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default PropertiesService;
