export type Role = 'Admin' | 'Manager' | 'Staff' | 'Tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  propertyId?: string; // For tenants, which property they belong to
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'Residential' | 'Commercial' | 'Retail';
  units: number;
  occupancy: number; // e.g. 94 for 94%
  image: string;
  manager: string;
  amenities: string[];
}

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type MaintenanceStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed';

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  unitNumber: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdBy: string;
  createdAt: string;
  assignedTo?: string;
  category: string;
}

export type BookingStatus = 'pending' | 'booked' | 'cancelled';

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
  start: string;
  end: string;
  status: BookingStatus;
  price?: number;
}
