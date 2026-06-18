import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const ROLES = {
  ADMIN: 'a7b0a7b0-c0c0-4d4d-8e8e-1f1f1f1f1f1f',
  PROPERTY_MANAGER: 'b8b0b8b0-c0c0-4d4d-8e8e-2f2f2f2f2f2f',
  MAINTENANCE_STAFF: 'c9c0c9c0-c0c0-4d4d-8e8e-3f3f3f3f3f3f',
  TENANT: 'd0d0d0d0-c0c0-4d4d-8e8e-4f4f4f4f4f4f',
};

const PERMISSIONS = [
  // Properties
  { name: 'properties:create', description: 'Create properties' },
  { name: 'properties:edit', description: 'Modify property profiles' },
  { name: 'properties:view', description: 'View properties' },
  // Maintenance
  { name: 'maintenance:create', description: 'Create maintenance request tickets' },
  { name: 'maintenance:assign', description: 'Assign tasks to technicians' },
  { name: 'maintenance:update_status', description: 'Update ticket status' },
  { name: 'maintenance:view_all', description: 'View all tickets in building' },
  // Amenity Bookings
  { name: 'amenities:create', description: 'Create properties amenities' },
  { name: 'amenity_bookings:create', description: 'File amenity booking requests' },
  { name: 'amenity_bookings:approve', description: 'Approve or Reject bookings' },
  // System Configurations
  { name: 'system:configure', description: 'Modify global server specifications' },
];

