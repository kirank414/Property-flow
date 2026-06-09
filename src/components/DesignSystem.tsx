import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Trash2, 
  Sparkles, 
  Search, 
  X, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  ShieldCheck, 
  RefreshCw,
  ServerCrash,
  UserCheck,
  Building,
  Key
} from 'lucide-react';
import { Property, BookingSlot } from '../types.ts';

// ============================================================================
// 1. KPI CARD COMPONENT
// ============================================================================
interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    text: string;
  };
  icon: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
}

export function KpiCard({
  id,
  title,
  value,
  trend,
  icon,
  onClick,
  isLoading = false
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-sm flex items-center justify-between animate-pulse min-h-[110px]">
        <div className="space-y-2 flex-1 mr-4">
          <div className="h-3 bg-brand-alternate rounded w-2/3"></div>
          <div className="h-6 bg-brand-alternate rounded w-2/5"></div>
          <div className="h-3 bg-brand-alternate rounded w-11/12 mt-1"></div>
        </div>
        <div className="w-12 h-12 bg-brand-alternate rounded-xl shrink-0"></div>
      </div>
    );
  }

  return (
    <div 
      id={id}
      onClick={onClick}
      className={`bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-sm flex items-center justify-between hover:border-primary-teal transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="space-y-1 font-sans">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{title}</span>
        <div className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight">{value}</div>
        {trend && (
          <div className={`text-[11px] font-semibold flex items-center space-x-1 ${trend.direction === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
            <span className="text-brand-body font-normal">{trend.text}</span>
          </div>
        )}
      </div>
      <div className="w-12 h-12 bg-primary-teal/10 text-primary-teal rounded-xl flex items-center justify-center border border-primary-teal/20 shrink-0 select-none text-xl">
        {icon}
      </div>
    </div>
  );
}

// ============================================================================
// 2. STATUS & PRIORITY BADGES
// ============================================================================
interface StatusBadgeProps {
  id?: string;
  type: 'priority' | 'status' | 'category' | 'role';
  value: string;
}

export function StatusBadge({ id, type, value }: StatusBadgeProps) {
  const norm = value.trim();
  const lower = norm.toLowerCase();

  let styles = 'bg-[#111827] text-[#CBD5E1] border border-[#334155]';

  if (type === 'priority') {
    if (lower === 'urgent') styles = 'bg-rose-500/10 text-rose-450 border border-rose-500/20 font-bold';
    else if (lower === 'high') styles = 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold';
    else if (lower === 'medium') styles = 'bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20';
    else styles = 'bg-[#111827] text-[#CBD5E1] border border-[#334155]';
  } else if (type === 'status') {
    if (lower === 'pending') styles = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    else if (lower === 'assigned') styles = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    else if (lower === 'in progress') styles = 'bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20';
    else styles = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  } else if (type === 'role') {
    if (lower === 'admin') styles = 'bg-[#111827] text-[#F8FAFC] border border-[#334155] shadow-xs';
    else if (lower === 'manager') styles = 'bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 font-semibold';
    else if (lower === 'staff') styles = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    else styles = 'bg-[#111827] text-[#CBD5E1] border border-[#334155]';
  } else if (type === 'category') {
    styles = 'bg-[#111827] text-[#94A3B8] border border-[#334155] font-mono text-[10px] uppercase font-semibold';
  }

  return (
    <span 
      id={id}
      className={`px-2.5 py-1 rounded text-[10px] font-mono leading-none inline-block uppercase font-bold select-none ${styles}`}
    >
      {norm}
    </span>
  );
}

