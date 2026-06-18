import { UsersRepository } from './users.repository';
import { CryptoService } from '../../utils/crypto';
import { AppError } from '../../errors/AppError';
import { logAudit } from '../../utils/audit';
import { clearAuthCache } from '../../middlewares/rbac';
import { prisma } from '../../config/db';

export class UsersService {
  private repo = new UsersRepository();

  private getDBRoleName(roleType: string): string {
    switch (roleType) {
      case 'ADMIN': return 'Admin';
      case 'MANAGER': return 'Property Manager';
      case 'STAFF': return 'Maintenance Staff';
      case 'TENANT': return 'Tenant';
      default: return 'Tenant';
    }
  }

  private mapUserToDTO(user: any) {
    const dbRoleName = user.roles?.[0]?.role?.name || 'Tenant';
    let role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'TENANT' = 'TENANT';
    if (dbRoleName === 'Admin') role = 'ADMIN';
    else if (dbRoleName === 'Property Manager') role = 'MANAGER';
    else if (dbRoleName === 'Maintenance Staff') role = 'STAFF';

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      role,
      avatarUrl: user.avatarUrl || null,
      propertyId: user.propertyId || null,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async createUser(
    data: {
      email: string;
      passwordHash: string; // Plain password in request, will be hashed
      firstName: string;
      lastName: string;
      phone: string;
      role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'TENANT';
      propertyId?: string | null;
    },
    currentUserId?: string
  ) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new AppError('A user with this email address already exists.', 409);
    }

    const hashed = await CryptoService.hashPassword(data.passwordHash);
    const dbRoleName = this.getDBRoleName(data.role);

    const roleRecord = await prisma.role.findFirst({
      where: { name: dbRoleName },
    });
    if (!roleRecord) {
      throw new AppError(`The role '${dbRoleName}' does not exist in the system.`, 500);
    }

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: hashed,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          propertyId: data.role === 'TENANT' ? data.propertyId || null : null,
        },
      });

      await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: roleRecord.id,
        },
      });

      return newUser;
    });

    const userWithRoles = await this.repo.findById(user.id);
    const mapped = this.mapUserToDTO(userWithRoles);

    await logAudit({
      userId: currentUserId,
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      details: JSON.stringify({ email: mapped.email, firstName: mapped.firstName, lastName: mapped.lastName, role: mapped.role }),
    });

    return mapped;
  }

  async updateUser(
    id: string,
    data: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'TENANT';
      propertyId?: string | null;
      avatarUrl?: string | null;
    }>,
    currentUserId?: string
  ) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Authorization: User can update themselves, Admins can update anyone
    const currentUser = currentUserId ? await this.repo.findById(currentUserId) : null;
    const currentUserRoleName = currentUser?.roles?.[0]?.role?.name || 'Tenant';
    const isAdmin = currentUserRoleName === 'Admin';
    const isSelf = id === currentUserId;

    if (!isAdmin && !isSelf) {
      throw new AppError('Forbidden: You do not have permission to update this user profile.', 403);
    }

    if (data.role && !isAdmin) {
      throw new AppError('Forbidden: Only system administrators can assign user roles.', 403);
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.repo.findByEmail(data.email);
      if (existing) {
        throw new AppError('A user with this email address already exists.', 409);
      }
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update User Table details
      const updateData: any = {};
      if (data.email !== undefined) updateData.email = data.email;
      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
      
      // Property ID management
      if (data.propertyId !== undefined) {
        updateData.propertyId = data.propertyId;
      }

      const updated = await tx.user.update({
        where: { id },
        data: updateData,
      });

      // Role update
      if (data.role) {
        const dbRoleName = this.getDBRoleName(data.role);
        const roleRecord = await tx.role.findFirst({
          where: { name: dbRoleName },
        });
        if (!roleRecord) {
          throw new AppError(`The role '${dbRoleName}' does not exist in the system.`, 500);
        }

        // Delete current user roles
        await tx.userRole.deleteMany({
          where: { userId: id },
        });

        // Insert new user role
        await tx.userRole.create({
          data: {
            userId: id,
            roleId: roleRecord.id,
          },
        });

        // Clear Redis authentication cache for this user
        await clearAuthCache(id);
      }

      return updated;
    });

    const userWithRoles = await this.repo.findById(updatedUser.id);
    const mapped = this.mapUserToDTO(userWithRoles);

    await logAudit({
      userId: currentUserId,
      action: 'UPDATE',
      entity: 'User',
      entityId: id,
      details: JSON.stringify(data),
    });

    return mapped;
  }

  async deleteUser(id: string, currentUserId?: string) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const deleted = await this.repo.delete(id);
    await clearAuthCache(id);

    await logAudit({
      userId: currentUserId,
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      details: 'Soft deleted user',
    });

    return deleted;
  }

  async getUserById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return this.mapUserToDTO(user);
  }

  async listUsers(filters: { page?: number; limit?: number; search?: string; role?: 'ADMIN' | 'MANAGER' | 'STAFF' | 'TENANT' }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const dbRoleName = filters.role ? this.getDBRoleName(filters.role) : undefined;

    const items = await this.repo.findAll({
      skip,
      take: limit,
      search: filters.search,
      role: dbRoleName,
    });

    const total = await this.repo.count({
      search: filters.search,
      role: dbRoleName,
    });

    return {
      users: items.map((u) => this.mapUserToDTO(u)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default UsersService;
