import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Eye, 
  Lock, 
  Mail, 
  CheckCircle,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { User, Role } from '../types.ts';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
  onBackToMarketing: () => void;
}

export default function LoginPage({ users, onLogin, onBackToMarketing }: LoginPageProps) {
  const [activeTabRole, setActiveTabRole] = useState<Role>('Manager');
  const [email, setEmail] = useState('marcus@propertyflow.com');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Quick select helper profiles
  const profiles: Record<Role, { email: string; name: string; desc: string; authScope: string }> = {
    Admin: {
      email: 'eleanor@propertyflow.com',
      name: 'Eleanor Vance',
      desc: 'Owner authorization level. Complete security logs, configuration panels, database metrics access.',
      authScope: 'Global root level access controls status.'
    },
    Manager: {
      email: 'marcus@propertyflow.com',
      name: 'Marcus Brody',
      desc: 'Portfolio operator role. Dispatches techs, manages listings, schedules bookings and views SLA metrics.',
      authScope: 'All listed Evergreen and Peachtree estates.'
    },
    Staff: {
      email: 'dave@propertyflow.com',
      name: 'Dave Miller',
      desc: 'Technical dispatcher staff. Updates task tracking logs, claims repair orders, completes site safety work.',
      authScope: 'Local maintenance crew tickets.'
    },
    Tenant: {
      email: 'sarah@propertyflow.com',
      name: 'Sarah Connor',
      desc: 'Rental occupant profile. Submits repair tickets, reserves skyline pools/court facilities.',
      authScope: 'Summit Heights Suite 402 only.'
    }
  };

  const selectQuickRole = (role: Role) => {
    setActiveTabRole(role);
    setEmail(profiles[role].email);
    setPassword('••••••••');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Match simulated user
    const matchedUser = users.find(u => u.role === activeTabRole);
    if (matchedUser) {
      onLogin(matchedUser);
    } else {
      alert('Mock Error: Simulated authentication scope failure.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] grid lg:grid-cols-12 font-sans select-none">
      
      {/* Left Column (Geometric branding, only visible on larger screens) */}
      <div className="hidden lg:flex lg:col-span-6 bg-[#111827] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-[#334155]">
        
        {/* Abstract futuristic grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-teal rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-teal rounded-full blur-3xl opacity-15"></div>
 
        {/* Brand */}
        <div className="flex items-center space-x-2 relative z-10 cursor-pointer" onClick={onBackToMarketing}>
          <div className="w-10 h-10 bg-[#14B8A6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-teal/10 animate-pulse">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-accent-teal to-secondary-teal bg-clip-text text-transparent">
            PropertyFlow
          </span>
        </div>

        {/* Feature Slider Mockup */}
        <div className="space-y-6 relative z-10 max-w-lg">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-primary-teal/25 border border-primary-teal/30 text-accent-teal uppercase tracking-widest inline-block leading-none">
            Enterprise Single Sign-On
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Seamless operational flow.<br />Under 100% security SLA.
          </h2>
          <p className="text-sm font-light text-slate-300 leading-relaxed font-sans">
            Eliminate endless notification gaps, unlogged emails, and scheduling overlaps. Sign in to instantly manage premium rentals, incident tracking timelines, and facility availability bookings.
          </p>

          <div className="bg-[#1E293B]/60 p-5 rounded-2xl border border-[#334155] space-y-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">System Integration Status</span>
              <span className="text-accent-teal font-mono">100% Operational</span>
            </div>
            <div className="h-1 bg-[#111827] rounded-full overflow-hidden">
              <div className="h-full bg-[#14B8A6] w-full rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
              <div>
                <span className="font-mono text-white font-bold block">1.4ms</span>
                <span className="block mt-0.5 text-slate-500">Node Sync API</span>
              </div>
              <div className="border-x border-[#334155]">
                <span className="font-mono text-white font-bold block">99.99%</span>
                <span className="block mt-0.5 text-slate-500">Uptime Pool</span>
              </div>
              <div>
                <span className="font-mono text-white font-bold block">0 errors</span>
                <span className="block mt-0.5 text-slate-500">Core Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info lock */}
        <div className="text-[11px] text-slate-400 font-mono relative z-10 flex items-center space-x-1">
          <KeyRound className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>AES-256 Multi-Factor Authenticated Core Logs.</span>
        </div>
      </div>

      {/* Right Column (Standard Login form) */}
      <div className="col-span-12 lg:col-span-6 p-6 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-between bg-[#0F172A] text-[#CBD5E1]">
        
        {/* Mobile brand header (only visible when Left column is hidden) */}
        <div className="flex lg:hidden items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#14B8A6] rounded-lg flex items-center justify-center text-white">
              <Building2 className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg text-[#F8FAFC]">PropertyFlow</span>
          </div>
          <button 
            onClick={onBackToMarketing} 
            className="text-xs font-semibold text-[#14B8A6] hover:text-[#14B8A6]/90 cursor-pointer"
          >
            Back to website
          </button>
        </div>

        {/* Form Container wrapping */}
        <div className="max-w-md w-full mx-auto my-auto space-y-8">
          
          <div className="hidden lg:block">
            <button 
              onClick={onBackToMarketing}
              className="text-xs font-semibold text-[#CBD5E1] hover:text-[#14B8A6] transition-colors flex items-center mb-4 cursor-pointer"
            >
              ← Back to marketing site
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[#F8FAFC] leading-none">Security Sign-In</h1>
            <p className="text-sm text-[#CBD5E1] font-light">
              Select a simulated test role below to immediately populate verified mock credential parameters.
            </p>
          </div>

          {/* Quick simulation helper widget */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-wider flex items-center space-x-1 font-sans">
                <span>⚡</span> <span>Demo Role Simulator</span>
              </span>
              <span className="text-[10px] text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded font-mono uppercase font-bold animate-pulse border border-[#14B8A6]/20">
                Click to Test
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-sans">
              {(['Manager', 'Admin', 'Staff', 'Tenant'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  id={`quick-login-${r.toLowerCase()}`}
                  onClick={() => selectQuickRole(r)}
                  className={`py-2 text-[10px] sm:text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${activeTabRole === r ? 'bg-[#14B8A6] text-white border-[#14B8A6] shadow-sm' : 'bg-[#111827] text-[#CBD5E1] border-[#334155] hover:bg-[#1E293B]'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Quick role capabilities preview */}
            <div className="bg-[#111827] border border-[#334155] rounded-lg p-3 text-xs text-[#CBD5E1] space-y-1">
              <div className="flex justify-between items-center bg-[#1E293B] p-1.5 rounded-md">
                <span className="font-extrabold text-[#F8FAFC]">
                  {activeTabRole === 'Manager' && '🏨 Property Manager Profile'}
                  {activeTabRole === 'Admin' && '🛡️ System Administrator Profile'}
                  {activeTabRole === 'Staff' && '🛠️ Maintenance Service Officer'}
                  {activeTabRole === 'Tenant' && '🔑 Registered Rental Tenant'}
                </span>
                <span className="text-[9px] font-mono text-[#14B8A6] font-bold uppercase">{activeTabRole} LEVEL</span>
              </div>
              <p className="mt-1 font-sans leading-normal text-[#CBD5E1] text-[11px]">{profiles[activeTabRole].desc}</p>
              <div className="text-[10px] text-[#94A3B8] font-medium">
                <span className="font-bold text-[#CBD5E1]">Scope:</span> {profiles[activeTabRole].authScope}
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider select-none">
                Work Security Email
              </label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@propertyflow.com"
                  className="w-full pl-10 pr-4 py-3 border border-[#334155] rounded-xl text-[#F8FAFC] bg-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#14B8A6] text-sm focus:ring-1 focus:ring-[#14B8A6] transition-all font-sans"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 font-sans">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider select-none">
                  Security Password
                </label>
                <button 
                  type="button"
                  onClick={() => alert("Simulated: Check work email files to restore code.")}
                  className="text-xs text-[#14B8A6] hover:text-[#14B8A6]/90 font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-[#334155] rounded-xl text-[#F8FAFC] bg-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#14B8A6] text-sm focus:ring-1 focus:ring-[#14B8A6] transition-all"
                  required
                />
                <Eye className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
              </div>
            </div>

            {/* Remember me toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer text-sm font-light text-[#CBD5E1] select-none font-sans">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#14B8A6] bg-[#111827] border-[#334155] rounded focus:ring-[#14B8A6] cursor-pointer"
                />
                <span>Keep me signed in for 30 days</span>
              </label>
            </div>

            {/* CTA action trigger button */}
            <button
              type="submit"
              id="submit-login-btn"
              className="w-full py-3.5 bg-[#14B8A6] hover:bg-[#0F766E] text-white font-semibold text-sm rounded-xl shadow-md shadow-primary-teal/15 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Authenticate as {activeTabRole}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>

        </div>

        {/* Bottom credits */}
        <div className="text-center text-[10px] text-[#94A3B8] font-mono mt-8">
          PropertyFlow Systems Secure Gateway. Authorized Personnel ONLY.
        </div>

      </div>

    </div>
  );
}
