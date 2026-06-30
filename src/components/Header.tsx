import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  ChevronDown, 
  LogOut, 
  ShieldAlert, 
  User, 
  CheckCircle,
  HelpCircle,
  X,
  Building,
  Wrench,
  Calendar,
  Sparkles,
  Trash2,
  Check,
  History,
  Info,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { User as UserType, Property, MaintenanceRequest, BookingSlot, AppNotification } from '../types.ts';

interface HeaderProps {
  currentUser: UserType;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  properties?: Property[];
  maintenance?: MaintenanceRequest[];
  bookings?: BookingSlot[];
  notifications?: AppNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearNotifications?: () => void;
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

export default function Header({ 
  currentUser, 
  onNavigate, 
  onLogout,
  properties = [],
  maintenance = [],
  bookings = [],
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
  theme = 'system',
  onThemeChange
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'boiler',
    'Heights',
    'pool',
    'leak'
  ]);
  const [searchFilter, setSearchFilter] = useState<'all' | 'properties' | 'tickets' | 'amenities'>('all');

  // Notification category filter
  const [notifCategoryFilter, setNotifCategoryFilter] = useState<string>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside mouse click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setShowQuickAdd(false);
        setShowThemeMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter Notification Items
  const filteredNotifications = notifications.filter(n => {
    if (notifCategoryFilter === 'all') return true;
    return n.category === notifCategoryFilter;
  });

