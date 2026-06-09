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

// Seed Initial Data
const initialUsers: User[] = [
  { id: '1', name: 'Eleanor Vance', email: 'eleanor@propertyflow.com', role: 'Admin', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Marcus Brody', email: 'marcus@propertyflow.com', role: 'Manager', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Dave Miller', email: 'dave@propertyflow.com', role: 'Staff', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Sarah Connor', email: 'sarah@propertyflow.com', role: 'Tenant', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', propertyId: 'prop-1' }
];

const initialProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Summit Heights',
    address: '742 Evergreen Terrace, Sector 7G',
    type: 'Residential',
    units: 120,
    occupancy: 96,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    manager: 'Marcus Brody',
    amenities: ['Skyline Pool', 'Fitness Center', 'Penthouse Lounge', 'E-Charging Stations']
  },
  {
    id: 'prop-2',
    name: 'Oakridge Manor',
    address: '1048 Peachtree Street, Midtown',
    type: 'Residential',
    units: 80,
    occupancy: 91,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    manager: 'Marcus Brody',
    amenities: ['Garden Lounge', 'Tennis Courts', 'Pet Spa', 'Co-Working Station']
  },
  {
    id: 'prop-3',
    name: 'Centennial Plaza',
    address: '500 Corporate Boulevard, Suite 100',
    type: 'Commercial',
    units: 45,
    occupancy: 88,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    manager: 'Eleanor Vance',
    amenities: ['Shared Boardroom', 'Cafe Patio', 'Concierge Lobby', 'Fiber Internet']
  }
];

const initialMaintenance: MaintenanceRequest[] = [
  {
    id: 'maint-1',
    title: 'Boiler leakage and hot water outage',
    description: 'The main hot water boiler is leaking in the basement, affecting heating and water in Unit 402. Flooding risk is currently high.',
    propertyId: 'prop-1',
    unitNumber: '402',
    priority: 'Urgent',
    status: 'Pending',
    createdBy: 'Sarah Connor',
    createdAt: '2026-06-08T14:30:00Z',
    category: 'Plumbing'
  },
  {
    id: 'maint-2',
    title: 'HVAC system diagnostic scan',
    description: 'Air conditioner unit blowing warm air during afternoon peak cooling cycles. Filter was changed but compressor makes loud buzzing sounds.',
    propertyId: 'prop-3',
    unitNumber: 'Suite 12',
    priority: 'High',
    status: 'Assigned',
    createdBy: 'Alice Green (Tenant)',
    createdAt: '2026-06-07T09:15:00Z',
    assignedTo: 'Dave Miller',
    category: 'HVAC'
  },
  {
    id: 'maint-3',
    title: 'Replace burnt workspace ballast and tubes',
    description: 'Three overhead fluorescent ballasts dropped voltage and burnt out. Noise coming from lighting cluster; requires instant bypass.',
    propertyId: 'prop-2',
    unitNumber: 'Unit 104',
    priority: 'Medium',
    status: 'In Progress',
    createdBy: 'Michael Roe (Tenant)',
    createdAt: '2026-06-09T08:00:00Z',
    assignedTo: 'Dave Miller',
    category: 'Electrical'
  },
  {
    id: 'maint-4',
    title: 'Repaint corridor entry wall and repair drywall',
    description: 'Moving boxes scraped the drywall in the east wing corridor. Needs mud patch, sanding, and matching eggshell touch up.',
    propertyId: 'prop-1',
    unitNumber: 'Common Area',
    priority: 'Low',
    status: 'Completed',
    createdBy: 'Marcus Brody',
    createdAt: '2026-06-05T11:00:00Z',
    assignedTo: 'Dave Miller',
    category: 'General'
  }
];

