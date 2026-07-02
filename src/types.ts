export type Role = 'Admin' | 'Manager' | 'Staff' | 'Tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  avatar?: string; // Add fallback
  phone?: string;
  unit?: string;
  propertyId?: string; // For tenants, which property they belong to
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: string; // Residential, Commercial, Retail, Mixed-Use
  units: number;
  occupancy: number; // occupancy is required
  occupancyRate?: number;
  image: string;
  manager?: string; // optional to fit data.ts
  amenities: string[];
  ownerName?: string;
  revenue?: number;
  activeRequests?: number;
}

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type MaintenanceStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed';

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  propertyName?: string;
  unitNumber: string; // Required to satisfy views compiler check
  unit?: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdBy: string;
  createdById?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  assignedToId?: string;
  category: string;
  rating?: number;
  reviewComment?: string;
  ratedAt?: string;
  timeline?: any[];
  comments?: any[];
}

export type BookingStatus = 'pending' | 'booked' | 'cancelled' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'IN_USE' | 'COMPLETED' | 'NO_SHOW';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'booking' | 'conflict' | 'sla' | 'property';
  priority: 'low' | 'medium' | 'high' | 'critical';
  time: string; // relative or ISO format
  read: boolean;
  dateGroup: 'Today' | 'Yesterday' | 'Older';
}

export interface BookingSlot {
  id: string;
  amenityName: string;
  propertyId: string;
  user: string;
  date: string;
  start: string;
  end: string;
  status: BookingStatus;
  price?: number;
  actualCheckInAt?: string | null;
  actualCheckOutAt?: string | null;
}

// Additional missing types used in data.ts
export interface Amenity {
  id: string;
  name: string;
  description: string;
  capacity: number;
  location: string;
  image: string;
  rules: string[];
  activeBookings: number;
  operatingHours: string;
}

export interface Booking {
  id: string;
  amenityId: string;
  amenityName: string;
  userName: string;
  userId: string;
  unit: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  purpose: string;
  guestsCount: number;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'maintenance' | 'booking' | 'system' | 'user';
  message: string;
  user: string;
  role: string;
  time: string;
  avatar: string;
}
