import { prisma } from '../../config/db';
import { PropertyStatus } from '@prisma/client';

export class PropertiesRepository {
  async create(data: { name: string; address: string; ownerId: string; status: PropertyStatus }) {
    return prisma.property.create({
      data,
    });
  }

  async update(id: string, data: Partial<{ name: string; address: string; ownerId: string; status: PropertyStatus }>) {
    return prisma.property.update({
      where: { id },
      data,
    });
  }

  /**
   * Performs a soft delete by marking deletedAt
   */
  async delete(id: string) {
    return prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findById(id: string) {
    return prisma.property.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        amenities: {
          where: { deletedAt: null },
        },
      },
    });
  }

  async findAll(options: { skip?: number; take?: number; search?: string; status?: PropertyStatus }) {
    const where: any = { deletedAt: null };

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
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        amenities: {
          where: { deletedAt: null },
        },
      },
    });
  }
}

export default PropertiesRepository;
