import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Eye, 
  Lock, 
  Mail, 
  CheckCircle,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  EyeOff
} from 'lucide-react';
import { User, Role } from '../types.ts';
import { AuthService } from '../api/services';
import { loginValidationSchema } from '../../shared/zod';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
  onBackToMarketing: () => void;
}

export default function LoginPage({ users, onLogin, onBackToMarketing }: LoginPageProps) {
  const [activeTabRole, setActiveTabRole] = useState<Role>('Manager');
  const [email, setEmail] = useState('manager@propertyflow.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Authentication screen states
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Quick select helper profiles
  const profiles: Record<Role, { email: string; name: string; desc: string; authScope: string }> = {
    Admin: {
      email: 'admin@propertyflow.com',
      name: 'System Admin',
      desc: 'Owner authorization level. Manage users, properties, amenities, and platform operations.',
      authScope: 'Global platform administration.'
    },
    Manager: {
      email: 'manager@propertyflow.com',
      name: 'Property Manager',
      desc: 'Portfolio operator role. Dispatches technicians, manages listings, and schedules bookings.',
      authScope: 'All properties in portfolio.'
    },
    Staff: {
      email: 'staff@propertyflow.com',
      name: 'Support Staff',
      desc: 'Maintenance staff role. Updates task tracking logs, claims repair orders, and completes site work.',
      authScope: 'Assigned maintenance tickets.'
    },
    Tenant: {
      email: 'tenant.a@example.com',
      name: 'Tenant A',
      desc: 'Rental occupant role. Submits maintenance requests and reserves amenities.',
      authScope: 'Assigned rental unit.'
    }
  };

  const selectQuickRole = (role: Role) => {
    setActiveTabRole(role);
    setEmail(profiles[role].email);
    setPassword('password123');
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsAuthenticating(true);

    const actualPassword = password;

    try {
      // Zod Validation
      loginValidationSchema.parse({ email, password: actualPassword });
      
      const userDto = await AuthService.login({ email, password: actualPassword });
      
      let role: 'Admin' | 'Manager' | 'Staff' | 'Tenant' = 'Tenant';
      if (userDto.role === 'ADMIN') role = 'Admin';
      else if (userDto.role === 'MANAGER') role = 'Manager';
      else if (userDto.role === 'STAFF') role = 'Staff';

      const user: User = {
        id: userDto.id,
        email: userDto.email,
        name: `${userDto.firstName} ${userDto.lastName}`,
        role,
        avatarUrl: userDto.avatarUrl || undefined,
        propertyId: userDto.propertyId || undefined,
      };

      onLogin(user);
    } catch (err: any) {
      if (err.errors) {
        // Zod validation error
        setErrorMessage(err.errors[0].message);
      } else {
        const errorMsg = err.response?.data?.message || err.response?.data?.error?.message;
        if (errorMsg && (errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('credential'))) {
          setErrorMessage('Wrong password. Please try again.');
        } else {
          setErrorMessage(errorMsg || 'Invalid credentials. Please try again.');
        }
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    try {
      setIsAuthenticating(true);
      await AuthService.resetPasswordImmediate({ email: forgotEmail, newPassword });
      setResetError(null);
      setForgotSubmitted(true);
      setTimeout(() => {
        setForgotSubmitted(false);
        setMode('login');
        setPassword(newPassword);
        setEmail(forgotEmail);
        setNewPassword('');
        setConfirmPassword('');
      }, 3000);
    } catch (err: any) {
      setResetError(err.response?.data?.message || err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    try {
      await AuthService.resetPassword({ token: 'dummy-token', newPassword });
      setResetError(null);
      setResetSubmitted(true);
      setTimeout(() => {
        setResetSubmitted(false);
        setMode('login');
        setPassword(newPassword);
      }, 2000);
    } catch (err: any) {
      setResetError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] grid lg:grid-cols-12 font-sans select-none">
      
      {/* Left Column (Geometric branding, only visible on larger screens) */}
      <div className="hidden lg:flex lg:col-span-6 bg-[#111827] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-[#334155]">
        
        {/* Abstract futuristic grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35"></div>
 
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
            PropertyFlow Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Secure Access to PropertyFlow
          </h2>
          <p className="text-sm font-light text-slate-300 leading-relaxed font-sans">
            Sign in to manage maintenance requests, amenity bookings, and real-time property operations.
          </p>

          <div className="bg-[#1E293B]/60 p-5 rounded-2xl border border-[#334155] space-y-4 font-sans">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#334155]/60 pb-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider">Platform Capabilities</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></div>
                <span>Secure Authentication</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></div>
                <span>Real-Time Status Updates</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></div>
                <span>Maintenance Tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></div>
                <span>Amenity Booking Management</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer info lock */}
        <div className="text-[11px] text-slate-400 font-mono relative z-10 flex items-center space-x-1">
          <CheckCircle className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>All platform connections are encrypted.</span>
        </div>
      </div>

      {/* Right Column */}
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

          {mode === 'login' && (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-[#F8FAFC] leading-none">Sign In</h1>
                <p className="text-sm text-[#CBD5E1] font-light">
                  Select a demo user role below to quickly log in and test the platform capabilities.
                </p>
              </div>

              {/* Quick simulation helper widget */}
              <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center font-sans">
                  <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-wider flex items-center space-x-1">
                    <span>⚡</span> <span>Select User Role</span>
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
                      {activeTabRole === 'Manager' && '🏨 Property Manager'}
                      {activeTabRole === 'Admin' && '🛡️ System Administrator'}
                      {activeTabRole === 'Staff' && '🛠️ Maintenance Staff'}
                      {activeTabRole === 'Tenant' && '🔑 Rental Tenant'}
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
              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs p-3 rounded-xl font-sans">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider select-none">
                    Email Address
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
                      Password
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotSubmitted(false);
                        setMode('forgot');
                      }}
                      className="text-xs text-[#14B8A6] hover:text-[#14B8A6]/90 font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-[#334155] rounded-xl text-[#F8FAFC] bg-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#14B8A6] text-sm focus:ring-1 focus:ring-[#14B8A6] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
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
                    <span>Remember this device</span>
                  </label>
                </div>

                {/* CTA action trigger button */}
                <button
                  type="submit"
                  id="submit-login-btn"
                  className="w-full py-3.5 bg-[#14B8A6] hover:bg-[#0F766E] text-white font-semibold text-sm rounded-xl shadow-md shadow-primary-teal/15 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Sign In as {activeTabRole}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>
            </>
          )}

          {mode === 'forgot' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-[#F8FAFC] leading-none">Reset Password</h1>
                <p className="text-sm text-[#CBD5E1] font-light">
                  Specify your email and input your new password to reset it immediately.
                </p>
              </div>

              {forgotSubmitted ? (
                <div className="bg-[#1E293B] border border-[#334155] p-6 rounded-2xl text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-[#F8FAFC] text-sm">Password Changed Successfully</h4>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed font-light">
                      Your password has been updated. Redirecting you to the sign in page...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  {resetError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-450 text-xs font-sans">
                      {resetError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider select-none">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@propertyflow.com"
                        className="w-full pl-10 pr-4 py-3 border border-[#334155] rounded-xl text-[#F8FAFC] bg-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#14B8A6] text-sm focus:ring-1 focus:ring-[#14B8A6] transition-all font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider select-none">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full pl-10 pr-10 py-3 border border-[#334155] rounded-xl text-[#F8FAFC] bg-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#14B8A6] text-sm focus:ring-1 focus:ring-[#14B8A6] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider select-none">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-10 pr-10 py-3 border border-[#334155] rounded-xl text-[#F8FAFC] bg-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#14B8A6] text-sm focus:ring-1 focus:ring-[#14B8A6] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3.5 bg-[#14B8A6] hover:bg-[#0F766E] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isAuthenticating ? 'Resetting...' : 'Reset Password Immediately'}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </form>
              )}

              <div className="text-center">
                <button
                  onClick={() => setMode('login')}
                  className="text-xs text-[#14B8A6] hover:text-[#14B8A6]/90 font-bold"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          {mode === 'reset' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-[#F8FAFC] leading-none">Change Password</h1>
                <p className="text-sm text-[#CBD5E1] font-light">
                  Enter your new password below.
                </p>
              </div>

              {resetSubmitted ? (
                <div className="bg-[#1E293B] border border-[#334155] p-6 rounded-2xl text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-455 rounded-full flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-[#F8FAFC] text-sm">Password Changed Successfully</h4>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed font-light">
                      Your password has been successfully updated. Redirecting to the sign in page.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  {resetError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-450 text-xs font-sans">
                      {resetError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider select-none">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-10 pr-10 py-3 border border-[#334155] rounded-xl text-[#F8FAFC] bg-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#14B8A6] text-sm focus:ring-1 focus:ring-[#14B8A6] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider select-none">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-10 pr-10 py-3 border border-[#334155] rounded-xl text-[#F8FAFC] bg-[#111827] placeholder-slate-500 focus:outline-none focus:border-[#14B8A6] text-sm focus:ring-1 focus:ring-[#14B8A6] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#14B8A6] hover:bg-[#0F766E] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Save New Password</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </form>
              )}

              <div className="text-center">
                <button
                  onClick={() => setMode('login')}
                  className="text-xs text-[#14B8A6] hover:text-[#14B8A6]/90 font-bold"
                >
                  Cancel and Return
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom credits */}
        <div className="text-center text-[10px] text-[#94A3B8] font-mono mt-8">
          PropertyFlow Systems.
        </div>

      </div>

    </div>
  );
}
