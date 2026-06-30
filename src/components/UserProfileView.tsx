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
  Phone,
  Eye,
  EyeOff
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
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);
  const [audioAlerts, setAudioAlerts] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          phone,
          avatarUrl: avatarUrl || undefined
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">Personal Space</h1>
        <p className="text-sm text-brand-body font-light mt-0.5">Manage your profile information, contact details, password, and notification preferences.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-7 shadow-sm space-y-6">
            {/* Profile Card Header Banner */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b border-brand-border pb-5">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={currentUser.name} 
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary-teal/15"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-16 h-16 rounded-2xl ring-4 ring-primary-teal/15 bg-gradient-to-br from-primary-teal/30 to-primary-teal/10 text-primary-teal flex items-center justify-center text-xl font-bold shrink-0 ${avatarUrl ? 'hidden' : ''}`}>
                {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2)}
              </div>
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
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Email Address</label>
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

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Profile Image URL (Optional)</label>
                  <span className="text-[10px] text-brand-muted font-mono">Leave empty for default</span>
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/profile-image.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-brand-alternate border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/15 text-brand-title transition-all"
                />
                {avatarUrl && (
                  <div className="mt-2 flex items-center space-x-3">
                    <img 
                      src={avatarUrl} 
                      alt="Profile preview" 
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary-teal/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-[10px] text-rose-500 hover:text-rose-600 font-semibold underline"
                    >
                      Remove image
                    </button>
                  </div>
                )}
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

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Password</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value="••••••••••••"
                        readOnly
                        className="w-full pl-9 pr-4 py-2 bg-brand-alternate/50 border border-brand-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-teal text-brand-muted font-mono cursor-not-allowed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="px-4 py-2 bg-brand-alternate border border-brand-border hover:bg-brand-surface text-brand-title text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-body uppercase tracking-wider block">Assigned Property</label>
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

        {/* Right Column: Account Information */}
        <div className="lg:col-span-5 bg-brand-surface rounded-3xl border border-brand-border p-6 shadow-sm space-y-6 flex flex-col">
          <div className="border-b border-brand-border pb-3 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary-teal" />
            <h3 className="text-sm sm:text-base font-extrabold text-brand-title">Account Information</h3>
          </div>

          <div className="space-y-5 pt-2 font-sans flex-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Role</span>
              <span className="text-xs font-bold text-brand-title">{currentUser.role}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Account Status</span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">Active</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Last Login</span>
              <span className="text-xs font-medium text-brand-title">
                {(() => {
                  const d = (currentUser as any).lastLoginAt ? new Date((currentUser as any).lastLoginAt) : new Date();
                  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
                })()}
              </span>
            </div>
            
            <div className="flex flex-col space-y-2 border-t border-brand-border pt-4 mt-4">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Assigned Properties</span>
              <span className="text-sm font-bold text-brand-title">{userComplex}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
