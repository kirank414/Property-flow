import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/config/db';
import { redisClient } from '../src/config/redis';
import { BookingStatus, MaintenanceStatus } from '../src/types/enums';
import jwt from 'jsonwebtoken';

// Mock BullMQ globally to prevent automatic Redis connection attempts during test initialization
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({}),
    on: jest.fn(),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn().mockResolvedValue({}),
    opts: { concurrency: 1 },
  })),
}));

// Mock Prisma and Redis clients to run tests cleanly in any environment
jest.mock('../src/config/db', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
    property: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    amenityBooking: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    amenity: {
      findFirst: jest.fn(),
    },
    maintenanceRequest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
    $queryRaw: jest.fn().mockResolvedValue([1]),
  },
}));

jest.mock('../src/config/redis', () => ({
  redisClient: {
    isOpen: true,
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    quit: jest.fn(),
  },
  subClient: {
    isOpen: true,
  },
  connectRedis: jest.fn(),
}));

jest.mock('../src/utils/tokens', () => ({
  TokenService: {
    generateAccessToken: jest.fn().mockReturnValue('mock-access-token'),
    generateRefreshToken: jest.fn().mockReturnValue('mock-refresh-token'),
    verifyAccessToken: jest.fn().mockReturnValue({ id: 'a1111111-1111-1111-1111-111111111111', email: 'test@example.com' }),
  },
}));

