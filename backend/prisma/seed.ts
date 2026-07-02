import { PrismaClient, UserRole, MaintenancePriority, MaintenanceStatus, BookingStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Generic Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@propertyflow.com' },
    update: {},
    create: {
      email: 'admin@propertyflow.com',
      firstName: 'System',
      lastName: 'Admin',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@propertyflow.com' },
    update: {},
    create: {
      email: 'manager@propertyflow.com',
      firstName: 'Property',
      lastName: 'Manager',
      passwordHash,
      role: UserRole.MANAGER,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@propertyflow.com' },
    update: {},
    create: {
      email: 'staff@propertyflow.com',
      firstName: 'Support',
      lastName: 'Staff',
      passwordHash,
      role: UserRole.STAFF,
    },
  });

  const tenantA = await prisma.user.upsert({
    where: { email: 'tenant.a@example.com' },
    update: {},
    create: {
      email: 'tenant.a@example.com',
      firstName: 'Tenant',
      lastName: 'A',
      passwordHash,
      role: UserRole.TENANT,
    },
  });

  const tenantB = await prisma.user.upsert({
    where: { email: 'tenant.b@example.com' },
    update: {},
    create: {
      email: 'tenant.b@example.com',
      firstName: 'Tenant',
      lastName: 'B',
      passwordHash,
      role: UserRole.TENANT,
    },
  });

  // 2. Create Generic Property
  const propertyA = await prisma.property.create({
    data: {
      name: 'Property A',
      address: '123 Main Street',
      type: 'Residential',
      units: 100,
      occupancyRate: 85.5,
      ownerId: manager.id,
      tenants: {
        connect: [{ id: tenantA.id }, { id: tenantB.id }],
      },
    },
  });

  // 3. Create Generic Amenities
  const fitnessRoom = await prisma.amenity.create({
    data: {
      propertyId: propertyA.id,
      name: 'Fitness Room',
      description: 'Fully equipped fitness center',
      capacity: 15,
      location: '1st Floor',
      operatingHours: '06:00 - 22:00',
    },
  });

  const meetingRoom = await prisma.amenity.create({
    data: {
      propertyId: propertyA.id,
      name: 'Meeting Room',
      description: 'Conference room for up to 10 people',
      capacity: 10,
      location: '2nd Floor',
      operatingHours: '08:00 - 20:00',
    },
  });

  // 4. Create Sample Maintenance Requests
  await prisma.maintenanceRequest.create({
    data: {
      propertyId: propertyA.id,
      tenantId: tenantA.id,
      assignedTechnicianId: staff.id,
      title: 'Leaking Faucet in Kitchen',
      description: 'The kitchen sink faucet has been dripping continuously.',
      category: 'Plumbing',
      priority: MaintenancePriority.MEDIUM,
      status: MaintenanceStatus.IN_PROGRESS,
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      propertyId: propertyA.id,
      tenantId: tenantB.id,
      title: 'AC Not Cooling',
      description: 'The air conditioning unit is blowing warm air.',
      category: 'HVAC',
      priority: MaintenancePriority.HIGH,
      status: MaintenanceStatus.PENDING,
    },
  });

  // 5. Create Sample Amenity Bookings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(11, 0, 0, 0);

  await prisma.amenityBooking.create({
    data: {
      amenityId: fitnessRoom.id,
      tenantId: tenantA.id,
      startTime: tomorrow,
      endTime: tomorrowEnd,
      status: BookingStatus.APPROVED,
      guestsCount: 1,
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 0, 0, 0);
  
  const nextWeekEnd = new Date(nextWeek);
  nextWeekEnd.setHours(16, 0, 0, 0);

  await prisma.amenityBooking.create({
    data: {
      amenityId: meetingRoom.id,
      tenantId: tenantB.id,
      startTime: nextWeek,
      endTime: nextWeekEnd,
      status: BookingStatus.PENDING,
      guestsCount: 5,
    },
  });

  console.log('Seed execution completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
