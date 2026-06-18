import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Clock, 
  Plus, 
  X, 
  UserCheck, 
  Check, 
  AlertTriangle,
  FileText,
  User,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';
import { User as UserType, Property, MaintenanceRequest, MaintenancePriority, MaintenanceStatus } from '../types.ts';
import { EmptyState, StatusBadge } from './DesignSystem.tsx';

interface MaintenanceViewProps {
  currentUser: UserType;
  properties: Property[];
  maintenance: MaintenanceRequest[];
  onCreateTicket: (ticket: any) => void;
  onUpdateTicketStatus: (id: string, status: MaintenanceStatus, assignedTo?: string) => void;
  staffUsers: UserType[];
}

export default function MaintenanceView({
  currentUser,
  properties,
  maintenance,
  onCreateTicket,
  onUpdateTicketStatus,
  staffUsers
}: MaintenanceViewProps) {
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Search/Filter local states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [recentKeywords] = useState(['Boiler', 'HVAC', 'Drywall', 'Ballast']);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const tenantProperty = currentUser.role === 'Tenant' && currentUser.propertyId ? currentUser.propertyId : '';
  const [propertyId, setPropertyId] = useState(tenantProperty || properties[0]?.id || '');
  const [unitNumber, setUnitNumber] = useState('');
  const [priority, setPriority] = useState<MaintenancePriority>('Medium');
  const [category, setCategory] = useState('Plumbing');
  
  // Form Interaction & Validation States
  const [formTouched, setFormTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Simulated Load cycle to expose skeleton loaders
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Filter Maintenance
  const filteredMaintenance = maintenance.filter(req => {
    // Tenant filter: only show requests created by the active tenant
    if (currentUser.role === 'Tenant' && req.createdBy !== currentUser.name) {
      return false;
    }

    const matchesSearch = 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = selectedPriorityFilter === 'All' || req.priority === selectedPriorityFilter;
    const matchesStatus = selectedStatusFilter === 'All' || req.status === selectedStatusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Synchronize first available request if selected remains out of scope
  useEffect(() => {
    if (!isLoading && filteredMaintenance.length > 0 && !selectedRequest) {
      setSelectedRequest(filteredMaintenance[0]);
    } else if (filteredMaintenance.length === 0) {
      setSelectedRequest(null);
    }
  }, [isLoading, filteredMaintenance, selectedRequest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    // Strict validation
    if (!title.trim()) {
      setFormError('SLA validation failure: Please stipulate a descriptive title for field technicians.');
      return;
    }
    if (title.length < 8) {
      setFormError('SLA validation failure: Incident title must be at least 8 characters for diagnostic validation.');
      return;
    }
    if (!unitNumber.trim()) {
      setFormError('Operations validation failure: Please input the specific property unit number.');
      return;
    }
    if (description.length < 15) {
      setFormError('Verification check failed: Full scope description must exceed 15 characters to avoid technician routing delays.');
      return;
    }

    // Success dispatch
    onCreateTicket({
      title,
      description,
      propertyId,
      unitNumber,
      priority,
      category
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setUnitNumber('');
    setPriority('Medium');
    setCategory('Plumbing');
    setFormTouched(false);
    setFormError(null);
    setShowCreateModal(false);
  };

  const handleStatusUpdate = (status: MaintenanceStatus) => {
    if (!selectedRequest) return;
    const assignedUser = staffUsers[0]?.name || 'Unassigned Staff';
    onUpdateTicketStatus(selectedRequest.id, status, assignedUser);
    
    // Refresh selected request state inline
    setSelectedRequest(prev => {
      if (prev) {
        return {
          ...prev,
          status,
          assignedTo: assignedUser
        };
      }
      return null;
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedPriorityFilter('All');
    setSelectedStatusFilter('All');
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header section with last audited timestamp */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#334155] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">Active Repaint & Repair Dispatches</h1>
            <span className="hidden sm:inline bg-[#14B8A6]/10 text-[#14B8A6] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#14B8A6]/20 font-mono tracking-tight">SYSTEM ONLINE</span>
          </div>
          <p className="text-sm text-[#CBD5E1] font-light mt-0.5">Disseminate orders, track response clocks, and verify technician reports under compliance SLAs.</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0 leading-none">
          <div className="hidden lg:block text-right pr-2">
            <span className="text-[10px] font-bold text-[#94A3B8] block uppercase font-mono">Last SLA Audit Check</span>
            <span className="text-xs text-[#CBD5E1] font-medium">Synced 1 min ago</span>
          </div>

          <button
            id="maint-open-create-btn"
            onClick={() => {
              setFormError(null);
              setFormTouched(false);
              setShowCreateModal(true);
            }}
            className="bg-[#14B8A6] hover:bg-[#0F766E] focus:ring-2 focus:ring-[#14B8A6] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer leading-none min-h-[44px]"
            aria-label="File a new maintenance dispatch order"
          >
            <Plus className="w-4 h-4 text-white font-extrabold" />
            <span>New Repair Order</span>
          </button>
        </div>
      </div>

      {/* Advanced Search & Filtering Controls Area */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Text Search input */}
          <div className="flex-1 relative">
            <Search className="w-4.5 h-4.5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search request brief, unit number, or description logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/15 transition-all text-brand-title font-sans placeholder-slate-500"
              aria-label="Search incident reports"
            />
          </div>

          {/* Priority filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-brand-body uppercase tracking-wider font-sans whitespace-nowrap">Priority</span>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs font-medium focus:outline-none focus:border-primary-teal text-brand-body min-h-[38px]"
              aria-label="Filter tickets by priority level"
            >
              <option value="All">All Levels</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider font-sans whitespace-nowrap">Status</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#334155] rounded-xl text-xs font-medium focus:outline-none focus:border-[#14B8A6] text-[#CBD5E1] min-h-[38px]"
              aria-label="Filter tickets by progress status"
            >
              <option value="All">All States</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {(searchQuery || selectedPriorityFilter !== 'All' || selectedStatusFilter !== 'All') && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 text-xs font-bold rounded-xl transition-colors border border-transparent hover:border-rose-500/20 whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Quick Keyword Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-brand-body font-sans pt-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-brand-muted">Popular keywords:</span>
          {recentKeywords.map((kw, kwIdx) => (
            <button
              key={kwIdx}
              onClick={() => setSearchQuery(kw)}
              className="px-2.5 py-1 bg-brand-alternate border border-brand-border hover:bg-brand-border text-brand-body rounded-lg font-medium transition-all"
            >
              #{kw}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left is Tickets List, Right is Detail View */}
      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left: Interactive List Column */}
        <div className="space-y-3 lg:col-span-5 max-h-[700px] overflow-y-auto pr-1">
          {isLoading ? (
            /* Card/Table SKELETON LOADERS */
            Array.from({ length: 3 }).map((_, sIdx) => (
              <div 
                key={sIdx} 
                className="p-5 rounded-2xl border border-brand-border bg-brand-surface space-y-3.5 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1 mr-4">
                    <div className="h-3 bg-brand-alternate rounded w-1/3"></div>
                    <div className="h-4.5 bg-brand-alternate rounded w-4/5"></div>
                  </div>
                  <div className="h-5 bg-brand-alternate rounded-full w-14 shrink-0"></div>
                </div>
                <div className="h-2.5 bg-brand-alternate rounded w-11/12 mt-1"></div>
                <div className="flex space-x-2 pt-1.5">
                  <div className="h-4 bg-brand-alternate rounded w-12"></div>
                  <div className="h-4 bg-brand-alternate rounded w-16"></div>
                </div>
              </div>
            ))
          ) : filteredMaintenance.length > 0 ? (
            filteredMaintenance.map((req) => {
              const isSelected = selectedRequest?.id === req.id;
              const propName = properties.find(p => p.id === req.propertyId)?.name || 'Unknown Estate';
              
              return (
                <div
                  key={req.id}
                  id={`maint-ticket-card-${req.id}`}
                  onClick={() => setSelectedRequest(req)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedRequest(req); }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer text-brand-body ${isSelected ? 'bg-brand-alternate dark:bg-[#334155] border-primary-teal ring-2 ring-primary-teal shadow-md' : 'bg-brand-surface border-brand-border hover:border-primary-teal/75 hover:shadow-xs focus:ring-2 focus:ring-primary-teal/50'}`}
                  role="button"
                  aria-selected={isSelected}
                  aria-label={`Dispatch report: ${req.title}, Status: ${req.status}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-muted font-mono block tracking-wider font-semibold uppercase">{propName} • UNIT {req.unitNumber}</span>
                      <h4 className="text-sm font-extrabold text-brand-title line-clamp-1 leading-snug">{req.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 pt-1 leading-none">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                          req.priority === 'Urgent' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-450' :
                          req.priority === 'High' ? 'bg-amber-500/15 text-amber-500' :
                          req.priority === 'Medium' ? 'bg-primary-teal/15 text-primary-teal' :
                          'bg-brand-alternate text-brand-body'
                        }`}>
                          {req.priority.toUpperCase()}
                        </span>
                        <span className="text-[10px] bg-brand-alternate px-2 py-0.5 rounded text-brand-body font-mono uppercase leading-none font-bold">{req.category}</span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                      req.status === 'Pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                      req.status === 'Assigned' ? 'bg-slate-500/15 text-[#CBD5E1] border border-[#334155]' :
                      req.status === 'In Progress' ? 'bg-[#14B8A6]/15 text-[#14B8A6] border border-[#14B8A6]/20' :
                      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-3 p-1.5 border border-dashed border-[#334155] rounded-2xl bg-[#111827]/20">
              <div className="w-12 h-12 bg-[#111827] rounded-xl flex items-center justify-center border border-dashed border-[#334155] mx-auto text-xl">
                📋
              </div>
              <div>
                <h5 className="font-extrabold text-[#F8FAFC] text-xs">No dispatches found</h5>
                <p className="text-[11px] text-[#CBD5E1] max-w-xs mx-auto mt-1 leading-normal font-light">
                  Either no work orders are logged for this category, or your filters matched 0 active tickets.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 px-3 py-1.5 bg-[#14B8A6] text-white rounded-lg text-xs font-semibold hover:bg-[#0F766E] transition-all cursor-pointer"
                >
                  Clear Search Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Technical Details Column */}
        <div className="lg:col-span-7 bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-sm space-y-6 min-h-[500px]">
          {isLoading ? (
            /* Detail skeleton placeholder */
            <div className="space-y-6 animate-pulse p-2">
              <div className="space-y-2">
                <div className="h-3 bg-brand-alternate rounded w-1/4"></div>
                <div className="h-6 bg-brand-alternate rounded w-3/4"></div>
              </div>
              <div className="h-px bg-brand-border w-full my-6"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-brand-alternate rounded-xl"></div>
                <div className="h-10 bg-brand-alternate rounded-xl"></div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-brand-alternate rounded w-1/3"></div>
                <div className="h-24 bg-brand-alternate rounded-xl"></div>
              </div>
              <div className="h-12 bg-brand-alternate rounded-xl"></div>
            </div>
          ) : selectedRequest ? (
            <div className="space-y-6">
              
              {/* Title Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-brand-muted font-mono">
                    <span>REPAIR TICKET #{selectedRequest.id}</span>
                    <span>•</span>
                    <span className="font-sans font-semibold">Priority check: {selectedRequest.priority}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-brand-title leading-snug mt-1">{selectedRequest.title}</h2>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  selectedRequest.status === 'Pending' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20' :
                  selectedRequest.status === 'Assigned' ? 'bg-slate-500/15 text-brand-body border border-brand-border' :
                  selectedRequest.status === 'In Progress' ? 'bg-primary-teal/15 text-primary-teal border border-primary-teal/20' :
                  'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {selectedRequest.status.toUpperCase()}
                </span>
              </div>

              {/* Box: Assigned Personnel & Author */}
              <div className="grid grid-cols-2 gap-4 border-y border-brand-border py-4.5">
                <div>
                  <span className="text-[10px] font-bold text-brand-muted uppercase block tracking-wider font-sans">Submitting Tenant</span>
                  <div className="flex items-center space-x-2 mt-1.5 leading-none">
                    <div className="w-7 h-7 bg-primary-teal/20 text-primary-teal dark:text-secondary-teal rounded-full flex items-center justify-center text-xs font-bold font-sans select-none">
                      {selectedRequest.createdBy.charAt(0)}
                    </div>
                    <span className="text-xs font-extrabold text-brand-title truncate">{selectedRequest.createdBy}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-brand-muted uppercase block tracking-wider font-sans">Tech Handled By</span>
                  <div className="flex items-center space-x-2 mt-1.5 leading-none">
                    <div className="w-7 h-7 bg-brand-alternate text-brand-body rounded-full flex items-center justify-center text-xs font-bold font-mono">
                      🛠️
                    </div>
                    <span className="text-xs font-semibold text-brand-title truncate">
                      {selectedRequest.assignedTo || 'Unassigned Crew Pool'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-brand-muted uppercase tracking-widest block font-sans">Incident Logs & Directive Description</span>
                <div className="p-4 bg-brand-alternate/40 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-body leading-relaxed font-light">
                  {selectedRequest.description}
                </div>
              </div>

              {/* Incident Attachments Simulation */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-brand-muted uppercase tracking-widest block font-sans">SLA INCIDENT ATTACHMENTS</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-brand-border hover:border-primary-teal rounded-xl p-3 flex items-center justify-between transition-all bg-brand-alternate/30 cursor-pointer">
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className="w-8 h-8 bg-teal-500/10 text-primary-teal dark:text-secondary-teal rounded-lg flex items-center justify-center shrink-0 text-sm">
                        📄
                      </div>
                      <div className="text-left font-sans truncate">
                        <span className="text-xs font-bold text-brand-title block truncate">SLA_Audit_Diagnostic.pdf</span>
                        <span className="text-[10px] text-brand-muted block">Tech spec sheet ready</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-brand-border hover:border-primary-teal rounded-xl p-3 flex items-center justify-between transition-all bg-brand-alternate/30 cursor-pointer">
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center shrink-0 text-sm">
                        🖼️
                      </div>
                      <div className="text-left font-sans truncate">
                        <span className="text-xs font-bold text-brand-title block truncate">Site_Work_Reference.jpg</span>
                        <span className="text-[10px] text-brand-muted block">Field camera state</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Audit Trace */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block font-sans">AUDIT DISPATCH TIMELINE & TRACE</span>
                  <span className="text-[9.5px] text-primary-teal dark:text-secondary-teal font-bold border border-primary-teal/20 bg-primary-teal/10 px-2 py-0.5 rounded uppercase font-mono">Verified compliant</span>
                </div>
                
                <div className="relative pl-6 border-l-2 border-brand-border space-y-4 ml-1">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-brand-surface ring-4 ring-emerald-500/10 text-[10px] text-white flex items-center justify-center font-extrabold pb-0.5">✓</span>
                    <div>
                      <h5 className="text-xs font-extrabold text-brand-title">Incident Reported & System Logged</h5>
                      <span className="text-[10px] text-brand-muted block font-mono mt-0.5">June 8, 2026 at 2:30 PM UTC</span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 border-brand-surface ring-4 transition-all ${
                      ['Assigned', 'In Progress', 'Completed'].includes(selectedRequest.status)
                        ? 'bg-emerald-500 ring-emerald-500/10 text-[10px] text-white flex items-center justify-center font-extrabold pb-0.5'
                        : 'bg-brand-alternate ring-brand-alternate/10 text-brand-muted'
                    }`}>
                      {['Assigned', 'In Progress', 'Completed'].includes(selectedRequest.status) ? '✓' : ''}
                    </span>
                    <div>
                      <h5 className="text-xs font-extrabold text-brand-title">Technician Assured & Displaced</h5>
                      <p className="text-[11px] text-brand-body font-light mt-0.5 animate-in fade-in">
                        {selectedRequest.assignedTo 
                          ? `Automated routing allocation complete: ${selectedRequest.assignedTo}` 
                          : 'Pending technician availability check'}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 border-brand-surface ring-4 transition-all ${
                      ['In Progress', 'Completed'].includes(selectedRequest.status)
                        ? 'bg-emerald-500 ring-emerald-500/10 text-[10px] text-white flex items-center justify-center font-extrabold pb-0.5'
                        : 'bg-brand-alternate ring-brand-alternate/10'
                    }`}>
                      {['In Progress', 'Completed'].includes(selectedRequest.status) ? '✓' : ''}
                    </span>
                    <div>
                      <h5 className="text-xs font-extrabold text-brand-title">Mitigation Commenced on Site</h5>
                      <p className="text-[11px] text-brand-body font-light mt-0.5">Diagnostics verification, power-bypass or safety loop mitigation initiated.</p>
                    </div>
                  </div>

                  <div className="relative font-sans">
                    <span className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 border-brand-surface ring-4 transition-all ${
                      selectedRequest.status === 'Completed'
                        ? 'bg-emerald-500 ring-emerald-500/10 text-[10px] text-white flex items-center justify-center font-extrabold pb-0.5'
                        : 'bg-brand-alternate ring-brand-alternate/10'
                    }`}>
                      {selectedRequest.status === 'Completed' ? '✓' : ''}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-brand-title">Cleared & Resolved</h5>
                      <p className="text-[11px] text-brand-body font-light mt-0.5">Signed-off as safe. Auto-notified to resident portfolio dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status workflow transitions for Landlords / Technicians */}
              {currentUser.role !== 'Tenant' && (
                <div className="bg-primary-teal/10 border border-primary-teal/20 rounded-xl p-4 space-y-3 font-sans">
                  <div className="flex items-center space-x-1.5 text-primary-teal dark:text-secondary-teal font-extrabold uppercase tracking-wider text-[10px]">
                    <UserCheck className="w-4 h-4 shrink-0 text-primary-teal dark:text-secondary-teal" />
                    <span>State Manager Control Console</span>
                  </div>
                  <p className="text-xs text-brand-body font-light leading-relaxed">Modify state indicators for real-time compliance metrics audits and live tenant transparency updates.</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleStatusUpdate('Assigned')}
                      type="button"
                      id="action-set-assigned"
                      className={`px-3 py-1.8 text-[11px] font-bold rounded-lg border transition-all cursor-pointer min-h-[36px] ${selectedRequest.status === 'Assigned' ? 'bg-primary-teal text-white border-primary-teal shadow-xs' : 'bg-brand-alternate text-brand-body border-brand-border hover:bg-brand-surface hover:border-brand-body'}`}
                    >
                      Assign Staff
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('In Progress')}
                      type="button"
                      id="action-set-inprogress"
                      className={`px-3 py-1.8 text-[11px] font-bold rounded-lg border transition-all cursor-pointer min-h-[36px] ${selectedRequest.status === 'In Progress' ? 'bg-primary-teal text-white border-primary-teal shadow-xs' : 'bg-brand-alternate text-brand-body border-brand-border hover:bg-brand-surface hover:border-brand-body'}`}
                    >
                      Start Repair Work
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('Completed')}
                      type="button"
                      id="action-set-completed"
                      className={`px-3 py-1.8 text-[11px] font-bold rounded-lg border transition-all cursor-pointer min-h-[36px] ${selectedRequest.status === 'Completed' ? 'bg-emerald-600 text-white border-brand-border' : 'bg-brand-alternate text-brand-body border-brand-border hover:bg-brand-surface hover:border-brand-body'}`}
                    >
                      Sign-off & Resolve
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Empty detail selected state */
            <div className="text-center py-20 text-brand-muted space-y-3 flex flex-col justify-center items-center h-full">
              <div className="w-16 h-16 bg-brand-alternate rounded-2xl flex items-center justify-center border border-dashed border-brand-border text-2xl">
                🛠️
              </div>
              <div>
                <h5 className="font-extrabold text-brand-title text-xs">No dispatch chosen</h5>
                <p className="text-[11px] text-brand-body max-w-xs mt-1 leading-normal font-light">Select a service ticket on the left pane to analyze diagnostic timeline and assign technical resources.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* --- CREATE MODAL DIALOG WITH EXCELLENT INTEGRAL VALIDATION --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-brand-surface rounded-3xl border border-brand-border max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-primary-teal" />
                <h3 className="text-base sm:text-lg font-extrabold text-brand-title">Dispatch Maintenance Team</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-brand-muted hover:text-brand-title rounded-lg hover:bg-brand-alternate transition-all cursor-pointer"
                aria-label="Close modal dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error notifications block */}
            {formError && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-rose-600 dark:text-rose-400 animate-in fade-in">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="font-sans leading-normal">
                  <span className="font-bold block">Validation Check Unsuccessful</span>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Incident Brief Title</label>
                  <span className="text-[10px] text-brand-muted font-mono font-bold uppercase">SLA requirement</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Toilet tank overflowing and corridor floor damage"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.length >= 8) setFormError(null);
                  }}
                  className={`w-full px-4 py-2.5 bg-brand-alternate border rounded-xl text-sm focus:outline-none focus:ring-2 text-brand-title transition-all font-sans font-medium placeholder-slate-400 dark:placeholder-slate-500 ${formTouched && (!title.trim() || title.length < 8) ? 'border-rose-500 focus:ring-rose-500/20' : 'border-brand-border focus:border-primary-teal focus:ring-primary-teal/15'}`}
                  aria-invalid={formTouched && (!title.trim() || title.length < 8)}
                />
                <p className="text-[10px] text-brand-muted font-light mt-0.5">Stipulate exact room location and symptoms for fast dispatch. Minimum 8 characters.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Property Complex</label>
                  {currentUser.role === 'Tenant' ? (
                    <input
                      type="text"
                      value={properties.find(p => p.id === propertyId)?.name || 'My Property'}
                      className="w-full px-3.5 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm text-brand-muted min-h-[44px] focus:outline-none"
                      disabled
                    />
                  ) : (
                    <select
                      value={propertyId}
                      onChange={(e) => setPropertyId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm focus:outline-none focus:border-primary-teal text-brand-body min-h-[44px]"
                    >
                      {properties.map(p => (
                        <option key={p.id} value={p.id} className="bg-brand-surface text-brand-title">{p.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Unit Number / Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Unit 402, Suite B"
                    value={unitNumber}
                    onChange={(e) => {
                      setUnitNumber(e.target.value);
                      if (e.target.value.trim()) setFormError(null);
                    }}
                    className={`w-full px-4 py-2.5 bg-brand-alternate border rounded-xl text-sm focus:outline-none focus:ring-2 text-brand-title transition-all font-sans font-medium placeholder-slate-400 dark:placeholder-slate-500 ${formTouched && !unitNumber.trim() ? 'border-rose-500 focus:ring-rose-500/20' : 'border-brand-border focus:border-primary-teal focus:ring-primary-teal/15'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">SLA Priority Case</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                    className="w-full px-3.5 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm focus:outline-none focus:border-primary-teal text-brand-body min-h-[44px]"
                  >
                    <option value="Low" className="bg-brand-surface text-brand-title">Low (Under 72 hours)</option>
                    <option value="Medium" className="bg-brand-surface text-brand-title">Medium (Under 48 hours)</option>
                    <option value="High" className="bg-brand-surface text-brand-title">High (Under 24 hours)</option>
                    <option value="Urgent" className="bg-brand-surface text-brand-title">Urgent (Immediate Dispatch)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Category Type</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-sm focus:outline-none focus:border-primary-teal text-brand-body min-h-[44px]"
                  >
                    <option value="Plumbing" className="bg-brand-surface text-brand-title">Plumbing</option>
                    <option value="HVAC" className="bg-brand-surface text-brand-title">HVAC System</option>
                    <option value="Electrical" className="bg-brand-surface text-brand-title">Electrical Circuitry</option>
                    <option value="Structural" className="bg-brand-surface text-brand-title">Structural drywalls</option>
                    <option value="General" className="bg-brand-surface text-brand-title">General Grounds / Paint</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[11px] text-brand-body uppercase tracking-wider block">Scope Description & Directives</label>
                  <span className={`text-[10px] font-mono font-bold ${description.length < 15 ? 'text-amber-500' : 'text-brand-muted'}`}>
                    {description.length} / 500 characters
                  </span>
                </div>
                <textarea
                  rows={3.5}
                  maxLength={500}
                  placeholder="e.g. Resident reported small brown leakage on ceiling drywall below common pipeline joint. Leak spreads slowly, damp patch is cold."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (e.target.value.length >= 15) setFormError(null);
                  }}
                  className={`w-full px-4 py-2.5 bg-brand-alternate border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:bg-brand-surface text-brand-title transition-all font-sans placeholder-slate-400 dark:placeholder-slate-500 ${formTouched && description.length < 15 ? 'border-rose-500 focus:ring-rose-500/20' : 'border-brand-border focus:border-primary-teal focus:ring-primary-teal/15'}`}
                />
                <p className="text-[10px] text-brand-muted font-light mt-0.5">Minimum 15 characters. Char counters prevent word cuts.</p>
              </div>

              {/* Modal Actions Footer with compliant click triggers */}
              <div className="flex justify-end space-x-2 pt-3.5 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-brand-alternate border border-brand-border text-brand-body hover:text-brand-title hover:bg-brand-alternate/85 rounded-xl font-semibold text-xs transition-colors text-[11px] min-h-[40px]"
                >
                  Discard Case
                </button>
                <button
                  type="submit"
                  id="submit-create-ticket-btn"
                  className="px-6 py-2.5 bg-[#14B8A6] hover:bg-[#0F766E] focus:ring-2 focus:ring-[#14B8A6] text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all"
                >
                  Dispatch Maintenance Crew
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
