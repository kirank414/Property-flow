import { PrismaClient, UserRole, MaintenancePriority, MaintenanceStatus, BookingStatus } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting demo database clean up...');

  // Safe delete sequence
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.amenityBooking.deleteMany({});
  await prisma.amenity.deleteMany({});
  await prisma.maintenanceRequest.deleteMany({});

  // Clear user property references to avoid circular reference blocks
  await prisma.user.updateMany({
    data: { propertyId: null }
  });
  await prisma.property.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database successfully cleaned.');

  const now = new Date();

  // Hash password using Argon2id (same configuration as CryptoService)
  const passwordHash = await argon2.hash('password123', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  console.log('Creating demo users matching frontend credentials...');

  // 1. System Administrator
  const admin = await prisma.user.create({
    data: {
      email: 'admin@propertyflow.com',
      firstName: 'System',
      lastName: 'Admin',
      passwordHash,
      role: UserRole.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
  });

  // 2. Property Managers
  const managerSarah = await prisma.user.create({
    data: {
      email: 'manager@propertyflow.com', // Matched frontend expectation
      firstName: 'Sarah',
      lastName: 'Jenkins',
      passwordHash,
      role: UserRole.MANAGER,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  const managerMichael = await prisma.user.create({
    data: {
      email: 'michael.chang@propertyflow.com',
      firstName: 'Michael',
      lastName: 'Chang',
      passwordHash,
      role: UserRole.MANAGER,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  // 3. Support Staff
  const staffDavid = await prisma.user.create({
    data: {
      email: 'staff@propertyflow.com', // Matched frontend expectation
      firstName: 'David',
      lastName: 'Ross',
      passwordHash,
      role: UserRole.STAFF,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  const staffEmily = await prisma.user.create({
    data: {
      email: 'emily.stone@propertyflow.com',
      firstName: 'Emily',
      lastName: 'Stone',
      passwordHash,
      role: UserRole.STAFF,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
  });

  // 4. Tenants
  const tenantAlice = await prisma.user.create({
    data: {
      email: 'tenant.a@example.com', // Matched frontend expectation
      firstName: 'Alice',
      lastName: 'Cooper',
      passwordHash,
      role: UserRole.TENANT,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const tenantBob = await prisma.user.create({
    data: {
      email: 'tenant.b@example.com', // Matched frontend expectation
      firstName: 'Bob',
      lastName: 'Marley',
      passwordHash,
      role: UserRole.TENANT,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    },
  });

  const tenantCharlie = await prisma.user.create({
    data: {
      email: 'tenant.c@example.com', // Matched frontend expectation
      firstName: 'Charlie',
      lastName: 'Brown',
      passwordHash,
      role: UserRole.TENANT,
      avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    },
  });

  const tenantDiana = await prisma.user.create({
    data: {
      email: 'tenant.d@example.com', // Matched frontend expectation
      firstName: 'Diana',
      lastName: 'Prince',
      passwordHash,
      role: UserRole.TENANT,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
  });

  const tenantEvan = await prisma.user.create({
    data: {
      email: 'tenant.e@example.com', // Matched frontend expectation
      firstName: 'Evan',
      lastName: 'Wright',
      passwordHash,
      role: UserRole.TENANT,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    },
  });

  const tenantFiona = await prisma.user.create({
    data: {
      email: 'tenant.f@example.com', // Matched frontend expectation
      firstName: 'Fiona',
      lastName: 'Gallagher',
      passwordHash,
      role: UserRole.TENANT,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
  });

  console.log('Creating demo properties...');

  // 1. Verdant Pines
  const propertyVerdant = await prisma.property.create({
    data: {
      name: 'Verdant Pines',
      address: '742 Evergreen Terrace, Springfield',
      type: 'Residential',
      units: 120,
      occupancyRate: 92.5,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      ownerId: managerSarah.id,
      tenants: {
        connect: [{ id: tenantAlice.id }, { id: tenantBob.id }, { id: tenantCharlie.id }],
      },
    },
  });

  // 2. Grand Horizon
  const propertyHorizon = await prisma.property.create({
    data: {
      name: 'Grand Horizon',
      address: '100 Ocean Drive, Miami FL',
      type: 'Residential',
      units: 85,
      occupancyRate: 88.0,
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      ownerId: managerSarah.id,
      tenants: {
        connect: [{ id: tenantDiana.id }, { id: tenantEvan.id }],
      },
    },
  });

  // 3. Apex Tech Plaza
  const propertyApex = await prisma.property.create({
    data: {
      name: 'Apex Tech Plaza',
      address: '500 Innovation Way, Silicon Valley',
      type: 'Commercial',
      units: 12,
      occupancyRate: 100.0,
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      ownerId: managerMichael.id,
      tenants: {
        connect: [{ id: tenantFiona.id }],
      },
    },
  });

  console.log('Creating amenities...');

  // Verdant Pines Amenities
  const poolVerdant = await prisma.amenity.create({
    data: {
      propertyId: propertyVerdant.id,
      name: 'Olympic Pool',
      description: 'Heated outdoor swimming pool with lanes',
      capacity: 30,
      location: 'North Courtyard',
      operatingHours: '08:00 - 22:00',
      imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=300',
      status: 'ACTIVE',
    },
  });

  const gymVerdant = await prisma.amenity.create({
    data: {
      propertyId: propertyVerdant.id,
      name: 'Modern Gym',
      description: 'Fully equipped fitness center and cardio room',
      capacity: 15,
      location: 'Clubhouse Level 1',
      operatingHours: '06:00 - 23:00',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300',
      status: 'ACTIVE',
    },
  });

  // Grand Horizon Amenities
  const loungeHorizon = await prisma.amenity.create({
    data: {
      propertyId: propertyHorizon.id,
      name: 'Sky Lounge',
      description: 'Panoramic rooftop lounge and social space',
      capacity: 50,
      location: 'Rooftop',
      operatingHours: '10:00 - 00:00',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300',
      status: 'ACTIVE',
    },
  });

  const businessHorizon = await prisma.amenity.create({
    data: {
      propertyId: propertyHorizon.id,
      name: 'Business Center',
      description: 'Co-working workspace and private phone booths',
      capacity: 10,
      location: 'Lobby East',
      operatingHours: '08:00 - 20:00',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
      status: 'ACTIVE',
    },
  });

  // Apex Tech Plaza Amenities
  const boardroomApex = await prisma.amenity.create({
    data: {
      propertyId: propertyApex.id,
      name: 'Main Boardroom',
      description: 'High-tech conference room with dynamic video displays',
      capacity: 18,
      location: 'Suite 400',
      operatingHours: '07:00 - 19:00',
      imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300',
      status: 'ACTIVE',
    },
  });

  console.log('Populating maintenance requests...');

  // Active Pending Requests (2)
  const reqPending1 = await prisma.maintenanceRequest.create({
    data: {
      propertyId: propertyVerdant.id,
      tenantId: tenantAlice.id,
      title: 'Plumbing Leak under Sink',
      description: 'Water is dripping continuously from the master bathroom sink supply line.',
      category: 'Plumbing',
      priority: MaintenancePriority.HIGH,
      status: MaintenanceStatus.PENDING,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  });

  const reqPending2 = await prisma.maintenanceRequest.create({
    data: {
      propertyId: propertyHorizon.id,
      tenantId: tenantDiana.id,
      title: 'Broken Light Fixture',
      description: 'The kitchen ceiling light has stopped working despite replacing the bulb.',
      category: 'Electrical',
      priority: MaintenancePriority.LOW,
      status: MaintenanceStatus.PENDING,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
  });

  // Active In-Progress Requests (2)
  const reqInProgress1 = await prisma.maintenanceRequest.create({
    data: {
      propertyId: propertyHorizon.id,
      tenantId: tenantEvan.id,
      assignedTechnicianId: staffDavid.id,
      title: 'AC Unit blowing warm air',
      description: 'The wall unit works but fails to cool the room down. Temperature stays at 78°F.',
      category: 'HVAC',
      priority: MaintenancePriority.HIGH,
      status: MaintenanceStatus.IN_PROGRESS,
      createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000), // 10 hours ago
    },
  });

  const reqInProgress2 = await prisma.maintenanceRequest.create({
    data: {
      propertyId: propertyApex.id,
      tenantId: tenantFiona.id,
      assignedTechnicianId: staffEmily.id,
      title: 'Executive Suite Lock Sticky',
      description: 'The smart lock key card reader on Suite 3B takes multiple tries to unlock.',
      category: 'General',
      priority: MaintenancePriority.MEDIUM,
      status: MaintenanceStatus.IN_PROGRESS,
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
  });

  // Completed Requests (60)
  // We need satisfaction score to be exactly 4.8/5:
  // 48 requests rated 5, 12 requests rated 4.
  // We need average resolution time to be exactly 34 hours:
  // 60 requests resolved in sequence alternating: 24h, 36h, 40h, 36h (Avg = 34h).
  const completionComments5 = [
    'Excellent service.',
    'Issue resolved quickly.',
    'Technician arrived on time.',
    'Very professional support.',
    'Highly satisfied with the resolution.',
    'Great communication from the team.',
    'Fixed perfectly on the first visit.',
    'Service tech was polite and prompt.'
  ];

  const completionComments4 = [
    'Good support and cleanup.',
    'Fixed the issue successfully.',
    'Quick fix, thank you.',
    'Helpful technician.',
    'Resolved within expected timeframe.'
  ];

  const categories = ['Plumbing', 'Electrical', 'HVAC', 'General', 'Elevator', 'Cleaning'];
  const tenantsList = [tenantAlice, tenantBob, tenantCharlie, tenantDiana, tenantEvan, tenantFiona];
  const propertiesList = [propertyVerdant, propertyHorizon, propertyApex];
  const staffList = [staffDavid, staffEmily];

  console.log('Seeding 60 completed requests...');

  for (let i = 0; i < 60; i++) {
    // Alternating resolution durations: 24, 36, 40, 36
    const durations = [24, 36, 40, 36];
    const durationHours = durations[i % 4];
    const createdOffsetMs = (10 + i) * 24 * 60 * 60 * 1000; // start 10+ days ago
    const createdAt = new Date(now.getTime() - createdOffsetMs);
    const resolvedAt = new Date(createdAt.getTime() + durationHours * 60 * 60 * 1000);

    const rating = i < 48 ? 5 : 4; // 48 rated 5, 12 rated 4 -> Avg = 4.8
    const commentList = rating === 5 ? completionComments5 : completionComments4;
    const reviewComment = commentList[i % commentList.length];

    const prop = propertiesList[i % propertiesList.length];
    const tenant = tenantsList[i % tenantsList.length];
    const staff = staffList[i % staffList.length];
    const category = categories[i % categories.length];

    await prisma.maintenanceRequest.create({
      data: {
        propertyId: prop.id,
        tenantId: tenant.id,
        assignedTechnicianId: staff.id,
        title: `Completed Service Ticket #${1000 + i}`,
        description: `Standard maintenance task describing resolution details for ${category.toLowerCase()} issues.`,
        category,
        priority: MaintenancePriority.MEDIUM,
        status: MaintenanceStatus.COMPLETED,
        rating,
        reviewComment,
        ratedAt: resolvedAt,
        createdAt,
        resolvedAt,
        updatedAt: resolvedAt,
      },
    });
  }

  console.log('Populating amenity bookings...');

  // 1. CURRENT ACTIVE BOOKING (IN_USE)
  const bookingStartInUse = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
  const bookingEndInUse = new Date(now.getTime() + 90 * 60 * 1000); // 1.5 hours later
  await prisma.amenityBooking.create({
    data: {
      amenityId: poolVerdant.id,
      tenantId: tenantAlice.id,
      startTime: bookingStartInUse,
      endTime: bookingEndInUse,
      status: BookingStatus.IN_USE,
      guestsCount: 2,
      actualCheckInAt: bookingStartInUse,
    },
  });

  // 2. FUTURE CONFIRMED BOOKING (APPROVED)
  const bookingStartApproved = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
  bookingStartApproved.setHours(14, 0, 0, 0);
  const bookingEndApproved = new Date(bookingStartApproved.getTime() + 90 * 60 * 1000); // 1.5h duration
  await prisma.amenityBooking.create({
    data: {
      amenityId: gymVerdant.id,
      tenantId: tenantCharlie.id,
      startTime: bookingStartApproved,
      endTime: bookingEndApproved,
      status: BookingStatus.APPROVED,
      guestsCount: 1,
    },
  });

  // 3. SEVERAL COMPLETED BOOKINGS
  const bookingStartCompleted1 = new Date(now.getTime() - 5 * 60 * 60 * 1000); // 5 hours ago
  const bookingEndCompleted1 = new Date(bookingStartCompleted1.getTime() + 2 * 60 * 60 * 1000); // 2h duration
  await prisma.amenityBooking.create({
    data: {
      amenityId: loungeHorizon.id,
      tenantId: tenantDiana.id,
      startTime: bookingStartCompleted1,
      endTime: bookingEndCompleted1,
      status: BookingStatus.COMPLETED,
      guestsCount: 10,
      actualCheckInAt: bookingStartCompleted1,
      actualCheckOutAt: bookingEndCompleted1,
    },
  });

  const bookingStartCompleted2 = new Date(now.getTime() - 24 * 60 * 60 * 1000); // yesterday
  bookingStartCompleted2.setHours(10, 0, 0, 0);
  const bookingEndCompleted2 = new Date(bookingStartCompleted2.getTime() + 1 * 60 * 60 * 1000); // 1h duration
  await prisma.amenityBooking.create({
    data: {
      amenityId: businessHorizon.id,
      tenantId: tenantEvan.id,
      startTime: bookingStartCompleted2,
      endTime: bookingEndCompleted2,
      status: BookingStatus.COMPLETED,
      guestsCount: 2,
      actualCheckInAt: bookingStartCompleted2,
      actualCheckOutAt: bookingEndCompleted2,
    },
  });

  // 4. CANCELLED BOOKING
  const bookingStartCancelled = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 2 days ago
  bookingStartCancelled.setHours(16, 0, 0, 0);
  const bookingEndCancelled = new Date(bookingStartCancelled.getTime() + 2 * 60 * 60 * 1000);
  await prisma.amenityBooking.create({
    data: {
      amenityId: poolVerdant.id,
      tenantId: tenantEvan.id,
      startTime: bookingStartCancelled,
      endTime: bookingEndCancelled,
      status: BookingStatus.CANCELLED,
      guestsCount: 1,
    },
  });

  console.log('Creating real-time activity history / audit logs...');

  // Create audit logs mapping the lifecycle events for monitoring dashboard feeds
  const auditLogs = [
    {
      userId: tenantAlice.id,
      action: 'Booking Checked In',
      entity: 'AmenityBooking',
      entityId: poolVerdant.id,
      details: 'Alice Cooper checked into Olympic Pool.',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
    {
      userId: tenantAlice.id,
      action: 'Maintenance Request Created',
      entity: 'MaintenanceRequest',
      entityId: reqPending1.id,
      details: 'Plumbing Leak under Sink submitted by Alice Cooper.',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      userId: managerSarah.id,
      action: 'Staff Assigned',
      entity: 'MaintenanceRequest',
      entityId: reqInProgress1.id,
      details: 'David Ross assigned to AC Unit blowing warm air.',
      createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000),
    },
    {
      userId: staffEmily.id,
      action: 'Status Updated',
      entity: 'MaintenanceRequest',
      entityId: reqInProgress2.id,
      details: 'Executive Suite Lock Sticky status changed to IN_PROGRESS.',
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    },
    {
      userId: tenantDiana.id,
      action: 'Tenant Checked Out',
      entity: 'AmenityBooking',
      entityId: loungeHorizon.id,
      details: 'Diana Prince checked out of Rooftop Sky Lounge.',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    },
    {
      userId: tenantCharlie.id,
      action: 'Booking Created',
      entity: 'AmenityBooking',
      entityId: gymVerdant.id,
      details: 'Charlie Brown requested booking for Modern Gym.',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({
      data: log,
    });
  }

  console.log('Seeding notifications...');

  await prisma.notification.create({
    data: {
      userId: managerSarah.id,
      title: 'New Maintenance Request',
      message: 'Alice Cooper submitted a plumbing request for Verdant Pines.',
      category: 'maintenance',
      priority: 'high',
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: tenantAlice.id,
      title: 'Booking Confirmed',
      message: 'Your booking for Olympic Pool has been successfully registered.',
      category: 'booking',
      priority: 'low',
      read: true,
    },
  });

  console.log('Demo database seed successfully completed!');
}

main()
  .catch((e) => {
    console.error('Error during demo seed execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