const initialBookings: BookingSlot[] = [
  { id: 'b-1', amenityName: 'Skyline Pool', propertyId: 'prop-1', user: 'Sarah Connor', start: '10:00', end: '11:30', status: 'booked', price: 25 },
  { id: 'b-2', amenityName: 'Penthouse Lounge', propertyId: 'prop-1', user: 'Tommy Oliver', start: '14:00', end: '16:00', status: 'booked', price: 75 },
  { id: 'b-3', amenityName: 'Fitness Center', propertyId: 'prop-1', user: 'Sarah Connor', start: '08:00', end: '09:00', status: 'booked', price: 0 },
  { id: 'b-4', amenityName: 'Garden Lounge', propertyId: 'prop-2', user: 'Lois Lane', start: '11:00', end: '13:00', status: 'booked', price: 15 }
];

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'properties' | 'maintenance' | 'amenities' | 'analytics' | 'admin' | 'profile' | 'monitor'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(initialMaintenance);
  const [bookings, setBookings] = useState<BookingSlot[]>(initialBookings);
  const [simulationState, setSimulationState] = useState<'normal' | 'network' | 'unauthorized' | 'session'>('normal');

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('propertyflow-theme');
    return (saved as 'light' | 'dark' | 'system') || 'system';
  });

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
    },
    {
      id: 'notif-4',
      title: 'HVAC Seasonal Tune-Up Notice',
      description: 'Grand plaza central chiller diagnostic inspection requires facility authorization.',
      category: 'property',
      priority: 'medium',
      time: 'Yesterday',
      read: false,
      dateGroup: 'Yesterday'
    },
    {
      id: 'notif-5',
      title: 'Holiday Capacity Peak Limit Warning',
      description: 'Lounge booking density is reaching capacity limits. Preemptive schedule blocks might trigger automatically.',
      category: 'conflict',
      priority: 'low',
      time: '3 days ago',
      read: true,
      dateGroup: 'Older'
    }
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  const handleCreateTicket = (ticket: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    const newTicket: MaintenanceRequest = {
      ...ticket,
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || 'Anonymous',
      status: 'Pending'
    };
    setMaintenance([newTicket, ...maintenance]);

    // SLA notification trigger
    const priorityNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Emergency Repair Dispatched`,
      description: `New [${ticket.priority}] ${ticket.category} ticket generated for Unit ${ticket.unitNumber}: "${ticket.title}".`,
      category: 'maintenance',
      priority: ticket.priority === 'Urgent' ? 'critical' : ticket.priority === 'High' ? 'high' : 'medium',
      time: 'Just now',
      read: false,
      dateGroup: 'Today'
    };
    setNotifications(prev => [priorityNotif, ...prev]);
  };

  const handleUpdateTicketStatus = (id: string, status: MaintenanceRequest['status'], assignedTo?: string) => {
    setMaintenance(prev => prev.map(t => {
      if (t.id === id) {
        // Create dynamic status update notification
        const statusNotif: AppNotification = {
          id: `status-notif-${Date.now()}`,
          title: `Ticket Status Updated`,
          description: `"${t.title}" is now marked as [${status}]${assignedTo ? `. Staff: ${assignedTo}` : ''}.`,
          category: 'maintenance',
          priority: 'medium',
          time: 'Just now',
          read: false,
          dateGroup: 'Today'
        };
        setNotifications(prevNotifs => [statusNotif, ...prevNotifs]);

        return {
          ...t,
          status,
          ...(assignedTo !== undefined ? { assignedTo } : {})
        };
      }
      return t;
    }));
  };

  const handleCreateBooking = (booking: Omit<BookingSlot, 'id' | 'status'>) => {
    const newBooking: BookingSlot = {
      ...booking,
      id: `booking-${Date.now()}`,
      status: 'booked'
    };
    setBookings([newBooking, ...bookings]);

    // Booking notification trigger
    const bookingNotif: AppNotification = {
      id: `booking-notif-${Date.now()}`,
      title: 'Facility Reservation Confirmed',
      description: `Success! ${booking.amenityName} has been booked for ${booking.start} - ${booking.end}. Passcode synced.`,
      category: 'booking',
      priority: 'low',
      time: 'Just now',
      read: false,
      dateGroup: 'Today'
    };
    setNotifications(prev => [bookingNotif, ...prev]);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        const cancelNotif: AppNotification = {
          id: `cancel-notif-${Date.now()}`,
          title: 'Facility Booking Cancelled',
          description: `Your appointment for ${b.amenityName} has been successfully released/refunded.`,
          category: 'booking',
          priority: 'low',
          time: 'Just now',
          read: false,
          dateGroup: 'Today'
        };
        setNotifications(prevNotifs => [cancelNotif, ...prevNotifs]);
        return { ...b, status: 'cancelled' };
      }
      return b;
    }));
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
            users={initialUsers} 
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
            handleLogin(initialUsers[1]);
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
            staffUsers={initialUsers.filter(u => u.role === 'Staff')}
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
            users={initialUsers}
            properties={properties}
            maintenance={maintenance}
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
        onGetStarted={() => handleLogin(initialUsers[1])} // Default login with Manager Brody
        theme={theme}
        setTheme={setTheme}
      />
    );
  }

  if (view === 'login' && !currentUser) {
    return (
      <LoginPage 
        users={initialUsers} 
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
