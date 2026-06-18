import '@prisma/client';

declare module '@prisma/client' {
  export const PropertyStatus: {
    ACTIVE: 'ACTIVE';
    INACTIVE: 'INACTIVE';
    MAINTENANCE: 'MAINTENANCE';
  };
  export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus];

  export const MaintenancePriority: {
    LOW: 'LOW';
    MEDIUM: 'MEDIUM';
    HIGH: 'HIGH';
    EMERGENCY: 'EMERGENCY';
  };
  export type MaintenancePriority = (typeof MaintenancePriority)[keyof typeof MaintenancePriority];

  export const MaintenanceStatus: {
    PENDING: 'PENDING';
    ASSIGNED: 'ASSIGNED';
    IN_PROGRESS: 'IN_PROGRESS';
    COMPLETED: 'COMPLETED';
    CANCELLED: 'CANCELLED';
  };
  export type MaintenanceStatus = (typeof MaintenanceStatus)[keyof typeof MaintenanceStatus];

  export const BookingStatus: {
    PENDING: 'PENDING';
    APPROVED: 'APPROVED';
    REJECTED: 'REJECTED';
    CANCELLED: 'CANCELLED';
    IN_USE: 'IN_USE';
    COMPLETED: 'COMPLETED';
    NO_SHOW: 'NO_SHOW';
  };
  export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

  export const AmenityStatus: {
    ACTIVE: 'ACTIVE';
    INACTIVE: 'INACTIVE';
    MAINTENANCE: 'MAINTENANCE';
  };
  export type AmenityStatus = (typeof AmenityStatus)[keyof typeof AmenityStatus];

  export const NotificationType: {
    INFO: 'INFO';
    ALERT: 'ALERT';
    MAINTENANCE: 'MAINTENANCE';
    BOOKING: 'BOOKING';
  };
  export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

  export const DeliveryChannel: {
    IN_APP: 'IN_APP';
    EMAIL: 'EMAIL';
    PUSH: 'PUSH';
    SMS: 'SMS';
  };
  export type DeliveryChannel = (typeof DeliveryChannel)[keyof typeof DeliveryChannel];

  export const DeliveryStatus: {
    PENDING: 'PENDING';
    SENT: 'SENT';
    FAILED: 'FAILED';
  };
  export type DeliveryStatus = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];
}
