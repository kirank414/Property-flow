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
import { User, Property, BookingSlot } from '../types.ts';

interface AmenityViewProps {
  currentUser: User;
  properties: Property[];
  bookings: BookingSlot[];
  onCreateBooking: (booking: any) => void;
  onCancelBooking: (id: string) => void;
}

const localAmenities = [
  { name: 'Skyline Pool', location: 'Summit Heights Penthouse Deck', price: 25, icon: '🏊' },
  { name: 'Fitness Center', location: 'Summit Heights Level 2', price: 0, icon: '🏋️' },
  { name: 'Penthouse Lounge', location: 'Summit Heights West Tower', price: 75, icon: '🍹' },
  { name: 'Garden Lounge', location: 'Oakridge Manor Courtyard', price: 15, icon: '🌳' },
  { name: 'Tennis Courts', location: 'Oakridge Manor East Wing', price: 10, icon: '🎾' }
];

const timeSlots = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30', '16:00 - 17:30', '18:00 - 19:30'];

export default function AmenityView({
  currentUser,
  properties,
  bookings,
  onCreateBooking,
  onCancelBooking
}: AmenityViewProps) {
  const [selectedAmenity, setSelectedAmenity] = useState(localAmenities[0]);
  const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || 'prop-1');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[1]);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated Boot Loader Cycle
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Check if slot has a reservation overlap
  const isSlotBooked = (slot: string) => {
    const [start, end] = slot.split(' - ');
    return bookings.some(
      b => b.status === 'booked' && 
      b.amenityName === selectedAmenity.name && 
      b.propertyId === selectedProperty && 
      b.start === start &&
      b.end === end
    );
  };

  // Current active user bookings
  const userBookings = bookings.filter(b => b.status === 'booked');

  const handleBook = () => {
    if (isSlotBooked(selectedTimeSlot)) {
      setNotification({
        type: 'error',
        message: 'Conflict Prevention Overrides: Double Reservation overlap detected! Choose another time slot.'
      });
      return;
    }

    const [start, end] = selectedTimeSlot.split(' - ');
    onCreateBooking({
      amenityName: selectedAmenity.name,
      propertyId: selectedProperty,
      user: currentUser.name,
      start,
      end,
      price: selectedAmenity.price
    });
    
    setNotification({
      type: 'success',
      message: `Reserved ${selectedAmenity.name} at ${properties.find(p => p.id === selectedProperty)?.name || 'Summit Complex'} successfully! Check your email for entry access passcodes.`
    });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header section with last audits */}
      <div className="border-b border-brand-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Automated Amenity Booker</h1>
        <p className="text-sm text-brand-body font-light mt-0.5">Maintain resident shared environments, prevent timing conflicts, and audit facility passcodes.</p>
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
            ) : (
              localAmenities.map((am) => {
                const isActive = selectedAmenity.name === am.name;
                return (
                  <div
                    key={am.name}
                    onClick={() => setSelectedAmenity(am)}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedAmenity(am); }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 focus:ring-2 focus:ring-primary-teal ${isActive ? 'bg-primary-teal text-white border-primary-teal shadow-lg shadow-teal-500/15' : 'bg-brand-surface text-brand-body border-brand-border hover:border-primary-teal/70 hover:bg-brand-alternate'}`}
                    role="radio"
                    aria-checked={isActive}
                    aria-label={`Amenity: ${am.name}, Location: ${am.location}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-3xl">{am.icon}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${isActive ? 'bg-white/20 text-[#5EEAD4]' : 'bg-brand-alternate text-brand-body'}`}>
                        {am.price === 0 ? 'FREE' : `$${am.price}/hr`}
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-base font-extrabold ${isActive ? 'text-white font-black' : 'text-brand-title font-extrabold'}`}>{am.name}</h4>
                      <span className={`text-[11px] block mt-0.5 ${isActive ? 'text-teal-200' : 'text-brand-muted'}`}>{am.location}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Setup Booking Slot Card */}
          <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-brand-title font-sans">Configure Reservation Parameters</h3>
            
            <div className="grid sm:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Assigned Complex</label>
                {isLoading ? (
                  <div className="h-10 bg-brand-alternate animate-pulse rounded-xl w-full"></div>
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

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Preferred Time Window</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, slotIdx) => (
                      <div key={slotIdx} className="h-11 bg-brand-alternate animate-pulse rounded-xl w-full"></div>
                    ))
                  ) : (
                    timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      const isBooked = isSlotBooked(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-1 text-[10px] sm:text-xs font-bold rounded-xl border leading-none transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center min-h-[44px] focus:ring-2 focus:ring-primary-teal/50 ${
                            isBooked 
                              ? 'bg-brand-alternate text-brand-muted border-brand-border cursor-not-allowed line-through' 
                              : isSelected 
                              ? 'bg-primary-teal text-white border-primary-teal shadow-md font-bold' 
                              : 'bg-brand-alternate text-brand-body border-brand-border hover:bg-brand-surface hover:border-primary-teal/50'
                          }`}
                        >
                          <span>{slot}</span>
                          {isBooked && (
                            <span className="text-[8px] font-mono font-bold text-rose-400 uppercase mt-0.5 tracking-wider font-semibold">
                              OCCUPIED
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

            <div className="p-4 bg-teal-500/10 rounded-xl border border-teal-500/20 text-xs text-primary-teal dark:text-secondary-teal leading-relaxed font-sans mt-2 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-accent-teal" />
              <span>You are reserving <span className="font-extrabold text-brand-title">{selectedAmenity.name}</span> for {currentUser.name}. Price tier totals <span className="font-mono font-bold text-brand-title">${selectedAmenity.price} USD</span>. Full access credentials will automatically sync inside your profile folder.</span>
            </div>

            <button
              id="submit-book-amenity-btn"
              onClick={handleBook}
              disabled={isSlotBooked(selectedTimeSlot) || isLoading}
              className={`px-6 py-3 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 leading-none min-h-[44px] ${
                isSlotBooked(selectedTimeSlot)
                  ? 'bg-brand-alternate border border-brand-border text-brand-muted cursor-not-allowed shadow-none'
                  : 'bg-primary-teal hover:bg-[#0F766E] focus:ring-2 focus:ring-primary-teal'
              }`}
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>{isSlotBooked(selectedTimeSlot) ? 'Time Window Occupied' : 'Book Facility Booking Slot'}</span>
            </button>

          </div>

        </div>

        {/* Right Column: Active Bookings Queue */}
        <div className="lg:col-span-4 bg-brand-surface rounded-2xl border border-brand-border p-5 shadow-sm space-y-4">
          <div className="border-b border-brand-border pb-3">
            <h4 className="text-sm font-extrabold text-brand-title font-sans">Reservations Ledger ({userBookings.length})</h4>
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
                const propName = properties.find(p => p.id === b.propertyId)?.name || 'Summit Heights';
                
                return (
                  <div key={b.id} className="py-3.5 flex justify-between items-start first:pt-0 last:pb-0 font-sans border-b last:border-b-0 border-brand-border">
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-muted font-mono block uppercase">{propName}</span>
                      <h5 className="text-xs font-extrabold text-brand-title leading-snug">{b.amenityName}</h5>
                      <div className="flex items-center space-x-1.5 text-[11px] text-brand-body font-light font-mono leading-none">
                        <Clock className="w-3.5 h-3.5 text-brand-muted" />
                        <span>{b.start} - {b.end}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                       <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-primary-teal dark:text-secondary-teal border border-teal-500/20 px-2 py-0.5 rounded leading-none uppercase shrink-0">
                        CONFIRMED
                      </span>
                      {isCreator && (
                        <button
                          onClick={() => {
                            onCancelBooking(b.id);
                            setNotification({
                              type: 'info',
                              message: 'Allocation release synced successfully!'
                            });
                            setTimeout(() => setNotification(null), 4000);
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-500 font-extrabold flex items-center space-x-0.5 cursor-pointer leading-none"
                          aria-label="Cancel active reservation"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" />
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
                  <h5 className="font-extrabold text-brand-title text-xs">No reservations scheduled</h5>
                  <p className="text-[10px] text-brand-body max-w-[200px] mx-auto mt-1 leading-normal font-light">
                    Your active booking lists are clear. Configure parameters above to block Skyline Pool or Tennis Court slots.
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