describe('Zillow Integration Tests', () => {
  let mockToken: string;

  beforeAll(() => {
    mockToken = 'mock-access-token';
  });

  beforeEach(() => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'a1111111-1111-1111-1111-111111111111',
      role: 'TENANT',
      email: 'tenant@example.com'
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // 1. AUTHENTICATION TESTS
  // ==========================================
  describe('Authentication Module', () => {
    it('should successfully mock authenticate accessing secure routes', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'a1111111-1111-1111-1111-111111111111',
        role: 'TENANT',
      });
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(['properties:view']));

      const res = await request(app)
        .get('/api/v1/properties')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).not.toBe(401);
    });

    it('should return 401 Unauthorized for requests without token', async () => {
      const res = await request(app).get('/api/v1/properties');
      expect(res.status).toBe(401);
    });
  });

  // ==========================================
  // 2. RBAC TESTS
  // ==========================================
  describe('Role-Based Access Control', () => {
    it('should prevent Tenant from using Admin-only route configurations', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'a1111111-1111-1111-1111-111111111111',
        role: 'TENANT',
      });
      // Tenants do not have 'system:configure' permission
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(['properties:view']));

      const res = await request(app)
        .get('/api/v1/dashboard/kpis')
        .set('Authorization', `Bearer ${mockToken}`);

      // Expect forbidden since 'properties:view' is required, wait,
      // Dashboard kpis routes require 'properties:view' which tenant doesn't have in seed.ts, so it should block them.
      expect(res.status).toBe(403);
    });
  });

  // ==========================================
  // 3. BOOKINGS CHECK-IN & CHECK-OUT TESTS
  // ==========================================
  describe('Amenity Check-In/Out Window & Lifecycle', () => {
    it('should reject check-in if booking is not approved', async () => {
      (prisma.amenityBooking.findFirst as jest.Mock).mockResolvedValue({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.PENDING,
        startTime: new Date(Date.now() + 10 * 60 * 1000), // 10 mins in future
        endTime: new Date(Date.now() + 60 * 1000 * 60),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        amenity: { name: 'Pool' },
      });

      const res = await request(app)
        .post('/api/v1/bookings/b1111111-1111-1111-1111-111111111111/checkin')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Only APPROVED bookings can be checked in');
    });

    it('should reject early check-in attempt before 15 minutes window', async () => {
      (prisma.amenityBooking.findFirst as jest.Mock).mockResolvedValue({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.APPROVED,
        startTime: new Date(Date.now() + 20 * 60 * 1000), // 20 mins in future
        endTime: new Date(Date.now() + 60 * 1000 * 60),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        amenity: { name: 'Pool' },
      });

      const res = await request(app)
        .post('/api/v1/bookings/b1111111-1111-1111-1111-111111111111/checkin')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Cannot check in more than 15 minutes before');
    });

    it('should accept check-in if within 15 minutes early check-in window', async () => {
      const now = new Date();
      (prisma.amenityBooking.findFirst as jest.Mock).mockResolvedValue({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.APPROVED,
        startTime: new Date(now.getTime() + 10 * 60 * 1000), // 10 mins in future (valid window)
        endTime: new Date(now.getTime() + 60 * 1000 * 60),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        amenity: { name: 'Pool' },
      });
      (prisma.amenityBooking.update as jest.Mock).mockResolvedValue({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.IN_USE,
      });

      const res = await request(app)
        .post('/api/v1/bookings/b1111111-1111-1111-1111-111111111111/checkin')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.booking.status).toBe(BookingStatus.IN_USE);
    });

    it('should reject check-out if booking has not been checked in yet', async () => {
      (prisma.amenityBooking.findFirst as jest.Mock).mockResolvedValue({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.APPROVED,
        actualCheckInAt: null,
        tenantId: 'a1111111-1111-1111-1111-111111111111',
      });

      const res = await request(app)
        .post('/api/v1/bookings/b1111111-1111-1111-1111-111111111111/checkout')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Only IN_USE bookings can be checked out');
    });

    it('should complete check-out successfully for IN_USE bookings', async () => {
      (prisma.amenityBooking.findFirst as jest.Mock).mockResolvedValue({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.IN_USE,
        actualCheckInAt: new Date(Date.now() - 10 * 60 * 1000),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        amenity: { name: 'Pool' },
      });
      (prisma.amenityBooking.update as jest.Mock).mockResolvedValue({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.COMPLETED,
      });

      const res = await request(app)
        .post('/api/v1/bookings/b1111111-1111-1111-1111-111111111111/checkout')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.booking.status).toBe(BookingStatus.COMPLETED);
    });

    it('should prevent concurrent check-in race conditions', async () => {
      // Setup first transaction update mock to simulate checking in
      (prisma.amenityBooking.findFirst as jest.Mock).mockImplementationOnce(() => ({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.APPROVED,
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        amenity: { name: 'Pool' },
        actualCheckInAt: null,
      }));

      // Simulate a concurrent check-in: next fetch finds it already checked in
      (prisma.amenityBooking.findFirst as jest.Mock).mockImplementationOnce(() => ({
        id: 'b1111111-1111-1111-1111-111111111111',
        status: BookingStatus.IN_USE,
        actualCheckInAt: new Date(),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
      }));

      const res1 = await request(app)
        .post('/api/v1/bookings/b1111111-1111-1111-1111-111111111111/checkin')
        .set('Authorization', `Bearer ${mockToken}`);

      const res2 = await request(app)
        .post('/api/v1/bookings/b1111111-1111-1111-1111-111111111111/checkin')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(400); // Fails since status is already IN_USE
    });
  });

  // ==========================================
  // 4. KPI DASHBOARD & PEAK CALCULATIONS TESTS
  // ==========================================
  describe('Dashboard KPIs & Peak Hour Aggregations', () => {
    it('should return compiled KPI dashboard metrics', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'a1111111-1111-1111-1111-111111111111',
        role: 'MANAGER',
      });
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(['system:configure']));
      (prisma.property.count as jest.Mock).mockResolvedValue(5);
      (prisma.property.findMany as jest.Mock).mockResolvedValue([
        { occupancyRate: 90 },
        { occupancyRate: 96 },
      ]);
      (prisma.user.count as jest.Mock).mockResolvedValue(40);
      (prisma.maintenanceRequest.count as jest.Mock).mockResolvedValue(10);
      (prisma.maintenanceRequest.findMany as jest.Mock).mockResolvedValue([
        { status: MaintenanceStatus.COMPLETED, createdAt: new Date(Date.now() - 5 * 3600 * 1000), resolvedAt: new Date() },
        { status: MaintenanceStatus.PENDING, createdAt: new Date() },
      ]);

      const now = new Date();
      const st1 = new Date(now);
      st1.setHours(14, 0, 0, 0); // 2 PM
      const et1 = new Date(st1.getTime() + 2 * 3600 * 1000);

      const st2 = new Date(now);
      st2.setHours(14, 30, 0, 0); // 2:30 PM
      const et2 = new Date(st2.getTime() + 2 * 3600 * 1000);

      (prisma.amenityBooking.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'b1111111-1111-1111-1111-111111111111',
          status: BookingStatus.COMPLETED,
          startTime: st1,
          endTime: et1,
          actualCheckInAt: st1,
          actualCheckOutAt: et1,
          amenity: { name: 'Skyline Pool' },
        },
        {
          id: 'b2222222-2222-2222-2222-222222222222',
          status: BookingStatus.COMPLETED,
          startTime: st2,
          endTime: et2,
          actualCheckInAt: st2,
          actualCheckOutAt: et2,
          amenity: { name: 'Skyline Pool' },
        },
      ]);

      (prisma.amenityBooking.count as jest.Mock).mockResolvedValue(2);

      const res = await request(app)
        .get('/api/v1/dashboard/kpis')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.properties.totalProperties).toBe(5);
      expect(res.body.data.properties.occupancyRate).toBe(93); // Average of 90 and 96
      expect(res.body.data.amenity.mostPopularAmenity).toBe('Skyline Pool');
      expect(res.body.data.amenity.peakAmenityUsageHours).toBe('2:00 PM - 3:00 PM');
    });
  });
});
