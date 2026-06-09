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
  ArrowRight
} from 'lucide-react';
import { Property, User as UserType } from '../types.ts';
import { PropertyCard, EmptyState } from './DesignSystem.tsx';

interface PropertyViewProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  currentUser: UserType;
}

export default function PropertyView({
  properties,
  setProperties,
  currentUser
}: PropertyViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('All');

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'Residential' | 'Commercial' | 'Retail'>('Residential');
  const [units, setUnits] = useState(60);
  const [occupancy, setOccupancy] = useState(95);

  // Form error states
  const [formTouched, setFormTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Dynamic notification
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  // Simulated Boot Loader Cycle
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    if (!name.trim()) {
      setFormError('Portfolio error: Estate name must be populated.');
      return;
    }
    if (name.length < 5) {
      setFormError('Portfolio error: Estate name must be at least 5 character length.');
      return;
    }
    if (!address.trim() || address.length < 10) {
      setFormError('Portfolio error: Please insert a descriptive physical address (min 10 chars).');
      return;
    }
    if (units <= 0 || units > 2000) {
      setFormError('Portfolio bounds error: Scale units must range between 1 and 2,000 units.');
      return;
    }
    if (occupancy < 0 || occupancy > 100) {
      setFormError('Portfolio error: Active occupancy percentage must stand between 0 and 100%.');
      return;
    }

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      name,
      address,
      type,
      units,
      occupancy,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80',
      manager: currentUser.name,
      amenities: ['E-Charging Stations', 'Touchless lockers', 'Garden Lounge Access']
    };

    setProperties([...properties, newProperty]);
    setSelectedProperty(newProperty);
    setFormTouched(false);
    setFormError(null);
    setShowAddModal(false);

    setName('');
    setAddress('');
    setType('Residential');
    setUnits(60);
    setOccupancy(95);

    // Dynamic success flag instead of native alert
    setActionNotification(`Portfolio asset "${newProperty.name}" registered successfully into operations registry.`);
    setTimeout(() => setActionNotification(null), 5000);
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Corporate Holdings Portfolio Index</h1>
          <p className="text-sm text-brand-body font-light mt-0.5">Control managed real estate unit occupancy arrays and inspect staff allocations.</p>
        </div>

        {currentUser.role !== 'Tenant' && (
          <button
            onClick={() => {
              setFormError(null);
              setFormTouched(false);
              setShowAddModal(true);
            }}
            className="bg-primary-teal hover:bg-primary-teal-hover focus:ring-2 focus:ring-primary-teal text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 self-start sm:self-auto cursor-pointer min-h-[44px]"
            aria-label="Add a new property complex to operations"
          >
            <Plus className="w-4 h-4 text-accent-teal font-extrabold" />
            <span>Settle New Property</span>
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
            placeholder="Search holding name or physical street location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-brand-surface focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/15 transition-all text-brand-title"
            aria-label="Search properties list"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-brand-body uppercase tracking-wider font-sans whitespace-nowrap">Asset Category</span>
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
              description="No estate complexes match your description criteria. Clear filters to resume original view."
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

                  <div className="bg-brand-alternate border border-brand-border rounded-xl p-3.5 flex items-center space-x-3 shrink-0 leading-none">
                    <div className="w-9 h-9 bg-primary-teal/10 text-primary-teal rounded-lg flex items-center justify-center font-bold text-center">
                      🏘️
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted font-mono block uppercase">ASSIGNED MANAGER</span>
                      <span className="text-xs font-bold text-brand-title">{selectedProperty.manager}</span>
                    </div>
                  </div>
                </div>

                {/* Occupancy and Scale Metrics with visual progress bar */}
                <div className="grid grid-cols-2 gap-4 border-y border-brand-border py-5">
                  <div className="space-y-1">
                    <span className="text-xs text-brand-body font-light font-sans block">Total Active Units</span>
                    <div className="text-2xl font-extrabold text-brand-title">{selectedProperty.units} Luxury Units</div>
                    <span className="text-[10px] text-brand-muted block font-mono">100% SLA Registered</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-brand-body font-light font-sans block">Occupancy Rate</span>
                    <div className="text-2xl font-extrabold text-emerald-600 block">{selectedProperty.occupancy}% SLA</div>
                    <div className="h-1.5 w-full bg-brand-alternate rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedProperty.occupancy}%` }}></div>
                    </div>
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
                                {/* SLA Operational Unit Status Grid */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-brand-muted uppercase tracking-widest font-sans border-t border-brand-border pt-4 pb-1">
                    <span>UNIT STATUS GRID & LAYOUT INDEX</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                      <span>●</span> <span>100% HEALTHY</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {[
                      { num: 'U101', status: 'Occupied' },
                      { num: 'U102', status: 'Occupied' },
                      { num: 'U103', status: 'Vacant' },
                      { num: 'U201', status: 'Occupied' },
                      { num: 'U202', status: 'Occupied' },
                      { num: 'U203', status: 'Occupied' },
                      { num: 'U301', status: 'Occupied' },
                      { num: 'U302', status: 'Vacant' },
                      { num: 'U303', status: 'Occupied' },
                      { num: 'U401', status: 'Occupied' },
                      { num: 'U402', status: 'Occupied' },
                      { num: 'U403', status: 'Occupied' }
                    ].map((unit, uIdx) => (
                      <div 
                        key={uIdx} 
                        className={`p-2.5 rounded-xl border text-center font-mono text-[10px] uppercase font-bold select-none leading-none flex flex-col justify-between h-11 transition-all ${
                          unit.status === 'Occupied'
                            ? 'bg-brand-alternate text-brand-title border-brand-border shadow-2xs hover:border-slate-500'
                            : 'bg-teal-500/10 text-primary-teal dark:text-[#14B8A6] border-teal-500/20 font-extrabold shadow-xs hover:border-teal-300'
                        }`}
                      >
                        <span className="text-[10px] block font-mono">{unit.num}</span>
                        <span className={`text-[8px] font-sans font-bold block leading-none ${unit.status === 'Occupied' ? 'text-brand-muted font-normal' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {unit.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-brand-body font-light font-sans leading-relaxed pt-1.5 flex items-start space-x-1 bg-brand-alternate p-2.5 rounded-lg border border-brand-border">
                    <Info className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                    <span>Compliance Checked: Unit configuration grid represents active tenant logs. Inactive keys are recycled automatically.</span>
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* Choose estate detailed view */
            <div className="text-center py-20 text-brand-body space-y-3 flex flex-col items-center justify-center h-full dark:bg-[#0f172a]">
              <Building2 className="w-16 h-16 text-brand-muted mx-auto border border-dashed border-brand-border rounded-3xl p-3.5 bg-brand-alternate" />
              <div>
                <h5 className="font-extrabold text-brand-title text-xs">No property complex chosen</h5>
                <p className="text-[11px] text-brand-muted max-w-xs mt-1 leading-normal font-light">
                  Select an estate holding from the left index panel to check unit occupancies and manager credentials.
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
                <h3 className="text-base sm:text-lg font-extrabold text-brand-title">Settle Property into Portfolio</h3>
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

              <div className="grid grid-cols-3 gap-4">
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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase block tracking-wider">Occupancy %</label>
                  <input
                    type="number"
                    value={occupancy}
                    onChange={(e) => {
                      setOccupancy(Number(e.target.value));
                      if (Number(e.target.value) >= 0 && Number(e.target.value) <= 100) setFormError(null);
                    }}
                    className="w-full px-4 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-teal/15 text-brand-title"
                    required
                  />
                </div>
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
                  className="px-6 py-2.5 bg-primary-teal hover:bg-primary-teal-hover focus:ring-2 focus:ring-primary-teal text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all"
                >
                  Settle Property Complex
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
