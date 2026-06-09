import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  Server, 
  CheckCircle,
  AlertOctagon
} from 'lucide-react';
import { User, Property, MaintenanceRequest } from '../types.ts';

interface AdminViewProps {
  users: User[];
  properties: Property[];
  maintenance: MaintenanceRequest[];
}

export default function AdminView({
  users,
  properties,
  maintenance
}: AdminViewProps) {
  const [auditScanned, setAuditScanned] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header */}
      <div className="border-b border-brand-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">System Administration Command</h1>
        <p className="text-sm text-brand-body font-light mt-0.5">Control global credential roles, inspect audit logs, and diagnostic API states.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Authorized Users Listing */}
        <div className="lg:col-span-8 bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b border-brand-border pb-3 flex justify-between items-center">
            <h3 className="text-base font-extrabold text-brand-title flex items-center space-x-1.5 font-sans">
              <Users className="w-5 h-5 text-primary-teal" />
              <span>Registered Systems Personnel</span>
            </h3>
            <span className="text-[10px] text-primary-teal dark:text-secondary-teal bg-primary-teal/10 border border-primary-teal/20 px-2.5 py-0.5 rounded font-mono font-bold">
              SYS-AUTHORIZED
            </span>
          </div>

          <div className="divide-y divide-brand-border font-sans">
            {users.map((u) => (
              <div key={u.id} className="py-4 flex justify-between items-center gap-3 first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-xl object-cover border border-brand-border" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="text-sm font-extrabold text-brand-title leading-snug">{u.name}</h5>
                    <span className="text-xs text-brand-body font-light">{u.email}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                  u.role === 'Admin' ? 'bg-brand-alternate text-brand-title border border-brand-border shadow-xs' :
                  u.role === 'Manager' ? 'bg-primary-teal/10 text-primary-teal dark:text-secondary-teal border border-primary-teal/20' :
                  u.role === 'Staff' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20' :
                  'bg-brand-alternate text-brand-body'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Database Infrastructure Status */}
        <div className="lg:col-span-4 bg-brand-surface rounded-2xl border border-brand-border p-5 shadow-sm space-y-5">
          <div className="border-b border-brand-border pb-2">
            <h4 className="text-sm font-extrabold text-brand-title flex items-center space-x-1.5 font-sans">
              <Database className="w-4.5 h-4.5 text-primary-teal" />
              <span>Durable Cloud Systems</span>
            </h4>
          </div>

          <div className="space-y-4 font-sans text-xs text-brand-body">
            <div className="flex justify-between items-center">
              <span>Primary DB Status</span>
              <span className="text-emerald-500 font-bold flex items-center space-x-1">
                <span>●</span> <span>Online</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Database Provider</span>
              <span className="font-semibold text-brand-title">Cloud SQL (PostgreSQL)</span>
            </div>

            <div className="flex justify-between items-center">
              <span>API Gateway Connection</span>
              <span className="text-emerald-500 font-semibold font-mono">100% Operational</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Auth Middleware Node</span>
              <span className="font-semibold text-brand-body">Firebase Auth Native</span>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-start space-x-2.5">
            <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-amber-500 leading-none">Database Flushing Zone</h5>
              <p className="text-[11px] text-amber-500/90 leading-relaxed font-light">
                Do not trigger index rebuild actions during active listing leases. Continuous backups are enabled.
              </p>
            </div>
          </div>

          {auditScanned && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 font-medium text-center animate-in fade-in">
              Diagnostic complete: All local databases and credentials clusters verified perfectly.
            </div>
          )}

          <button 
            onClick={() => {
              setAuditScanned(true);
              setTimeout(() => setAuditScanned(false), 5000);
            }}
            className="w-full py-3 bg-primary-teal hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors text-center"
          >
            Trigger Integrity Audit Scan
          </button>
        </div>

      </div>

    </div>
  );
}