  // Unread Count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Search filter query results
  const matchingProperties = properties.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingTickets = maintenance.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.unitNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingBookings = bookings.filter(b => 
    b.amenityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearchResults = 
    matchingProperties.length > 0 || 
    matchingTickets.length > 0 || 
    matchingBookings.length > 0;

  const handleSelectRecentSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePushRecentSearch = (text: string) => {
    if (!text.trim()) return;
    if (recentSearches.includes(text)) return;
    setRecentSearches(prev => [text, ...prev.slice(0, 3)]);
  };

  return (
    <header className="h-16 border-b border-brand-border bg-brand-surface dark:bg-[#111827] text-brand-body px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0 select-none transition-colors duration-200">
      
      {/* 44px accessible search wrapper */}
      <div ref={searchRef} className="flex-1 max-w-md hidden sm:block relative">
        <div className="relative flex items-center min-h-[44px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            placeholder="Search: tickets, keys, amenities, properties..."
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePushRecentSearch(searchQuery);
              }
            }}
            className="w-full pl-9 pr-8 py-2 bg-brand-alternate hover:bg-brand-hover border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-brand-surface focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/20 text-brand-title transition-all font-sans font-medium"
            id="global-search-bar"
            aria-label="Search dashboard properties, dispatches, and amenities"
          />
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Clear search input query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Popup Dropdown (Instant Feedback) */}
        {isSearchFocused && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 dark:bg-[#1E293B] dark:border-[#334155] rounded-2xl shadow-xl z-50 text-xs overflow-hidden max-h-[450px] flex flex-col">
            
            {/* Header controls inside search */}
            <div className="p-3 bg-slate-50 border-b border-slate-150 dark:bg-[#111827] dark:border-[#334155] flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-[#CBD5E1] uppercase tracking-widest block font-sans">SLA SEARCH COMMAND</span>
              <div className="flex gap-1">
                {['all', 'properties', 'tickets', 'amenities'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSearchFilter(f as any)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${searchFilter === f ? 'bg-primary-teal text-white' : 'bg-white text-slate-600 dark:bg-[#1E293B] dark:text-[#CBD5E1] dark:border-[#334155] hover:bg-slate-150 dark:hover:bg-[#334155] border border-slate-200'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Content list */}
            <div className="overflow-y-auto p-2 space-y-3 max-h-[350px]">
              
              {/* Show Recent Searches initially if searchQuery is empty */}
              {!searchQuery && (
                <div className="p-1.5 space-y-1.5">
                  <div className="flex items-center space-x-1 text-slate-400 dark:text-[#94A3B8]">
                    <History className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recentSearches.map((term, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => handleSelectRecentSearch(term)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#111827] dark:hover:bg-[#334155] dark:text-[#CBD5E1] rounded-lg text-[11px] font-medium transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Estate Listings */}
              {searchQuery && (searchFilter === 'all' || searchFilter === 'properties') && (
                <div className="space-y-1">
                  <div className="px-2 text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#94A3B8] font-bold block">Properties ({matchingProperties.length})</div>
                  {matchingProperties.length > 0 ? (
                    matchingProperties.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { onNavigate('properties'); setIsSearchFocused(false); }}
                        className="w-full text-left p-2 hover:bg-teal-50/55 dark:hover:bg-[#111827] rounded-xl transition-all flex items-center space-x-2.5"
                      >
                        <Building className="w-3.5 h-3.5 text-primary-teal shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-slate-900 dark:text-[#F8FAFC] block truncate">{p.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-[#CBD5E1] block truncate">{p.address} | {p.type} occupancy: {p.occupancy}%</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    searchFilter === 'properties' && (
                      <div className="p-2 text-slate-400 dark:text-[#94A3B8] text-center font-sans">No matching estate complexes.</div>
                    )
                  )}
                </div>
              )}

              {/* Matching Incident Tickets */}
              {searchQuery && (searchFilter === 'all' || searchFilter === 'tickets') && (
                <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-[#334155] first:border-none">
                  <div className="px-2 text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#94A3B8] font-bold block">Maintenance tickets ({matchingTickets.length})</div>
                  {matchingTickets.length > 0 ? (
                    matchingTickets.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { onNavigate('maintenance'); setIsSearchFocused(false); }}
                        className="w-full text-left p-2 hover:bg-amber-50/55 dark:hover:bg-[#111827] rounded-xl transition-all flex items-center space-x-2.5"
                      >
                        <Wrench className="w-3.5 h-3.5 text-warn-gold shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-slate-900 dark:text-[#F8FAFC] block truncate">{m.title}</span>
                          <span className="text-[10px] text-slate-500 dark:text-[#CBD5E1] block truncate">Unit {m.unitNumber} | PRIORITY: {m.priority} • Status: {m.status}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    searchFilter === 'tickets' && (
                      <div className="p-2 text-slate-400 dark:text-[#94A3B8] text-center font-sans">No matching service dispatches.</div>
                    )
                  )}
                </div>
              )}

              {/* Matching Amenity Slots */}
              {searchQuery && (searchFilter === 'all' || searchFilter === 'amenities') && (
                <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-[#334155] first:border-none">
                  <div className="px-2 text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#94A3B8] font-bold block">Facility Reservations ({matchingBookings.length})</div>
                  {matchingBookings.length > 0 ? (
                    matchingBookings.map(b => (
                      <button
                        key={b.id}
                        onClick={() => { onNavigate('amenities'); setIsSearchFocused(false); }}
                        className="w-full text-left p-2 hover:bg-emerald-50/55 dark:hover:bg-[#111827] rounded-xl transition-all flex items-center space-x-2.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-slate-900 dark:text-[#F8FAFC] block truncate">{b.amenityName} ({b.user})</span>
                          <span className="text-[10px] text-slate-500 dark:text-[#CBD5E1] block truncate">{b.start} - {b.end} status: {b.status}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    searchFilter === 'amenities' && (
                      <div className="p-2 text-slate-400 dark:text-[#94A3B8] text-center font-sans">No matching lounge bookings.</div>
                    )
                  )}
                </div>
              )}

              {/* EMPTY SEARCH STATE (No matches across any categories) */}
              {searchQuery && !hasSearchResults && (
                <div className="p-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-slate-50 border border-dashed border-slate-200 dark:bg-[#111827] dark:border-[#334155] rounded-xl flex items-center justify-center mx-auto text-slate-400 dark:text-[#94A3B8]">
                    🏢
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-[#F8FAFC] text-xs">No holdings or tickets matched</h5>
                  <p className="text-[10px] text-slate-500 dark:text-[#CBD5E1] max-w-xs mx-auto leading-normal">
                    We couldn't locate estate details for "{searchQuery}". Double-check spelling or restore original query filters.
                  </p>
                  <button 
                    onClick={handleClearSearch}
                    className="text-[10px] font-bold text-primary-teal hover:underline leading-none dark:text-[#14B8A6]"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

            </div>
            
            {/* Quick help footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 dark:bg-[#111827] dark:border-[#334155] text-center text-[10px] text-slate-400 dark:text-[#94A3B8] font-mono">
              Press Enter to remember search. Focus outside or hit clear to cancel.
            </div>

          </div>
        )}
      </div>

      <div className="sm:hidden leading-none select-none">
        <span className="font-extrabold text-sm text-slate-900 tracking-tight">PropertyFlow</span>
      </div>

      {/* Trailing Control Deck */}
      <div className="flex items-center space-x-3.5 ml-auto" ref={containerRef}>
        
        {/* Actions Button Menu */}
        <div className="relative">
          <button 
            id="header-actions-menu-btn"
            onClick={() => {
              setShowQuickAdd(!showQuickAdd);
              setShowNotifications(false);
            }}
            className="bg-primary-teal hover:bg-primary-teal-hover text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer leading-none min-h-[44px] focus:ring-2 focus:ring-primary-teal/30 focus:outline-none"
            aria-expanded={showQuickAdd}
            aria-haspopup="menu"
            aria-label="Strategic dispatch menu"
          >
            <Plus className="w-4 h-4 text-accent-teal" />
            <span className="hidden sm:inline">Actions Menu</span>
            <ChevronDown className="w-3 h-3 text-accent-teal" />
          </button>

          {showQuickAdd && (
            <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-200 dark:bg-[#1E293B] dark:border-[#334155] rounded-xl shadow-xl py-2 z-50 text-xs text-slate-700 dark:text-[#CBD5E1] animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-1.5 border-b border-slate-100 bg-slate-50/50 dark:border-[#334155] dark:bg-[#111827] mb-1 font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider text-[9px]">
                Portfolio Operations Desk
              </div>
              {currentUser.role !== 'Tenant' && (
                <button 
                  onClick={() => { setShowQuickAdd(false); onNavigate('properties'); }}
                  className="w-full px-4 py-2 hover:bg-teal-50 dark:hover:bg-[#111827] text-left hover:text-primary-teal dark:hover:text-[#14B8A6] flex items-center space-x-2 font-medium"
                >
                  <span>🏢</span> <span>Inspect Properties Index</span>
                </button>
              )}
              <button 
                onClick={() => { setShowQuickAdd(false); onNavigate('maintenance'); }}
                className="w-full px-4 py-2 hover:bg-teal-50 dark:hover:bg-[#111827] text-left hover:text-primary-teal dark:hover:text-[#14B8A6] flex items-center space-x-2 font-medium"
              >
                <span>🛠️</span> <span>Dispatch Repair Order</span>
              </button>
              <button 
                onClick={() => { setShowQuickAdd(false); onNavigate('amenities'); }}
                className="w-full px-4 py-2 hover:bg-teal-50 dark:hover:bg-[#111827] text-left hover:text-primary-teal dark:hover:text-[#14B8A6] flex items-center space-x-2 font-medium"
              >
                <span>📅</span> <span>Reserve Shared Amenity Slot</span>
              </button>
              {currentUser.role !== 'Tenant' && (
                <button 
                  onClick={() => { setShowQuickAdd(false); onNavigate('analytics'); }}
                  className="w-full px-4 py-2 hover:bg-teal-50 dark:hover:bg-[#111827] text-left hover:text-primary-teal dark:hover:text-[#14B8A6] border-t border-slate-100 dark:border-[#334155]/60 mt-1 flex items-center space-x-2 font-medium"
                >
                  <span>📈</span> <span>Generate Platform Charts</span>
                </button>
              )}
            </div>
          )}
        </div>



        {/* Dynamic Alarm Bell Button Component with Live Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickAdd(false);
              setShowThemeMenu(false);
            }}
            className="p-2.5 bg-brand-alternate hover:bg-brand-hover text-brand-body rounded-xl transition-all cursor-pointer relative min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-slate-300 focus:outline-none"
            aria-label="System notifications and safety dispatcher feed"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 dark:bg-[#1E293B] dark:border-[#334155] rounded-2xl shadow-xl z-50 text-xs overflow-hidden animate-in fade-in slide-in-from-top-1 max-h-[500px] flex flex-col">
              
              {/* Dropdown Header controls */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-[#334155] bg-slate-50 flex justify-between items-center bg-slate-50/80 dark:bg-[#111827]">
                <div className="leading-none">
                  <span className="font-extrabold text-slate-900 block font-sans dark:text-[#F8FAFC]">Notifications Feed</span>
                  <span className="text-[9.5px] text-slate-400 font-mono mt-0.5 block dark:text-[#94A3B8]">{unreadCount} pending logs</span>
                </div>
                
                <div className="flex space-x-1.5 select-none text-[10px]">
                  {unreadCount > 0 && onMarkAllAsRead && (
                    <button 
                      onClick={onMarkAllAsRead}
                      className="text-primary-teal hover:underline font-bold dark:text-[#14B8A6]"
                    >
                      Mark All Read
                    </button>
                  )}
                  {notifications.length > 0 && onClearNotifications && (
                    <button 
                      onClick={onClearNotifications}
                      className="text-rose-500 hover:underline font-bold flex items-center space-x-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Category selector filters */}
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-[#334155] flex items-center gap-1 overflow-x-auto bg-slate-50/50 dark:bg-[#111827]">
                {['all', 'maintenance', 'booking', 'sla', 'property'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNotifCategoryFilter(cat)}
                    className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-lg border transition-all ${
                      notifCategoryFilter === cat 
                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-[#1E293B] dark:border-[#14B8A6]' 
                        : 'bg-white border-slate-150 text-slate-500 dark:bg-[#111827] dark:border-[#334155] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Segmented Notifications by group */}
              <div className="overflow-y-auto max-h-[300px] divide-y divide-slate-100 dark:divide-[#334155]">
                {filteredNotifications.length > 0 ? (
                  ['Today', 'Yesterday', 'Older'].map((group) => {
                    const groupItems = filteredNotifications.filter(n => n.dateGroup === group);
                    if (groupItems.length === 0) return null;
                    
                    return (
                      <div key={group} className="bg-white dark:bg-[#1E293B]">
                        {/* Group Header */}
                        <div className="px-3.5 py-1.5 bg-slate-50/40 dark:bg-[#111827] text-[9px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase tracking-widest block font-sans border-b border-slate-100 dark:border-[#334155]">
                          {group}
                        </div>
                        
                        {groupItems.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              if (onMarkAsRead) {
                                onMarkAsRead(n.id);
                              }
                              // Navigate contextually
                              if (n.category === 'maintenance') onNavigate('maintenance');
                              if (n.category === 'booking') onNavigate('amenities');
                              if (n.category === 'property') onNavigate('properties');
                            }}
                            className={`p-3.5 hover:bg-slate-50 dark:hover:bg-[#111827] transition-colors flex items-start gap-3 cursor-pointer ${
                              !n.read ? 'bg-teal-50/15 dark:bg-[#14B8A6]/5' : ''
                            }`}
                          >
                            {/* Color indicators depending on priority */}
                            <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                              n.priority === 'critical' ? 'bg-rose-500' :
                              n.priority === 'high' ? 'bg-amber-500' :
                              n.priority === 'medium' ? 'bg-blue-500' :
                              'bg-slate-300 dark:bg-slate-600'
                            }`} />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-extrabold text-slate-950 dark:text-[#F8FAFC] block truncate pr-2 text-xs">{n.title}</span>
                                {!n.read && (
                                  <span className="w-1.5 h-1.5 bg-primary-teal rounded-full animate-ping shrink-0" />
                                )}
                              </div>
                              <p className="text-slate-500 dark:text-[#94A3B8] text-[10.5px] mt-0.5 leading-normal text-left">{n.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-mono block">{n.time}</span>
                                {!n.read && onMarkAsRead && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onMarkAsRead(n.id);
                                    }}
                                    className="p-1 text-slate-400 hover:text-primary-teal rounded flex items-center space-x-1 dark:hover:bg-[#111827]"
                                    aria-label="Mark single notification read"
                                  >
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-[9.5px] font-sans font-bold text-slate-400 dark:text-[#94A3B8] dark:hover:text-[#14B8A6]">read</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })
                ) : (
                  /* NO NOTIFICATIONS EMPTY STATE (subtle real estate themed visual) */
                  <div className="py-12 px-6 text-center space-y-3 dark:bg-[#1E293B]">
                    <div className="w-16 h-16 bg-slate-50 border border-dashed border-slate-250 border-slate-200 dark:bg-[#111827] dark:border-[#334155] rounded-full flex items-center justify-center mx-auto text-3xl font-mono text-slate-300 dark:text-slate-600 select-none">
                      🗝️
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-[#F8FAFC] text-xs">Operations clear & optimal</h4>
                      <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] max-w-[210px] mx-auto mt-1 leading-normal font-light">
                        All physical occupancy and asset monitors are clean. Active safety loops are normal.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Inspect system monitor bar */}
              <div className="p-2 border-t border-slate-100 dark:border-[#334155] text-center bg-slate-50 dark:bg-[#111827]">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('monitor');
                  }}
                  className="text-[10.5px] text-primary-teal font-extrabold hover:text-primary-teal/90 font-sans cursor-pointer flex items-center justify-center space-x-1 mx-auto leading-none dark:text-[#14B8A6]"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Inspect live diagnostics timeline</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info with accessible touch targets */}
        <div 
          onClick={() => onNavigate('profile')}
          className="flex items-center space-x-2.5 pl-2.5 border-l border-slate-200 dark:border-[#334155] cursor-pointer min-h-[44px]"
          aria-label="Manage user profile details"
          role="link"
        >
          {currentUser.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-8.5 h-8.5 rounded-full object-cover ring-2 ring-slate-100/95 dark:ring-[#334155]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8.5 h-8.5 rounded-full ring-2 ring-slate-100/95 dark:ring-[#334155] bg-gradient-to-br from-primary-teal/30 to-primary-teal/10 text-primary-teal flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2)}
            </div>
          )}
          <span className="text-xs font-bold text-slate-700 dark:text-[#CBD5E1] hidden lg:inline max-w-[100px] truncate leading-none">{currentUser.name}</span>
        </div>

      </div>
    </header>
  );
}
