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
  const [logs, setLogs] = useState<{timestamp: string; type: string; message: string}[]>([]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate periodic background activity log and listen to real socket events
  useEffect(() => {
    if (!isRunning) return;

    // Listen to real socket events
    const handleCheckIn = (data: any) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(p => [...p, { timestamp, type: 'CHECK-IN', message: `Tenant Checked In (Booking ID: ${data.id.substring(0,8)}). Checked in by user ${data.checkedInBy}.` }]);
    };

    const handleCheckOut = (data: any) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(p => [...p, { timestamp, type: 'CHECK-OUT', message: `Tenant Checked Out (Booking ID: ${data.id.substring(0,8)}). Checked out by user ${data.checkedOutBy}.` }]);
    };

    import('../api/socket').then(({ socket }) => {
      socket.on('booking.checkedin', handleCheckIn);
      socket.on('booking.checkedout', handleCheckOut);
    });

    const interval = setInterval(() => {
      const activeProperties = properties.length > 0 ? properties : [{ name: 'Property' }];
      const propName = activeProperties[Math.floor(Math.random() * activeProperties.length)].name;
      
      const phrases = [
        { type: 'MAINTENANCE', message: `Maintenance Status Updated: Pending → In Progress at ${propName}.` },
        { type: 'MAINTENANCE', message: `Maintenance Status Updated: In Progress → Completed at ${propName}.` },
        { type: 'MAINTENANCE', message: `Maintenance Request Created at ${propName}.` },
        { type: 'BOOKING', message: `Booking Created: Tennis Court reserved at ${propName}.` },
        { type: 'BOOKING', message: `Booking Cancelled: Slot released at ${propName}.` },
        { type: 'CONFLICT', message: `Booking Conflict Prevented: Tennis Court on ${new Date().toISOString().split('T')[0]} (10:00 - 11:30) - Double booking detected at ${propName}.` }
      ];
      const randomEvent = phrases[Math.floor(Math.random() * phrases.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(p => [...p, { timestamp, type: randomEvent.type, message: randomEvent.message }]);
    }, 8000);

    return () => {
      clearInterval(interval);
      import('../api/socket').then(({ socket }) => {
        socket.off('booking.checkedin', handleCheckIn);
        socket.off('booking.checkedout', handleCheckOut);
      });
    };
  }, [isRunning, properties]);

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Real-Time Monitoring</h1>
          <p className="text-sm text-brand-body font-light mt-0.5">Monitor live maintenance requests, maintenance status updates, amenity bookings, check-ins, check-outs, and booking conflicts in real time.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center space-x-1.5 transition-all cursor-pointer select-none leading-none ${isRunning ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'}`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Pause Live Feed</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Live Feed</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => {
              setLogs([]);
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
              <span>{isRunning ? 'Real-Time Connected' : 'Live Feed Paused'}</span>
            </div>

            <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-3.5 pr-1 font-mono leading-relaxed select-text select-all py-2">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-emerald-400/50">
                  <p>
                    No live operational events.<br /><br />
                    Maintenance requests,<br />
                    status updates,<br />
                    bookings,<br />
                    check-ins,<br />
                    check-outs,<br />
                    and booking conflicts will appear here in real time.
                  </p>
                </div>
              ) : (
                logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex items-start space-x-3 text-[11px] sm:text-xs">
                    <span className="text-brand-muted shrink-0 w-16">[{log.timestamp}]</span>
                    
                    <span className={`shrink-0 px-2.5 py-0.5 rounded font-bold uppercase text-[9px] border w-24 text-center tracking-wider ${
                      log.type === 'MAINTENANCE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      log.type === 'BOOKING' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                      log.type === 'CHECK-IN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      log.type === 'CHECK-OUT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      log.type === 'CONFLICT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {log.type}
                    </span>
                    
                    <span className="text-brand-title font-sans font-medium flex-1">
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
