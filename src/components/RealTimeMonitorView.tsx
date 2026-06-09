import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Terminal, 
  Play, 
  Square, 
  Zap, 
  ShieldAlert, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MaintenanceRequest } from '../types.ts';

interface RealTimeMonitorViewProps {
  maintenance: MaintenanceRequest[];
  setMaintenance: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
}

export default function RealTimeMonitorView({
  maintenance,
  setMaintenance
}: RealTimeMonitorViewProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM: [09:26:01] Booting PropertyFlow real-time telemetry node...',
    'SYSTEM: [09:26:02] Cloud SQL replica pool connection resolved, ping latency: 4.2ms.',
    'SECURITY: [09:26:05] Authorized authentication certificate for element Eleanor Vance.',
    'METRIC: [09:26:12] Skyline Pool chemical status scan: pH level standing at 7.42 (Optimal).',
    'METRIC: [09:26:30] Elevator 3 Summit Heights West Wing reports standard cable friction coefficient: 0.12.'
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
      const phrases = [
        'METRIC: Elevator 1 Summit Heights reporting normal bypass sequence.',
        'SECURITY: Scanned structural temperature registers in Oakridge Court: 21.4°C.',
        'KPI: Refreshed booking arrays for Rooftop Tennis Court slot.',
        'SYSTEM: Heartbeat signal healthy. Cloud SQL latency standing at 4.1ms.',
        'TELEMETRY: Power subgrid 4 (Summit G-Level) wattage curve: 2.14kW (Nominal).'
      ];
      const randomMsg = phrases[Math.floor(Math.random() * phrases.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(p => [...p, `LOG: [${timestamp}] ${randomMsg}`]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSimulateAlarm = (type: 'boiler' | 'electrical' | 'hvac') => {
    const timestamp = new Date().toLocaleTimeString();
    
    let title = '';
    let desc = '';
    let category = '';
    let priority: 'High' | 'Urgent' = 'High';
    let unit = 'Suite 100';
    let p_id = 'prop-1';

    if (type === 'boiler') {
      title = 'Basement pressure release valve failure';
      desc = 'Boiler room thermostat scanner reads a spike to 125 PSI. Immediate water isolation recommended.';
      category = 'Plumbing';
      priority = 'Urgent';
      unit = 'Basement';
    } else if (type === 'electrical') {
      title = 'Power phase offset fluctuation warning';
      desc = 'Phase balance variance detected (>4.2%). Risk of elevator motor heat loop.';
      category = 'Electrical';
      priority = 'High';
      unit = 'Machine Room';
      p_id = 'prop-2';
    } else {
      title = 'AC compressor heat overload shutdown';
      desc = 'HVAC unit compressor thermistor trip detected in east corridor wing.';
      category = 'HVAC';
      priority = 'High';
      unit = 'East Corridor';
      p_id = 'prop-3';
    }

    const newTicket: MaintenanceRequest = {
      id: `maint-${Date.now()}`,
      title,
      description: desc,
      propertyId: p_id,
      unitNumber: unit,
      priority,
      status: 'Pending',
      createdBy: 'SYSTEM Telemetry',
      createdAt: new Date().toISOString(),
      category
    };

    setMaintenance([newTicket, ...maintenance]);
    setLogs(p => [
      ...p,
      `🚨 ALARM: [${timestamp}] CRITICAL METRICS BREACH DETECTED: ${title}.`,
      `SYSTEM: [${timestamp}] Dispatched new urgent maintenance request to Repair Logs.`
    ]);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Live Core Telemetry Signals</h1>
          <p className="text-sm text-brand-body font-light mt-0.5">Continuous diagnostics scanning from local IoT subgrids, boiler heat logs, and elevators.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center space-x-1.5 transition-all cursor-pointer select-none leading-none ${isRunning ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'}`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Pause Signals</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Signals</span>
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
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-[#0f172a] dark:bg-[#0b0f19] text-emerald-400 font-mono text-[11px] sm:text-xs p-5 rounded-2xl border border-brand-border shadow-2xl space-y-2 flex flex-col justify-between h-[360px] relative">
            <div className="absolute top-2 right-3 flex items-center space-x-1.5 text-brand-muted uppercase tracking-widest text-[9px] font-sans">
              <span className={`w-2 h-2 rounded-full inline-block ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{isRunning ? 'STREAM ACTIVE' : 'STREAM STALE'}</span>
            </div>

            <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono leading-relaxed select-text select-all">
              {logs.map((log, lIdx) => (
                <div key={lIdx} className={
                  log.includes('ALARM') ? 'text-rose-400 font-bold' :
                  log.includes('SECURITY') ? 'text-indigo-400' :
                  log.includes('METRIC') ? 'text-amber-400 font-medium' :
                  'text-emerald-400 font-normal'
                }>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alarm Injector Command Grid */}
        <div className="lg:col-span-4 bg-brand-surface rounded-2xl border border-brand-border p-5 shadow-sm space-y-4 font-sans">
          <div>
            <h4 className="text-sm font-extrabold text-brand-title">Incident Signal Injector</h4>
            <p className="text-xs text-brand-body font-light mt-0.5">Manually trip hardware registers to verify operational alert dispatches and queue assignments.</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleSimulateAlarm('boiler')}
              className="w-full text-left p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 font-bold hover:bg-rose-500/20 transition-all flex justify-between items-center text-xs cursor-pointer"
            >
              <span>♨ Boiler Overpressure Alarm</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </button>

            <button
              onClick={() => handleSimulateAlarm('electrical')}
              className="w-full text-left p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 font-bold hover:bg-amber-500/20 transition-all flex justify-between items-center text-xs cursor-pointer"
            >
              <span>⚡ Core Subgrid Phase Deviation</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => handleSimulateAlarm('hvac')}
              className="w-full text-left p-3.5 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-xl text-primary-teal font-bold hover:bg-[#14B8A6]/20 transition-all flex justify-between items-center text-xs cursor-pointer"
            >
              <span>❄ HVAC Thermal Cutoff Alert</span>
              <Activity className="w-4 h-4 text-primary-teal" />
            </button>
          </div>

          <div className="p-3 bg-brand-alternate border border-brand-border rounded-xl text-[10px] text-brand-muted leading-normal font-mono flex items-start space-x-1.5 mt-2">
            <Terminal className="w-4.5 h-4.5 text-slate-500 mt-0.5 shrink-0" />
            <span>Telemetry metrics mapped to server-side socket handlers. Alarm inputs reflect instantly inside core databases.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
