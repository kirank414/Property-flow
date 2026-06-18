import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Check, 
  Menu, 
  X, 
  TrendingUp, 
  Shield, 
  Activity, 
  Zap, 
  Users,
  ShieldCheck,
  Star,
  Sparkles,
  BarChart3,
  Flame,
  Clock,
  ChevronRight,
  Database,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onGetStarted: () => void;
  theme?: 'light' | 'dark' | 'system';
  setTheme?: (theme: 'light' | 'dark' | 'system') => void;
}

export default function LandingPage({ 
  onLoginClick, 
  onGetStarted,
  theme = 'system',
  setTheme
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [heroTab, setHeroTab] = useState<'analytics' | 'maintenance' | 'scheduling'>('analytics');
  const [activeSection, setActiveSection] = useState<'home' | 'features' | 'pricing'>('home');

  const stats = [
    { 
      label: 'MAINTENANCE RESOLUTION TARGET', 
      value: '≤ 48 Hours', 
      change: 'Target Resolution Time',
      icon: Activity,
      trend: 'stable'
    },
    { 
      label: 'REQUEST COMPLETION RATE GOAL', 
      value: '≥ 90%', 
      change: 'Target Completion Rate',
      icon: Check,
      trend: 'up'
    },
    { 
      label: 'AMENITY BOOKING CONFLICT GOAL', 
      value: '0', 
      change: 'Conflict-Free Booking Target',
      icon: Zap,
      trend: 'stable'
    },
    { 
      label: 'SYSTEM RESPONSE TIME GOAL', 
      value: '≤ 2 Seconds', 
      change: 'System Response Time Goal',
      icon: Clock,
      trend: 'up'
    },
    { 
      label: 'USER SATISFACTION GOAL', 
      value: '≥ 4 / 5', 
      change: 'Target Satisfaction Score',
      icon: Star,
      trend: 'up'
    }
  ];

  const features = [
    { 
      title: 'Real-Time Maintenance Tracking', 
      description: 'Create maintenance requests, monitor progress, and receive real-time status updates. Improve visibility between tenants and property owners while reducing delays and communication gaps.',
      icon: Activity,
      status: 'Maintenance Management'
    },
    { 
      title: 'Amenity Booking Management', 
      description: 'View amenity availability, reserve time slots, manage check-in and check-out activities, and prevent double-booking conflicts through centralized scheduling.',
      icon: Zap,
      status: 'Amenity Management'
    },
    { 
      title: 'Real-Time Operations Dashboard', 
      description: 'Monitor maintenance activity, amenity usage, and operational status from a centralized dashboard designed for transparency and efficient property management.',
      icon: BarChart3,
      status: 'Dashboard Monitoring'
    }
  ];



  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] font-sans selection:bg-[#CCFBF1] selection:text-[#0F766E] scroll-smooth antialiased transition-colors duration-200">
      
      {/* Structural Header & Navbar */}
      <nav id="navbar" className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-[10px] sticky top-0 z-50 border-b border-[#E2E8F0] dark:border-[#334155] h-16 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => { setActiveSection('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="w-9 h-9 bg-[#0F766E] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#0F766E]/20">
                <Building2 className="w-5 h-5 text-[#5EEAD4]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#0F172A] dark:text-[#F8FAFC] font-sans">
                PropertyFlow
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1]">
              <button 
                onClick={() => setActiveSection('features')} 
                className={`hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors bg-transparent border-0 cursor-pointer p-0 font-semibold text-xs uppercase tracking-wider focus:outline-none ${activeSection === 'features' ? 'text-[#0F766E] dark:text-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1]'}`}
              >
                Platform Features
              </button>
              <button 
                onClick={() => setActiveSection('pricing')} 
                className={`hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors bg-transparent border-0 cursor-pointer p-0 font-semibold text-xs uppercase tracking-wider focus:outline-none ${activeSection === 'pricing' ? 'text-[#0F766E] dark:text-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1]'}`}
              >
                System Modules
              </button>
            </div>

            {/* Access Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {setTheme && (
                <button
                  onClick={() => {
                    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
                    setTheme(nextTheme);
                  }}
                  className="p-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#1E293B] dark:hover:bg-[#334155] text-[#64748B] dark:text-[#CBD5E1] rounded-xl transition-all cursor-pointer flex items-center justify-center border border-transparent dark:border-[#334155]"
                  title={`Switch visual theme (Current: ${theme})`}
                >
                  {theme === 'light' && <Sun className="w-4 h-4 text-amber-500 animate-[spin_10s_linear_infinite]" />}
                  {theme === 'dark' && <Moon className="w-4 h-4 text-[#14B8A6]" />}
                  {theme === 'system' && <Laptop className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />}
                </button>
              )}

              <button 
                id="landing-login-btn"
                onClick={onLoginClick} 
                className="text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F766E] dark:hover:text-[#14B8A6] text-xs font-bold uppercase tracking-wider transition-colors px-3 py-2 cursor-pointer"
              >
                Sign In
              </button>
              
              <button 
                id="landing-cta-btn"
                onClick={onGetStarted} 
                className="bg-[#0F766E] hover:bg-[#115E59] dark:bg-[#14B8A6] dark:hover:bg-[#0F766E] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-[12px] shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Launch Demo Matrix</span>
                <ArrowRight className="w-4 h-4 text-[#5EEAD4] dark:text-white" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#64748B] dark:text-[#CBD5E1] p-2 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] p-5 space-y-4 shadow-xl">
            <button 
              onClick={() => { setActiveSection('features'); setMobileMenuOpen(false); }} 
              className={`block w-full text-left py-1 text-xs font-bold uppercase tracking-wide transition-colors bg-transparent border-0 cursor-pointer focus:outline-none ${activeSection === 'features' ? 'text-[#0F766E] dark:text-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F766E] dark:hover:text-[#14B8A6]'}`}
            >
              Features
            </button>
            <button 
              onClick={() => { setActiveSection('pricing'); setMobileMenuOpen(false); }} 
              className={`block w-full text-left py-1 text-xs font-bold uppercase tracking-wide transition-colors bg-transparent border-0 cursor-pointer focus:outline-none ${activeSection === 'pricing' ? 'text-[#0F766E] dark:text-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F766E] dark:hover:text-[#14B8A6]'}`}
            >
              System Modules
            </button>
            
            {setTheme && (
              <div className="flex items-center justify-between py-1 px-1">
                <span className="text-xs font-bold uppercase tracking-wide text-[#64748B] dark:text-[#CBD5E1]">App Theme</span>
                <div className="flex bg-[#F1F5F9] dark:bg-[#111827] p-0.5 rounded-lg border border-transparent dark:border-[#334155]">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all flex items-center space-x-1 cursor-pointer capitalize ${theme === t ? 'bg-white dark:bg-[#1E293B] text-primary-teal dark:text-[#14B8A6] shadow-xs' : 'text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                      {t === 'light' && <Sun className="w-3.5 h-3.5" />}
                      {t === 'dark' && <Moon className="w-3.5 h-3.5" />}
                      {t === 'system' && <Laptop className="w-3.5 h-3.5" />}
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-[#E2E8F0] dark:border-[#334155]" />
            <div className="space-y-3 pt-1">
              <button 
                onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC]"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
                className="w-full bg-[#0F766E] dark:bg-[#14B8A6] text-white text-center py-3 rounded-xl font-bold font-sans shadow-md cursor-pointer text-xs uppercase tracking-wider"
              >
                Launch Demo Matrix
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {(activeSection === 'home' || activeSection === 'features') && (
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 lg:py-0 overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0F172A] dark:to-[#111827] border-b border-[#E2E8F0] dark:border-[#334155] lg:min-h-[600px] lg:h-[650px] lg:flex lg:items-center">
        
        {/* Subtle grid elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full lg:h-full lg:flex lg:items-stretch">
          <div className="w-full lg:grid lg:grid-cols-12 lg:gap-16 items-stretch relative">
            
            {/* Left Column Text & Buttons */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-6 sm:space-y-7 lg:py-16 lg:flex lg:flex-col lg:justify-center">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-[#14B8A6]/10 border border-teal-100 dark:border-[#14B8A6]/20 text-[#0F766E] dark:text-[#5EEAD4] uppercase tracking-widest leading-none">
                <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>REAL-TIME PROPERTY MANAGEMENT PLATFORM</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-[1.05] font-sans">
                Manage Properties, Maintenance<br />
                <span className="text-[#0F766E] dark:text-[#14B8A6]">
                  & Amenities In One Platform
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-[#64748B] dark:text-[#CBD5E1] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                PropertyFlow centralizes maintenance requests, amenity bookings, and real-time operational visibility in one platform. Improve transparency between tenants and property owners while reducing conflicts and manual coordination.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-[12px] text-white font-bold bg-[#0F766E] hover:bg-[#115E59] dark:bg-[#14B8A6] dark:hover:bg-[#0F766E] shadow-md shadow-[#0F766E]/10 transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Launch Demo Matrix</span>
                  <ArrowRight className="w-4.5 h-4.5 text-[#5EEAD4] dark:text-white" />
                </button>
                
                <button
                  onClick={onLoginClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-[12px] text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] hover:bg-[#F8FAFC] dark:hover:bg-[#111827] font-bold transition-all text-xs uppercase tracking-wider cursor-pointer"
                >
                  Verify Active Session
                </button>
              </div>

              {/* Compliance Trust Flags */}
              <div className="pt-6 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-wrap justify-center lg:justify-start gap-6 items-center text-[#64748B] dark:text-[#CBD5E1]">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-[#10B981]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">SLA Target: ≤ 48h Resolution</span>
                </div>
                <div className="text-slate-300 dark:text-slate-700 hidden sm:block">|</div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4.5 h-4.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Satisfaction Goal: ≥ 4/5</span>
                </div>
                <div className="text-slate-300 dark:text-slate-700 hidden sm:block">|</div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4.5 h-4.5 text-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Completion Goal: ≥ 90%</span>
                </div>
              </div>

            </div>

            {/* Spacer Column for Desktop Grid Flow */}
            <div className="hidden lg:block lg:col-span-7 h-full"></div>

            {/* Mobile/Tablet Mockup (Normal flow layout, visible only on mobile/tablet) */}
            <div className="mt-12 lg:hidden w-full">
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
                
                {/* Simulated MacOS Browser Bar */}
                <div className="bg-[#F1F5F9] dark:bg-[#111827] px-5 py-4 border-b border-[#E2E8F0] dark:border-[#334155] flex justify-between items-center select-none">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 bg-red-400 rounded-full inline-block"></span>
                    <span className="w-3.5 h-3.5 bg-yellow-400 rounded-full inline-block"></span>
                    <span className="w-3.5 h-3.5 bg-green-400 rounded-full inline-block"></span>
                  </div>
                  <div className="px-4 py-1 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-md text-[11px] font-mono text-[#64748B] dark:text-[#CBD5E1] w-72 truncate text-center">
                    https://app.propertyflow.io
                  </div>
                  <div className="w-3.5"></div>
                </div>

                {/* Sub-navigation tabs within hero mockup */}
                <div className="flex border-b border-[#E2E8F0] dark:border-[#334155] bg-slate-50/50 dark:bg-[#111827]/40 justify-start">
                  <button 
                    onClick={() => setHeroTab('maintenance')}
                    className={`px-6 py-4 text-sm font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-2 transition-colors cursor-pointer ${heroTab === 'maintenance' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-[3px] border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <Activity className="w-4.5 h-4.5" />
                    <span>Maintenance Requests</span>
                  </button>
                  <button 
                    onClick={() => setHeroTab('scheduling')}
                    className={`px-6 py-4 text-sm font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-2 transition-colors cursor-pointer ${heroTab === 'scheduling' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-[3px] border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <Zap className="w-4.5 h-4.5" />
                    <span>Amenity Bookings</span>
                  </button>
                  <button 
                    onClick={() => setHeroTab('analytics')}
                    className={`px-6 py-4 text-sm font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-2 transition-colors cursor-pointer ${heroTab === 'analytics' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-[3px] border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <BarChart3 className="w-4.5 h-4.5" />
                    <span>Real-Time Dashboard</span>
                  </button>
                </div>

                {/* Simulated Content Area in Hero Preview */}
                <div className="p-6 sm:p-8 space-y-6">
                  {heroTab === 'analytics' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] p-4 rounded-xl">
                        <div className="text-[10px] font-bold font-mono text-[#64748B] dark:text-[#94A3B8] uppercase">Maintenance Resolution Target</div>
                        <div className="text-[#0F172A] dark:text-[#F8FAFC] font-extrabold text-base mt-0.5">≤ 48 Hours</div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-light mt-0.5">Target Resolution Time</div>
                      </div>
                      <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] p-4 rounded-xl">
                        <div className="text-[10px] font-bold font-mono text-[#64748B] dark:text-[#94A3B8] uppercase">Request Completion Goal</div>
                        <div className="text-[#0F172A] dark:text-[#F8FAFC] font-extrabold text-base mt-0.5">≥ 90%</div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-light mt-0.5">Completion Rate Target</div>
                      </div>
                      <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] p-4 rounded-xl">
                        <div className="text-[10px] font-bold font-mono text-[#64748B] dark:text-[#94A3B8] uppercase">Amenity Booking Conflict Goal</div>
                        <div className="text-[#0F172A] dark:text-[#F8FAFC] font-extrabold text-base mt-0.5">0</div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-light mt-0.5">Conflict-Free Booking Target</div>
                      </div>
                    </div>
                  )}

                  {heroTab === 'maintenance' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center text-sm border-b border-[#E2E8F0] dark:border-[#334155] pb-3">
                        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">Active Maintenance Requests</span>
                        <span className="text-[10px] font-mono text-[#0F766E] dark:text-[#14B8A6]">Real-Time Monitor</span>
                      </div>

                      <div className="space-y-3 font-sans">
                        <div className="p-4 bg-red-50/75 dark:bg-rose-950/25 border border-red-100 dark:border-rose-500/20 rounded-xl flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-bold text-red-955 dark:text-rose-200 block">Maintenance Request</span>
                            <span className="text-xs text-red-750 dark:text-rose-350 font-light block mt-0.5">Issue Description</span>
                          </div>
                          <span className="bg-red-500 text-white font-mono text-[10px] px-3 py-1 rounded font-extrabold uppercase">
                            Pending
                          </span>
                        </div>

                        <div className="p-4 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] block">Maintenance Request</span>
                            <span className="text-xs text-[#64748B] dark:text-[#CBD5E1] font-light block mt-0.5">Issue Description</span>
                          </div>
                          <span className="bg-amber-150 dark:bg-amber-500/10 text-[#F59E0B] dark:text-amber-400 font-mono text-[10px] px-3 py-1 rounded font-bold uppercase border border-amber-200/50 dark:border-amber-500/20">
                            In Progress
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {heroTab === 'scheduling' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-[#334155] pb-3 text-sm">
                        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">Amenity Availability Overview</span>
                        <span className="text-[10px] font-mono bg-[#CCFBF1] dark:bg-[#14B8A6]/20 text-[#0F766E] dark:text-[#2DD4BF] px-2.5 rounded font-bold py-1">Active Booking</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-center">
                          <span className="text-2xl block">📅</span>
                          <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-1.5 truncate">Amenity</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-medium">Available</span>
                        </div>
                        <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-center">
                          <span className="text-2xl block">📅</span>
                          <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-1.5 truncate">Amenity</span>
                          <span className="text-[10px] text-[#0F766E] dark:text-[#14B8A6] block mt-0.5 font-medium">Booked</span>
                        </div>
                        <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-center">
                          <span className="text-2xl block">📅</span>
                          <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-1.5 truncate">Amenity</span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-500 block mt-0.5 font-medium">Check-In Scheduled</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-lg text-xs text-[#64748B] dark:text-[#CBD5E1] leading-normal font-light">
                        ✔ Centralized scheduling automatically prevents double-booking conflicts.
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Console Stats Row */}
                <div className="bg-[#FAFBFB] dark:bg-[#111827] p-4 text-center border-t border-[#E2E8F0] dark:border-[#334155] flex justify-center space-x-6 text-[10px] text-[#64748B] dark:text-[#CBD5E1] font-mono leading-none select-none">
                  <span>System Response Goal ≤ 2 Seconds</span>
                  <span>Secure Authentication</span>
                  <span>Real-Time Status Updates</span>
                </div>
              </div>
            </div>

            {/* Desktop Mockup (Absolute positioned, floating box completely visible inside the screen) */}
            <div className="hidden lg:block absolute top-8 bottom-8 right-[calc((100%-100vw)/2+2rem)] left-[calc(5/12*100%+3rem)] xl:left-[calc(5/12*100%+4.5rem)] transition-all">
              <div className="w-full h-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between">
                
                {/* Simulated MacOS Browser Bar */}
                <div className="bg-[#F1F5F9] dark:bg-[#111827] px-6 py-5 border-b border-[#E2E8F0] dark:border-[#334155] flex justify-between items-center select-none flex-none">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 bg-red-400 rounded-full inline-block"></span>
                    <span className="w-3.5 h-3.5 bg-yellow-400 rounded-full inline-block"></span>
                    <span className="w-3.5 h-3.5 bg-green-400 rounded-full inline-block"></span>
                  </div>
                  <div className="px-5 py-1.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg text-xs font-mono text-[#64748B] dark:text-[#CBD5E1] w-80 truncate text-center">
                    https://app.propertyflow.io
                  </div>
                  <div className="w-3.5"></div>
                </div>

                {/* Sub-navigation tabs within hero mockup */}
                <div className="flex border-b border-[#E2E8F0] dark:border-[#334155] bg-slate-50/50 dark:bg-[#111827]/40 justify-start flex-none">
                  <button 
                    onClick={() => setHeroTab('maintenance')}
                    className={`px-8 py-5 text-sm font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-2 transition-colors cursor-pointer ${heroTab === 'maintenance' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-[3px] border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <Activity className="w-5 h-5" />
                    <span>Maintenance Requests</span>
                  </button>
                  <button 
                    onClick={() => setHeroTab('scheduling')}
                    className={`px-8 py-5 text-sm font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-2 transition-colors cursor-pointer ${heroTab === 'scheduling' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-[3px] border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Amenity Bookings</span>
                  </button>
                  <button 
                    onClick={() => setHeroTab('analytics')}
                    className={`px-8 py-5 text-sm font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-2 transition-colors cursor-pointer ${heroTab === 'analytics' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-[3px] border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Real-Time Dashboard</span>
                  </button>
                </div>

                {/* Simulated Content Area in Hero Preview */}
                <div className="p-8 sm:p-10 space-y-8 flex-1 flex flex-col justify-center overflow-y-auto">
                  {heroTab === 'analytics' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] p-5 rounded-2xl shadow-xs">
                        <div className="text-xs font-bold font-mono text-[#64748B] dark:text-[#94A3B8] uppercase">Maintenance Resolution Target</div>
                        <div className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-0.5 block">≤ 48 Hours</div>
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-light mt-1 block">Target Resolution Time</div>
                      </div>
                      <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] p-5 rounded-2xl shadow-xs">
                        <div className="text-xs font-bold font-mono text-[#64748B] dark:text-[#94A3B8] uppercase">Request Completion Goal</div>
                        <div className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-0.5 block">≥ 90%</div>
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-light mt-1 block">Completion Rate Target</div>
                      </div>
                      <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] p-5 rounded-2xl shadow-xs">
                        <div className="text-xs font-bold font-mono text-[#64748B] dark:text-[#94A3B8] uppercase">Amenity Booking Conflict Goal</div>
                        <div className="text-[#0F172A] dark:text-[#F8FAFC] font-extrabold text-xl sm:text-2xl mt-0.5 block">0</div>
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-light mt-1 block">Conflict-Free Booking Target</div>
                      </div>
                    </div>
                  )}

                  {heroTab === 'maintenance' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex justify-between items-center text-sm border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
                        <span className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">Active Maintenance Requests</span>
                        <span className="text-xs font-mono text-[#0F766E] dark:text-[#14B8A6]">Real-Time Monitor</span>
                      </div>

                      <div className="space-y-4 font-sans">
                        <div className="p-5 bg-red-50/75 dark:bg-rose-950/25 border border-red-100 dark:border-rose-500/20 rounded-2xl flex justify-between items-center shadow-xs">
                          <div className="text-sm">
                            <span className="font-bold text-red-955 dark:text-rose-200 text-base sm:text-lg block">Maintenance Request</span>
                            <span className="text-xs sm:text-sm text-red-750 dark:text-rose-350 font-light block mt-1">Issue Description</span>
                          </div>
                          <span className="bg-red-500 text-white font-mono text-[10px] sm:text-xs px-4 py-2 rounded-lg font-extrabold uppercase tracking-wider shadow-sm">
                            Pending
                          </span>
                        </div>

                        <div className="p-5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl flex justify-between items-center shadow-xs">
                          <div className="text-sm">
                            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base sm:text-lg block">Maintenance Request</span>
                            <span className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1] font-light block mt-1">Issue Description</span>
                          </div>
                          <span className="bg-amber-150 dark:bg-amber-500/10 text-[#F59E0B] dark:text-amber-400 font-mono text-[10px] sm:text-xs px-4 py-2 rounded-lg font-bold uppercase border border-amber-200/50 dark:border-amber-500/20 tracking-wider">
                            In Progress
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {heroTab === 'scheduling' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-[#334155] pb-4 text-sm">
                        <span className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">Amenity Availability Overview</span>
                        <span className="text-xs font-mono bg-[#CCFBF1] dark:bg-[#14B8A6]/20 text-[#0F766E] dark:text-[#2DD4BF] px-3.5 rounded font-bold py-1.5">Active Booking</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl text-center shadow-xs">
                          <span className="text-3xl block">📅</span>
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-2.5 truncate">Amenity</span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 block mt-1">Available</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl text-center shadow-xs">
                          <span className="text-3xl block">📅</span>
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-2.5 truncate">Amenity</span>
                          <span className="text-xs text-[#0F766E] dark:text-[#14B8A6] block mt-1">Booked</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl text-center shadow-xs">
                          <span className="text-3xl block">📅</span>
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-2.5 truncate">Amenity</span>
                          <span className="text-xs text-amber-600 dark:text-amber-500 block mt-1 font-medium">Check-In Scheduled</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed font-light">
                        ✔ Centralized scheduling automatically prevents double-booking conflicts.
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Console Stats Row */}
                <div className="bg-[#FAFBFB] dark:bg-[#111827] p-5 text-center border-t border-[#E2E8F0] dark:border-[#334155] flex justify-center space-x-10 text-xs text-[#64748B] dark:text-[#CBD5E1] font-mono leading-none select-none flex-none">
                  <span>System Response Goal ≤ 2 Seconds</span>
                  <span>Secure Authentication</span>
                  <span>Real-Time Status Updates</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* Platform Features Page (Features Grid + Performance KPIs + Reviews Testimonials) */}
      {activeSection === 'features' && (
        <>
          {/* Problem Statement Section */}
          <section id="problem-statement" className="relative py-20 bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#334155] scroll-mt-12 overflow-hidden animate-fadeIn">
            {/* Subtle grid elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6] bg-teal-50 dark:bg-[#14B8A6]/10 border border-teal-100 dark:border-[#14B8A6]/20 px-3.5 py-1.5 rounded-full inline-block">
                  PROBLEM STATEMENT
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                  Challenges in Traditional Property Management
                </h2>
                <p className="mt-3.5 text-sm sm:text-base text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                  Traditional rental management processes often rely on manual communication, resulting in delayed maintenance updates, poor request visibility, communication gaps between tenants and property owners, and scheduling conflicts for shared amenities.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Card 1 */}
                <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-7 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs flex flex-col justify-between h-48 hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest font-mono text-[#0F766E] dark:text-[#14B8A6] block uppercase">Gaps</span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Real-Time Tracking Gaps</h3>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                    Limited visibility into maintenance request progress.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-7 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs flex flex-col justify-between h-48 hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest font-mono text-[#0F766E] dark:text-[#14B8A6] block uppercase">Issues</span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Status Visibility Issues</h3>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                    Difficulty monitoring request and booking status.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-7 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs flex flex-col justify-between h-48 hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest font-mono text-[#0F766E] dark:text-[#14B8A6] block uppercase">Challenges</span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Communication Challenges</h3>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                    Manual coordination between tenants and property owners.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-7 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs flex flex-col justify-between h-48 hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest font-mono text-[#0F766E] dark:text-[#14B8A6] block uppercase">Conflicts</span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Booking Conflicts</h3>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                    Scheduling overlaps caused by unmanaged amenity reservations.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Features Grid Section */}
          <section id="features" className="relative py-20 bg-[#F8FAFC] dark:bg-[#111827] scroll-mt-12 overflow-hidden">
            {/* Subtle grid elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6] bg-teal-50 dark:bg-[#14B8A6]/10 border border-teal-100 dark:border-[#14B8A6]/20 px-3.5 py-1.5 rounded-full inline-block">
                  Modern Operational Capabilities
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                  Real-Time Rental, Maintenance & Amenity Management
                </h2>
                <p className="mt-3.5 text-sm sm:text-base text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                  PropertyFlow centralizes maintenance requests, amenity bookings, and real-time status monitoring in one platform. The system improves transparency between tenants and property owners while helping reduce booking conflicts and manual coordination.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} className="bg-white dark:bg-[#1E293B] p-7 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 hover:shadow-lg transition-all flex flex-col justify-between h-[340px]">
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <div className="w-12 h-12 bg-teal-50 dark:bg-[#14B8A6]/10 text-[#0F766E] dark:text-[#5EEAD4] rounded-xl flex items-center justify-center border border-teal-100 dark:border-[#14B8A6]/20">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-slate-100 dark:bg-[#111827] text-[#64748B] dark:text-[#94A3B8] px-2.5 py-1 rounded">
                            {feat.status}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">{feat.title}</h3>
                        <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed font-light">{feat.description}</p>
                      </div>
                      
                      <div 
                        className="mt-6 pt-4 border-t border-slate-100 dark:border-[#334155]/60 flex items-center space-x-1.5 font-bold text-xs text-[#0F766E] dark:text-[#14B8A6] cursor-pointer hover:underline" 
                        onClick={onGetStarted}
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* KPI Performance Section */}
          <section id="stats" className="relative py-16 bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#334155] scroll-mt-12 overflow-hidden">
            {/* Subtle grid elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6]">
                  Project Target Objectives
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 font-sans tracking-tight">
                  PRD Mandated System KPI Thresholds
                </h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="p-5 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-36">
                      <div>
                        <div className="flex justify-between items-center text-[#64748B] dark:text-[#94A3B8]">
                          <span className="text-[9px] font-extrabold tracking-widest font-mono block">{stat.label}</span>
                          <Icon className="w-4.5 h-4.5 text-[#0F766E] dark:text-[#14B8A6]" />
                        </div>
                        <div className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">{stat.value}</div>
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 mt-2">
                        <span>●</span> <span>{stat.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* User Satisfaction & Objectives KPI Section */}
          <section id="testimonials" className="relative py-20 bg-[#F1F5F9] dark:bg-[#0F172A] border-y border-[#E2E8F0] dark:border-[#334155] scroll-mt-12 overflow-hidden">
            {/* Subtle grid elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6]">
                  Platform Goals
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight font-sans">
                  Primary Objectives & Expected Impact
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm space-y-4 flex flex-col justify-between h-44">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest font-mono text-[#0F766E] dark:text-[#14B8A6] block uppercase">PRIMARY OBJECTIVE</span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Centralize Information</h3>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                    Centralize rental, maintenance, and amenity-related information.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm space-y-4 flex flex-col justify-between h-44">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest font-mono text-[#0F766E] dark:text-[#14B8A6] block uppercase">IMPROVE TRANSPARENCY</span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Improve Transparency</h3>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                    Improve transparency between tenants and property owners.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm space-y-4 flex flex-col justify-between h-44">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest font-mono text-[#0F766E] dark:text-[#14B8A6] block uppercase">EXPECTED IMPACT</span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Reduce Manual Coordination</h3>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                    Reduce manual coordination and improve operational efficiency.
                  </p>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

      {/* Platform Modules Section */}
      {activeSection === 'pricing' && (
        <>
          <section id="pricing" className="relative py-20 bg-white dark:bg-[#111827] scroll-mt-12 overflow-hidden animate-fadeIn">
          {/* Subtle grid elements */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6] bg-teal-50 dark:bg-[#14B8A6]/10 px-3.5 py-1.5 rounded-full inline-block border border-teal-100 dark:border-[#14B8A6]/20">
              PLATFORM MODULES
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Core Functional Modules
            </h2>
            <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] font-light">
              PropertyFlow provides centralized maintenance management, amenity booking management, and real-time operational visibility for tenants and property owners.
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch pt-4">
            {/* Card 1: Maintenance Management */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:shadow-md transition-all flex flex-col justify-between p-7">
              <div>
                <span className="text-[10px] font-extrabold text-[#64748B] dark:text-[#94A3B8] tracking-widest uppercase block">Module 01</span>
                <h3 className="mt-2 text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Maintenance Management</h3>
                <hr className="border-[#E2E8F0] dark:border-[#334155] my-4" />
                <ul className="space-y-3 text-xs text-[#64748B] dark:text-[#CBD5E1]">
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Maintenance request creation</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Status updates</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Real-time visibility</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Resolution tracking</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Amenity Management */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:shadow-md transition-all flex flex-col justify-between p-7">
              <div>
                <span className="text-[10px] font-extrabold text-[#64748B] dark:text-[#94A3B8] tracking-widest uppercase block">Module 02</span>
                <h3 className="mt-2 text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Amenity Management</h3>
                <hr className="border-[#E2E8F0] dark:border-[#334155] my-4" />
                <ul className="space-y-3 text-xs text-[#64748B] dark:text-[#CBD5E1]">
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Availability display</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Date & time booking</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Check-in tracking</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Check-out tracking</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Booking conflict prevention</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Real-Time Dashboards */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:shadow-md transition-all flex flex-col justify-between p-7">
              <div>
                <span className="text-[10px] font-extrabold text-[#64748B] dark:text-[#94A3B8] tracking-widest uppercase block">Module 03</span>
                <h3 className="mt-2 text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Real-Time Dashboards</h3>
                <hr className="border-[#E2E8F0] dark:border-[#334155] my-4" />
                <ul className="space-y-3 text-xs text-[#64748B] dark:text-[#CBD5E1]">
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Maintenance overview</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Amenity usage overview</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Real-time monitoring</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">KPI visibility</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 4: Platform Foundation */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:shadow-md transition-all flex flex-col justify-between p-7">
              <div>
                <span className="text-[10px] font-extrabold text-[#64748B] dark:text-[#94A3B8] tracking-widest uppercase block">Module 04</span>
                <h3 className="mt-2 text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Platform Foundation</h3>
                <hr className="border-[#E2E8F0] dark:border-[#334155] my-4" />
                <ul className="space-y-3 text-xs text-[#64748B] dark:text-[#CBD5E1]">
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Secure authentication</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Responsive user interface</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Accurate real-time updates</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span className="font-sans font-medium text-slate-750 dark:text-[#CBD5E1]">Modular architecture</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          </div>
        </section>

        {/* Section 2: Platform Workflow */}
        <section id="workflow" className="relative py-20 bg-[#F8FAFC] dark:bg-[#111827] border-t border-[#E2E8F0] dark:border-[#334155] overflow-hidden animate-fadeIn">
          {/* Subtle grid elements */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6] bg-teal-50 dark:bg-[#14B8A6]/10 px-3.5 py-1.5 rounded-full inline-block border border-teal-100 dark:border-[#14B8A6]/20">
                PLATFORM WORKFLOW
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                How PropertyFlow Works
              </h2>
              <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] font-light">
                A simple workflow designed to improve transparency, reduce manual coordination, and provide real-time operational visibility.
              </p>
            </div>

            {/* Horizontal / Vertical Flow Steps */}
            <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-6 lg:gap-4 relative">
              {/* Step 1 */}
              <div className="flex-1 bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs relative text-center flex flex-col justify-center h-40 w-full max-w-sm lg:max-w-none">
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#0F766E] dark:bg-[#14B8A6] text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white dark:border-[#1E293B]">
                  Step 1
                </span>
                <h4 className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-sm sm:text-base leading-snug">User Login</h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] dark:text-[#CBD5E1] font-light mt-2.5">Secure authentication portal access for tenants and property owners.</p>
              </div>

              {/* Arrow 1 */}
              <div className="flex items-center justify-center text-[#0F766E] dark:text-[#14B8A6] lg:rotate-0 rotate-90 py-2 lg:py-0 shrink-0">
                <ArrowRight className="w-6 h-6" />
              </div>

              {/* Step 2 */}
              <div className="flex-1 bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs relative text-center flex flex-col justify-center h-40 w-full max-w-sm lg:max-w-none">
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#0F766E] dark:bg-[#14B8A6] text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white dark:border-[#1E293B]">
                  Step 2
                </span>
                <h4 className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-sm sm:text-base leading-snug">Create Request or Booking</h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] dark:text-[#CBD5E1] font-light mt-2.5">Submit a generic maintenance request or book a shared amenity time slot.</p>
              </div>

              {/* Arrow 2 */}
              <div className="flex items-center justify-center text-[#0F766E] dark:text-[#14B8A6] lg:rotate-0 rotate-90 py-2 lg:py-0 shrink-0">
                <ArrowRight className="w-6 h-6" />
              </div>

              {/* Step 3 */}
              <div className="flex-1 bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs relative text-center flex flex-col justify-center h-40 w-full max-w-sm lg:max-w-none">
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#0F766E] dark:bg-[#14B8A6] text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white dark:border-[#1E293B]">
                  Step 3
                </span>
                <h4 className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-sm sm:text-base leading-snug">System Checks & Records</h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] dark:text-[#CBD5E1] font-light mt-2.5">Centralized scheduling checks availability and records transaction logs.</p>
              </div>

              {/* Arrow 3 */}
              <div className="flex items-center justify-center text-[#0F766E] dark:text-[#14B8A6] lg:rotate-0 rotate-90 py-2 lg:py-0 shrink-0">
                <ArrowRight className="w-6 h-6" />
              </div>

              {/* Step 4 */}
              <div className="flex-1 bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs relative text-center flex flex-col justify-center h-40 w-full max-w-sm lg:max-w-none">
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#0F766E] dark:bg-[#14B8A6] text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white dark:border-[#1E293B]">
                  Step 4
                </span>
                <h4 className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-sm sm:text-base leading-snug">Status Reflected</h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] dark:text-[#CBD5E1] font-light mt-2.5">Live status updates propagate in real time across dashboards and portals.</p>
              </div>

              {/* Arrow 4 */}
              <div className="flex items-center justify-center text-[#0F766E] dark:text-[#14B8A6] lg:rotate-0 rotate-90 py-2 lg:py-0 shrink-0">
                <ArrowRight className="w-6 h-6" />
              </div>

              {/* Step 5 */}
              <div className="flex-1 bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs relative text-center flex flex-col justify-center h-40 w-full max-w-sm lg:max-w-none">
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#0F766E] dark:bg-[#14B8A6] text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white dark:border-[#1E293B]">
                  Step 5
                </span>
                <h4 className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-sm sm:text-base leading-snug">Task Completion</h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] dark:text-[#CBD5E1] font-light mt-2.5">Resolution is confirmed or booking check-out successfully recorded.</p>
              </div>
            </div>

          </div>
        </section>

        {/* Section 3: Core Data Entities */}
        <section id="entities" className="relative py-20 bg-white dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#334155] overflow-hidden animate-fadeIn">
          {/* Subtle grid elements */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6] bg-teal-50 dark:bg-[#14B8A6]/10 px-3.5 py-1.5 rounded-full inline-block border border-teal-100 dark:border-[#14B8A6]/20">
                CORE DATA ENTITIES
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Platform Data Structure
              </h2>
              <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] font-light">
                PropertyFlow organizes rental operations around five core entities.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Card 1: Users */}
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors flex flex-col justify-between h-44">
                <div>
                  <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#64748B] dark:text-[#94A3B8] uppercase">Entity 01</span>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Users</h3>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                  Tenant and property owner access management.
                </p>
              </div>

              {/* Card 2: Properties */}
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors flex flex-col justify-between h-44">
                <div>
                  <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#64748B] dark:text-[#94A3B8] uppercase">Entity 02</span>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Properties</h3>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                  Managed rental properties and associated records.
                </p>
              </div>

              {/* Card 3: Maintenance Requests */}
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors flex flex-col justify-between h-44">
                <div>
                  <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#64748B] dark:text-[#94A3B8] uppercase">Entity 03</span>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Maintenance Requests</h3>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                  Maintenance issues, status updates, and resolution tracking.
                </p>
              </div>

              {/* Card 4: Amenities */}
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors flex flex-col justify-between h-44">
                <div>
                  <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#64748B] dark:text-[#94A3B8] uppercase">Entity 04</span>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Amenities</h3>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                  Shared facilities available for reservation.
                </p>
              </div>

              {/* Card 5: Amenity Bookings */}
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CCFBF1] dark:hover:border-[#14B8A6]/40 transition-colors flex flex-col justify-between h-44">
                <div>
                  <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#64748B] dark:text-[#94A3B8] uppercase">Entity 05</span>
                  <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 leading-snug">Amenity Bookings</h3>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
                  Scheduled reservations with check-in and check-out tracking.
                </p>
              </div>
            </div>

          </div>
        </section>
        </>
      )}

      {/* Simple Footer */}
      <footer className="bg-slate-900 dark:bg-[#0F172A] text-slate-400 dark:text-[#CBD5E1] py-12 border-t border-[#E2E8F0] dark:border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-[#0F766E] rounded-lg flex items-center justify-center text-white">
                <Building2 className="w-4.5 h-4.5 text-[#5EEAD4]" />
              </div>
              <span className="text-white font-extrabold text-base tracking-tight font-sans">PropertyFlow</span>
            </div>
            <p className="text-[10px] font-mono text-slate-550 dark:text-[#CBD5E1] text-center sm:text-right">
              © 2026 PropertyFlow. Real-Time Property Rental, Maintenance & Amenity Management Platform.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
