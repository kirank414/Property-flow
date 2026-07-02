// ==========================================
// 1. DYNAMIC SYSTEM ENUMS
// ==========================================
export type RoleType = 'ADMIN' | 'MANAGER' | 'STAFF' | 'TENANT';

export type PropertyStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type MaintenanceStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type AmenityStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'IN_USE' | 'COMPLETED' | 'NO_SHOW';

export type NotificationCategory = 'INFO' | 'ALERT' | 'MAINTENANCE' | 'BOOKING' | 'CONFLICT' | 'SLA' | 'PROPERTY';

export type DeliveryChannel = 'IN_APP' | 'EMAIL' | 'PUSH' | 'SMS';

export type DeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';

// ==========================================
// 2. DATA ENTITY CONTRACTS (DTOs)
// ==========================================

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Computed
  phone: string;
  role: RoleType;
  avatarUrl?: string | null;
  propertyId?: string | null;
  createdAt: string;
}

export interface PropertyDTO {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  occupancyRate: number;
  imageUrl?: string | null;
  revenue: number;
  ownerId: string;
  status: PropertyStatus;
  activeRequestsCount?: number; // Calculated dynamically
  amenities?: AmenityDTO[];
  createdAt: string;
}

export interface AmenityDTO {
  id: string;
  propertyId: string;
  name: string;
  description?: string | null;
  capacity: number;
  location?: string | null;
  imageUrl?: string | null;
  rules: string[];
  operatingHours?: string | null;
  status: AmenityStatus;
  activeBookingsCount?: number; // Calculated dynamically
}

export interface AmenityBookingDTO {
  id: string;
  amenityId: string;
  amenityName?: string; // Mapped on join
  tenantId: string;
  tenantName?: string; // Mapped on join
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  status: BookingStatus;
  purpose?: string | null;
  guestsCount: number;
  actualCheckInAt?: string | null;
  actualCheckOutAt?: string | null;
  checkedInBy?: string | null;
  checkedOutBy?: string | null;
  createdAt: string;
}

export interface MaintenanceRequestDTO {
  id: string;
  propertyId: string;
  propertyName?: string; // Mapped on join
  tenantId: string;
  tenantName?: string; // Mapped on join
  assignedTechnicianId?: string | null;
  assignedTechnicianName?: string | null; // Mapped on join
  title: string;
  description: string;
  unitNumber: string;
  category: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  rating?: number | null;
  reviewComment?: string | null;
  ratedAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequestHistoryDTO {
  id: string;
  maintenanceRequestId: string;
  oldStatus?: MaintenanceStatus | null;
  newStatus?: MaintenanceStatus | null;
  oldPriority?: MaintenancePriority | null;
  newPriority?: MaintenancePriority | null;
  oldTechnicianId?: string | null;
  newTechnicianId?: string | null;
  actionType: string;
  performedBy: string;
  performedByName?: string; // Mapped on join
  notes?: string | null;
  createdAt: string;
}

export interface NotificationDTO {
  id: string;
  userId: string;
  createdBy?: string | null;
  title: string;
  message: string; // Maps to description on client
  category: NotificationCategory;
  channel: DeliveryChannel;
  status: DeliveryStatus;
  read: boolean; // Computed: readAt !== null
  readAt?: string | null;
  createdAt: string;
}
