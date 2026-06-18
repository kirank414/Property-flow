import { prisma } from '../../config/db';

export class AuthRepository {
  /**
   * Finds an active user by email
   */
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Finds a user by ID
   */
  async findById(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * Finds a user by ID with roles relation loaded
   */
  async findByIdWithRelations(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Creates a user and assigns the default 'Tenant' role in a single transaction
   */
  async createUser(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    const tenantRoleId = 'd0d0d0d0-c0c0-4d4d-8e8e-4f4f4f4f4f4f'; // Seeding UUID for Tenant

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });

      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: tenantRoleId,
        },
      });

      return user;
    });
  }

  /**
   * Updates password hash for a user
   */
  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}

export default AuthRepository;
