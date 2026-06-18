import React, { useState, useEffect } from 'react';
import { User, Property, MaintenanceRequest, BookingSlot, AppNotification } from './types.ts';
import LandingPage from './components/LandingPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import DashboardView from './components/DashboardView.tsx';
import PropertyView from './components/PropertyView.tsx';
import MaintenanceView from './components/MaintenanceView.tsx';
import AmenityView from './components/AmenityView.tsx';
import AnalyticsView from './components/AnalyticsView.tsx';
import AdminView from './components/AdminView.tsx';
import UserProfileView from './components/UserProfileView.tsx';
import RealTimeMonitorView from './components/RealTimeMonitorView.tsx';
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
  useCheckOutBooking
} from './api/hooks';
import { AuthService } from './api/services';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'properties' | 'maintenance' | 'amenities' | 'analytics' | 'admin' | 'profile' | 'monitor'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [simulationState, setSimulationState] = useState<'normal' | 'network' | 'unauthorized' | 'session'>('normal');

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('propertyflow-theme');
    return (saved as 'light' | 'dark' | 'system') || 'system';
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Critical Boiler Pressure Alert',
      description: 'Summit Heights basement boiler pressure breached safety threshold of 4.5 PSI. Assigned to emergency plumbing queue.',
      category: 'sla',
      priority: 'critical',
      time: '12m ago',
      read: false,
      dateGroup: 'Today'
    },
    {
      id: 'notif-2',
      title: 'Active Dispatch Automated SLA Lock',
      description: 'Contractor Dave Miller allocated to HVAC system compressor failure in Unit 402 under Tier-1 agreement.',
      category: 'maintenance',
      priority: 'high',
      time: '1h ago',
      read: false,
      dateGroup: 'Today'
    },
    {
      id: 'notif-3',
      title: 'Tenant Amenity Slot Reserved',
      description: 'Sarah Connor confirmed shared Skyline Pool access window for June 9: 10:00 - 11:30.',
      category: 'booking',
      priority: 'low',
      time: '2h ago',
      read: true,
      dateGroup: 'Today'
    }
  ]);

  // React Query Queries
  const { data: propertiesData, isLoading: propertiesLoading } = useProperties();
  const { data: maintenanceData, isLoading: maintenanceLoading } = useMaintenanceRequests();
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings();
  const { data: usersData } = useUsers();

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
      propertyName: req.propertyName || undefined,
      unitNumber: req.unitNumber || 'Suite 402',
      priority,
      status,
      createdBy: req.tenantName || 'Sarah Connor',
      createdAt: req.createdAt,
      assignedTo: req.assignedTechnicianName || undefined,
      category: req.category || 'General',
    } as MaintenanceRequest;
  });

  const bookings = (bookingsData || []).map((b: any) => {
    const startStr = b.startTime ? new Date(b.startTime).toISOString().split('T')[1].substring(0, 5) : '10:00';
    const endStr = b.endTime ? new Date(b.endTime).toISOString().split('T')[1].substring(0, 5) : '11:30';

    return {
      id: b.id,
      amenityName: b.amenityName || 'Skyline Pool',
      propertyId: b.propertyId || 'prop-1111-1111-1111-111111111111',
      user: b.user || 'Sarah Connor',
      start: startStr,
      end: endStr,
      status: b.status === 'APPROVED' ? 'booked' : b.status === 'IN_USE' ? 'IN_USE' : b.status === 'COMPLETED' ? 'COMPLETED' : 'cancelled',
      actualCheckInAt: b.actualCheckInAt || null,
      actualCheckOutAt: b.actualCheckOutAt || null,
    } as BookingSlot;
  });

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

  const amenities = ['Skyline Pool', 'Fitness Center', 'Penthouse Lounge', 'Garden Lounge', 'Tennis Courts'];

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
    }
  }, []);

  // Theme support
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = () => {
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();
    localStorage.setItem('propertyflow-theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleMediaChange = () => {
        applyTheme();
      };
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }
  }, [theme]);

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
    setView('landing');
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

  const handleCreateBooking = (booking: Omit<BookingSlot, 'id' | 'status'>) => {
    const propObj = propertiesData?.properties?.find(p => p.id === booking.propertyId);
    const amenityObj = propObj?.amenities?.find((am: any) => am.name === booking.amenityName);
    
    if (!amenityObj) {
      alert('Error: Specified amenity does not exist on property.');
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const startTime = new Date(`${tomorrowStr}T${booking.start}:00Z`).toISOString();
    const endTime = new Date(`${tomorrowStr}T${booking.end}:00Z`).toISOString();

    createBookingMutation.mutate({
      amenityId: amenityObj.id,
      tenantId: currentUser?.id || 'd4444444-4444-4444-4444-444444444444',
      startTime,
      endTime,
    });
  };

  const handleCancelBooking = (id: string) => {
    cancelBookingMutation.mutate(id);
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
          onGetStarted={() => {
            // Log in as manager by default for easy experience
            handleLogin(users[1]);
          }} 
          theme={theme}
          setTheme={setTheme}
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
        return (
          <PropertyView 
            properties={properties}
            setProperties={setProperties}
            currentUser={currentUser}
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
            onCancelBooking={handleCancelBooking}
            onCheckInBooking={handleCheckInBooking}
            onCheckOutBooking={handleCheckOutBooking}
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

  if (view === 'landing' && !currentUser) {
    return (
      <LandingPage 
        onLoginClick={() => setView('login')} 
        onGetStarted={() => handleLogin(users[1])} // Default login with Manager Brody
        theme={theme}
        setTheme={setTheme}
      />
    );
  }

  if (view === 'login' && !currentUser) {
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
          theme={theme}
          onThemeChange={setTheme}
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
              renderContent()
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
