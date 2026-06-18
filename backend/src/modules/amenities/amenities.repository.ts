import { prisma } from '../../config/db';

export class AmenitiesRepository {
  async create(data: {
    propertyId: string;
    name: string;
    description?: string | null;
    capacity: number;
    location?: string | null;
    imageUrl?: string | null;
    rules?: string; // Serialized JSON array
    operatingHours?: string | null;
    status?: string;
  }) {
    return prisma.amenity.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<{
      propertyId: string;
      name: string;
      description?: string | null;
      capacity: number;
      location?: string | null;
      imageUrl?: string | null;
      rules?: string;
      operatingHours?: string | null;
      status?: string;
    }>
  ) {
    return prisma.amenity.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.amenity.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findById(id: string) {
    return prisma.amenity.findFirst({
      where: { id, deletedAt: null },
      include: {
        property: true,
      },
    });
  }

  async findAll(options: { skip?: number; take?: number; search?: string; propertyId?: string }) {
    const where: any = { deletedAt: null };

    if (options.propertyId) {
      where.propertyId = options.propertyId;
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search } },
        { location: { contains: options.search } },
      ];
    }

    return prisma.amenity.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { name: 'asc' },
      include: {
        property: true,
        bookings: {
          where: { deletedAt: null, status: 'APPROVED' },
        },
      },
    });
  }

  async count(options: { search?: string; propertyId?: string }) {
    const where: any = { deletedAt: null };

    if (options.propertyId) {
      where.propertyId = options.propertyId;
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search } },
        { location: { contains: options.search } },
      ];
    }

    return prisma.amenity.count({ where });
  }
}

export default AmenitiesRepository;
