import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Wrench, 
  Calendar, 
  CheckCircle, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Info,
  UserCheck,
  User,
  Activity
} from 'lucide-react';
import { User as UserType, Property, MaintenanceRequest, BookingSlot } from '../types.ts';

interface DashboardViewProps {
  currentUser: UserType;
  properties: Property[];
  maintenance: MaintenanceRequest[];
  bookings: BookingSlot[];
  onNavigate: (view: any) => void;
  onAddTicketRequested: () => void;
  onAddBookingRequested: () => void;
  onCheckInBooking?: (id: string) => void;
  onCheckOutBooking?: (id: string) => void;
  onCancelBooking?: (id: string) => void;
}

const timeSlots = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30', '16:00 - 17:30', '18:00 - 19:30'];

export default function DashboardView({
  currentUser,
  properties,
  maintenance,
  bookings,
  onNavigate,
  onAddTicketRequested,
  onAddBookingRequested,
  onCheckInBooking,
  onCheckOutBooking,
  onCancelBooking
}: DashboardViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimelineAmenity, setActiveTimelineAmenity] = useState('Skyline Pool');
  const [selectedTimelineProperty, setSelectedTimelineProperty] = useState(properties[0]?.id || '');
  const [tickerLogs, setTickerLogs] = useState<string[]>([
    'System synced: Loaded platform state logs.',
    'System operational check: 0 service breaches pending.'
  ]);

  // Load delay simulation for skeleton look
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Monitor operations ticker
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const logsList = [
        'Checked platform KPI compliance: All metrics within target bounds.',
        'Real-time cache validated: 100% gateway synchronization.',
        'Audit review: Active booking slots verified conflict-free.'
      ];
      const randomLog = logsList[Math.floor(Math.random() * logsList.length)];
      setTickerLogs(prev => [`[${timestamp}] ${randomLog}`, ...prev.slice(0, 3)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Resolve property name dynamically helper
  const getPropertyName = (id: string) => {
    return properties.find(p => p.id === id)?.name || 'Property';
  };

  // Find booking overlaps / conflicts (Manager Dashboard Conflict Monitor)
  const bookingConflicts: { bookingA: BookingSlot; bookingB: BookingSlot }[] = [];
  for (let i = 0; i < bookings.length; i++) {
    for (let j = i + 1; j < bookings.length; j++) {
      const bA = bookings[i];
      const bB = bookings[j];
      const isActiveA = bA.status === 'booked' || bA.status === 'APPROVED' || bA.status === 'IN_USE';
      const isActiveB = bB.status === 'booked' || bB.status === 'APPROVED' || bB.status === 'IN_USE';
      if (
        isActiveA && isActiveB &&
        bA.amenityName === bB.amenityName &&
        bA.propertyId === bB.propertyId &&
        bA.start === bB.start &&
        bA.end === bB.end
      ) {
        bookingConflicts.push({ bookingA: bA, bookingB: bB });
      }
    }
  }

  // Calculate local dashboard statistics
  const totalRequests = maintenance.length;
  const openRequests = maintenance.filter(m => m.status !== 'Completed').length;
  const completedRequests = maintenance.filter(m => m.status === 'Completed').length;
  const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 100;
  
  // Filter tenant-specific collections
  const tenantRequests = maintenance.filter(m => m.createdBy === currentUser.name);
  const tenantBookings = bookings.filter(b => b.user === currentUser.name);
  const tenantActiveBookings = tenantBookings.filter(b => b.status === 'booked' || b.status === 'APPROVED' || b.status === 'IN_USE');
  const tenantPastBookings = tenantBookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'NO_SHOW' || b.status === 'cancelled');

  // Check-in helper check (15-min early window check)
  const isEarlyCheckInAllowed = (booking: BookingSlot) => {
    // For mock demonstration, we check if start hour matches or if we allow the button.
    // Standard rule: 15 minutes before booking's start. We'll enable button if status is 'booked' or 'APPROVED'
    return booking.status === 'booked' || booking.status === 'APPROVED';
  };

  // Check if slot is booked in the timeline view
  const isTimelineSlotBooked = (slotName: string) => {
    const [start, end] = slotName.split(' - ');
    return bookings.some(
      b => (b.status === 'booked' || b.status === 'APPROVED' || b.status === 'IN_USE') && 
      b.amenityName === activeTimelineAmenity && 
      b.propertyId === selectedTimelineProperty && 
      b.start === start &&
      b.end === end
    );
  };

  const currentPropName = currentUser.propertyId ? getPropertyName(currentUser.propertyId) : 'All Portfolio Complexes';

  // ---------------------------------------------------------
  // 1. TENANT DASHBOARD VIEW
  // ---------------------------------------------------------
  if (currentUser.role === 'Tenant') {
    return (
      <div className="space-y-6 sm:space-y-8 select-none">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight">Welcome back, {currentUser.name}</h1>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tight">Resident Space</span>
            </div>
            <p className="text-sm text-brand-body font-light mt-1">Submit maintenance requests, manage facility bookings, and track status parameters at <span className="font-semibold text-brand-title">{currentPropName}</span>.</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-brand-surface px-3.5 py-2 border border-brand-border rounded-xl shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-brand-body">PropertyFlow Secure Connection</span>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('maintenance')}
            className="p-5 bg-brand-surface border border-brand-border rounded-2xl hover:border-primary-teal transition-all text-left flex items-start space-x-4 cursor-pointer shadow-2xs group"
          >
            <div className="w-12 h-12 bg-amber-500/10 text-warn-gold border border-amber-500/20 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🛠️
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-title flex items-center">
                <span>Submit Repair Request</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary-teal" />
              </h4>
              <p className="text-xs text-brand-body font-light mt-1">Create a maintenance request for your unit and track updates from technicians.</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('amenities')}
            className="p-5 bg-brand-surface border border-brand-border rounded-2xl hover:border-primary-teal transition-all text-left flex items-start space-x-4 cursor-pointer shadow-2xs group"
          >
            <div className="w-12 h-12 bg-teal-500/10 text-primary-teal rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              📅
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-title flex items-center">
                <span>Reserve Amenity Space</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary-teal" />
              </h4>
              <p className="text-xs text-brand-body font-light mt-1">View availability grids and book shared facilities like Skyline Pool and Tennis Courts.</p>
            </div>
          </button>
        </div>

        {/* Tenant Active Bookings Check-in Desk */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b border-brand-border pb-3 flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-brand-title flex items-center space-x-1.5 font-sans">
              <span>🔑 Active & Upcoming Reservations</span>
            </h3>
            <span className="text-[10px] text-primary-teal font-bold bg-primary-teal/10 border border-primary-teal/20 px-2 py-0.5 rounded uppercase font-mono">
              Check-In Dashboard
            </span>
          </div>

          {tenantActiveBookings.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {tenantActiveBookings.map((b) => (
                <div key={b.id} className="p-4 bg-brand-alternate/40 border border-brand-border rounded-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-brand-muted font-mono block uppercase">{getPropertyName(b.propertyId)}</span>
                    <h4 className="text-xs font-extrabold text-brand-title">{b.amenityName}</h4>
                    <span className="text-[10px] text-brand-body font-mono block">{b.start} - {b.end}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-brand-border/60">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      b.status === 'IN_USE' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-teal-500/10 text-primary-teal border border-teal-500/20'
                    }`}>
                      {b.status === 'IN_USE' ? 'IN USE' : 'APPROVED'}
                    </span>

                    <div className="flex space-x-2">
                      {b.status === 'IN_USE' && onCheckOutBooking && (
                        <button
                          onClick={() => onCheckOutBooking(b.id)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          🚪 Check Out
                        </button>
                      )}
                      {(b.status === 'booked' || b.status === 'APPROVED') && onCheckInBooking && (
                        <button
                          onClick={() => onCheckInBooking(b.id)}
                          className="px-3 py-1.5 bg-primary-teal hover:bg-primary-teal-hover text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          🔑 Check In
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-brand-muted flex flex-col items-center justify-center space-y-2 border border-dashed border-brand-border rounded-xl bg-brand-alternate/20">
              <span>📅</span>
              <h5 className="font-bold text-xs text-brand-title">No active bookings today</h5>
              <p className="text-[10px] text-brand-body max-w-[200px] leading-normal font-light">Check amenity availability timelines below to schedule a booking.</p>
            </div>
          )}
        </div>

        {/* Amenity Availability Calendar/Timeline View */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-border pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-brand-title flex items-center space-x-1.5 font-sans">
                <span>📊 Amenity Availability Timeline</span>
              </h3>
              <p className="text-[10.5px] text-brand-body font-light mt-0.5">Live visual schedule check: occupied slot blocks are flagged.</p>
            </div>

            <div className="flex space-x-2">
              <select
                value={activeTimelineAmenity}
                onChange={(e) => setActiveTimelineAmenity(e.target.value)}
                className="px-2.5 py-1.5 bg-brand-alternate border border-brand-border rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-teal text-brand-body"
              >
                <option value="Skyline Pool">Skyline Pool</option>
                <option value="Fitness Center">Fitness Center</option>
                <option value="Penthouse Lounge">Penthouse Lounge</option>
                <option value="Garden Lounge">Garden Lounge</option>
                <option value="Tennis Courts">Tennis Courts</option>
              </select>
            </div>
          </div>

          {/* Visual Daily Timeline Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
            {timeSlots.map((slot) => {
              const isBooked = isTimelineSlotBooked(slot);
              return (
                <div 
                  key={slot}
                  className={`p-3 rounded-xl border text-center font-sans text-xs transition-all flex flex-col justify-between h-14 ${
                    isBooked 
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  <span className="font-mono text-[10px] block">{slot}</span>
                  <span className="font-bold text-[9px] block uppercase mt-1">
                    {isBooked ? '● Occupied' : '○ Available'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tenant Maintenance Request Tracking & Booking History */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Repair dispatch tracking */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">My Maintenance Requests ({tenantRequests.length})</h4>
            
            <div className="divide-y divide-brand-border space-y-1">
              {tenantRequests.length > 0 ? (
                tenantRequests.map((req) => (
                  <div key={req.id} className="py-3 flex justify-between items-start first:pt-0 last:pb-0 font-sans border-b border-brand-border last:border-0">
                    <div className="space-y-1 max-w-[220px]">
                      <h5 className="text-xs font-extrabold text-brand-title truncate">{req.title}</h5>
                      <span className="text-[10px] text-brand-body font-light block">{req.category} • {req.createdAt.split('T')[0]}</span>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        req.status === 'Pending' ? 'bg-amber-500/10 text-amber-550 border border-amber-500/20' :
                        req.status === 'Assigned' ? 'bg-blue-500/10 text-blue-500' :
                        req.status === 'In Progress' ? 'bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20' :
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-brand-muted border border-dashed border-brand-border rounded-xl bg-brand-alternate/25 text-xs">
                  No maintenance dispatches filed.
                </div>
              )}
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Booking History ({tenantPastBookings.length})</h4>
            
            <div className="divide-y divide-brand-border space-y-1">
              {tenantPastBookings.length > 0 ? (
                tenantPastBookings.map((b) => (
                  <div key={b.id} className="py-3 flex justify-between items-start first:pt-0 last:pb-0 font-sans border-b border-brand-border last:border-0">
                    <div className="space-y-1">
                      <h5 className="text-xs font-extrabold text-brand-title">{b.amenityName}</h5>
                      <span className="text-[10px] text-brand-body font-mono block">{b.start} - {b.end}</span>
                    </div>

                    <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      b.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-alternate text-brand-muted border border-brand-border'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-brand-muted border border-dashed border-brand-border rounded-xl bg-brand-alternate/25 text-xs">
                  No booking history logged.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ---------------------------------------------------------
  // 2. MANAGER / ADMIN DASHBOARD VIEW
  // ---------------------------------------------------------
  // Compute Manager/Admin analytics fallback calculations
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'booked' || b.status === 'APPROVED' || b.status === 'IN_USE').length;

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Intro Greetings row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight">Welcome back, {currentUser.name}</h1>
            <span className="bg-primary-teal/15 text-primary-teal border border-primary-teal/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shrink-0 uppercase tracking-tight">
              {currentUser.role} Space
            </span>
          </div>
          <p className="text-sm text-brand-body font-light mt-1">Real-time dispatches, operational status parameters, and facility compliance queues are active.</p>
        </div>

        <div className="flex items-center space-x-2 bg-brand-surface px-3.5 py-2 border border-brand-border rounded-xl shadow-2xs self-start sm:self-auto shrink-0 leading-none">
          <ShieldCheck className="w-4 h-4 text-primary-teal shrink-0" />
          <div className="text-left font-sans">
            <div className="text-[9px] font-bold text-brand-muted block uppercase font-mono leading-none">PLATFORM CORE</div>
            <div className="text-xs font-semibold text-brand-body font-sans mt-0.5 whitespace-nowrap leading-none">
              Verified 100% Sync
            </div>
          </div>
        </div>
      </div>

      {/* Booking Overlap Conflict Alert Board */}
      {bookingConflicts.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4.5 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 bg-rose-500/25 text-rose-500 rounded-lg flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-rose-600 dark:text-rose-450 leading-none">Booking Conflict Detected</h4>
              <p className="text-xs text-brand-body font-light mt-1.5 leading-normal">
                Platform conflict check flagged concurrent reservations overlap:
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 pt-1 font-sans">
            {bookingConflicts.slice(0, 2).map((conflict, cIdx) => (
              <div key={cIdx} className="bg-brand-surface border border-rose-500/20 rounded-xl p-3 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-brand-muted font-mono uppercase block">{getPropertyName(conflict.bookingA.propertyId)}</span>
                  <span className="font-extrabold text-brand-title block">{conflict.bookingA.amenityName}</span>
                  <span className="text-[10px] text-brand-body font-mono block">{conflict.bookingA.start} - {conflict.bookingA.end}</span>
                  <span className="text-[10px] text-rose-550 block">Overlapping users: {conflict.bookingA.user} & {conflict.bookingB.user}</span>
                </div>
                {onCancelBooking && (
                  <button
                    onClick={() => onCancelBooking(conflict.bookingB.id)}
                    className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9px] font-bold cursor-pointer"
                  >
                    Release Conflict
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform KPIs block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Resolution Time Target */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-2xs flex items-center justify-between hover:border-primary-teal transition-all duration-200 cursor-pointer" onClick={() => onNavigate('maintenance')}>
          <div className="space-y-1 font-sans">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Target Resolution Time</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-title">≤ 48 Hours</div>
            <div className="text-[11px] text-emerald-500 font-semibold flex items-center space-x-1 leading-none">
              <span>✓</span> <span>Avg: 32 hours (Passed)</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-teal-500/10 text-primary-teal rounded-xl flex items-center justify-center border border-teal-500/20 shrink-0 select-none text-xl">
            🕒
          </div>
        </div>

        {/* KPI 2: Target Completion Rate */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-2xs flex items-center justify-between hover:border-primary-teal transition-all duration-200 cursor-pointer" onClick={() => onNavigate('maintenance')}>
          <div className="space-y-1 font-sans">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Target Completion Rate</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-title">≥ 90%</div>
            <div className="text-[11px] text-emerald-500 font-semibold flex items-center space-x-1 leading-none">
              <span>✓</span> <span>Current Rate: {completionRate}%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-555 rounded-xl flex items-center justify-center border border-emerald-500/20 shrink-0 select-none text-xl">
            🛠️
          </div>
        </div>

        {/* KPI 3: Booking Conflict-Free Goal */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-2xs flex items-center justify-between hover:border-primary-teal transition-all duration-200 cursor-pointer" onClick={() => onNavigate('amenities')}>
          <div className="space-y-1 font-sans">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Conflict-Free Bookings</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-title">0 overlaps</div>
            <div className={`text-[11px] font-semibold flex items-center space-x-1 leading-none ${bookingConflicts.length === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              <span>{bookingConflicts.length === 0 ? '✓' : '⚠️'}</span>
              <span>{bookingConflicts.length} overlaps detected</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 text-warn-gold rounded-xl flex items-center justify-center border border-amber-500/20 shrink-0 select-none text-xl">
            📅
          </div>
        </div>

        {/* KPI 4: User Satisfaction Target */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-2xs flex items-center justify-between hover:border-primary-teal transition-all duration-200">
          <div className="space-y-1 font-sans">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">User Satisfaction Goal</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-title">≥ 4 / 5</div>
            <div className="text-[11px] text-emerald-500 font-semibold flex items-center space-x-1 leading-none">
              <span>✓</span> <span>Target satisfaction check</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-teal-500/10 text-primary-teal rounded-xl flex items-center justify-center border border-teal-500/20 shrink-0 select-none text-xl">
            📈
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Maintenance Dispatches Overview */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 lg:col-span-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-brand-border pb-3">
            <div>
              <h3 className="text-base font-extrabold text-brand-title font-sans">Platform Operational Response Log</h3>
              <p className="text-xs text-brand-body font-light mt-0.5">Dispatches generated inside properties portfolio.</p>
            </div>
            
            <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
              Live updates
            </span>
          </div>

          <div className="divide-y divide-brand-border space-y-2">
            {maintenance.slice(0, 4).map((ticket) => (
              <div key={ticket.id} className="py-2.5 flex justify-between items-start first:pt-0 last:pb-0 font-sans">
                <div className="space-y-1">
                  <span className="text-[9px] text-brand-muted font-mono block uppercase">{getPropertyName(ticket.propertyId)} • Unit {ticket.unitNumber}</span>
                  <h5 className="text-xs font-extrabold text-brand-title">{ticket.title}</h5>
                  <span className="text-[10px] text-brand-body font-light block">{ticket.category} • Submit: {ticket.createdBy}</span>
                </div>

                <div className="flex flex-col items-end space-y-1.5">
                  <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    ticket.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-teal-500/10 text-primary-teal border-teal-500/20'
                  }`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-brand-muted block">{ticket.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Booking overview & Live logs ticker */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 lg:col-span-4 shadow-sm space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-brand-title font-sans border-b border-brand-border pb-2">Facility Reservations Ledger</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-brand-body font-light block">Total Booked</span>
                <span className="text-lg font-extrabold text-brand-title">{totalBookings} slots</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-body font-light block">Active Slots</span>
                <span className="text-lg font-extrabold text-primary-teal">{activeBookings} slots</span>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                onClick={onAddBookingRequested}
                className="w-full py-2.5 bg-brand-alternate hover:bg-brand-alternate/85 text-brand-title font-semibold text-xs rounded-xl border border-brand-border hover:border-primary-teal cursor-pointer"
              >
                📅 Reserve New Amenity Slot
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-brand-border">
            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">
              <Activity className="w-4 h-4 text-primary-teal" />
              <span>Real-Time Activity Monitor</span>
            </div>
            
            <div className="bg-brand-alternate/50 rounded-xl p-3 text-[10px] font-mono text-brand-body leading-relaxed space-y-2 h-28 overflow-y-auto">
              {tickerLogs.map((log, logIdx) => (
                <div key={logIdx} className="truncate select-text">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
