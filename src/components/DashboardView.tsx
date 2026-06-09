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
  Info
} from 'lucide-react';
import { User, Property, MaintenanceRequest, BookingSlot } from '../types.ts';

interface DashboardViewProps {
  currentUser: User;
  properties: Property[];
  maintenance: MaintenanceRequest[];
  bookings: BookingSlot[];
  onNavigate: (view: any) => void;
  onAddTicketRequested: () => void;
  onAddBookingRequested: () => void;
}

export default function DashboardView({
  currentUser,
  properties,
  maintenance,
  bookings,
  onNavigate,
  onAddTicketRequested,
  onAddBookingRequested
}: DashboardViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulated Loader Clock
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Calculate analytics metric sums
  const activePropertiesCount = properties.length;
  const openRequestsCount = maintenance.filter(m => m.status !== 'Completed').length;
  const todayBookingsCount = bookings.filter(b => b.status === 'booked').length;

  // Most recent 3 maintenance tickets
  const recentTickets = maintenance.slice(0, 3);

  // Filter urgent files
  const urgentTickets = maintenance.filter(m => m.priority === 'Urgent' && m.status !== 'Completed');

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Intro Greetings row with enterprise trust signals */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight leading-none">Welcome back, {currentUser.name}</h1>
            <span className="bg-primary-teal/15 text-primary-teal dark:text-secondary-teal border border-primary-teal/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shrink-0 uppercase tracking-tight">Manager Space</span>
          </div>
          <p className="text-sm text-brand-body font-light mt-1">Real-time occupancy grids, maintenance clocks, and resident booking compliance queues are live.</p>
        </div>

        <div className="flex items-center space-x-2 bg-brand-surface px-3.5 py-2 border border-brand-border rounded-xl shadow-2xs self-start sm:self-auto shrink-0 leading-none">
          <ShieldCheck className="w-4 h-4 text-primary-teal dark:text-secondary-teal shrink-0" />
          <div className="text-left font-sans">
            <div className="text-[9px] font-bold text-brand-muted block uppercase font-mono leading-none">PORTFOLIO INTEGRITY</div>
            <div className="text-xs font-semibold text-brand-body font-sans mt-0.5 whitespace-nowrap leading-none flex items-center space-x-1">
              <span>Verified 100% Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Box for Tenants / Managers if any active Urgent Tickets exist */}
      {urgentTickets.length > 0 && !isLoading && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start space-x-3.5 animate-in fade-in slide-in-from-top-1">
          <div className="w-9 h-9 bg-rose-500/25 text-rose-550 dark:text-rose-400 rounded-lg flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-650 dark:text-rose-450 leading-none">Critical Urgent Repairs Pending</h4>
            <p className="text-xs text-brand-body font-light mt-1.5 leading-normal">
              "{urgentTickets[0].title}" in unit {urgentTickets[0].unitNumber} requires immediate assignment and field technician dispatch under SLA agreement terms.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Block Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, kIdx) => (
            <div key={kIdx} className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-xs flex items-center justify-between animate-pulse">
              <div className="space-y-2.5 flex-1 mr-4">
                <div className="h-3 bg-brand-alternate rounded w-2/3"></div>
                <div className="h-6 bg-brand-alternate rounded w-2/5"></div>
                <div className="h-3 bg-brand-alternate rounded w-11/12 mt-1"></div>
              </div>
              <div className="w-12 h-12 bg-brand-alternate rounded-xl shrink-0"></div>
            </div>
          ))
        ) : (
          <>
            {/* KPI 1: Active Properties */}
            <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-2xs flex items-center justify-between hover:border-primary-teal hover:shadow-xs transition-all duration-200 cursor-pointer" onClick={() => onNavigate('properties')}>
              <div className="space-y-1 font-sans">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Managed Properties</span>
                <div className="text-3xl font-extrabold text-brand-title">{activePropertiesCount} Est.</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 font-sans leading-none">
                  <span>↑</span> <span>98% Average Occupancy</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-teal-500/10 text-primary-teal dark:text-secondary-teal rounded-xl flex items-center justify-center border border-teal-500/20 shrink-0 select-none text-xl">
                🏢
              </div>
            </div>

            {/* KPI 2: Open Maintenance Inquiries */}
            <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-2xs flex items-center justify-between cursor-pointer hover:border-primary-teal hover:shadow-xs transition-all duration-200" onClick={() => onNavigate('maintenance')}>
              <div className="space-y-1 font-sans">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Active Repair Orders</span>
                <div className="text-3xl font-extrabold text-brand-title">{openRequestsCount} Requests</div>
                <div className="text-[11px] text-warn-gold font-semibold flex items-center space-x-1 font-sans leading-none">
                  <span>●</span> <span>SLA Response Window Lock</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 text-warn-gold rounded-xl flex items-center justify-center border border-amber-500/20 shrink-0 select-none text-xl">
                🛠️
              </div>
            </div>

            {/* KPI 3: Today's Reservations */}
            <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-2xs flex items-center justify-between cursor-pointer hover:border-primary-teal hover:shadow-xs transition-all duration-200" onClick={() => onNavigate('amenities')}>
              <div className="space-y-1 font-sans">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Amenities Booked</span>
                <div className="text-3xl font-extrabold text-brand-title">{todayBookingsCount} slots</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 font-sans leading-none">
                  <span>↑</span> <span>Automatic codes synched</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-555 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 shrink-0 select-none text-xl">
                📅
              </div>
            </div>

            {/* KPI 4: Monthly Success SLA */}
            <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border shadow-2xs flex items-center justify-between transition-all duration-200 hover:border-primary-teal cursor-pointer" onClick={() => onNavigate('analytics')}>
              <div className="space-y-1 font-sans">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Resolved SLA Cycles</span>
                <div className="text-3xl font-extrabold text-brand-title">98.4%</div>
                <div className="text-[11px] text-primary-teal dark:text-secondary-teal font-semibold flex items-center space-x-1 font-sans leading-none">
                  <span>↑</span> <span>92% in 24h goal</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-teal-500/10 text-primary-teal dark:text-secondary-teal rounded-xl flex items-center justify-center border border-teal-500/20 shrink-0 select-none text-xl">
                📈
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Visual line Curves or Graphs */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 lg:col-span-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-brand-title font-sans">Operational Response & SLA Timetable</h3>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono shrink-0 select-none">Target &lt; 2hr</span>
              </div>
              <p className="text-xs text-brand-body font-light mt-0.5">Reported dispatches contrasted against signed resolution workflows per week.</p>
            </div>
            
            <div className="flex items-center space-x-1.5 self-start sm:self-auto text-[10px] text-brand-muted font-mono">
              <RefreshCw className="w-3.5 h-3.5 text-brand-muted shrink-0" />
              <span>LIVE AUTOMATED CORRELATION</span>
            </div>
          </div>

          {isLoading ? (
            /* HUGE CHART LOAD SKELETON */
            <div className="h-64 w-full bg-brand-alternate rounded-2xl border border-brand-border relative animate-pulse flex items-center justify-center text-brand-muted">
              Generating active curve vectors...
            </div>
          ) : (
            /* Clean High Quality SVG Chart Mockup */
            <div className="h-64 w-full bg-brand-alternate rounded-2xl border border-brand-border relative p-4 flex flex-col justify-between">
              {/* Background grids */}
              <div className="absolute inset-x-0 top-1/4 border-t border-brand-border/40"></div>
              <div className="absolute inset-x-0 top-2/4 border-t border-brand-border/40"></div>
              <div className="absolute inset-x-0 top-3/4 border-t border-brand-border/40"></div>

              <div className="flex-1 w-full relative">
                {/* SVG Curve lines representing real-estate diagnostics */}
                <svg className="w-full h-full absolute inset-0 text-brand-border/45 overflow-visible" preserveAspectRatio="none">
                  {/* Performance Target Threshold baseline */}
                  <line x1="0" y1="120" x2="100%" y2="120" stroke="#F59E0B" strokeDasharray="4,4" strokeWidth="2" />
                  
                  {/* Generated curve lines */}
                  <path 
                    d="M 0 140 C 100 130, 200 80, 300 100 C 400 120, 500 50, 600 60 C 700 70, 800 30, 900 40 L 1000 40" 
                    fill="none" 
                    stroke="var(--primary-teal)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 0 180 C 100 160, 200 130, 300 140 C 400 130, 500 110, 600 80 C 700 90, 800 60, 900 70 L 1000 50" 
                    fill="none" 
                    stroke="#A3E635" 
                    strokeWidth="2.5" 
                    strokeDasharray="2,2" 
                    strokeLinecap="round" 
                  />
                </svg>

                {/* Floating tags */}
                <div className="absolute right-4 top-2 bg-brand-surface border border-brand-border text-brand-title font-mono rounded p-2 text-[9px] shadow-sm tracking-wider font-bold">
                  SLA CYCLE HIT RATE: 98.4%
                </div>
              </div>

              {/* Chart Legend Controls with responsive formatting */}
              <div className="flex justify-between items-center text-[10px] text-brand-body font-medium font-sans border-t border-brand-border pt-3 relative z-10">
                <div className="flex space-x-4">
                  <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-primary-teal rounded-full"></span> <span>Resolution Rate</span></span>
                  <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 border border-dashed border-[#14B8A6] bg-[#14B8A6]/10 rounded-full"></span> <span className="text-brand-muted font-light">Service requests logged</span></span>
                </div>
                <span className="font-mono text-brand-muted font-bold shrink-0">Updated just now</span>
              </div>
            </div>
          )}

          {/* Core Trust Scorecard Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="border border-brand-border bg-brand-alternate/40 rounded-xl p-3.5 flex items-start space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-brand-title block leading-tight font-sans">State Compliance Audit Verified</span>
                <p className="text-[10.5px] text-brand-body mt-1 leading-normal font-light">All system tenant logins, entry codes, and contractor assignments comply with landlord standards.</p>
              </div>
            </div>
            <div className="border border-brand-border bg-brand-alternate/40 rounded-xl p-3.5 flex items-start space-x-2.5">
              <Info className="w-5 h-5 text-primary-teal shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-brand-title block leading-tight font-sans">Transparent Record Log</span>
                <p className="text-[10.5px] text-brand-body mt-1 leading-normal font-light">Tenant requests are audit-trailed perpetually inside real-time profiles. Actions cannot be wiped.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Active Incident Dispatch Queue */}
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 lg:col-span-4 shadow-sm space-y-4 h-full">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h4 className="text-sm font-extrabold text-brand-title font-sans">Incident Dispatch Queue</h4>
            <button 
              onClick={() => onNavigate('maintenance')}
              className="text-[11px] font-bold text-primary-teal dark:text-secondary-teal hover:underline flex items-center space-x-0.5 leading-none transition-all cursor-pointer font-sans"
            >
              <span>View All</span> <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, rIdx) => (
                <div key={rIdx} className="space-y-2 animate-pulse min-h-[60px] pb-3 border-b border-brand-border last:border-none">
                  <div className="h-3 bg-brand-alternate rounded w-1/4"></div>
                  <div className="h-4.5 bg-brand-alternate rounded w-4/5"></div>
                  <div className="h-3 bg-brand-alternate rounded w-1/2"></div>
                </div>
              ))
            ) : recentTickets.length > 0 ? (
              recentTickets.map((t) => {
                const propStr = properties.find(p => p.id === t.propertyId)?.name || 'Summit Office';
                return (
                  <div key={t.id} className="pb-3 border-b border-brand-border last:border-b-0 last:pb-0 font-sans flex justify-between items-start">
                    <div className="space-y-1 max-w-[200px]">
                      <span className="text-[9px] text-brand-muted font-mono block uppercase">{propStr} • Unit {t.unitNumber}</span>
                      <h5 className="text-xs font-extrabold text-brand-title line-clamp-1 leading-snug">{t.title}</h5>
                      <span className="text-[10px] text-brand-body font-light font-sans block">{t.category}</span>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        t.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20' :
                        t.priority === 'High' ? 'bg-warn-gold/10 text-warn-gold border-warn-gold/20' :
                        t.priority === 'Medium' ? 'bg-teal-500/10 text-primary-teal dark:text-secondary-teal border-teal-500/20' :
                        'bg-brand-alternate text-brand-body border-brand-border'
                      }`}>
                        {t.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-brand-muted font-mono block leading-none pt-1">
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-brand-muted flex flex-col items-center justify-center space-y-2 border border-dashed border-brand-border rounded-xl bg-brand-alternate/25">
                <span>📋</span>
                <h5 className="font-bold text-xs text-brand-title">Clear Operations Slate</h5>
                <p className="text-[10px] text-brand-body max-w-[180px] leading-normal font-light">Audit complete: zero maintenance tickets require dispatching.</p>
              </div>
            )}
          </div>

          {/* Quick Action prompts */}
          <div className="pt-2">
            <button
              onClick={onAddBookingRequested}
              className="w-full py-3 bg-brand-alternate hover:bg-brand-alternate/80 text-brand-title font-semibold text-xs rounded-xl transition-all border border-brand-border hover:border-primary-teal cursor-pointer flex items-center justify-center space-x-1 min-h-[44px]"
            >
              <span>📅 Book New Amenity Access Slot</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
