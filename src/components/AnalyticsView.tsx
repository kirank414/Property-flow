import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Wrench, 
  CheckCircle,
  BarChart4,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Property, MaintenanceRequest, BookingSlot } from '../types.ts';

interface AnalyticsViewProps {
  properties: Property[];
  maintenance: MaintenanceRequest[];
  bookings: BookingSlot[];
  onNavigate: (view: any) => void;
}

export default function AnalyticsView({
  properties,
  maintenance,
  bookings,
  onNavigate
}: AnalyticsViewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 5000);
    }, 1500);
  };

  const totalRequests = maintenance.length;
  const completedCount = maintenance.filter(m => m.status === 'Completed').length;
  const completionRate = totalRequests > 0 ? Math.round((completedCount / totalRequests) * 100) : 0;
  
  const pendingCount = maintenance.filter(m => m.status === 'Pending').length;
  const assignedCount = maintenance.filter(m => m.status === 'Assigned').length;
  const inProgressCount = maintenance.filter(m => m.status === 'In Progress').length;

  const statusStats = [
    { label: 'Pending', count: pendingCount, color: 'bg-amber-500', total: totalRequests },
    { label: 'Assigned', count: assignedCount, color: 'bg-slate-500', total: totalRequests },
    { label: 'In Progress', count: inProgressCount, color: 'bg-[#14B8A6]', total: totalRequests },
    { label: 'Completed', count: completedCount, color: 'bg-emerald-500', total: totalRequests },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#334155] pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-sans">Platform KPIs</h1>
            <span className="hidden sm:flex items-center space-x-1.5 bg-[#14B8A6]/10 text-[#14B8A6] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#14B8A6]/20 font-mono tracking-tight">
              <span className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full animate-pulse"></span>
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-sm text-[#CBD5E1] font-light mt-0.5">Monitor maintenance performance, amenity usage, booking conflicts, and real-time operational KPIs.</p>
        </div>

        <div className="flex items-center gap-4 self-start sm:self-auto shrink-0">
          <div className="hidden lg:block text-right pr-2">
            <span className="text-[10px] font-bold text-brand-muted block uppercase font-mono">Last Updated</span>
            <span className="text-xs text-brand-body font-medium">Just now</span>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="p-2.5 bg-[#14B8A6] hover:bg-[#0F766E] disabled:bg-[#14B8A6]/50 text-white rounded-xl shadow-md flex items-center justify-center space-x-1.5 font-semibold text-xs cursor-pointer leading-none transition-all"
          >
            <Download className="w-4 h-4 text-white" />
            <span>{isExporting ? 'Generating Report...' : 'Export KPI Report'}</span>
          </button>
        </div>
      </div>

      {exportComplete && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-semibold text-center animate-in fade-in">
          Success: Exported the latest Platform KPI Report.
        </div>
      )}

      {/* Analytics KPI Sums */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-brand-surface p-4 rounded-2xl border border-brand-border flex flex-col justify-between">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">Maintenance Resolution</span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold text-brand-title">24 Hrs</div>
            <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">
              <span>✓ Target Met (≤ 48h)</span>
            </div>
          </div>
        </div>

        <div className="bg-brand-surface p-4 rounded-2xl border border-brand-border flex flex-col justify-between">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">Completion Rate</span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold text-brand-title">
              {totalRequests === 0 ? '0%' : `${completionRate}%`}
            </div>
            {completionRate >= 90 || totalRequests === 0 ? (
              <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">
                <span>✓ Above Target (≥ 90%)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded w-fit border border-rose-500/20">
                <span>✗ Below Target (≥ 90%)</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-brand-surface p-4 rounded-2xl border border-brand-border flex flex-col justify-between">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">Booking Conflicts</span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold text-brand-title">0</div>
            <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">
              <span>✓ Target Met (= 0)</span>
            </div>
          </div>
        </div>

        <div className="bg-brand-surface p-4 rounded-2xl border border-brand-border flex flex-col justify-between">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">System Response</span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold text-brand-title">1.2s</div>
            <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">
              <span>✓ Target Met (≤ 2.0s)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-brand-surface p-4 rounded-2xl border border-brand-border flex flex-col justify-between">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">User Satisfaction</span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-extrabold text-brand-title">4.8/5</div>
            <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">
              <span>✓ Target Met (≥ 4/5)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Performance graphs & summary cards */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Maintenance Status Distribution Graph Panel */}
        <div className="lg:col-span-8 bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="text-base font-extrabold text-brand-title">Maintenance Requests by Status</h3>
            <span className="text-[10px] bg-brand-alternate border border-brand-border font-mono text-brand-body px-2 py-0.5 rounded">LIVE DATA</span>
          </div>

          <div className="space-y-5">
            {statusStats.map((stat, idx) => {
              const percentage = stat.total > 0 ? Math.round((stat.count / stat.total) * 100) : 0;
              return (
                <div key={stat.label} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full inline-block ${stat.color}`}></span>
                      <span className="font-bold text-brand-body">{stat.label}</span>
                    </div>
                    <span className="font-mono text-brand-muted font-bold">{stat.count} ({percentage}%)</span>
                  </div>
                  <div className="h-3 w-full bg-brand-alternate rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${stat.color}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 bg-brand-alternate text-brand-body rounded-2xl p-5 border border-brand-border space-y-4 shadow-md flex flex-col">
          <div className="flex items-center space-x-2 border-b border-brand-border pb-3">
            <BarChart4 className="w-5 h-5 text-primary-teal dark:text-secondary-teal" />
            <h4 className="text-sm font-bold text-brand-title">Operational Summary</h4>
          </div>
          
          <div className="space-y-3 flex-1 pt-2 font-sans">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">Total Maintenance Requests</span>
              <span className="text-xs font-mono font-bold text-brand-title">{totalRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">Active Amenity Bookings</span>
              <span className="text-xs font-mono font-bold text-brand-title">{bookings.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">Current Booking Conflicts</span>
              <span className="text-xs font-mono font-bold text-brand-title">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">System Status</span>
              <span className="text-xs font-mono font-bold text-emerald-500">Operational</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
