import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AuthService,
  PropertiesService,
  MaintenanceService,
  BookingsService,
  DashboardService,
  UsersService,
  AmenitiesService,
  AuditLogsService,
} from './services';
import {
  PropertyStatus,
  MaintenanceStatus,
  MaintenancePriority,
  BookingStatus,
} from '../../shared/types';

// ==========================================
// 1. PROPERTIES HOOKS
// ==========================================
export function useProperties(filters?: { page?: number; limit?: number; search?: string; status?: PropertyStatus }) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => PropertiesService.list(filters),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => PropertiesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PropertiesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => PropertiesService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PropertiesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

// ==========================================
// 2. USERS HOOKS
// ==========================================
export function useUsers(filters?: { page?: number; limit?: number; search?: string; role?: string }) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => UsersService.list(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => UsersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UsersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => UsersService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UsersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

// ==========================================
// 3. AMENITIES HOOKS
// ==========================================
export function useAmenities(filters?: { page?: number; limit?: number; search?: string; propertyId?: string }) {
  return useQuery({
    queryKey: ['amenities', filters],
    queryFn: () => AmenitiesService.list(filters),
  });
}

export function useAmenity(id: string) {
  return useQuery({
    queryKey: ['amenities', id],
    queryFn: () => AmenitiesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AmenitiesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] }); // Properties include amenities
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useUpdateAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AmenitiesService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['amenities', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useDeleteAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AmenitiesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

// ==========================================
// 4. MAINTENANCE HOOKS
// ==========================================
export function useMaintenanceRequests(filters?: { propertyId?: string; tenantId?: string; assignedTechnicianId?: string; status?: MaintenanceStatus; priority?: MaintenancePriority }) {
  return useQuery({
    queryKey: ['maintenance', filters],
    queryFn: () => MaintenanceService.list(filters),
  });
}

export function useMaintenanceRequest(id: string) {
  return useQuery({
    queryKey: ['maintenance', id],
    queryFn: () => MaintenanceService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMaintenanceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: MaintenanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useAssignMaintenanceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, technicianId }: { id: string; technicianId: string }) => MaintenanceService.assign(id, technicianId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateMaintenanceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: MaintenanceStatus; notes?: string }) => MaintenanceService.updateStatus(id, status, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useMaintenanceTimeline(id: string) {
  return useQuery({
    queryKey: ['maintenance', id, 'timeline'],
    queryFn: () => MaintenanceService.getTimeline(id),
    enabled: !!id,
  });
}

// ==========================================
// 5. BOOKINGS HOOKS
// ==========================================
export function useBookings(filters?: { tenantId?: string; amenityId?: string; status?: BookingStatus }) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => BookingsService.list(filters),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BookingsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => BookingsService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BookingsService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCheckInBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BookingsService.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCheckOutBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BookingsService.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ==========================================
// 6. DASHBOARD HOOKS
// ==========================================
export function useDashboardKPIs() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: DashboardService.getKPIs,
  });
}

// ==========================================
// 7. AUDIT LOGS HOOKS
// ==========================================
export function useAuditLogs(filters?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => AuditLogsService.list(filters),
  });
}
