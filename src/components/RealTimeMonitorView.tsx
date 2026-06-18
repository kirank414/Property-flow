import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Terminal, 
  Play, 
  Square, 
  RotateCcw,
  Info
} from 'lucide-react';
import { MaintenanceRequest, Property, User } from '../types.ts';

interface RealTimeMonitorViewProps {
  maintenance: MaintenanceRequest[];
  setMaintenance: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
  properties: Property[];
  currentUser: User;
}

export default function RealTimeMonitorView({
  maintenance,
  setMaintenance,
  properties,
  currentUser
}: RealTimeMonitorViewProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM: [09:26:01] Booting PropertyFlow real-time monitoring node...',
    'SYSTEM: [09:26:02] Connected to database replica pool.',
    'SECURITY: [09:26:05] Session initialized for user Eleanor Vance.',
    'OPERATION: [09:26:12] Checked booking availability slot for Skyline Pool.',
    'OPERATION: [09:26:30] Tenant Sarah Connor submitted a new maintenance request for Plumbing.'
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate periodic background activity log
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const activeProperties = properties.length > 0 ? properties : [{ name: 'Property' }];
      const propName = activeProperties[Math.floor(Math.random() * activeProperties.length)].name;
      
      const phrases = [
        `OPERATION: Resident checked in to reserved slot at ${propName}.`,
        `OPERATION: Technical staff assigned to HVAC dispatch at ${propName}.`,
        `SECURITY: Successful login token handshake.`,
        `OPERATION: Refreshed booking slot availability ledger for ${propName}.`,
        `OPERATION: Tenant checked out of booking slot at ${propName} successfully.`
      ];
      const randomMsg = phrases[Math.floor(Math.random() * phrases.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(p => [...p, `LOG: [${timestamp}] ${randomMsg}`]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning, properties]);

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Real-Time Monitoring</h1>
          <p className="text-sm text-brand-body font-light mt-0.5">Continuous operations monitor stream tracking check-ins, maintenance dispatch logs, and bookings.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center space-x-1.5 transition-all cursor-pointer select-none leading-none ${isRunning ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'}`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Stream</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => {
              setLogs(['SYSTEM: Telemetry buffer cleared. Monitoring stream reset.']);
            }}
            className="p-2.5 bg-brand-alternate border border-brand-border hover:bg-brand-surface text-brand-body rounded-xl cursor-pointer"
            title="Reset telemetry buffer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Terminal logs monitor screen */}
        <div className="lg:col-span-12 space-y-3">
          <div className="bg-[#0f172a] dark:bg-[#0b0f19] text-emerald-400 font-mono text-[11px] sm:text-xs p-5 rounded-2xl border border-brand-border shadow-2xl space-y-2 flex flex-col justify-between h-[400px] relative">
            <div className="absolute top-2 right-3 flex items-center space-x-1.5 text-brand-muted uppercase tracking-widest text-[9px] font-sans">
              <span className={`w-2 h-2 rounded-full inline-block ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{isRunning ? 'STREAM ACTIVE' : 'STREAM STALE'}</span>
            </div>

            <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono leading-relaxed select-text select-all">
              {logs.map((log, lIdx) => (
                <div key={lIdx} className={
                  log.includes('🚨') || log.includes('SYSTEM') ? 'text-teal-400 font-bold' :
                  log.includes('SECURITY') ? 'text-indigo-400' :
                  log.includes('OPERATION') ? 'text-amber-400 font-medium' :
                  'text-emerald-450 font-normal'
                }>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
