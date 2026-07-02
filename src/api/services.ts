import { apiClient } from './client';
import {
  UserDTO,
  PropertyDTO,
  MaintenanceRequestDTO,
  MaintenanceRequestHistoryDTO,
  AmenityBookingDTO,
  NotificationDTO,
  AmenityDTO,
  RoleType,
  PropertyStatus,
  MaintenanceStatus,
  MaintenancePriority,
  BookingStatus,
} from '../../shared/types';

// ==========================================
// 1. AUTHENTICATION SERVICE
// ==========================================
export const AuthService = {
  async register(data: any): Promise<UserDTO> {
    const res = await apiClient.post('/auth/register', data);
    const { user, accessToken } = res.data.data;
    localStorage.setItem('access_token', accessToken);
    return user;
  },

  async login(credentials: any): Promise<UserDTO> {
    const res = await apiClient.post('/auth/login', credentials);
    const { user, accessToken } = res.data.data;
    localStorage.setItem('access_token', accessToken);
    return user;
  },

  async refresh(): Promise<string> {
    const res = await apiClient.post('/auth/refresh');
    const { accessToken } = res.data.data;
    localStorage.setItem('access_token', accessToken);
    return accessToken;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(data: any): Promise<void> {
    await apiClient.post('/auth/reset-password', data);
  },

  async me(): Promise<UserDTO> {
    const res = await apiClient.get('/auth/me');
    return res.data.data.user;
  },
};

// ==========================================
// 2. PROPERTIES SERVICE
// ==========================================
export const PropertiesService = {
  async list(params?: { page?: number; limit?: number; search?: string; status?: PropertyStatus }): Promise<{ properties: PropertyDTO[]; meta: any }> {
    const res = await apiClient.get('/properties', { params });
    return res.data.data;
  },

  async getById(id: string): Promise<PropertyDTO> {
    const res = await apiClient.get(`/properties/${id}`);
    return res.data.data.property;
  },

  async create(data: any): Promise<PropertyDTO> {
    const res = await apiClient.post('/properties', data);
    return res.data.data.property;
  },

  async update(id: string, data: any): Promise<PropertyDTO> {
    const res = await apiClient.patch(`/properties/${id}`, data);
    return res.data.data.property;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/properties/${id}`);
  },
};

// ==========================================
// 3. MAINTENANCE SERVICE
// ==========================================
export const MaintenanceService = {
  async list(params?: { propertyId?: string; tenantId?: string; assignedTechnicianId?: string; status?: MaintenanceStatus; priority?: MaintenancePriority }): Promise<MaintenanceRequestDTO[]> {
    const res = await apiClient.get('/maintenance', { params });
    return res.data.data.requests;
  },

  async getById(id: string): Promise<MaintenanceRequestDTO> {
    const res = await apiClient.get(`/maintenance/${id}`);
    return res.data.data.request;
  },

  async create(data: any): Promise<MaintenanceRequestDTO> {
    const res = await apiClient.post('/maintenance', data);
    return res.data.data.request;
  },

  async update(id: string, data: any): Promise<MaintenanceRequestDTO> {
    const res = await apiClient.patch(`/maintenance/${id}`, data);
    return res.data.data.request;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/maintenance/${id}`);
  },

  async assign(id: string, technicianId: string): Promise<MaintenanceRequestDTO> {
    const res = await apiClient.patch(`/maintenance/${id}/assign`, { technicianId });
    return res.data.data.request;
  },

  async updateStatus(id: string, status: MaintenanceStatus, notes?: string): Promise<MaintenanceRequestDTO> {
    const res = await apiClient.patch(`/maintenance/${id}/status`, { status, notes });
    return res.data.data.request;
  },

  async getTimeline(id: string): Promise<MaintenanceRequestHistoryDTO[]> {
    const res = await apiClient.get(`/maintenance/${id}/timeline`);
    return res.data.data.timeline;
  },

  async getSLA(): Promise<any[]> {
    const res = await apiClient.get('/maintenance/sla');
    return res.data.data.metrics;
  },

  async rate(id: string, rating: number, reviewComment?: string): Promise<MaintenanceRequestDTO> {
    const res = await apiClient.patch(`/maintenance/${id}/rate`, { rating, reviewComment });
    return res.data.data.request;
  },
};

