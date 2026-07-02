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
import { maintenanceValidationSchema } from '../../shared/zod';
import { useCreateMaintenanceRequest, useUpdateMaintenanceRequest, useDeleteMaintenanceRequest, useRateMaintenanceRequest } from '../api/hooks';
import { Edit2, Trash2, Star } from 'lucide-react';

interface MaintenanceViewProps {
  currentUser: UserType;
  properties: Property[];
  maintenance: MaintenanceRequest[];
  onCreateTicket?: (ticket: any) => void;
  onUpdateTicketStatus?: (id: string, status: MaintenanceStatus, assignedTo?: string) => void;
  staffUsers: UserType[];
  isLoading?: boolean;
}

export default function MaintenanceView({
  currentUser,
  properties,
  maintenance,
  onCreateTicket,
  onUpdateTicketStatus,
  staffUsers,
  isLoading = false
}: MaintenanceViewProps) {
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Search/Filter local states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [recentKeywords] = useState(['Plumbing', 'Electrical', 'Water Leakage', 'Cleaning', 'Lift', 'Air Conditioning']);

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

  // Edit Mode States
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);

  // Rating States
  const [rating, setRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');

  // React Query Mutations
  const createTicketMutation = useCreateMaintenanceRequest();
  const updateTicketMutation = useUpdateMaintenanceRequest();
  const deleteTicketMutation = useDeleteMaintenanceRequest();
  const rateTicketMutation = useRateMaintenanceRequest();

  useEffect(() => {
    if (!propertyId && properties.length > 0) {
      setPropertyId(currentUser.role === 'Tenant' && currentUser.propertyId ? currentUser.propertyId : properties[0].id);
    }
  }, [properties, propertyId, currentUser]);

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

  // Synchronize selectedRequest with updated data from React Query
  useEffect(() => {
    if (!isLoading && filteredMaintenance.length > 0) {
      if (!selectedRequest) {
        setSelectedRequest(filteredMaintenance[0]);
      } else {
        const updatedMatch = filteredMaintenance.find(req => req.id === selectedRequest.id);
        if (updatedMatch) {
          if (updatedMatch.status !== selectedRequest.status || updatedMatch.assignedTo !== selectedRequest.assignedTo || updatedMatch.priority !== selectedRequest.priority) {
            setSelectedRequest(updatedMatch);
          }
        }
      }
    } else if (filteredMaintenance.length === 0) {
      setSelectedRequest(null);
    }
  }, [isLoading, filteredMaintenance, selectedRequest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    setFormError(null);

    const finalTitle = currentUser.role === 'Tenant' ? `${category} Issue - Unit ${unitNumber}`.padEnd(8, ' ') : title;

    try {
      maintenanceValidationSchema.parse({
        title: finalTitle,
        description,
        unitNumber,
        category,
        priority: priority.toUpperCase(),
        propertyId,
        tenantId: currentUser.id
      });
    } catch (err: any) {
      if (err.errors) {
        setFormError(err.errors[0].message);
        return;
      }
    }

    // Success dispatch
    if (editingRequest) {
      updateTicketMutation.mutate({
        id: editingRequest.id,
        data: {
          title: finalTitle,
          description,
          propertyId,
          unitNumber,
          priority: priority.toUpperCase() as any,
          category,
        }
      });
      setEditingRequest(null);
    } else {
      createTicketMutation.mutate({
        title: finalTitle,
        description,
        propertyId,
        unitNumber,
        priority: priority.toUpperCase() as any,
        category,
        status: 'PENDING',
        tenantId: currentUser.id
      });
    }

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

  const openEditModal = (req: MaintenanceRequest) => {
    setEditingRequest(req);
    setTitle(req.title);
    setDescription(req.description);
    setPropertyId(req.propertyId);
    setUnitNumber(req.unitNumber);
    // Convert to proper casing for local state if necessary
    setPriority(req.priority as MaintenancePriority);
    setCategory(req.category);
    setShowCreateModal(true);
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Are you sure you want to delete this maintenance request?')) {
      deleteTicketMutation.mutate(id);
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
    }
  };

  const handleStatusUpdate = (status: MaintenanceStatus) => {
    if (!selectedRequest) return;
    const assignedUser = staffUsers[0]?.name || 'Unassigned Staff';
    
    // Status in UI is 'Pending', 'In Progress', 'Completed'
    if (onUpdateTicketStatus) {
      onUpdateTicketStatus(selectedRequest.id, status, assignedUser);
    }
  };

  const handleRateRequest = () => {
    if (!selectedRequest || rating === 0) return;
    rateTicketMutation.mutate({
      id: selectedRequest.id,
      rating,
      reviewComment: reviewComment.trim() || undefined
    });
    setRating(0);
    setReviewComment('');
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">Maintenance Requests</h1>
            <span className="hidden sm:inline bg-[#14B8A6]/10 text-[#14B8A6] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#14B8A6]/20 font-mono tracking-tight">Real-Time Connected</span>
          </div>
          <p className="text-sm text-[#CBD5E1] font-light mt-0.5">
            {currentUser.role === 'Tenant' ? 'Submit maintenance requests and track their status in real time.' : 'Manage maintenance requests, update request statuses, and monitor real-time maintenance progress.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0 leading-none">
          <div className="hidden lg:block text-right pr-2">
            <span className="text-[10px] font-bold text-[#94A3B8] block uppercase font-mono">Real-Time Status</span>
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
            <span>{currentUser.role === 'Tenant' ? 'New Maintenance Request' : 'Log Maintenance Request'}</span>
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

      {/* Summary Row */}
      {currentUser.role !== 'Tenant' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col justify-center transition-all hover:border-primary-teal/50">
            <span className="text-[10px] font-bold text-brand-muted uppercase font-sans tracking-wider">Total Requests</span>
            <span className="text-xl sm:text-2xl font-extrabold text-brand-title mt-1 font-mono">{maintenance.length}</span>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col justify-center transition-all hover:border-amber-500/50">
            <span className="text-[10px] font-bold text-brand-muted uppercase font-sans tracking-wider">Pending</span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-500 mt-1 font-mono">{maintenance.filter(r => r.status === 'Pending').length}</span>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col justify-center transition-all hover:border-primary-teal/50">
            <span className="text-[10px] font-bold text-brand-muted uppercase font-sans tracking-wider">In Progress</span>
            <span className="text-xl sm:text-2xl font-extrabold text-primary-teal mt-1 font-mono">{maintenance.filter(r => r.status === 'In Progress').length}</span>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col justify-center transition-all hover:border-emerald-500/50">
            <span className="text-[10px] font-bold text-brand-muted uppercase font-sans tracking-wider">Completed</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-500 mt-1 font-mono">{maintenance.filter(r => r.status === 'Completed').length}</span>
          </div>
        </div>
      )}

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
                  aria-label={`Maintenance report: ${req.title}, Status: ${req.status}`}
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
                <h5 className="font-extrabold text-[#F8FAFC] text-xs">No maintenance requests found.</h5>
                <p className="text-[11px] text-[#CBD5E1] max-w-xs mx-auto mt-1 leading-normal font-light">
                  {currentUser.role === 'Tenant' ? "You haven't submitted any maintenance requests yet." : "No maintenance requests are currently assigned or match the selected filters."}
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
                    <span>REQUEST ID #{selectedRequest.id}</span>
                    <span>•</span>
                    <span className="font-sans font-semibold">Priority: {selectedRequest.priority}</span>
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
                {currentUser.role !== 'Tenant' && (
                  <div className="flex space-x-2 shrink-0 self-start">
                    <button 
                      onClick={() => openEditModal(selectedRequest)}
                      className="px-3 py-1.5 bg-brand-alternate hover:bg-brand-alternate/80 text-brand-title border border-brand-border rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteRequest(selectedRequest.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Box: Details */}
              <div className="grid grid-cols-2 gap-4 border-y border-brand-border py-4.5">
                {currentUser.role !== 'Tenant' && (
                  <div>
                    <span className="text-[10px] font-bold text-brand-muted uppercase block tracking-wider font-sans">Tenant</span>
                    <div className="flex items-center space-x-2 mt-1.5 leading-none">
                      <span className="text-xs font-extrabold text-brand-title truncate">{selectedRequest.createdBy}</span>
                    </div>
                  </div>
                )}
                {currentUser.role === 'Tenant' && (
                  <div>
                    <span className="text-[10px] font-bold text-brand-muted uppercase block tracking-wider font-sans">Issue Category</span>
                    <div className="flex items-center space-x-2 mt-1.5 leading-none">
                      <span className="text-xs font-semibold text-brand-title truncate">{selectedRequest.category}</span>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold text-brand-muted uppercase block tracking-wider font-sans">Property</span>
                  <div className="flex items-center space-x-2 mt-1.5 leading-none">
                    <span className="text-xs font-semibold text-brand-title truncate">
                      {properties.find(p => p.id === selectedRequest.propertyId)?.name || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-brand-muted uppercase block tracking-wider font-sans">Unit Number</span>
                  <div className="flex items-center space-x-2 mt-1.5 leading-none">
                    <span className="text-xs font-semibold text-brand-title truncate">
                      {selectedRequest.unitNumber}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-[10px] font-bold text-brand-muted uppercase block tracking-wider font-sans">Created Date</span>
                  <div className="flex items-center space-x-2 mt-1.5 leading-none">
                    <span className="text-xs font-semibold text-brand-title truncate">
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {selectedRequest.status === 'Completed' && (
                  <div>
                    <span className="text-[10px] font-bold text-brand-muted uppercase block tracking-wider font-sans">Resolution Date</span>
                    <div className="flex items-center space-x-2 mt-1.5 leading-none">
                      <span className="text-xs font-semibold text-emerald-500 truncate">
                        Resolved
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Body */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-brand-muted uppercase tracking-widest block font-sans">Issue Description</span>
                <div className="p-4 bg-brand-alternate/40 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-body leading-relaxed font-light">
                  {selectedRequest.description}
                </div>
              </div>

              {/* Simple Activity Timeline */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block font-sans">Activity Timeline</span>
                </div>
                
                <div className="relative pl-6 border-l-2 border-brand-border space-y-4 ml-1">
                  {/* Created */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-brand-surface ring-4 ring-emerald-500/10 text-[10px] text-white flex items-center justify-center font-extrabold pb-0.5">✓</span>
                    <div>
                      <h5 className="text-xs font-extrabold text-brand-title">Request Created</h5>
                      <span className="text-[10px] text-brand-muted block font-mono mt-0.5">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Pending */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 border-brand-surface ring-4 transition-all ${
                      ['Pending', 'Assigned', 'In Progress', 'Completed'].includes(selectedRequest.status)
                        ? 'bg-emerald-500 ring-emerald-500/10 text-[10px] text-white flex items-center justify-center font-extrabold pb-0.5'
                        : 'bg-brand-alternate ring-brand-alternate/10 text-brand-muted'
                    }`}>
                      {['Pending', 'Assigned', 'In Progress', 'Completed'].includes(selectedRequest.status) ? '✓' : ''}
                    </span>
                    <div>
                      <h5 className="text-xs font-extrabold text-brand-title">Pending</h5>
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 border-brand-surface ring-4 transition-all ${
                      ['In Progress', 'Completed'].includes(selectedRequest.status)
                        ? 'bg-emerald-500 ring-emerald-500/10 text-[10px] text-white flex items-center justify-center font-extrabold pb-0.5'
                        : 'bg-brand-alternate ring-brand-alternate/10 text-brand-muted'
                    }`}>
                      {['In Progress', 'Completed'].includes(selectedRequest.status) ? '✓' : ''}
                    </span>
                    <div>
                      <h5 className="text-xs font-extrabold text-brand-title">In Progress</h5>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="relative font-sans">
                    <span className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 border-brand-surface ring-4 transition-all ${
                      selectedRequest.status === 'Completed'
                        ? 'bg-emerald-500 ring-emerald-500/10 text-[10px] text-white flex items-center justify-center font-extrabold pb-0.5'
                        : 'bg-brand-alternate ring-brand-alternate/10'
                    }`}>
                      {selectedRequest.status === 'Completed' ? '✓' : ''}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-brand-title">Completed</h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Section for Tenants on Completed Requests */}
              {currentUser.role === 'Tenant' && selectedRequest.status === 'Completed' && (
                <div className="bg-primary-teal/10 border border-primary-teal/20 rounded-xl p-4 space-y-3 font-sans">
                  <div className="flex items-center space-x-1.5 text-primary-teal dark:text-secondary-teal font-extrabold uppercase tracking-wider text-[10px]">
                    <Star className="w-4 h-4 shrink-0 text-primary-teal dark:text-secondary-teal" />
                    <span>Rate Your Experience</span>
                  </div>
                  
                  {selectedRequest.rating ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= (selectedRequest.rating || 0)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-brand-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-brand-title">{selectedRequest.rating}/5</span>
                      </div>
                      {selectedRequest.reviewComment && (
                        <div className="p-3 bg-brand-alternate/40 rounded-lg border border-brand-border">
                          <p className="text-xs text-brand-body italic">"{selectedRequest.reviewComment}"</p>
                        </div>
                      )}
                      <p className="text-[10px] text-brand-muted font-mono">Rated on {selectedRequest.ratedAt ? new Date(selectedRequest.ratedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-brand-body font-light leading-relaxed">
                        How satisfied were you with the maintenance service? Please rate your experience (1-5 stars).
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setRating(star)}
                            className="transition-transform hover:scale-110 cursor-pointer"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-brand-muted hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="text-sm font-bold text-brand-title ml-2">{rating}/5</span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-body uppercase tracking-wider block">Optional Feedback</label>
                        <textarea
                          rows={2}
                          placeholder="Share your experience (optional)"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full px-3 py-2 bg-brand-alternate border border-brand-border rounded-lg text-xs focus:outline-none focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/15 text-brand-title transition-all font-sans placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                          maxLength={300}
                        />
                        <p className="text-[9px] text-brand-muted font-light">{reviewComment.length} / 300 characters</p>
                      </div>
                      
                      <button
                        onClick={handleRateRequest}
                        disabled={rating === 0 || rateTicketMutation.isPending}
                        className="px-4 py-2 bg-[#14B8A6] hover:bg-[#0F766E] disabled:bg-brand-muted disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold shadow-md cursor-pointer transition-all flex items-center space-x-1.5"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>{rateTicketMutation.isPending ? 'Submitting...' : 'Submit Rating'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Status workflow transitions for Landlords / Technicians */}
              {currentUser.role !== 'Tenant' && (
                <div className="bg-primary-teal/10 border border-primary-teal/20 rounded-xl p-4 space-y-3 font-sans">
                  <div className="flex items-center space-x-1.5 text-primary-teal dark:text-secondary-teal font-extrabold uppercase tracking-wider text-[10px]">
                    <UserCheck className="w-4 h-4 shrink-0 text-primary-teal dark:text-secondary-teal" />
                    <span>Status Controls</span>
                  </div>
                  <p className="text-xs text-brand-body font-light leading-relaxed">Update the operational status of this maintenance request.</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleStatusUpdate('Pending')}
                      type="button"
                      className={`px-3 py-1.8 text-[11px] font-bold rounded-lg border transition-all cursor-pointer min-h-[36px] ${selectedRequest.status === 'Pending' ? 'bg-primary-teal text-white border-primary-teal shadow-xs' : 'bg-brand-alternate text-brand-body border-brand-border hover:bg-brand-surface hover:border-brand-body'}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('In Progress')}
                      type="button"
                      className={`px-3 py-1.8 text-[11px] font-bold rounded-lg border transition-all cursor-pointer min-h-[36px] ${selectedRequest.status === 'In Progress' ? 'bg-primary-teal text-white border-primary-teal shadow-xs' : 'bg-brand-alternate text-brand-body border-brand-border hover:bg-brand-surface hover:border-brand-body'}`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('Completed')}
                      type="button"
                      className={`px-3 py-1.8 text-[11px] font-bold rounded-lg border transition-all cursor-pointer min-h-[36px] ${selectedRequest.status === 'Completed' ? 'bg-emerald-600 text-white border-brand-border' : 'bg-brand-alternate text-brand-body border-brand-border hover:bg-brand-surface hover:border-brand-body'}`}
                    >
                      Completed
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
                <h5 className="font-extrabold text-brand-title text-xs">No maintenance request selected.</h5>
                <p className="text-[11px] text-brand-body max-w-xs mt-1 leading-normal font-light">
                  {currentUser.role === 'Tenant' ? "Select a maintenance request to view its details and current status." : "Select a maintenance request to view its details and update its status."}
                </p>
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
                <h3 className="text-base sm:text-lg font-extrabold text-brand-title">{editingRequest ? 'Edit Maintenance Request' : 'Create Maintenance Request'}</h3>
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
              
              {currentUser.role !== 'Tenant' && (
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
              )}

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
                  Discard
                </button>
                <button
                  type="submit"
                  id="submit-create-ticket-btn"
                  className="px-6 py-2.5 bg-[#14B8A6] hover:bg-[#0F766E] focus:ring-2 focus:ring-[#14B8A6] text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all"
                >
                  {editingRequest ? 'Save Changes' : 'Create Request'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
