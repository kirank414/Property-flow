import React, { useState, useEffect } from 'react';
import { User, Property, MaintenanceRequest, BookingSlot, AppNotification } from './types.ts';
import LandingPage from './components/LandingPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
const DashboardView = React.lazy(() => import('./components/DashboardView.tsx'));
const PropertyView = React.lazy(() => import('./components/PropertyView.tsx'));
const MaintenanceView = React.lazy(() => import('./components/MaintenanceView.tsx'));
const AmenityView = React.lazy(() => import('./components/AmenityView.tsx'));
const AnalyticsView = React.lazy(() => import('./components/AnalyticsView.tsx'));
const AdminView = React.lazy(() => import('./components/AdminView.tsx'));
const UserProfileView = React.lazy(() => import('./components/UserProfileView.tsx'));
const RealTimeMonitorView = React.lazy(() => import('./components/RealTimeMonitorView.tsx'));
import { ErrorBoundary, SafeguardState } from './components/DesignSystem.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useProperties, 
  useMaintenanceRequests, 
  useBookings, 
  useUsers,
  useCreateMaintenanceRequest,
  useUpdateMaintenanceStatus,
  useAssignMaintenanceRequest,
  useCreateBooking,
  useCancelBooking,
  useCheckInBooking,
  useCheckOutBooking,
  useUpdateBooking,
  useAmenities
} from './api/hooks';
import { AuthService } from './api/services';
import { bookingValidationSchema } from '../shared/zod';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'properties' | 'maintenance' | 'amenities' | 'analytics' | 'admin' | 'profile' | 'monitor'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [simulationState, setSimulationState] = useState<'normal' | 'network' | 'unauthorized' | 'session'>('normal');

  const theme = 'dark';

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // React Query Queries
  const { data: propertiesData, isLoading: propertiesLoading } = useProperties();
  const { data: maintenanceData, isLoading: maintenanceLoading } = useMaintenanceRequests();
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings();
  const { data: usersData } = useUsers();
  const { data: amenitiesData, isLoading: amenitiesLoading } = useAmenities();

  const properties = (propertiesData?.properties || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    type: p.type,
    units: p.units,
    occupancy: p.occupancyRate,
    image: p.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    manager: p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : 'Unassigned',
    amenities: p.amenities ? p.amenities.map((am: any) => am.name) : [],
  } as Property));

  const maintenance = (maintenanceData || []).map((req: any) => {
    let priority: 'Low' | 'Medium' | 'High' | 'Urgent' = 'Medium';
    if (req.priority === 'LOW') priority = 'Low';
    else if (req.priority === 'HIGH') priority = 'High';
    else if (req.priority === 'EMERGENCY') priority = 'Urgent';

    let status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' = 'Pending';
    if (req.status === 'ASSIGNED') status = 'Assigned';
    else if (req.status === 'IN_PROGRESS') status = 'In Progress';
    else if (req.status === 'COMPLETED') status = 'Completed';

    return {
      id: req.id,
      title: req.title,
      description: req.description,
      propertyId: req.propertyId,
      propertyName: req.property ? req.property.name : undefined,
      unitNumber: req.unitNumber || 'Suite 402',
      priority,
      status,
      createdBy: req.tenant ? `${req.tenant.firstName} ${req.tenant.lastName}` : 'System',
      createdById: req.tenantId,
      createdAt: req.createdAt,
      assignedTo: req.technician ? `${req.technician.firstName} ${req.technician.lastName}` : undefined,
      category: req.category || 'General',
      rating: req.rating ?? undefined,
      reviewComment: req.reviewComment ?? undefined,
      ratedAt: req.ratedAt ?? undefined,
    } as MaintenanceRequest;
  });

  const bookings: BookingSlot[] = bookingsData || [];

  const users = (usersData?.users || []).map((u: any) => {
    let role: 'Admin' | 'Manager' | 'Staff' | 'Tenant' = 'Tenant';
    if (u.role === 'ADMIN') role = 'Admin';
    else if (u.role === 'MANAGER') role = 'Manager';
    else if (u.role === 'STAFF') role = 'Staff';
    return {
      id: u.id,
      email: u.email,
      name: `${u.firstName} ${u.lastName}`,
      role,
      avatarUrl: u.avatarUrl || undefined,
      propertyId: u.propertyId || undefined,
    } as User;
  });

  const amenities = Array.from(new Set((amenitiesData?.amenities || []).map((a: any) => a.name)));

  const setUsers = () => {};
  const setProperties = () => {};
  const setMaintenance = () => {};
  const setBookings = () => {};
  const setAmenities = () => {};

  // React Query Mutations
  const createTicketMutation = useCreateMaintenanceRequest();
  const updateTicketStatusMutation = useUpdateMaintenanceStatus();
  const assignTicketMutation = useAssignMaintenanceRequest();

  const createBookingMutation = useCreateBooking();
  const updateBookingMutation = useUpdateBooking();
  const cancelBookingMutation = useCancelBooking();
  const checkInBookingMutation = useCheckInBooking();
  const checkOutBookingMutation = useCheckOutBooking();

  // Load token and restore session on boot
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      AuthService.me()
        .then((userDto) => {
          let role: 'Admin' | 'Manager' | 'Staff' | 'Tenant' = 'Tenant';
          if (userDto.role === 'ADMIN') role = 'Admin';
          else if (userDto.role === 'MANAGER') role = 'Manager';
          else if (userDto.role === 'STAFF') role = 'Staff';

          const user: User = {
            id: userDto.id,
            email: userDto.email,
            name: `${userDto.firstName} ${userDto.lastName}`,
            role,
            avatarUrl: userDto.avatarUrl || undefined,
            propertyId: userDto.propertyId || undefined,
          };
          setCurrentUser(user);
          setView('dashboard');
          import('./api/socket').then(({ reconnectSocket }) => {
            reconnectSocket(token);
          });
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          setCurrentUser(null);
          setView('landing');
        });
    } else {
      setView('landing');
    }
  }, []);

  // Listen to global auth logout event (triggered by Axios refresh failures)
  useEffect(() => {
    const handleGlobalLogout = () => {
      setCurrentUser(null);
      setView('landing');
    };
    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout);
    };
  }, []);

  // Theme support (locked to dark mode)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    localStorage.setItem('propertyflow-theme', 'dark');
  }, []);

  // Real-time updates invalidation via WebSockets
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!currentUser) return;
    
    import('./api/socket').then(({ socket }) => {
      socket.connect();
      
      socket.on('dashboard.invalidate', () => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['maintenance'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      });

      socket.on('maintenance.update', () => {
        queryClient.invalidateQueries({ queryKey: ['maintenance'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      });

      socket.on('booking.update', () => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      });
    });

    return () => {
      import('./api/socket').then(({ socket }) => {
        socket.off('dashboard.invalidate');
        socket.off('maintenance.update');
        socket.off('booking.update');
        socket.disconnect();
      });
    };
  }, [currentUser, queryClient]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    setCurrentUser(null);
    setView('login');
    import('./api/socket').then(({ socket }) => {
      socket.disconnect();
    });
  };

  const handleCreateTicket = (ticket: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    let priority = 'MEDIUM';
    if (ticket.priority === 'Low') priority = 'LOW';
    else if (ticket.priority === 'High') priority = 'HIGH';
    else if (ticket.priority === 'Urgent') priority = 'EMERGENCY';

    createTicketMutation.mutate({
      propertyId: ticket.propertyId,
      tenantId: currentUser?.id || 'd4444444-4444-4444-4444-444444444444',
      title: ticket.title,
      description: ticket.description,
      category: ticket.category || 'General',
      priority,
      unitNumber: ticket.unitNumber || '402',
    });
  };

  const handleUpdateTicketStatus = (id: string, status: MaintenanceRequest['status'], assignedTo?: string) => {
    let dbStatus = 'PENDING';
    if (status === 'Assigned') dbStatus = 'ASSIGNED';
    else if (status === 'In Progress') dbStatus = 'IN_PROGRESS';
    else if (status === 'Completed') dbStatus = 'COMPLETED';

    if (assignedTo !== undefined) {
      const staffUser = users.find(u => u.name === assignedTo);
      if (staffUser) {
        assignTicketMutation.mutate({ id, technicianId: staffUser.id }, {
          onSuccess: () => {
            updateTicketStatusMutation.mutate({ id, status: dbStatus as any });
          }
        });
        return;
      }
    }
    updateTicketStatusMutation.mutate({ id, status: dbStatus as any });
  };

  const handleCreateBooking = (booking: Omit<BookingSlot, 'id' | 'status'>, callbacks?: { onSuccess?: () => void, onError?: (err: any) => void }) => {
    const propObj = propertiesData?.properties?.find((p: any) => p.id === booking.propertyId);
    const amenityObj = propObj?.amenities?.find((am: any) => am.name === booking.amenityName);
    
    if (!amenityObj) {
      if (callbacks?.onError) callbacks.onError(new Error('Specified amenity does not exist on property.'));
      return;
    }

    const selectedDateStr = booking.date;

    const startTime = new Date(`${selectedDateStr}T${booking.start}:00`).toISOString();
    const endTime = new Date(`${selectedDateStr}T${booking.end}:00`).toISOString();

    const payload = {
      amenityId: amenityObj.id,
      tenantId: currentUser?.id || 'd4444444-4444-4444-4444-444444444444',
      startTime,
      endTime,
    };

    try {
      bookingValidationSchema.parse(payload);
    } catch (err: any) {
      if (err.errors) {
        if (callbacks?.onError) callbacks.onError(new Error('Validation Error: ' + err.errors[0].message));
        return;
      }
    }

    createBookingMutation.mutate(payload, {
      onSuccess: () => {
        if (callbacks?.onSuccess) callbacks.onSuccess();
      },
      onError: (error: any) => {
        if (callbacks?.onError) {
          const message = error.response?.data?.message || 'This time slot has already been booked. Please choose another available slot.';
          callbacks.onError(new Error(message));
        } else {
          alert('This time slot has already been booked. Please choose another available slot.');
        }
      }
    });
  };

  const handleCancelBooking = (id: string) => {
    cancelBookingMutation.mutate(id);
  };

  const handleUpdateBooking = (id: string, updatedBooking: Omit<BookingSlot, 'id' | 'status'>, callbacks?: { onSuccess?: () => void, onError?: (err: any) => void }) => {
    const propObj = propertiesData?.properties?.find((p: any) => p.id === updatedBooking.propertyId);
    const amenityObj = propObj?.amenities?.find((am: any) => am.name === updatedBooking.amenityName);
    
    if (!amenityObj) {
      if (callbacks?.onError) callbacks.onError(new Error('Specified amenity does not exist on property.'));
      return;
    }

    const selectedDateStr = updatedBooking.date;
    const startTime = new Date(`${selectedDateStr}T${updatedBooking.start}:00`).toISOString();
    const endTime = new Date(`${selectedDateStr}T${updatedBooking.end}:00`).toISOString();

    const payload = {
      amenityId: amenityObj.id,
      tenantId: currentUser?.id || 'd4444444-4444-4444-4444-444444444444',
      startTime,
      endTime,
    };

    try {
      bookingValidationSchema.parse(payload);
    } catch (err: any) {
      if (err.errors) {
        if (callbacks?.onError) callbacks.onError(new Error('Validation Error: ' + err.errors[0].message));
        return;
      }
    }

    updateBookingMutation.mutate({ id, data: payload }, {
      onSuccess: () => {
        if (callbacks?.onSuccess) callbacks.onSuccess();
      },
      onError: (error: any) => {
        if (callbacks?.onError) {
          const message = error.response?.data?.message || 'Failed to update booking.';
          callbacks.onError(new Error(message));
        } else {
          alert('Failed to update booking.');
        }
      }
    });
  };

  const handleCheckInBooking = (id: string) => {
    checkInBookingMutation.mutate(id);
  };

  const handleCheckOutBooking = (id: string) => {
    checkOutBookingMutation.mutate(id);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Render Page Content
  const renderContent = () => {
    if (!currentUser) {
      if (view === 'login') {
        return (
          <LoginPage 
            users={users} 
            onLogin={handleLogin} 
            onBackToMarketing={() => setView('landing')} 
          />
        );
      }
      return (
        <LandingPage 
          onLoginClick={() => setView('login')} 
          onGetStarted={() => setView('login')} 
        />
      );
    }

    switch (view) {
      case 'dashboard':
        return (
          <DashboardView 
            currentUser={currentUser}
            properties={properties}
            maintenance={maintenance}
            bookings={bookings}
            onNavigate={setView}
            onAddTicketRequested={() => setView('maintenance')}
            onAddBookingRequested={() => setView('amenities')}
          />
        );
      case 'properties':
        if (currentUser.role !== 'Admin') {
          return <div className="p-8 text-center text-rose-500 font-bold">Access Denied: You do not have permissions to view the Property Index.</div>;
        }
        return (
          <PropertyView 
            properties={properties}
            setProperties={setProperties}
            currentUser={currentUser}
            maintenance={maintenance}
            bookings={bookings}
            isLoading={propertiesLoading}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceView 
            currentUser={currentUser}
            properties={properties}
            maintenance={maintenance}
            onCreateTicket={handleCreateTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            staffUsers={users.filter(u => u.role === 'Staff')}
          />
        );
      case 'amenities':
        return (
          <AmenityView 
            currentUser={currentUser}
            properties={properties}
            bookings={bookings}
            onCreateBooking={handleCreateBooking}
            onUpdateBooking={handleUpdateBooking}
            onCancelBooking={handleCancelBooking}
            onCheckInBooking={handleCheckInBooking}
            onCheckOutBooking={handleCheckOutBooking}
            amenities={amenities}
            isLoading={amenitiesLoading}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            properties={properties}
            maintenance={maintenance}
            bookings={bookings}
            onNavigate={setView}
          />
        );
      case 'admin':
        return (
          <AdminView 
            currentUser={currentUser}
            users={users}
            setUsers={setUsers}
            properties={properties}
            setProperties={setProperties}
            maintenance={maintenance}
            setMaintenance={setMaintenance}
            bookings={bookings}
            setBookings={setBookings}
            amenities={amenities}
            setAmenities={setAmenities}
          />
        );
      case 'profile':
        return (
          <UserProfileView 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            properties={properties}
            simulationState={simulationState}
            setSimulationState={setSimulationState}
          />
        );
      case 'monitor':
        return (
          <RealTimeMonitorView 
            maintenance={maintenance}
            setMaintenance={setMaintenance}
            properties={properties}
            currentUser={currentUser}
          />
        );
      default:
        return (
          <DashboardView 
            currentUser={currentUser}
            properties={properties}
            maintenance={maintenance}
            bookings={bookings}
            onNavigate={setView}
            onAddTicketRequested={() => setView('maintenance')}
            onAddBookingRequested={() => setView('amenities')}
          />
        );
    }
  };

  // Global Route Protection
  if (!currentUser && view !== 'landing' && view !== 'login') {
    setView('login');
    return null; // Don't render layout until state updates
  }

  if (view === 'landing') {
    return (
      <LandingPage 
        onLoginClick={() => setView('login')} 
        onGetStarted={() => setView('dashboard')}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginPage 
        users={users} 
        onLogin={handleLogin} 
        onBackToMarketing={() => setView('landing')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg transition-colors duration-200 flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentUser={currentUser!} 
        activeTab={view} 
        setActiveTab={setView} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Global Action Header */}
        <Header 
          currentUser={currentUser!} 
          onNavigate={setView} 
          onLogout={handleLogout}
          properties={properties}
          maintenance={maintenance}
          bookings={bookings}
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationRead}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          onClearNotifications={handleClearNotifications}
        />

        {/* Dynamic View Scroll Area shielded by ErrorBoundary & Safeguard simulations */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <ErrorBoundary>
            {simulationState !== 'normal' ? (
              <SafeguardState 
                type={simulationState} 
                onReset={() => setSimulationState('normal')} 
              />
            ) : (
              <React.Suspense fallback={
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal"></div>
                </div>
              }>
                {renderContent()}
              </React.Suspense>
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