// ==========================================
// 4. BOOKINGS SERVICE
// ==========================================
export const BookingsService = {
  async list(params?: { tenantId?: string; amenityId?: string; status?: BookingStatus }): Promise<AmenityBookingDTO[]> {
    const res = await apiClient.get('/bookings', { params });
    return res.data.data.bookings;
  },

  async create(data: any): Promise<AmenityBookingDTO> {
    const res = await apiClient.post('/bookings', data);
    return res.data.data.booking;
  },

  async update(id: string, data: any): Promise<AmenityBookingDTO> {
    const res = await apiClient.patch(`/bookings/${id}`, data);
    return res.data.data.booking;
  },

  async checkAvailability(params: { amenityId: string; startTime: string; endTime: string }): Promise<{ available: boolean }> {
    const res = await apiClient.get('/bookings/check-availability', { params });
    return res.data.data;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<AmenityBookingDTO> {
    const res = await apiClient.patch(`/bookings/${id}/status`, { status });
    return res.data.data.booking;
  },

  async cancel(id: string): Promise<AmenityBookingDTO> {
    const res = await apiClient.post(`/bookings/${id}/cancel`);
    return res.data.data.booking;
  },

  async checkIn(id: string): Promise<AmenityBookingDTO> {
    const res = await apiClient.post(`/bookings/${id}/checkin`);
    return res.data.data.booking;
  },

  async checkOut(id: string): Promise<AmenityBookingDTO> {
    const res = await apiClient.post(`/bookings/${id}/checkout`);
    return res.data.data.booking;
  },
};

// ==========================================
// 5. DASHBOARD SERVICE
// ==========================================
export const DashboardService = {
  async getKPIs(): Promise<any> {
    const res = await apiClient.get('/dashboard/kpis');
    return res.data.data;
  },
};

// ==========================================
// 6. USERS SERVICE
// ==========================================
export const UsersService = {
  async list(params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<{ users: UserDTO[]; meta: any }> {
    const res = await apiClient.get('/users', { params });
    return res.data.data;
  },

  async getById(id: string): Promise<UserDTO> {
    const res = await apiClient.get(`/users/${id}`);
    return res.data.data.user;
  },

  async create(data: any): Promise<UserDTO> {
    const res = await apiClient.post('/users', data);
    return res.data.data.user;
  },

  async update(id: string, data: any): Promise<UserDTO> {
    const res = await apiClient.patch(`/users/${id}`, data);
    return res.data.data.user;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};

// ==========================================
// 7. AMENITIES SERVICE
// ==========================================
export const AmenitiesService = {
  async list(params?: { page?: number; limit?: number; search?: string; propertyId?: string }): Promise<{ amenities: AmenityDTO[]; meta: any }> {
    const res = await apiClient.get('/amenities', { params });
    return res.data.data;
  },

  async getById(id: string): Promise<AmenityDTO> {
    const res = await apiClient.get(`/amenities/${id}`);
    return res.data.data.amenity;
  },

  async create(data: any): Promise<AmenityDTO> {
    const res = await apiClient.post('/amenities', data);
    return res.data.data.amenity;
  },

  async update(id: string, data: any): Promise<AmenityDTO> {
    const res = await apiClient.patch(`/amenities/${id}`, data);
    return res.data.data.amenity;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/amenities/${id}`);
  },
};

// ==========================================
// 8. AUDIT LOGS SERVICE
// ==========================================
export const AuditLogsService = {
  async list(params?: { page?: number; limit?: number }): Promise<{ logs: any[]; meta: any }> {
    const res = await apiClient.get('/audit-logs', { params });
    return res.data.data;
  },
};
