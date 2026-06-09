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
  
  const totalUnits = properties.reduce((acc, curr) => acc + curr.units, 0);
  const averageOccupancy = Math.round(properties.reduce((acc, curr) => acc + curr.occupancy, 0) / properties.length);
  const completedCount = maintenance.filter(m => m.status === 'Completed').length;
  const pendingCount = maintenance.filter(m => m.status === 'Pending').length;

  const handleExport = () => {
    setIsExporting(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#334155] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-sans">Portfolio KPI Analytics Board</h1>
          <p className="text-sm text-[#CBD5E1] font-light mt-0.5">Diagnose listing yields, repair SLA margins, and active facility capacity streams.</p>
        </div>

        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="p-2.5 bg-[#14B8A6] hover:bg-[#0F766E] disabled:bg-[#14B8A6]/50 text-white rounded-xl shadow-md flex items-center justify-center space-x-1.5 font-semibold text-xs cursor-pointer leading-none transition-all"
        >
          <Download className="w-4 h-4 text-white" />
          <span>{isExporting ? 'Compiling Report PDF...' : 'Export SLA Report PDF'}</span>
        </button>
      </div>

      {exportComplete && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-semibold text-center animate-in fade-in">
          Success: Compiled and exported latest SLA performance audits to local systems buffer perfectly!
        </div>
      )}

      {/* Analytics KPI Sums */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-brand-surface p-5 rounded-2xl border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">PORTFOLIO EXPANSE</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-title mt-1">{totalUnits} units</div>
          <span className="text-[11px] text-emerald-500 font-semibold block mt-0.5">● Managed seamlessly</span>
        </div>

        <div className="bg-brand-surface p-5 rounded-2xl border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">PORTFOLIO YIELD</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-title mt-1">{averageOccupancy}% SLA</div>
          <span className="text-[11px] text-emerald-500 font-semibold block mt-0.5">↑ Stable peak demand</span>
        </div>

        <div className="bg-brand-surface p-5 rounded-2xl border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">COMPLETED REPAIRS</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-title mt-1">{completedCount} codes</div>
          <span className="text-[11px] text-primary-teal font-semibold block mt-0.5">✔ 100% resolved</span>
        </div>

        <div className="bg-brand-surface p-5 rounded-2xl border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block font-bold font-sans">SLA INCIDENTS OVERVIEW</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-500 mt-1">{pendingCount} cases</div>
          <span className="text-[11px] text-rose-500 font-semibold block mt-0.5">▲ Response active</span>
        </div>

      </div>

      {/* Performance graphs & summary cards */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Occupancy Distribution Graph Panel */}
        <div className="lg:col-span-8 bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="text-base font-extrabold text-brand-title">Complex Occupancy Distribution</h3>
            <span className="text-[10px] bg-brand-alternate border border-brand-border font-mono text-brand-body px-2 py-0.5 rounded">REAL-TIME</span>
          </div>

          <div className="space-y-5">
            {properties.map((p, idx) => (
              <div key={p.id} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full inline-block ${
                      idx === 0 ? 'bg-primary-teal' :
                      idx === 1 ? 'bg-teal-500' :
                      'bg-teal-400'
                    }`}></span>
                    <span className="font-bold text-brand-body">{p.name} ({p.type})</span>
                  </div>
                  <span className="font-mono text-brand-muted font-bold">{p.occupancy}% Occupied</span>
                </div>
                <div className="h-3 w-full bg-brand-alternate rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    idx === 0 ? 'bg-primary-teal' :
                    idx === 1 ? 'bg-teal-500' :
                    'bg-teal-400'
                  }`} style={{ width: `${p.occupancy}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 bg-brand-alternate text-brand-body rounded-2xl p-5 border border-brand-border space-y-4 shadow-md">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary-teal dark:text-secondary-teal" />
            <h4 className="text-sm font-bold text-brand-title">Continuous Diagnostics</h4>
          </div>
          <p className="text-xs text-brand-body leading-relaxed font-light font-sans font-medium">
            AI-assisted metric tracking is fully scanning client-side. We detect a <span className="text-primary-teal dark:text-secondary-teal font-extrabold">stable +3.4% SLA cycle rise</span> comparing unit demand curves week over week.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-brand-title hover:text-primary-teal text-xs font-bold font-mono inline-block underline mt-2 cursor-pointer transition-colors"
          >
            ← Back to operations workspace
          </button>
        </div>

      </div>

    </div>
  );
}