// ============================================================================
// 3. PROPERTY LIST CARD
// ============================================================================
interface PropertyCardProps {
  id?: string;
  property: Property;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PropertyCard({ id, property, isSelected, onClick }: PropertyCardProps) {
  return (
    <div
      id={id || `property-card-${property.id}`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
      className={`p-4 rounded-2xl border transition-all duration-200 bg-brand-surface ${
        onClick ? 'cursor-pointer focus:ring-2 focus:ring-primary-teal/50' : ''
      } ${
        isSelected 
          ? 'border-primary-teal ring-2 ring-primary-teal shadow-md -translate-y-0.5' 
          : 'border-brand-border hover:border-brand-border hover:shadow-sm hover:-translate-y-0.5'
      }`}
      role={onClick ? 'button' : undefined}
      aria-selected={isSelected}
    >
      <div className="flex space-x-3">
        <img 
          src={property.image} 
          alt={property.name} 
          className="w-14 h-14 rounded-xl object-cover shrink-0" 
          referrerPolicy="no-referrer" 
        />
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold bg-brand-alternate text-brand-body px-2 py-0.5 rounded font-mono uppercase tracking-wider">{property.type}</span>
          <h4 className="text-sm font-extrabold text-brand-title mt-1 truncate">{property.name}</h4>
          <span className="text-xs text-brand-body font-light block mt-0.5 truncate">{property.address}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. BOOKING CARD / LEDGER ITEM
// ============================================================================
interface BookingCardProps {
  id?: string;
  booking: BookingSlot;
  propertyName: string;
  isCreator: boolean;
  onCancel?: (id: string) => void;
}

export function BookingCard({ id, booking, propertyName, isCreator, onCancel }: BookingCardProps) {
  return (
    <div 
      id={id || `booking-card-${booking.id}`} 
      className="py-3.5 flex justify-between items-start first:pt-0 last:pb-0 font-sans border-b border-brand-border last:border-b-0"
    >
      <div className="space-y-1">
        <span className="text-[10px] text-brand-body font-mono block uppercase">{propertyName}</span>
        <h5 className="text-xs font-extrabold text-brand-title leading-snug">{booking.amenityName}</h5>
        <div className="flex items-center space-x-1.5 text-[11px] text-brand-body font-light font-mono leading-none">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{booking.start} - {booking.end}</span>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded leading-none uppercase ${
          booking.status === 'booked' 
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
        }`}>
          {booking.status === 'booked' ? 'CONFIRMED' : 'CANCELLED'}
        </span>
        {isCreator && booking.status === 'booked' && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="text-[10px] text-rose-500 hover:text-rose-650 font-bold flex items-center space-x-0.5 cursor-pointer leading-none"
            aria-label="Cancel this reservation"
          >
            <Trash2 className="w-3 h-3 text-rose-500" />
            <span>Cancel Slot</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. EMPTY STATES
// ============================================================================
interface EmptyStateProps {
  id?: string;
  icon: string | ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ id, icon, title, description, action }: EmptyStateProps) {
  return (
    <div 
      id={id}
      className="py-12 px-6 text-center space-y-4 border border-dashed border-brand-border rounded-2xl bg-brand-alternate/20 max-w-md mx-auto w-full my-4"
    >
      <div className="w-16 h-16 bg-brand-alternate border border-dashed border-brand-border rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-2xs">
        {typeof icon === 'string' ? icon : icon}
      </div>
      <div className="space-y-1">
        <h5 className="font-extrabold text-brand-title text-sm">{title}</h5>
        <p className="text-xs text-brand-body leading-normal font-light max-w-xs mx-auto">
          {description}
        </p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-brand-alternate hover:bg-brand-hover text-brand-title border border-brand-border rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// 6. SEARCH PARAMETERS COMPONENTS
// ============================================================================
interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchInput({ id, value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        id={id}
        placeholder={placeholder || "Search holdings name or physical entries..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-brand-surface focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/15 transition-all text-brand-title"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="p-1 text-[var(--text-body)] hover:text-[var(--text-title)] absolute right-3 top-1/2 -translate-y-1/2 rounded-full cursor-pointer"
          aria-label="Clear searchQuery parameter"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// 7. MULTIPURPOSE TABLES
// ============================================================================
interface CustomTableProps {
  headers: string[];
  children: ReactNode;
  id?: string;
}

export function CustomTable({ headers, children, id }: CustomTableProps) {
  return (
    <div id={id} className="overflow-x-auto border border-brand-border rounded-2xl bg-brand-surface shadow-sm">
      <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
        <thead className="bg-brand-alternate text-brand-body border-b border-brand-border">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} className="p-3.5 font-bold uppercase tracking-wider text-[10px] text-brand-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border text-brand-title">
          {children}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// 8. UNIFIED NOTIFICATION ALERTS / DIALOGS
// ============================================================================
interface NotificationBannerProps {
  id?: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export function NotificationBanner({ id, type, title, message, onDismiss }: NotificationBannerProps) {
  let containerStyles = 'bg-slate-50 text-slate-800 border-slate-200 dark:bg-[#1E293B] dark:text-[#CBD5E1] dark:border-[#334155]';
  let iconNode = <Info className="w-5 h-5 text-slate-500 mt-0.5 shrink-0 dark:text-[#94A3B8]" />;

  if (type === 'success') {
    containerStyles = 'bg-emerald-50 text-emerald-800 border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/20';
    iconNode = <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />;
  } else if (type === 'error') {
    containerStyles = 'bg-rose-50 text-rose-800 border-rose-150 dark:bg-rose-950/10 dark:text-rose-400 dark:border-rose-500/20';
    iconNode = <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />;
  } else if (type === 'warning') {
    containerStyles = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-500/20';
    iconNode = <AlertOctagon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />;
  }

  return (
    <div 
      id={id}
      className={`p-4 rounded-xl border flex items-start space-x-3 animate-in fade-in ${containerStyles}`}
    >
      {iconNode}
      <div className="flex-1 font-sans text-xs">
        {title && <span className="font-bold block mb-0.5">{title}</span>}
        <p className="font-light leading-normal">{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 p-0.5"
          aria-label="Dismiss alert component"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// 9. REUSABLE MODALS
// ============================================================================
interface UiModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  id?: string;
}

export function UiModal({ isOpen, onClose, title, children, icon, id }: UiModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      id={id} 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
    >
      <div className="bg-brand-surface rounded-3xl border border-brand-border max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-brand-border pb-3">
          <div className="flex items-center space-x-2">
            {icon || <Building2 className="w-5 h-5 text-primary-teal" />}
            <h3 className="text-base sm:text-lg font-extrabold text-brand-title font-sans">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-brand-alternate text-brand-body hover:text-brand-title rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal dial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. ERROR BOUNDARY PRODUCTION GUARD
// ============================================================================
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an active runtime visual issue: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-950/10 rounded-2xl text-center space-y-4 max-w-xl mx-auto w-full my-6 font-sans">
          <ServerCrash className="w-12 h-12 text-rose-600 dark:text-rose-400 mx-auto" />
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-rose-900 dark:text-rose-400 text-sm">System Guard Shield: Panel Crashing Overridden</h4>
            <p className="text-xs text-rose-700 dark:text-rose-350 leading-relaxed font-light">
              Our pre-backend architectural safety layers bypassed a visual render exception. Operational continuity state registered nominal.
            </p>
          </div>
          {this.state.error && (
            <div className="bg-white/70 dark:bg-[#111827]/80 p-3 rounded-lg text-left text-[10px] font-mono text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-500/10 overflow-x-auto max-h-24">
              {this.state.error.message}
            </div>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-sans transition-all shadow-sm"
          >
            Recover Live Viewport
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// 11. REUSABLE SAFEGUARD EDGE CASE SIMULATIONS
// ============================================================================
interface SafeguardStateProps {
  type: 'network' | 'unauthorized' | 'session' | 'empty' | 'nonconforming';
  message?: string;
  onReset: () => void;
}

export function SafeguardState({ type, message, onReset }: SafeguardStateProps) {
  let title = "Guard Failure State";
  let description = "An unexpected gate conditions mismatch was detected.";
  let visualNode = <ServerCrash className="w-14 h-14 text-rose-600" />;

  if (type === 'network') {
    title = "Simulated API Network Timeout";
    description = message || "Primary database connection pool timing breached SLA. Retrying connection or checking reverse-proxy gateway rules (E_TIMEOUT).";
    visualNode = <RefreshCw className="w-14 h-14 text-primary-teal animate-spin" />;
  } else if (type === 'unauthorized') {
    title = "Simulation Access Control: Unauthorized (401)";
    description = message || "Your active tenant/staff credential role does not contain authorization clearance to alter corporate portfolio indexes.";
    visualNode = <ShieldAlert className="w-14 h-14 text-rose-600" />;
  } else if (type === 'session') {
    title = "Session Expiration Safeguard Block";
    description = message || "Auth tokens has expired or was validated out of compliance envelope. Re-authenticate to obtain secured JWT lease.";
    visualNode = <Key className="w-14 h-14 text-amber-500" />;
  } else if (type === 'empty') {
    title = "No Records Available";
    description = message || "Query request returned. Ensure parameters align with the corporate holdings portfolio.";
    visualNode = <Building className="w-14 h-14 text-slate-400" />;
  }

  return (
    <div className="p-8 sm:p-12 border border-brand-border bg-brand-surface rounded-2xl text-center space-y-6 max-w-md mx-auto w-full my-8 shadow-md font-sans">
      <div className="w-20 h-20 bg-brand-alternate border border-brand-border rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
        {visualNode}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-extrabold text-brand-title text-base">{title}</h3>
        <p className="text-xs text-brand-body leading-relaxed font-light">{description}</p>
      </div>

      <div className="pt-2">
        <button
          onClick={onReset}
          className="w-full py-3 bg-primary-teal hover:bg-primary-teal-hover text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all leading-none min-h-[44px]"
        >
          Resume Normal Operation Mode
        </button>
      </div>
    </div>
  );
}
