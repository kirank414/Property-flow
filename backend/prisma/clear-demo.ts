import { PrismaClient, UserRole } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting absolute fresh database clean...');

  // Delete dependent tables in order
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.amenityBooking.deleteMany({});
  await prisma.amenity.deleteMany({});
  await prisma.maintenanceRequest.deleteMany({});

  // Reset property associations on users
  await prisma.user.updateMany({
    data: { propertyId: null }
  });

  // Delete properties
  await prisma.property.deleteMany({});

  // Delete all users
  await prisma.user.deleteMany({});

  console.log('Database records wiped.');

  // Create Argon2id password hash for demo credentials
  const passwordHash = await argon2.hash('password123', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  console.log('Re-creating clean login credentials...');

  // Create System Admin
  await prisma.user.create({
    data: {
      email: 'admin@propertyflow.com',
      firstName: 'System',
      lastName: 'Admin',
      passwordHash,
      role: UserRole.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
  });

  // Create Property Manager
  await prisma.user.create({
    data: {
      email: 'manager@propertyflow.com',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      passwordHash,
      role: UserRole.MANAGER,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  // Create Support Staff
  await prisma.user.create({
    data: {
      email: 'staff@propertyflow.com',
      firstName: 'David',
      lastName: 'Ross',
      passwordHash,
      role: UserRole.STAFF,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  // Create Tenant
  await prisma.user.create({
    data: {
      email: 'tenant.a@example.com',
      firstName: 'Alice',
      lastName: 'Cooper',
      passwordHash,
      role: UserRole.TENANT,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  console.log('Database successfully reset to a fresh state with only login credentials!');
}

main()
  .catch((e) => {
    console.error('Error cleaning database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
