import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Sparkles,
  CheckCircle,
  X,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { User, Property, BookingSlot, BookingStatus } from '../types.ts';
import { 
  useBookings, 
  useCreateBooking, 
  useUpdateBooking, 
  useCancelBooking, 
  useCheckInBooking, 
  useCheckOutBooking 
} from '../api/hooks';

interface AmenityViewProps {
  currentUser: User;
  properties: Property[];
  amenities: string[];
  bookings?: any[];
  onCreateBooking?: any;
  onUpdateBooking?: any;
  onCancelBooking?: any;
  onCheckInBooking?: any;
  onCheckOutBooking?: any;
  isLoading?: boolean;
}

const timeSlots = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30', '16:00 - 17:30', '18:00 - 19:30'];

export default function AmenityView({
  currentUser,
  properties,
  amenities,
  bookings: propBookings,
  onCreateBooking,
  onUpdateBooking,
  isLoading: propIsLoading
}: AmenityViewProps) {
  const tenantProperty = currentUser.role === 'Tenant' && currentUser.propertyId ? currentUser.propertyId : '';
  const [selectedAmenityName, setSelectedAmenityName] = useState(amenities[0] || 'Skyline Pool');
  const [selectedProperty, setSelectedProperty] = useState(tenantProperty || properties[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[1]);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string | null } | null>(null);

  const { data: bookingsData, isLoading: hooksIsLoading } = useBookings();
  const bookings = propBookings || bookingsData || [];
  const isLoading = propIsLoading !== undefined ? propIsLoading : hooksIsLoading;

  const createBookingMutation = useCreateBooking();
  const updateBookingMutation = useUpdateBooking();
  const cancelBookingMutation = useCancelBooking();
  const checkInBookingMutation = useCheckInBooking();
  const checkOutBookingMutation = useCheckOutBooking();
  
  // Edit mode state
  const [editingBooking, setEditingBooking] = useState<BookingSlot | null>(null);

  const availableAmenities = properties.find(p => p.id === selectedProperty)?.amenities || [];

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

  useEffect(() => {
    if (!selectedProperty && properties.length > 0) {
      setSelectedProperty(currentUser.role === 'Tenant' && currentUser.propertyId ? currentUser.propertyId : properties[0].id);
    }
  }, [properties, selectedProperty, currentUser]);

  useEffect(() => {
    if ((!selectedAmenityName || selectedAmenityName === 'Skyline Pool' || !availableAmenities.includes(selectedAmenityName)) && availableAmenities.length > 0) {
      setSelectedAmenityName(availableAmenities[0]);
    }
  }, [availableAmenities, selectedAmenityName]);

  // Check if slot has a reservation overlap
  const isSlotBooked = (slot: string) => {
    if (!slot) return false;
    const [start, end] = slot.split(' - ');
    return bookings.some(
      b => (b.status === 'APPROVED' || b.status === 'IN_USE') && 
      b.amenityName === selectedAmenityName && 
      b.propertyId === selectedProperty && 
      b.date === selectedDate &&
      b.start === start &&
      b.end === end
    );
  };

  // Check if slot is in the past
  const isSlotPast = (slot: string) => {
    if (!slot) return false;
    const now = new Date();
    
    // Create Date object for the selected date
    const [year, month, day] = selectedDate.split('-').map(Number);
    const selDate = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If selected date is strictly before today, it's past
    if (selDate < today) return true;
    
    // If selected date is strictly after today, it's not past
    if (selDate > today) return false;
    
    // Selected date is today, check time
    const [start] = slot.split(' - ');
    const [hours, minutes] = start.split(':').map(Number);
    
    // It's past if current time is past the slot start time
    if (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes)) {
      return true;
    }
    
    return false;
  };

  // Current active user bookings
  const userBookings = bookings.filter(b => {
    if (currentUser.role === 'Tenant' && b.user !== currentUser.name) {
      return false;
    }
    return (
      b.status === 'APPROVED' || 
      b.status === 'PENDING' ||
      b.status === 'IN_USE' || 
      b.status === 'COMPLETED' || 
      b.status === 'NO_SHOW' ||
      b.status === 'CANCELLED' ||
      b.status === 'booked'
    );
  });

  const handleBook = () => {
    if (!selectedTimeSlot) {
      setNotification({
        type: 'info',
        message: 'Please select a time slot first.'
      });
      return;
    }

    if (isSlotBooked(selectedTimeSlot)) {
      setNotification({
        type: 'error',
        message: 'Conflict Prevention Overrides: Double Reservation overlap detected! Choose another time slot.'
      });
      return;
    }

    const [start, end] = selectedTimeSlot.split(' - ');
    if (editingBooking) {
      if (onUpdateBooking) {
        onUpdateBooking(editingBooking.id, {
          amenityName: selectedAmenityName,
          propertyId: selectedProperty,
          user: currentUser.name,
          date: selectedDate,
          start,
          end,
        });
        setNotification({
          type: 'success',
          message: `Updated booking for ${selectedAmenityName} successfully!`
        });
      }
      setEditingBooking(null);
    } else {
      if (onCreateBooking) {
        onCreateBooking(
          {
            amenityName: selectedAmenityName,
            propertyId: selectedProperty,
            user: currentUser.name,
            date: selectedDate,
            start,
            end,
          },
          {
            onSuccess: () => {
              setNotification({
                type: 'success',
                message: `Reserved ${selectedAmenityName} at ${properties.find(p => p.id === selectedProperty)?.name || 'Property'} successfully!`
              });
            },
            onError: (error: any) => {
              setNotification({
                type: 'error',
                message: error.message
              });
            }
          }
        );
      }
    }
    
    // Clear selection so the UI instantly updates optimistically
    setSelectedTimeSlot('');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleEditBooking = (booking: BookingSlot) => {
    setEditingBooking(booking);
    setSelectedProperty(booking.propertyId || properties[0]?.id || '');
    // Need to set amenity name AFTER property is selected and availableAmenities updates, 
    // but React handles this in subsequent renders
    setTimeout(() => setSelectedAmenityName(booking.amenityName), 0);
    setSelectedDate(booking.date);
    setSelectedTimeSlot(`${booking.start} - ${booking.end}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header section with last audits */}
      <div className="border-b border-brand-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Facility Booking</h1>
        <p className="text-sm text-brand-body font-light mt-0.5">View amenity availability, create bookings, monitor check-in/check-out, and prevent booking conflicts.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Select Amenity & Book */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Amenity Horizontal Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              /* HORIZONTAL CARDS SKELETONS */
              Array.from({ length: 3 }).map((_, sIdx) => (
                <div key={sIdx} className="p-5 rounded-2xl border border-brand-border bg-brand-surface space-y-3.5 animate-pulse h-40 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-10 h-10 bg-brand-alternate rounded-full"></div>
                    <div className="w-14 h-4.5 bg-brand-alternate rounded"></div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="h-4 bg-brand-alternate rounded w-2/3"></div>
                    <div className="h-3 bg-brand-alternate rounded w-11/12"></div>
                  </div>
                </div>
              ))
            ) : availableAmenities.length === 0 ? (
              <div className="col-span-full py-8 text-center bg-brand-alternate/20 rounded-2xl border border-dashed border-brand-border text-brand-muted text-sm">
                No amenities available for this property.
              </div>
            ) : (
              availableAmenities.map((am) => {
                const isActive = selectedAmenityName === am;
                return (
                  <div
                    key={am}
                    onClick={() => setSelectedAmenityName(am)}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedAmenityName(am); }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 focus:ring-2 focus:ring-primary-teal ${isActive ? 'bg-primary-teal text-white border-primary-teal shadow-lg shadow-teal-500/15' : 'bg-brand-surface text-brand-body border-brand-border hover:border-primary-teal/70 hover:bg-brand-alternate'}`}
                    role="radio"
                    aria-checked={isActive}
                    aria-label={`Amenity: ${am}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-3xl"></span>
                    </div>
                    <div>
                      <h4 className={`text-base font-extrabold ${isActive ? 'text-white font-black' : 'text-brand-title font-extrabold'}`}>{am}</h4>
                      <span className={`text-[11px] block mt-0.5 ${isActive ? 'text-teal-200' : 'text-brand-muted'}`}>
                        {properties.find(p => p.id === selectedProperty)?.name || 'Property'} - { /* Location Removed */ }
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Setup Booking Slot Card */}
          <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-brand-title font-sans">Book Amenity</h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Property</label>
                {isLoading ? (
                  <div className="h-10 bg-brand-alternate animate-pulse rounded-xl w-full"></div>
                ) : currentUser.role === 'Tenant' ? (
                  <input
                    type="text"
                    value={`${properties.find(p => p.id === selectedProperty)?.name || 'My Property'} (Assigned Property)`}
                    className="w-full px-3.5 py-2.5 bg-brand-alternate/50 border border-brand-border/50 rounded-xl text-sm text-brand-muted min-h-[44px] focus:outline-none cursor-not-allowed"
                    disabled
                    readOnly
                  />
                ) : (
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm focus:outline-none focus:border-primary-teal text-brand-title min-h-[44px]"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Booking Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm focus:outline-none focus:border-primary-teal text-brand-title min-h-[44px] [color-scheme:dark]"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Available Time Slots</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, slotIdx) => (
                      <div key={slotIdx} className="h-11 bg-brand-alternate animate-pulse rounded-xl w-full"></div>
                    ))
                  ) : (
                    timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      const isBooked = isSlotBooked(slot);
                      const isPast = isSlotPast(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked || (isPast && !editingBooking)}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-1 text-[10px] sm:text-xs font-bold rounded-xl border leading-none transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center min-h-[44px] focus:ring-2 focus:ring-primary-teal/50 ${
                            isBooked 
                              ? 'bg-brand-alternate text-brand-muted border-brand-border cursor-not-allowed line-through' 
                              : (isPast && !editingBooking)
                              ? 'bg-brand-alternate/30 text-brand-muted border-brand-border/50 cursor-not-allowed opacity-60'
                              : isSelected 
                              ? 'bg-primary-teal text-white border-primary-teal shadow-md font-bold' 
                              : 'bg-brand-alternate text-brand-body border-brand-border hover:bg-brand-surface hover:border-primary-teal/50'
                          }`}
                        >
                          <span className="mb-0.5 whitespace-nowrap">{formatSlotAMPM(slot)}</span>
                          {isBooked ? (
                            <span className="text-[9px] font-mono font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider bg-rose-500/10 px-1.5 py-0.5 rounded">
                              OCCUPIED
                            </span>
                          ) : (isPast && !editingBooking) ? (
                            <span className="text-[9px] font-mono font-bold text-brand-muted uppercase tracking-wider bg-brand-surface border border-brand-border px-1.5 py-0.5 rounded">
                              UNAVAILABLE
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              AVAILABLE
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Warning and Confirmation Callouts */}
            {notification && (
              <div className={`p-4 rounded-xl border text-xs font-sans animate-in fade-in ${
                notification.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' 
                  : notification.type === 'error'
                  ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                  : 'bg-brand-alternate text-brand-body border-brand-border'
              }`}>
                <div className="flex items-start space-x-2.5">
                  <span className="text-sm shrink-0">{notification.type === 'success' ? '✓' : '⚠️'}</span>
                  <span>{notification.message}</span>
                </div>
              </div>
            )}

            <div className="p-4 bg-brand-alternate rounded-xl border border-brand-border text-xs text-brand-title leading-relaxed font-sans mt-2 space-y-2">
              <div className="flex items-start space-x-2 border-b border-brand-border pb-2">
                <Calendar className="w-4 h-4 mt-0.5 shrink-0 text-brand-muted" />
                <span className="font-bold text-sm uppercase tracking-wider">Booking Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <span className="block text-[10px] text-brand-muted uppercase font-bold tracking-wider">Property</span>
                  <span className="font-semibold">{properties.find(p => p.id === selectedProperty)?.name || 'Property'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted uppercase font-bold tracking-wider">Amenity</span>
                  <span className="font-semibold">{selectedAmenityName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted uppercase font-bold tracking-wider">Booking Date</span>
                  <span className="font-semibold font-mono">{selectedDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted uppercase font-bold tracking-wider">Current Status</span>
                  <span className="font-semibold">
                    {editingBooking 
                      ? (editingBooking.status === 'IN_USE' ? 'In Use' : editingBooking.status === 'COMPLETED' ? 'Completed' : editingBooking.status === 'CANCELLED' || editingBooking.status === 'NO_SHOW' ? 'Cancelled' : 'Confirmed') 
                      : 'Pending Creation'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted uppercase font-bold tracking-wider">Check-In Time</span>
                  <span className="font-semibold font-mono">{formatAMPM(selectedTimeSlot.split(' - ')[0])}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted uppercase font-bold tracking-wider">Check-Out Time</span>
                  <span className="font-semibold font-mono">{formatAMPM(selectedTimeSlot.split(' - ')[1])}</span>
                </div>
              </div>
            </div>

            <button
              id="submit-book-amenity-btn"
              onClick={handleBook}
              disabled={(isSlotBooked(selectedTimeSlot) && !editingBooking) || (isSlotPast(selectedTimeSlot) && !editingBooking) || isLoading}
              className={`px-6 py-3 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 leading-none min-h-[44px] ${
                ((isSlotBooked(selectedTimeSlot) || isSlotPast(selectedTimeSlot)) && !editingBooking)
                  ? 'bg-brand-alternate border border-brand-border text-brand-muted cursor-not-allowed shadow-none'
                  : 'bg-primary-teal hover:bg-[#0F766E] focus:ring-2 focus:ring-primary-teal'
              }`}
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>{((isSlotBooked(selectedTimeSlot) || isSlotPast(selectedTimeSlot)) && !editingBooking) ? 'Time Slot Unavailable' : editingBooking ? 'Save Changes' : 'Create Booking'}</span>
            </button>

          </div>

        </div>

        {/* Right Column: Active Bookings Queue */}
        <div className="lg:col-span-4 bg-brand-surface rounded-2xl border border-brand-border p-5 shadow-sm space-y-4">
          <div className="border-b border-brand-border pb-3">
            <h4 className="text-sm font-extrabold text-brand-title font-sans">
              {currentUser.role === 'Tenant' ? `My Bookings (${userBookings.length})` : `Facility Reservations (${userBookings.length})`}
            </h4>
          </div>

          <div className="divide-y divide-brand-border space-y-1">
            {isLoading ? (
              /* Ledger loading skeleton */
              Array.from({ length: 2 }).map((_, sIdx) => (
                <div key={sIdx} className="py-3.5 space-y-2 animate-pulse">
                  <div className="h-3 bg-brand-alternate rounded w-1/3"></div>
                  <div className="h-4.5 bg-brand-alternate rounded w-2/3"></div>
                  <div className="h-3 bg-brand-alternate rounded w-1/2"></div>
                </div>
              ))
            ) : userBookings.length > 0 ? (
              userBookings.map((b) => {
                const isCreator = b.user === currentUser.name;
                const propName = properties.find(p => p.id === b.propertyId)?.name || 'Property';
                
                return (
                  <div key={b.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start font-sans border-b last:border-b-0 border-brand-border gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-brand-muted font-mono uppercase font-bold tracking-wider">Booking ID: {b.id.substring(0,8)}</span>
                      </div>
                      <h5 className="text-sm font-extrabold text-brand-title leading-snug">{b.amenityName}</h5>
                      {currentUser.role !== 'Tenant' && <span className="text-xs text-brand-body font-medium">{propName}</span>}
                      {currentUser.role !== 'Tenant' && <span className="text-xs text-brand-muted block font-medium mt-0.5">Tenant: {b.user}</span>}
                      
                      <div className="flex flex-col space-y-0.5 text-[11px] text-brand-muted pt-1">
                        <span className="font-mono font-medium">Booking Date: {b.date}</span>
                        <span className="font-mono font-medium">Check-In Time: {formatAMPM(b.start)}</span>
                        <span className="font-mono font-medium">Check-Out Time: {formatAMPM(b.end)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {b.status === 'IN_USE' ? (
                        <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded leading-none uppercase shrink-0">
                          In Use
                        </span>
                      ) : b.status === 'COMPLETED' ? (
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded leading-none uppercase shrink-0">
                          Completed
                        </span>
                      ) : b.status === 'NO_SHOW' || b.status === 'CANCELLED' ? (
                        <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/20 px-2 py-0.5 rounded leading-none uppercase shrink-0">
                          Cancelled
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-primary-teal dark:text-secondary-teal border border-teal-500/20 px-2 py-0.5 rounded leading-none uppercase shrink-0">
                          Confirmed
                        </span>
                      )}

                      {currentUser.role !== 'Tenant' && (
                        <div className="flex flex-col space-y-2 w-full pt-1">
                          {(b.status === 'APPROVED' || b.status === 'booked' || b.status === 'PENDING') && (
                            <>
                              <button
                                onClick={() => {
                                  checkInBookingMutation.mutate(b.id, {
                                    onSuccess: () => {
                                      setNotification({
                                        type: 'success',
                                        message: 'Check-in processed successfully!'
                                      });
                                      setTimeout(() => setNotification(null), 4000);
                                    },
                                    onError: (error: any) => {
                                      setNotification({
                                        type: 'error',
                                        message: error.response?.data?.message || error.message || 'Check-in failed'
                                      });
                                      setTimeout(() => setNotification(null), 5000);
                                    }
                                  });
                                }}
                                className="text-[10px] text-teal-600 hover:text-teal-700 font-extrabold flex items-center space-x-0.5 cursor-pointer leading-none"
                                aria-label="Check in to booking"
                              >
                                <span>🔑 Check In</span>
                              </button>

                              <button
                                onClick={() => handleEditBooking(b)}
                                className="text-[10px] text-brand-body hover:text-brand-title font-extrabold flex items-center space-x-0.5 cursor-pointer leading-none"
                                aria-label="Edit booking"
                              >
                                <span>✏️ Edit Booking</span>
                              </button>

                              <button
                                onClick={() => {
                                  cancelBookingMutation.mutate(b.id);
                                  setNotification({
                                    type: 'info',
                                    message: 'Booking cancelled successfully!'
                                  });
                                  setTimeout(() => setNotification(null), 4000);
                                }}
                                className="text-[10px] text-rose-400 hover:text-rose-500 font-extrabold flex items-center space-x-0.5 cursor-pointer leading-none"
                                aria-label="Cancel active reservation"
                              >
                                <Trash2 className="w-3 h-3 text-rose-400 inline" />
                                <span>Cancel Booking</span>
                              </button>
                            </>
                          )}

                          {b.status === 'IN_USE' && (
                            <button
                              onClick={() => {
                                checkOutBookingMutation.mutate(b.id, {
                                  onSuccess: () => {
                                    setNotification({
                                      type: 'success',
                                      message: 'Check-out processed successfully!'
                                    });
                                    setTimeout(() => setNotification(null), 4000);
                                  },
                                  onError: (error: any) => {
                                    setNotification({
                                      type: 'error',
                                      message: error.response?.data?.message || error.message || 'Check-out failed'
                                    });
                                    setTimeout(() => setNotification(null), 5000);
                                  }
                                });
                              }}
                              className="text-[10px] text-amber-600 hover:text-amber-700 font-extrabold flex items-center space-x-0.5 cursor-pointer leading-none"
                              aria-label="Check out of booking"
                            >
                              <span>🚪 Check Out</span>
                            </button>
                          )}
                        </div>
                      )}
                      
                      {currentUser.role === 'Tenant' && isCreator && (b.status === 'APPROVED') && (
                        <button
                          onClick={() => {
                            cancelBookingMutation.mutate(b.id);
                            setNotification({
                              type: 'info',
                              message: 'Allocation release synced successfully!'
                            });
                            setTimeout(() => setNotification(null), 4000);
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-500 font-extrabold flex items-center space-x-0.5 cursor-pointer leading-none pt-1"
                          aria-label="Cancel active reservation"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400 inline" />
                          <span>Cancel Slot</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* DYNAMIC EMPTY STATE (with real estate themed illustration) */
              <div className="py-12 text-center space-y-3 p-1.5 border border-dashed border-brand-border rounded-2xl bg-brand-alternate/20">
                <div className="w-12 h-12 bg-brand-alternate rounded-xl flex items-center justify-center border border-dashed border-brand-border mx-auto text-xl">
                  🗝️
                </div>
                <div>
                  <h5 className="font-extrabold text-brand-title text-xs">{currentUser.role === 'Tenant' ? 'No upcoming bookings' : 'No facility bookings found.'}</h5>
                  <p className="text-[10px] text-brand-body max-w-[200px] mx-auto mt-1 leading-normal font-light">
                    {currentUser.role === 'Tenant' 
                      ? 'You have no upcoming bookings. Book an available amenity to get started.' 
                      : 'No bookings match the selected criteria.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}



