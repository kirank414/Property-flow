import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Save, 
  KeyRound,
  CheckCircle2,
  Code2,
  CheckSquare,
  FileCheck,
  Phone
} from 'lucide-react';
import { User as UserType } from '../types.ts';

interface UserProfileViewProps {
  currentUser: UserType;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  properties: any[];
  simulationState: 'normal' | 'network' | 'unauthorized' | 'session';
  setSimulationState: (state: 'normal' | 'network' | 'unauthorized' | 'session') => void;
}

export default function UserProfileView({
  currentUser,
  setCurrentUser,
  properties,
  simulationState,
  setSimulationState
}: UserProfileViewProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);
  const [audioAlerts, setAudioAlerts] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Find user property complex name if they are a tenant
  const userComplex = currentUser.propertyId 
    ? properties.find(p => p.id === currentUser.propertyId)?.name || 'Summit Heights'
    : 'All Portfolio Complexes';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => {
      if (prev) {
        return {
          ...prev,
          name,
          email,
          phone
        };
      }
      return null;
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="border-b border-brand-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Personal Accounts Workspace</h1>
        <p className="text-sm text-brand-body font-light mt-0.5">Edit contact details, audit authorization level settings, and set security keys.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-7 shadow-sm space-y-6">
            {/* Profile Card Header Banner */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b border-brand-border pb-5">
              <img 
                src={currentUser.avatarUrl || currentUser.avatar} 
                alt={currentUser.name} 
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary-teal/15"
                referrerPolicy="no-referrer"
              />
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-base font-extrabold text-brand-title">{currentUser.name}</h3>
                <span className="text-xs text-brand-body block">{currentUser.email}</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5 justify-center sm:justify-start">
                  <span className="bg-primary-teal/15 text-primary-teal px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider font-mono">
                    {currentUser.role} Level
                  </span>
                  <span className="bg-brand-alternate text-brand-body px-2 py-0.5 rounded text-[9px] font-semibold border border-brand-border">
                    🏢 {userComplex}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Edit Form */}
            <form onSubmit={handleSave} className="space-y-5 font-sans">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-teal text-brand-title"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Security Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-teal text-brand-title"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Contact Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-teal text-brand-title"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Master Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-teal text-brand-title font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Estates Authorization Scope</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userComplex}
                    className="w-full pl-9 pr-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs text-brand-body select-none focus:outline-none font-medium"
                    disabled
                  />
                </div>
              </div>

              {/* Notification & Update Preferences */}
              <div className="border-t border-brand-border pt-4 space-y-3">
                <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider block font-sans">Notification & Update Preferences</h4>
                <div className="space-y-2.5 font-sans">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-brand-body select-none">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 text-[#14B8A6] bg-brand-alternate border-brand-border rounded focus:ring-[#14B8A6] cursor-pointer"
                    />
                    <span>Receive email notifications on critical maintenance updates</span>
                  </label>
                  
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-brand-body select-none">
                    <input
                      type="checkbox"
                      checked={realtimeUpdates}
                      onChange={(e) => setRealtimeUpdates(e.target.checked)}
                      className="w-4 h-4 text-[#14B8A6] bg-brand-alternate border-brand-border rounded focus:ring-[#14B8A6] cursor-pointer"
                    />
                    <span>Enable Real-Time Updates (auto-refresh panels)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-brand-body select-none">
                    <input
                      type="checkbox"
                      checked={audioAlerts}
                      onChange={(e) => setAudioAlerts(e.target.checked)}
                      className="w-4 h-4 text-[#14B8A6] bg-brand-alternate border-brand-border rounded focus:ring-[#14B8A6] cursor-pointer"
                    />
                    <span>Enable audio signals for booking alerts</span>
                  </label>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex items-center space-x-3 pt-3 border-t border-brand-border">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-teal hover:bg-primary-teal-hover text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 leading-none"
                >
                  <Save className="w-4 h-4 text-accent-teal" />
                  <span>Update Profile Info</span>
                </button>

                {isSaved && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1 animate-pulse">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Update verified!</span>
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Pre-Backend Integration Audit and API Contracts */}
        <div className="lg:col-span-5 bg-brand-surface rounded-3xl border border-brand-border p-6 shadow-sm space-y-6">
          <div className="border-b border-brand-border pb-3 flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-primary-teal" />
            <h3 className="text-sm sm:text-base font-extrabold text-brand-title">Pre-Backend Deployment Audit</h3>
          </div>

          <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl space-y-2 font-sans">
            <div className="flex items-center space-x-1.5 text-primary-teal font-extrabold text-[11px]">
              <FileCheck className="w-4.5 h-4.5 text-secondary-teal" />
              <span>API GATEWAY CONTRACT READY</span>
            </div>
            <p className="text-[11px] text-brand-body leading-relaxed font-light">
              All front-end page layouts, state managers, and data lists are modularly decoupled, type-safe, and ready to swap in axios/fetch calls.
            </p>
          </div>

          {/* Unified Type Contracts */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block font-sans">Active Data Models</span>
            
            <div className="divide-y divide-brand-border font-mono text-[10.5px] leading-relaxed text-brand-body">
              <div className="py-2.5 flex justify-between">
                <span className="font-bold text-brand-title">User Interface</span>
                <span className="text-brand-muted">id, name, email, role, avatarUrl, phone</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-bold text-brand-title">Property Schema</span>
                <span className="text-brand-muted">id, name, address, units, occupancy</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-bold text-brand-title">Dispatch Order</span>
                <span className="text-brand-muted">id, title, priority, status, unitNumber</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-bold text-brand-title">Booking Reservation</span>
                <span className="text-brand-muted">id, start, end, user, amenityName, price</span>
              </div>
            </div>
          </div>

          {/* Integration Checkpoints */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block font-sans border-t border-brand-border pt-4">Integration Checkpoint Checklist</span>
            
            <div className="space-y-2.5 pt-2 text-[11px] text-brand-body font-sans">
              <div className="flex items-start space-x-2">
                <CheckSquare className="w-4.5 h-4.5 text-primary-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-title">JWT Token Auth Flow</strong>
                  <span className="block text-[10px] text-brand-muted font-light leading-normal">Exchange credentials mock login for secure bearer token in header.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckSquare className="w-4.5 h-4.5 text-primary-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-title">Cloud SQL Seeding Scripts</strong>
                  <span className="block text-[10px] text-brand-muted font-light leading-normal">Initial setup schemas and security roles matching the platform database.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckSquare className="w-4.5 h-4.5 text-primary-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-title">Real-Time WebSocket Sync</strong>
                  <span className="block text-[10px] text-brand-muted font-light leading-normal">Connect local maintenance dispatch stream with socket event broadcasts.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure gateway status indicator */}
          <div className="p-3 bg-brand-alternate border border-brand-border rounded-xl leading-none flex justify-between items-center text-[10.5px]">
            <span className="font-bold text-brand-muted font-mono block">NODE GATEWAY</span>
            <span className="text-emerald-600 font-bold flex items-center space-x-1 font-sans">
              <span>●</span> <span>100% READY</span>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
