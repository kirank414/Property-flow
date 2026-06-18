import { prisma } from '../../config/db';

export class UsersRepository {
  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findAll(options: { skip?: number; take?: number; search?: string; role?: string }) {
    const where: any = { deletedAt: null };

    if (options.search) {
      where.OR = [
        { email: { contains: options.search } },
        { firstName: { contains: options.search } },
        { lastName: { contains: options.search } },
      ];
    }

    if (options.role) {
      where.roles = {
        some: {
          role: {
            name: options.role,
          },
        },
      };
    }

    return prisma.user.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        property: true,
      },
    });
  }

  async count(options: { search?: string; role?: string }) {
    const where: any = { deletedAt: null };

    if (options.search) {
      where.OR = [
        { email: { contains: options.search } },
        { firstName: { contains: options.search } },
        { lastName: { contains: options.search } },
      ];
    }

    if (options.role) {
      where.roles = {
        some: {
          role: {
            name: options.role,
          },
        },
      };
    }

    return prisma.user.count({ where });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string;
    propertyId?: string | null;
  }) {
    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async assignRole(userId: string, roleId: string) {
    // Delete existing roles first (a user has one primary role in our UI model)
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    return prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async delete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default UsersRepository;
