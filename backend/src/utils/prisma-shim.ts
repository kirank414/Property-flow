// Runtime shim to inject missing PostgreSQL enums into SQLite Prisma client at runtime
const prismaModule = require('@prisma/client');

const PropertyStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE',
} as const;

const MaintenancePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  EMERGENCY: 'EMERGENCY',
} as const;

const MaintenanceStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

const BookingStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  IN_USE: 'IN_USE',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
} as const;

const AmenityStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE',
} as const;

const NotificationType = {
  INFO: 'INFO',
  ALERT: 'ALERT',
  MAINTENANCE: 'MAINTENANCE',
  BOOKING: 'BOOKING',
  CONFLICT: 'CONFLICT',
  SLA: 'SLA',
  PROPERTY: 'PROPERTY',
} as const;

const DeliveryChannel = {
  IN_APP: 'IN_APP',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  SMS: 'SMS',
} as const;

const DeliveryStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const;

const shims = {
  PropertyStatus,
  MaintenancePriority,
  MaintenanceStatus,
  BookingStatus,
  AmenityStatus,
  NotificationType,
  DeliveryChannel,
  DeliveryStatus,
};

for (const [key, value] of Object.entries(shims)) {
  if (!prismaModule[key]) {
    try {
      Object.defineProperty(prismaModule, key, {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } catch (e) {
      console.warn(`Failed to shim ${key} on @prisma/client:`, e);
      prismaModule[key] = value;
    }
  }
}
