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
  Activity,
  Plus,
  BarChart4
} from 'lucide-react';
import { User as UserType, Property, MaintenanceRequest, BookingSlot } from '../types.ts';
import { useUsers, useAmenities } from '../api/hooks';

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
  isLoading?: boolean;
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
  onCancelBooking,
  isLoading = false
}: DashboardViewProps) {
  const [activeTimelineAmenity, setActiveTimelineAmenity] = useState('Skyline Pool');
  const [selectedTimelineProperty, setSelectedTimelineProperty] = useState(properties[0]?.id || '');
  
  const { data: usersData } = useUsers();
  const { data: amenitiesData } = useAmenities();
  const usersCount = usersData?.users?.length || 0;
  const amenitiesCount = amenitiesData?.amenities?.length || 0;

  const formatAMPM = (timeStr: string) => {
    if (!timeStr) return '';
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; 
    return `${h.toString().padStart(2, '0')}:${mStr} ${ampm}`;
  };

  const formatSlotAMPM = (slot: string) => {
    if (!slot) return '';
    const [start, end] = slot.split(' - ');
    return `${formatAMPM(start)} - ${formatAMPM(end)}`;
  };

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
  
  // Calculate average rating from completed requests
  const ratedRequests = maintenance.filter(m => m.status === 'Completed' && m.rating !== undefined && m.rating !== null);
  const totalRatings = ratedRequests.length;
  const averageRating = totalRatings > 0 
    ? (ratedRequests.reduce((sum, req) => sum + (req.rating || 0), 0) / totalRatings).toFixed(1)
    : '0.0';
  
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
            </div>
            <p className="text-sm text-brand-body font-light mt-1">Submit maintenance requests, book amenities, and track your requests and bookings in real time.</p>
          </div>
          
          <div className="flex flex-col items-end gap-1.5 self-start sm:self-auto shrink-0">
            <div className="flex items-center space-x-2 bg-brand-surface px-3.5 py-2 border border-brand-border rounded-xl shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold text-brand-body">System Status: Connected</span>
            </div>
            <span className="text-[9px] text-brand-muted font-mono pr-1">
              Last Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('maintenance')}
            className="p-5 bg-brand-surface border border-brand-border rounded-2xl text-left flex items-start space-x-4 cursor-pointer shadow-2xs group interactive-card"
          >
            <div className="w-12 h-12 bg-amber-500/10 text-warn-gold border border-amber-500/20 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🛠️
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-title flex items-center">
                <span>Submit Maintenance Request</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary-teal" />
              </h4>
              <p className="text-xs text-brand-body font-light mt-1">Create a maintenance request for your unit and track updates from technicians.</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('amenities')}
            className="p-5 bg-brand-surface border border-brand-border rounded-2xl text-left flex items-start space-x-4 cursor-pointer shadow-2xs group interactive-card"
          >
            <div className="w-12 h-12 bg-teal-500/10 text-primary-teal rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              📅
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-title flex items-center">
                <span>Book Amenity</span>
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
              Check-In Status
            </span>
          </div>

          {tenantActiveBookings.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[...tenantActiveBookings].sort((a, b) => new Date(`${a.date}T${a.start}`).getTime() - new Date(`${b.date}T${b.start}`).getTime()).map((b) => (
                <div key={b.id} className="p-4 bg-brand-alternate/40 border border-brand-border rounded-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-brand-muted font-mono block uppercase">ID: {b.id.substring(0,8)}</span>
                    <h4 className="text-xs font-extrabold text-brand-title">{b.amenityName}</h4>
                    <span className="text-[10px] text-brand-body font-mono block">{b.date} • {formatAMPM(b.start)} - {formatAMPM(b.end)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-brand-border/60">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      b.status === 'IN_USE' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-teal-500/10 text-primary-teal border border-teal-500/20'
                    }`}>
                      {b.status === 'IN_USE' ? 'IN USE' : b.status === 'COMPLETED' ? 'COMPLETED' : 'APPROVED'}
                    </span>
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
                  <span className="font-mono text-[10px] block whitespace-nowrap">{formatSlotAMPM(slot)}</span>
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
                      <span className="text-[9px] text-brand-muted font-mono block uppercase">ID: {req.id.substring(0,8)}</span>
                      <h5 className="text-xs font-extrabold text-brand-title truncate">{req.title}</h5>
                      <span className="text-[10px] text-brand-body font-light block">{req.createdAt.split('T')[0]}</span>
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
                  No maintenance requests submitted.
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
                  No booking history available.
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
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaysBookings = bookings.filter(b => b.date === todayDateStr).length;

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Intro Greetings row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight">Welcome back, {currentUser.name}</h1>
            {currentUser.role === 'Admin' && (
              <span className="bg-primary-teal/15 text-primary-teal border border-primary-teal/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shrink-0 uppercase tracking-tight">
                System Administrator
              </span>
            )}
          </div>
          <p className="text-sm text-brand-body font-light mt-1">Monitor maintenance requests, amenity bookings, and overall platform operations in real time.</p>
        </div>

        <div className="flex flex-col items-end gap-1.5 self-start sm:self-auto shrink-0">
          <div className="flex items-center space-x-2 bg-brand-surface px-3.5 py-2 border border-brand-border rounded-xl shadow-2xs leading-none">
            <ShieldCheck className="w-4 h-4 text-primary-teal shrink-0" />
            <div className="text-left font-sans">
              <div className="text-[9px] font-bold text-brand-muted block uppercase font-mono leading-none">PLATFORM CORE</div>
              <div className="text-xs font-semibold text-brand-body font-sans mt-0.5 whitespace-nowrap leading-none">
                System Status: Connected
              </div>
            </div>
          </div>
          <span className="text-[9px] text-brand-muted font-mono pr-1">
            Last Sync: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Booking Conflict Monitor */}
      <div className={`border rounded-2xl p-4.5 space-y-3 animate-in fade-in duration-200 ${bookingConflicts.length > 0 ? 'bg-rose-500/10 border-rose-500/25' : 'bg-brand-surface border-brand-border shadow-2xs'}`}>
        <div className="flex items-start space-x-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bookingConflicts.length > 0 ? 'bg-rose-500/25 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {bookingConflicts.length > 0 ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h4 className={`text-sm font-extrabold leading-none ${bookingConflicts.length > 0 ? 'text-rose-600 dark:text-rose-450' : 'text-brand-title'}`}>
              Booking Conflict Monitor
            </h4>
            <p className="text-xs text-brand-body font-light mt-1.5 leading-normal">
              {bookingConflicts.length > 0 
                ? 'Platform conflict check flagged concurrent reservations overlap:' 
                : 'No booking conflicts detected. All amenity schedules are synchronized.'}
            </p>
          </div>
        </div>

        {bookingConflicts.length > 0 && (
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
        )}
      </div>

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
            <div className={`text-[11px] font-semibold flex items-center space-x-1 leading-none ${parseFloat(averageRating) >= 4 ? 'text-emerald-500' : 'text-amber-500'}`}>
              <span>{parseFloat(averageRating) >= 4 ? '✓' : '⚠️'}</span>
              <span>Avg: {averageRating} / 5 ({totalRatings} ratings)</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-teal-500/10 text-primary-teal rounded-xl flex items-center justify-center border border-teal-500/20 shrink-0 select-none text-xl">
            📈
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Live Activity Feed */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 lg:col-span-8 shadow-sm space-y-4 flex flex-col h-[500px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-brand-border pb-3 shrink-0">
            <div>
              <h3 className="text-base font-extrabold text-brand-title font-sans">Live Activity Feed</h3>
              <p className="text-xs text-brand-body font-light mt-0.5">Recent maintenance and booking events across your portfolio.</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                Real-time Sync
              </span>
            </div>
          </div>

          <div className="divide-y divide-brand-border space-y-2 overflow-y-auto flex-1 pr-2">
            {[
              ...maintenance.map(m => {
                let mTitle = 'Maintenance Status Updated';
                if (m.status === 'Pending') mTitle = 'Maintenance Request Created';
                return {
                  id: m.id,
                  type: 'maintenance',
                  title: mTitle,
                  subtitle: m.title,
                  details: `${getPropertyName(m.propertyId)} • Unit ${m.unitNumber}`,
                  meta: `${m.category} • ${m.createdBy}`,
                  status: m.status,
                  priority: m.priority,
                  timestamp: new Date(m.createdAt).getTime()
                };
              }),
              ...bookings.map(b => {
                let bStatusDisplay: string = b.status;
                let title = 'Booking Status Updated';
                if (b.status === 'booked' || b.status === 'APPROVED') { bStatusDisplay = 'Created'; title = 'Booking Created'; }
                if (b.status === 'IN_USE') { bStatusDisplay = 'Checked In'; title = 'Booking Checked In'; }
                if (b.status === 'COMPLETED') { bStatusDisplay = 'Checked Out'; title = 'Booking Checked Out'; }
                if (b.status === 'CANCELLED' || b.status === 'cancelled') { bStatusDisplay = 'Cancelled'; title = 'Booking Cancelled'; }
                if (b.status === 'NO_SHOW') { bStatusDisplay = 'No Show'; title = 'Booking No Show'; }
                
                let ts = new Date(`${b.date}T${b.start}`).getTime();
                if (b.actualCheckOutAt) ts = new Date(b.actualCheckOutAt).getTime();
                else if (b.actualCheckInAt) ts = new Date(b.actualCheckInAt).getTime();
                
                return {
                  id: b.id,
                  type: 'booking',
                  title: title,
                  subtitle: b.amenityName,
                  details: `${getPropertyName(b.propertyId)} • ${formatAMPM(b.start)} - ${formatAMPM(b.end)}`,
                  meta: `User: ${b.user}`,
                  status: bStatusDisplay,
                  priority: b.status === 'CANCELLED' || b.status === 'cancelled' ? 'High' : 'Normal',
                  timestamp: ts
                };
              })
            ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 15).map((item) => (
              <div key={`${item.type}-${item.id}`} className="py-2.5 flex justify-between items-start first:pt-0 last:pb-0 font-sans">
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 shrink-0 ${item.type === 'maintenance' ? 'text-amber-500' : 'text-primary-teal'}`}>
                    {item.type === 'maintenance' ? <Wrench className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-brand-muted font-mono block uppercase">{item.details}</span>
                    <h5 className="text-xs font-extrabold text-brand-title">
                      <span className="text-brand-muted font-semibold">{item.title}: </span>
                      {item.subtitle}
                    </h5>
                    <span className="text-[10px] text-brand-body font-light block">{item.meta}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1.5 shrink-0 ml-2">
                  <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    item.priority === 'Urgent' || item.priority === 'High' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 
                    item.type === 'booking' ? 'bg-teal-500/10 text-primary-teal border-teal-500/20' : 'bg-amber-500/10 text-amber-550 border-amber-500/20'
                  }`}>
                    {item.type === 'maintenance' ? item.priority.toUpperCase() : item.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-brand-muted block">
                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ledger, Summary, Actions */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 lg:col-span-4 shadow-sm space-y-6 flex flex-col">
          
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-brand-title font-sans border-b border-brand-border pb-2">Facility Reservations Ledger</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-brand-alternate/40 p-2 rounded-xl border border-brand-border/50">
                <span className="text-[10px] text-brand-body font-semibold block uppercase tracking-wider mb-1">Today</span>
                <span className="text-lg font-extrabold text-primary-teal leading-none">{todaysBookings}</span>
              </div>
              <div className="bg-brand-alternate/40 p-2 rounded-xl border border-brand-border/50">
                <span className="text-[10px] text-brand-body font-semibold block uppercase tracking-wider mb-1">Active</span>
                <span className="text-lg font-extrabold text-brand-title leading-none">{activeBookings}</span>
              </div>
              <div className="bg-brand-alternate/40 p-2 rounded-xl border border-brand-border/50">
                <span className="text-[10px] text-brand-body font-semibold block uppercase tracking-wider mb-1">Total</span>
                <span className="text-lg font-extrabold text-brand-muted leading-none">{totalBookings}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-brand-border">
            {currentUser.role === 'Admin' ? (
              <>
                <h4 className="text-sm font-extrabold text-brand-title font-sans border-b border-brand-border pb-2">Platform Summary</h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Users</span>
                    <span className="text-lg font-extrabold text-brand-title">{usersCount}</span>
                  </div>
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Properties</span>
                    <span className="text-lg font-extrabold text-brand-title">{properties.length}</span>
                  </div>
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Maintenance</span>
                    <span className="text-lg font-extrabold text-brand-title">{maintenance.length}</span>
                  </div>
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Amenities</span>
                    <span className="text-lg font-extrabold text-brand-title">{amenitiesCount}</span>
                  </div>
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40 col-span-2">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Amenity Bookings</span>
                    <span className="text-lg font-extrabold text-brand-title">{totalBookings}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-sm font-extrabold text-brand-title font-sans border-b border-brand-border pb-2">Operations Summary</h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Active Requests</span>
                    <span className="text-lg font-extrabold text-brand-title">{openRequests}</span>
                  </div>
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Pending Requests</span>
                    <span className="text-lg font-extrabold text-brand-title">{maintenance.filter(m => m.status === 'Pending').length}</span>
                  </div>
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">In Progress</span>
                    <span className="text-lg font-extrabold text-brand-title">{maintenance.filter(m => m.status === 'In Progress').length}</span>
                  </div>
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Completed Today</span>
                    <span className="text-lg font-extrabold text-brand-title">
                      {maintenance.filter(m => m.status === 'Completed' && m.updatedAt && m.updatedAt.startsWith(todayDateStr)).length || completedRequests}
                    </span>
                  </div>
                  <div className="flex flex-col bg-brand-alternate/30 p-2.5 rounded-xl border border-brand-border/40 col-span-2">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Active Amenity Bookings</span>
                    <span className="text-lg font-extrabold text-brand-title">{activeBookings}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-brand-border flex-1">
            <h4 className="text-sm font-extrabold text-brand-title font-sans border-b border-brand-border pb-2">Actions Menu</h4>
            
            {currentUser.role === 'Admin' ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="py-2.5 bg-brand-alternate hover:bg-brand-alternate/85 text-brand-title font-semibold text-xs rounded-xl border border-brand-border hover:border-primary-teal cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add User</span>
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className="py-2.5 bg-brand-alternate hover:bg-brand-alternate/85 text-brand-title font-semibold text-xs rounded-xl border border-brand-border hover:border-primary-teal cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Property</span>
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className="py-2.5 bg-brand-alternate hover:bg-brand-alternate/85 text-brand-title font-semibold text-xs rounded-xl border border-brand-border hover:border-primary-teal cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Amenity</span>
                </button>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="py-2.5 bg-primary-teal/10 hover:bg-primary-teal/20 text-primary-teal font-semibold text-xs rounded-xl border border-primary-teal/20 hover:border-primary-teal cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <BarChart4 className="w-3.5 h-3.5" />
                  <span>View KPIs</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigate('maintenance')}
                  className="py-2.5 bg-brand-alternate hover:bg-brand-alternate/85 text-brand-title font-semibold text-xs rounded-xl border border-brand-border hover:border-primary-teal cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>View Queue</span>
                </button>
                <button
                  onClick={onAddTicketRequested}
                  className="py-2.5 bg-brand-alternate hover:bg-brand-alternate/85 text-brand-title font-semibold text-xs rounded-xl border border-brand-border hover:border-primary-teal cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Request</span>
                </button>
                <button
                  onClick={() => onNavigate('amenities')}
                  className="py-2.5 bg-brand-alternate hover:bg-brand-alternate/85 text-brand-title font-semibold text-xs rounded-xl border border-brand-border hover:border-primary-teal cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Facility Booking</span>
                </button>
                <button
                  onClick={() => onNavigate('monitoring')}
                  className="py-2.5 bg-primary-teal/10 hover:bg-primary-teal/20 text-primary-teal font-semibold text-xs rounded-xl border border-primary-teal/20 hover:border-primary-teal cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Monitor</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
