import { prisma } from '../../config/db';

export class UsersRepository {
  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id }
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email }
    });
  }

  async findAll(options: { skip?: number; take?: number; search?: string; role?: string }) {
    const where: any = {};

    if (options.search) {
      where.OR = [
        { email: { contains: options.search } },
        { firstName: { contains: options.search } },
        { lastName: { contains: options.search } },
      ];
    }

    if (options.role) {
      where.role = options.role;
    }

    return prisma.user.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
      include: {
        property: true
      }
    });
  }

  async count(options: { search?: string; role?: string }) {
    const where: any = {};

    if (options.search) {
      where.OR = [
        { email: { contains: options.search } },
        { firstName: { contains: options.search } },
        { lastName: { contains: options.search } },
      ];
    }

    if (options.role) {
      where.role = options.role;
    }

    return prisma.user.count({ where });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    propertyId?: string | null;
  }) {
    return prisma.user.create({
      data
    });
  }

  async update(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id }
    });
  }
}

export default UsersRepository;