async function main() {
  console.log('🌱 Starting DB Seeding...');

  // 1. Seed Roles
  console.log('Seeding Roles...');
  await prisma.role.upsert({
    where: { id: ROLES.ADMIN },
    update: {},
    create: {
      id: ROLES.ADMIN,
      name: 'Admin',
      description: 'System Administrators with full platform capabilities',
    },
  });

  await prisma.role.upsert({
    where: { id: ROLES.PROPERTY_MANAGER },
    update: {},
    create: {
      id: ROLES.PROPERTY_MANAGER,
      name: 'Property Manager',
      description: 'Managers managing bookings, properties, and task assignments',
    },
  });

  await prisma.role.upsert({
    where: { id: ROLES.MAINTENANCE_STAFF },
    update: {},
    create: {
      id: ROLES.MAINTENANCE_STAFF,
      name: 'Maintenance Staff',
      description: 'Technicians resolving property issues',
    },
  });

  await prisma.role.upsert({
    where: { id: ROLES.TENANT },
    update: {},
    create: {
      id: ROLES.TENANT,
      name: 'Tenant',
      description: 'Residents booking amenities and submitting requests',
    },
  });

  // 2. Seed Permissions
  console.log('Seeding Permissions...');
  const permissionsMap: Record<string, string> = {};

  for (const perm of PERMISSIONS) {
    const record = await prisma.permission.findFirst({
      where: { name: perm.name },
    });

    if (record) {
      permissionsMap[perm.name] = record.id;
    } else {
      const created = await prisma.permission.create({
        data: perm,
      });
      permissionsMap[perm.name] = created.id;
    }
  }

  // 3. Clear existing role mappings before rebuilding
  await prisma.rolePermission.deleteMany({});

  // 4. Map Permissions
  console.log('Mapping Permissions...');
  
  // Helper to link permissions
  const linkPermissions = async (roleId: string, names: string[]) => {
    for (const name of names) {
      const permissionId = permissionsMap[name];
      if (permissionId) {
        await prisma.rolePermission.create({
          data: { roleId, permissionId },
        });
      }
    }
  };

  // Admin Role - All Permissions
  await linkPermissions(ROLES.ADMIN, PERMISSIONS.map((p) => p.name));

  // Property Manager
  await linkPermissions(ROLES.PROPERTY_MANAGER, [
    'properties:create',
    'properties:edit',
    'properties:view',
    'maintenance:assign',
    'maintenance:update_status',
    'maintenance:view_all',
    'amenity_bookings:approve',
  ]);

  // Maintenance Staff
  await linkPermissions(ROLES.MAINTENANCE_STAFF, [
    'properties:view',
    'maintenance:update_status',
    'maintenance:view_all',
  ]);

  // Tenant
  await linkPermissions(ROLES.TENANT, [
    'properties:view',
    'maintenance:create',
    'amenity_bookings:create',
  ]);

  // Hash a password
  const passwordHash = await argon2.hash('password123', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  // 5. Seed Users
  console.log('Seeding Users...');
  const users = [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      email: 'eleanor@propertyflow.com',
      passwordHash,
      firstName: 'Eleanor',
      lastName: 'Vance',
      phone: '+15550199',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      email: 'marcus@propertyflow.com',
      passwordHash,
      firstName: 'Marcus',
      lastName: 'Brody',
      phone: '+15550198',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      email: 'dave@propertyflow.com',
      passwordHash,
      firstName: 'Dave',
      lastName: 'Miller',
      phone: '+15550197',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'd4444444-4444-4444-4444-444444444444',
      email: 'sarah@propertyflow.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Connor',
      phone: '+15550196',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: u,
    });
  }

  // 6. Map Users to Roles
  console.log('Mapping User Roles...');
  await prisma.userRole.deleteMany({});
  
  await prisma.userRole.create({ data: { userId: 'a1111111-1111-1111-1111-111111111111', roleId: ROLES.ADMIN } });
  await prisma.userRole.create({ data: { userId: 'b2222222-2222-2222-2222-222222222222', roleId: ROLES.PROPERTY_MANAGER } });
  await prisma.userRole.create({ data: { userId: 'c3333333-3333-3333-3333-333333333333', roleId: ROLES.MAINTENANCE_STAFF } });
  await prisma.userRole.create({ data: { userId: 'd4444444-4444-4444-4444-444444444444', roleId: ROLES.TENANT } });

  // 7. Seed Properties
  console.log('Seeding Properties...');
  const properties = [
    {
      id: 'prop-1111-1111-1111-111111111111',
      name: 'Summit Heights',
      address: '742 Evergreen Terrace, Sector 7G',
      type: 'Residential',
      units: 120,
      occupancyRate: 96,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      ownerId: 'b2222222-2222-2222-2222-222222222222', // Marcus Brody
      status: 'ACTIVE',
    },
    {
      id: 'prop-2222-2222-2222-222222222222',
      name: 'Oakridge Manor',
      address: '1048 Peachtree Street, Midtown',
      type: 'Residential',
      units: 80,
      occupancyRate: 91,
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      ownerId: 'b2222222-2222-2222-2222-222222222222', // Marcus Brody
      status: 'ACTIVE',
    },
    {
      id: 'prop-3333-3333-3333-333333333333',
      name: 'Centennial Plaza',
      address: '500 Corporate Boulevard, Suite 100',
      type: 'Commercial',
      units: 45,
      occupancyRate: 88,
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      ownerId: 'a1111111-1111-1111-1111-111111111111', // Eleanor Vance
      status: 'ACTIVE',
    },
  ];

  for (const p of properties) {
    await prisma.property.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }

  // Link Sarah Connor to property
  console.log('Linking Sarah Connor to Summit Heights...');
  await prisma.user.update({
    where: { id: 'd4444444-4444-4444-4444-444444444444' },
    data: { propertyId: 'prop-1111-1111-1111-111111111111' },
  });

  // 8. Seed Amenities
  console.log('Seeding Amenities...');
  const amenities = [
    {
      id: 'amenity-1111-1111-1111-111111111111',
      propertyId: 'prop-1111-1111-1111-111111111111',
      name: 'Skyline Pool',
      description: 'Heated outdoor pool on the rooftop with lounge area',
      capacity: 30,
      location: 'Penthouse Deck',
      imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80',
      rules: JSON.stringify(['Shower before entering', 'No glass bottles', 'No lifeguards on duty']),
      operatingHours: '08:00 - 22:00',
      status: 'ACTIVE',
    },
    {
      id: 'amenity-2222-2222-2222-222222222222',
      propertyId: 'prop-1111-1111-1111-111111111111',
      name: 'Fitness Center',
      description: 'Fully equipped gym with cardio and weight machines',
      capacity: 15,
      location: 'Level 2 Fitness Room',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
      rules: JSON.stringify(['Wipe down equipment after use', 'Wear athletic shoes', 'Limit cardio to 30 mins during peak hours']),
      operatingHours: '06:00 - 23:00',
      status: 'ACTIVE',
    },
    {
      id: 'amenity-3333-3333-3333-333333333333',
      propertyId: 'prop-1111-1111-1111-111111111111',
      name: 'Penthouse Lounge',
      description: 'Private event space with bar, seats, and skyline view',
      capacity: 50,
      location: 'West Tower Lounge',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      rules: JSON.stringify(['Booking required', 'Clean up after event', 'Noise curfew at 23:00']),
      operatingHours: '10:00 - 23:00',
      status: 'ACTIVE',
    },
    {
      id: 'amenity-4444-4444-4444-444444444444',
      propertyId: 'prop-2222-2222-2222-222222222222',
      name: 'Garden Lounge',
      description: 'Tranquil garden space with benches and walking paths',
      capacity: 25,
      location: 'Courtyard Garden',
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
      rules: JSON.stringify(['Leash pets at all times', 'No littering', 'Do not pick flowers']),
      operatingHours: '07:00 - 21:00',
      status: 'ACTIVE',
    },
    {
      id: 'amenity-5555-5555-5555-555555555555',
      propertyId: 'prop-2222-2222-2222-222222222222',
      name: 'Tennis Courts',
      description: 'Two outdoor clay tennis courts',
      capacity: 4,
      location: 'East Wing Courts',
      imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
      rules: JSON.stringify(['Proper tennis attire required', 'Limit play to 1 hour if others are waiting']),
      operatingHours: '08:00 - 20:00',
      status: 'ACTIVE',
    },
  ];

  for (const a of amenities) {
    await prisma.amenity.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    });
  }

  // 9. Seed Bookings
  console.log('Seeding Bookings...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0); // 10 AM tomorrow

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(11, 30, 0, 0); // 11:30 AM tomorrow

  const bookings = [
    {
      id: 'b-1111111-1111-1111-1111-111111111111',
      amenityId: 'amenity-1111-1111-1111-111111111111', // Skyline Pool
      tenantId: 'd4444444-4444-4444-4444-444444444444', // Sarah Connor
      startTime: tomorrow,
      endTime: tomorrowEnd,
      status: 'APPROVED',
      purpose: 'Swimming and relaxing',
      guestsCount: 2,
    },
  ];

  for (const b of bookings) {
    await prisma.amenityBooking.upsert({
      where: { id: b.id },
      update: {},
      create: b,
    });
  }

  // 10. Seed Maintenance Requests
  console.log('Seeding Maintenance Requests...');
  const requests = [
    {
      id: 'maint-1111-1111-1111-111111111111',
      propertyId: 'prop-1111-1111-1111-111111111111', // Summit Heights
      tenantId: 'd4444444-4444-4444-4444-444444444444', // Sarah Connor
      title: 'Boiler leakage and hot water outage',
      description: 'The main hot water boiler is leaking in the basement, affecting heating and water in Unit 402. Flooding risk is currently high.',
      status: 'PENDING',
      priority: 'EMERGENCY',
      category: 'Plumbing',
    },
    {
      id: 'maint-2222-2222-2222-222222222222',
      propertyId: 'prop-1111-1111-1111-111111111111', // Summit Heights
      tenantId: 'd4444444-4444-4444-4444-444444444444', // Sarah Connor
      title: 'HVAC system diagnostic scan',
      description: 'Air conditioner unit blowing warm air during afternoon peak cooling cycles. Compressor makes loud buzzing sounds.',
      status: 'ASSIGNED',
      priority: 'HIGH',
      assignedTechnicianId: 'c3333333-3333-3333-3333-333333333333', // Dave Miller (Staff)
      category: 'HVAC',
    },
  ];

  for (const r of requests) {
    await prisma.maintenanceRequest.upsert({
      where: { id: r.id },
      update: {},
      create: r,
    });
  }

  console.log('🎉 Seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
