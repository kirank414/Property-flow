import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  TrendingUp, 
  User, 
  X,
  Sparkles,
  Search,
  Filter,
  Info,
  ShieldAlert,
  ArrowRight,
  Trash2,
  Edit2
} from 'lucide-react';
import { Property, User as UserType, MaintenanceRequest, BookingSlot } from '../types.ts';
import { PropertyCard, EmptyState } from './DesignSystem.tsx';
import { propertyValidationSchema } from '../../shared/zod';
import { useAmenities, useCreateProperty, useUpdateProperty, useDeleteProperty } from '../api/hooks';
import { resizeAndCompressImage } from '../utils/image';

interface PropertyViewProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  currentUser: UserType;
  maintenance?: MaintenanceRequest[];
  bookings?: BookingSlot[];
  isLoading?: boolean;
}

export default function PropertyView({
  properties,
  setProperties,
  currentUser,
  maintenance = [],
  bookings = [],
  isLoading = false
}: PropertyViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('All');

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'Residential' | 'Commercial' | 'Retail'>('Residential');
  const [units, setUnits] = useState(60);
  const [imageUrl, setImageUrl] = useState('');

  // Form error states
  const [formTouched, setFormTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Dynamic notification
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  const { data: amenitiesData } = useAmenities();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  // Summary logic
  const totalProperties = properties.length;
  const activeMaintenance = maintenance.filter(m => m.status !== 'Completed').length;
  const availableAmenities = amenitiesData?.amenities?.length || 0;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaysBookings = bookings.filter(b => b.date === todayDateStr).length;

  // Filter properties based on search and type
  const filteredProperties = properties.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = propertyTypeFilter === 'All' || p.type === propertyTypeFilter;

    return matchesSearch && matchesType;
  });

  // Select first available property on loaded state
  useEffect(() => {
    if (!isLoading && filteredProperties.length > 0 && !selectedProperty) {
      setSelectedProperty(filteredProperties[0]);
    } else if (filteredProperties.length === 0) {
      setSelectedProperty(null);
    }
  }, [isLoading, filteredProperties, selectedProperty]);

  // Sync selectedProperty details with updated properties list
  useEffect(() => {
    if (selectedProperty) {
      const updated = properties.find(p => p.id === selectedProperty.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedProperty)) {
        setSelectedProperty(updated);
      }
    }
  }, [properties, selectedProperty]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    setFormError(null);

    try {
      propertyValidationSchema.parse({
        name,
        address,
        type,
        units,
        occupancyRate: 100, // Default required by backend, but removed from UI
        ownerId: currentUser.id,
        status: 'ACTIVE'
      });
    } catch (err: any) {
      if (err.errors) {
        setFormError(err.errors[0].message);
        return;
      }
    }

    if (editingProperty) {
      updatePropertyMutation.mutate({
        id: editingProperty.id,
        data: { name, address, type, units, imageUrl: imageUrl || null }
      }, {
        onSuccess: (data) => {
          if (data && data.id) {
            const mapped: Property = {
              id: data.id,
              name: data.name,
              address: data.address,
              type: data.type as any,
              units: data.units,
              occupancy: data.occupancyRate,
              image: data.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
              manager: editingProperty.manager || 'Unassigned',
              amenities: editingProperty.amenities || []
            };
            setSelectedProperty(mapped);
          }
          setActionNotification(`Property "${name}" updated successfully.`);
          setFormTouched(false);
          setFormError(null);
          setShowAddModal(false);
          setEditingProperty(null);
          setImageUrl('');
          setTimeout(() => setActionNotification(null), 5000);
        },
        onError: (err: any) => {
          setFormError(err.response?.data?.message || err.message || 'Failed to update property details.');
        }
      });
    } else {
      createPropertyMutation.mutate({
        name,
        address,
        type,
        units,
        occupancyRate: 100,
        ownerId: currentUser.id,
        status: 'ACTIVE',
        imageUrl: imageUrl || null
      }, {
        onSuccess: (data) => {
          if (data && data.id) {
            const mapped: Property = {
              id: data.id,
              name: data.name,
              address: data.address,
              type: data.type as any,
              units: data.units,
              occupancy: data.occupancyRate,
              image: data.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
              manager: `${currentUser.name}`,
              amenities: []
            };
            setSelectedProperty(mapped);
          }
          setActionNotification(`Portfolio asset "${name}" registered successfully.`);
          setFormTouched(false);
          setFormError(null);
          setShowAddModal(false);
          setEditingProperty(null);
          setImageUrl('');
          setTimeout(() => setActionNotification(null), 5000);
        },
        onError: (err: any) => {
          setFormError(err.response?.data?.message || err.message || 'Failed to register property.');
        }
      });
    }
  };

  const openEditModal = (property: Property) => {
    setEditingProperty(property);
    setName(property.name);
    setAddress(property.address);
    setType(property.type as any);
    setUnits(property.units);
    setImageUrl(property.image || '');
    setShowAddModal(true);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deletePropertyMutation.mutate(id);
      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
      }
      setActionNotification(`Property deleted successfully.`);
      setTimeout(() => setActionNotification(null), 5000);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPropertyTypeFilter('All');
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header element */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Properties</h1>
          <p className="text-sm text-brand-body font-light mt-0.5">View and manage registered properties, maintenance activities, and amenity availability.</p>
        </div>

        {currentUser.role !== 'Tenant' && (
          <button
            onClick={() => {
              setEditingProperty(null);
              setName('');
              setAddress('');
              setType('Residential');
              setUnits(60);
              setImageUrl('');
              setFormError(null);
              setFormTouched(false);
              setShowAddModal(true);
            }}
            className="bg-primary-teal hover:bg-primary-teal-hover focus:ring-2 focus:ring-primary-teal text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 self-start sm:self-auto cursor-pointer min-h-[44px]"
            aria-label="Add a new property complex to operations"
          >
            <Plus className="w-4 h-4 text-accent-teal font-extrabold" />
            <span>Add Property</span>
          </button>
        )}
      </div>

      {/* Success Banner */}
      {actionNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-150 dark:bg-emerald-950/20 dark:border-emerald-500/20 dark:text-emerald-400 text-emerald-800 text-xs font-sans rounded-xl flex items-center space-x-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{actionNotification}</span>
        </div>
      )}

      {/* Filter and Search Box */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search property name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-brand-surface focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/15 transition-all text-brand-title"
            aria-label="Search properties list"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-brand-body uppercase tracking-wider font-sans whitespace-nowrap">Property Type</span>
          <select
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
            className="px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs font-medium focus:outline-none focus:border-primary-teal text-brand-body min-h-[38px]"
          >
            <option value="All">All Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Retail">Retail</option>
          </select>
        </div>

        {(searchQuery || propertyTypeFilter !== 'All') && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Property Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-sm flex flex-col items-start justify-center">
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Total Properties</span>
          <span className="text-xl font-extrabold text-brand-title mt-1">{totalProperties}</span>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-sm flex flex-col items-start justify-center">
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Active Maintenance</span>
          <span className="text-xl font-extrabold text-brand-title mt-1">{activeMaintenance}</span>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-sm flex flex-col items-start justify-center">
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Available Amenities</span>
          <span className="text-xl font-extrabold text-brand-title mt-1">{availableAmenities}</span>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-sm flex flex-col items-start justify-center">
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Today's Bookings</span>
          <span className="text-xl font-extrabold text-brand-title mt-1">{todaysBookings}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: List representation */}
        <div className="lg:col-span-4 space-y-4">
          {isLoading ? (
            /* Properties loading skeletons */
            Array.from({ length: 3 }).map((_, sIdx) => (
              <div key={sIdx} className="p-4 rounded-2xl border border-brand-border bg-brand-surface flex space-x-3.5 animate-pulse">
                <div className="w-14 h-14 bg-brand-alternate rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-3 bg-brand-alternate rounded w-1/4"></div>
                  <div className="h-4.5 bg-brand-alternate rounded w-11/12"></div>
                  <div className="h-3 bg-brand-alternate rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSelected={selectedProperty?.id === p.id}
                onClick={() => setSelectedProperty(p)}
              />
            ))
          ) : (
            <EmptyState
              icon="🏢"
              title="No properties found"
              description="No properties found."
              action={{
                label: "Clear Search Filter",
                onClick: clearFilters
              }}
            />
          )}
        </div>

        {/* Right Column: Detailed parameters */}
        <div className="lg:col-span-8 bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-sm min-h-[500px]">
          {isLoading ? (
            /* Detailed Card Skeleton */
            <div className="animate-pulse space-y-6">
              <div className="w-full h-60 bg-brand-alternate"></div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="h-4 bg-brand-alternate rounded w-12 text-xs"></div>
                  <div className="h-6 bg-brand-alternate rounded w-1/2"></div>
                  <div className="h-3 bg-brand-alternate rounded w-2/3"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-y border-brand-border py-6">
                  <div className="h-10 bg-brand-alternate rounded-xl"></div>
                  <div className="h-10 bg-brand-alternate rounded-xl"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-brand-alternate rounded w-20"></div>
                  <div className="h-14 bg-brand-alternate rounded-xl"></div>
                </div>
              </div>
            </div>
          ) : selectedProperty ? (
            <div>
              <img src={selectedProperty.image} alt={selectedProperty.name} className="w-full h-60 object-cover" referrerPolicy="no-referrer" />
              
              <div className="p-6 space-y-6">
                
                {/* Estate Info */}
                <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold bg-primary-teal text-white px-2 py-0.5 rounded font-mono uppercase tracking-wider">{selectedProperty.type}</span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-brand-title font-sans mt-0.5">{selectedProperty.name}</h2>
                    <div className="flex items-center space-x-1.5 text-xs text-brand-body mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-light">{selectedProperty.address}</span>
                    </div>
                  </div>

                  {currentUser.role !== 'Tenant' && (
                    <div className="flex space-x-2 shrink-0 self-start">
                      <button 
                        onClick={() => openEditModal(selectedProperty)}
                        className="px-3 py-1.5 bg-brand-alternate hover:bg-brand-alternate/80 text-brand-title border border-brand-border rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteProperty(selectedProperty.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Maintenance and Units Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-brand-border py-5">
                  <div className="space-y-1">
                    <span className="text-xs text-brand-body font-light font-sans block">Total Units</span>
                    <div className="text-2xl font-extrabold text-brand-title">{selectedProperty.units}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs text-brand-body font-light font-sans block">Pending</span>
                    <div className="text-2xl font-extrabold text-amber-500">{maintenance.filter(m => m.propertyId === selectedProperty.id && m.status === 'Pending').length}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-brand-body font-light font-sans block">In Progress</span>
                    <div className="text-2xl font-extrabold text-[#14B8A6]">{maintenance.filter(m => m.propertyId === selectedProperty.id && m.status === 'In Progress').length}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-brand-body font-light font-sans block">Completed</span>
                    <div className="text-2xl font-extrabold text-emerald-500">{maintenance.filter(m => m.propertyId === selectedProperty.id && m.status === 'Completed').length}</div>
                  </div>
                </div>

                {/* Sub Amenities Tags */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Active Facility Amenities</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((am, amIdx) => (
                      <span key={amIdx} className="bg-teal-50 text-primary-teal dark:bg-[#14B8A6]/10 dark:text-[#14B8A6] dark:border-[#14B8A6]/20 font-semibold px-2.5 py-1 rounded-lg text-xs border border-teal-100/65 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 text-accent-teal" />
                        <span>{am}</span>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Today's Amenity Bookings */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-brand-muted uppercase tracking-widest font-sans border-t border-brand-border pt-4 pb-1">
                    <span>TODAY'S AMENITY BOOKINGS</span>
                  </div>
                  
                  <div className="divide-y divide-brand-border space-y-1 border border-brand-border rounded-xl bg-brand-alternate/20 p-2">
                    {bookings.filter(b => b.propertyId === selectedProperty.id && b.date === new Date().toISOString().split('T')[0]).length > 0 ? (
                      bookings.filter(b => b.propertyId === selectedProperty.id && b.date === new Date().toISOString().split('T')[0]).map(b => (
                        <div key={b.id} className="py-2.5 px-3 flex justify-between items-center first:pt-2 last:pb-2 font-sans bg-brand-surface rounded-lg mb-1 shadow-xs border border-brand-border">
                          <div className="space-y-1">
                            <h5 className="text-xs font-extrabold text-brand-title">{b.amenityName}</h5>
                            <span className="text-[10px] text-brand-body font-mono block">{b.start} - {b.end} • {b.user}</span>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            b.status === 'booked' || b.status === 'APPROVED' ? 'bg-teal-500/10 text-primary-teal border-teal-500/20' :
                            b.status === 'IN_USE' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            b.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>
                            {b.status === 'booked' || b.status === 'APPROVED' ? 'BOOKED' : b.status === 'IN_USE' ? 'CHECKED IN' : b.status === 'COMPLETED' ? 'CHECKED OUT' : b.status.toUpperCase()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-brand-muted text-xs">
                        No amenity bookings scheduled for today.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Choose estate detailed view */
            <div className="text-center py-20 text-brand-body space-y-3 flex flex-col items-center justify-center h-full dark:bg-[#0f172a]">
              <Building2 className="w-16 h-16 text-brand-muted mx-auto border border-dashed border-brand-border rounded-3xl p-3.5 bg-brand-alternate" />
              <div>
                <h5 className="font-extrabold text-brand-title text-xs">No property selected.</h5>
                <p className="text-[11px] text-brand-muted max-w-xs mt-1 leading-normal font-light">
                  Select a property from the list to view its details, maintenance summary, and amenity schedule.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settle Property Modal Dialog with character count and warning indicators */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-brand-surface dark:bg-brand-surface rounded-3xl border border-brand-border max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-primary-teal" />
                <h3 className="text-base sm:text-lg font-extrabold text-brand-title">{editingProperty ? 'Edit Property' : 'Add Property'}</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-1 hover:bg-brand-alternate text-brand-muted hover:text-brand-title rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning block */}
            {formError && (
              <div className="bg-rose-50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-500/20 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-rose-800 dark:text-rose-400 animate-in fade-in">
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="font-sans">
                  <span className="font-bold block">Portfolio Audit Blocked</span>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 font-sans">
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-brand-body uppercase block tracking-wider">Property Estate Name</label>
                  <span className={`text-[10px] font-mono ${name.length < 5 ? 'text-amber-500' : 'text-brand-muted'}`}>
                    {name.length} chars (min 5)
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Skyline Heights Complex"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.length >= 5) setFormError(null);
                  }}
                  className={`w-full px-4 py-2.5 bg-brand-alternate border rounded-xl text-sm focus:outline-none focus:bg-brand-surface focus:ring-2 text-brand-title transition-all ${
                    formTouched && name.length < 5 
                      ? 'border-rose-500 focus:ring-rose-200 dark:border-rose-500' 
                      : 'border-brand-border focus:border-primary-teal focus:ring-primary-teal/15 dark:focus:border-primary-teal'
                  }`}
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-brand-body uppercase block tracking-wider">Complex Location Address</label>
                  <span className={`text-[10px] font-mono ${address.length < 10 ? 'text-amber-500' : 'text-brand-muted'}`}>
                    {address.length} chars (min 10)
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 1048 Peachtree Street, Suite 10"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (e.target.value.length >= 10) setFormError(null);
                  }}
                  className={`w-full px-4 py-2.5 bg-brand-alternate border rounded-xl text-sm focus:outline-none focus:bg-brand-surface focus:ring-2 text-brand-title transition-all ${
                    formTouched && address.length < 10 
                      ? 'border-rose-500 focus:ring-rose-200 dark:border-rose-500' 
                      : 'border-brand-border focus:border-primary-teal focus:ring-primary-teal/15 dark:focus:border-primary-teal'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase block tracking-wider">Estate Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm focus:outline-none text-brand-title min-h-[44px]"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Retail">Retail Store</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase block tracking-wider">Scale Units</label>
                  <input
                    type="number"
                    value={units}
                    onChange={(e) => {
                      setUnits(Number(e.target.value));
                      if (Number(e.target.value) > 0) setFormError(null);
                    }}
                    className="w-full px-4 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-teal/15 text-brand-title"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-body uppercase block tracking-wider">Property Photo</label>
                <div className="flex items-center space-x-4 p-3 bg-brand-alternate border border-brand-border rounded-xl">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Property Preview" 
                      className="w-16 h-16 rounded-xl object-cover border border-brand-border shadow-xs" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-brand-border bg-brand-alternate/50 flex items-center justify-center text-brand-muted text-xs select-none">
                      No Photo
                    </div>
                  )}
                  <div className="flex flex-col space-y-1.5">
                    <button
                      type="button"
                      onClick={() => document.getElementById('property-file-input')?.click()}
                      className="px-3 py-1.5 bg-brand-surface hover:bg-brand-alternate text-brand-title border border-brand-border rounded-lg text-xs font-semibold cursor-pointer focus:outline-none transition-colors"
                    >
                      Choose Local File
                    </button>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-[10px] text-left text-rose-500 hover:text-rose-600 font-semibold underline cursor-pointer focus:outline-none bg-transparent border-0 p-0"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  id="property-file-input"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64String = await resizeAndCompressImage(file);
                        setImageUrl(base64String);
                      } catch (err: any) {
                        alert(err.message || 'Failed to process property photo.');
                      }
                    }
                  }}
                  className="hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-brand-alternate text-brand-body hover:bg-brand-surface rounded-xl font-semibold text-xs transition-colors min-h-[40px]"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                  className="px-6 py-2.5 bg-primary-teal hover:bg-primary-teal-hover focus:ring-2 focus:ring-primary-teal text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createPropertyMutation.isPending || updatePropertyMutation.isPending
                    ? 'Saving...'
                    : editingProperty ? 'Save Changes' : 'Add Property'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
