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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [heroTab, setHeroTab] = useState<'analytics' | 'maintenance' | 'scheduling'>('analytics');

  const stats = [
    { 
      label: 'PORTFOLIO EXPANSE', 
      value: '14,820+', 
      change: '+12% YoY growth',
      icon: Building2,
      trend: 'up'
    },
    { 
      label: 'MAINTENANCE DISPATCH SLA', 
      value: '99.4%', 
      change: 'Under 2.4 hour response',
      icon: Activity,
      trend: 'up'
    },
    { 
      label: 'FACILITY BOOKING RATE', 
      value: '94.8%', 
      change: 'Peak resource yield',
      icon: Zap,
      trend: 'stable'
    },
    { 
      label: 'TENANT RETENTION RATE', 
      value: '98.2%', 
      change: 'Based on 12k reviews',
      icon: Users,
      trend: 'up'
    }
  ];

  const features = [
    { 
      title: 'Portfolio Intelligence Hub', 
      description: 'Acquire real-time visualization of occupancy rate parameters, unit vacancies, average yield, and monthly collection ratios across multiple holding complexes in seconds.',
      icon: TrendingUp,
      status: 'Ready'
    },
    { 
      title: 'Smart Dispatch Locker', 
      description: 'Instantly file, assign, and track technical repair requests. Tenants get seamless status updates and staff can easily prioritize urgent safety orders.',
      icon: Activity,
      status: 'Live'
    },
    { 
      title: 'Automated Facility Coordinator', 
      description: 'Streamline scheduling and eliminate reservation conflicts. Fully customized calendars for skyline pools, lounges, tennis courts, and conference centers.',
      icon: Zap,
      status: 'Integrated'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter Suite',
      price: billingCycle === 'monthly' ? 49 : 39,
      description: 'Perfect for local landlords managing up to 25 premium units.',
      features: [
        'Up to 25 Managed Units',
        'Standard Tenant Portal Access',
        'Basic Repair Dispatch',
        'Email Support (48h SLA)',
        'Standard Facility Calendars'
      ],
      cta: 'Launch Initial Access',
      popular: false
    },
    {
      name: 'Professional Hub',
      price: billingCycle === 'monthly' ? 129 : 99,
      description: 'Comprehensive workflow automation tools for medium portfolios.',
      features: [
        'Unlimited Managed Units',
        'Multi-User Role Permissions',
        'Real-time Repair Dispatch',
        'Interactive Facilities Coordinator',
        'Advanced API Integration Access',
        'Priority SLA Support (<4h SLA)'
      ],
      cta: 'Activate Professional Demo',
      popular: true
    },
    {
      name: 'Enterprise Matrix',
      price: billingCycle === 'monthly' ? 299 : 239,
      description: 'Corporate orchestration system for major holdings complexes.',
      features: [
        'Deep Multi-Property Matrices',
        'Custom Embedded White-labeling',
        'Advanced Predictive Core Logs',
        'Full Security Information SSO',
        'Dedicated Support Manager Desk',
        '100% Guaranteed SLA Agreement'
      ],
      cta: 'Enquire Enterprise Suite',
      popular: false
    }
  ];

  const matrixFeatures = [
    { name: 'Multi-Complex Dashboard', starter: true, pro: true, enterprise: true },
    { name: 'Live Telemetry Integration', starter: false, pro: true, enterprise: true },
    { name: 'Custom Amenities Reservation', starter: 'Up to 3', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Drywall & Mechanical Dispatch Engine', starter: 'Basic', pro: 'Advanced', enterprise: 'Automated' },
    { name: 'Role Simulation Workspace', starter: false, pro: true, enterprise: true },
    { name: 'Dedicated Infrastructure Support', starter: false, starterText: 'Self-serve', pro: 'Email (<4h)', enterprise: 'Instant Call & SLA' },
    { name: 'Cloud SQL Database Backups', starter: 'Daily', pro: 'Continuous', enterprise: 'Real-time Replica' }
  ];

  const reviews = [
    { 
      name: 'Arthur Pendragon', 
      role: 'Regional Landlord Director', 
      company: 'Apex Property Group',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      text: "PropertyFlow transformed our operational cycle. Tenant complaints dropped by 45% within three months of utilizing its smart dispatch flow. The executive metrics reporting tool is unmatched in simplicity.", 
      rating: 5 
    },
    { 
      name: 'Diana Prince', 
      role: 'Senior Property Manager', 
      company: 'Peachtree Estates Ltd',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      text: "The automated scheduling engine prevents double bookings on rooftop lounges perfectly. The role simulations are exceptionally precise for testing incident responses. Recommend for premium portfolios.", 
      rating: 5 
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] font-sans selection:bg-[#CCFBF1] selection:text-[#0F766E] scroll-smooth antialiased transition-colors duration-200">
      
      {/* Structural Header & Navbar */}
      <nav id="navbar" className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-[10px] sticky top-0 z-50 border-b border-[#E2E8F0] dark:border-[#334155] h-16 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-9 h-9 bg-[#0F766E] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#0F766E]/20">
                <Building2 className="w-5 h-5 text-[#5EEAD4]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#0F172A] dark:text-[#F8FAFC] font-sans">
                Property<span className="text-[#0F766E] dark:text-[#14B8A6]">Flow</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono bg-teal-50 dark:bg-[#14B8A6]/10 text-[#0F766E] dark:text-[#5EEAD4] border border-teal-100 dark:border-[#14B8A6]/20 font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                SaaS Enterprise
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1]">
              <a href="#features" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">Platform Features</a>
              <a href="#stats" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">Performance KPIs</a>
              <a href="#pricing" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">Pricing Solutions</a>
              <a href="#testimonials" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">Reviews</a>
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
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs font-bold uppercase tracking-wide text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F766E] dark:hover:text-[#14B8A6]">Features</a>
            <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs font-bold uppercase tracking-wide text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F766E] dark:hover:text-[#14B8A6]">Performance KPIs</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs font-bold uppercase tracking-wide text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F766E] dark:hover:text-[#14B8A6]">Pricing Solutions</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs font-bold uppercase tracking-wide text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F766E] dark:hover:text-[#14B8A6]">Reviews</a>
            
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
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0F172A] dark:to-[#111827] border-b border-[#E2E8F0] dark:border-[#334155]">
        
        {/* Subtle grid elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column Text & Buttons */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6 sm:space-y-7">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-[#14B8A6]/10 border border-teal-100 dark:border-[#14B8A6]/20 text-[#0F766E] dark:text-[#5EEAD4] uppercase tracking-widest leading-none">
                <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>PropTech Enterprise System 2026</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-[1.05] font-sans">
                Portfolio Operations,<br />
                <span className="text-[#0F766E] dark:text-[#14B8A6]">
                  Made Simple & Elegant
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-[#64748B] dark:text-[#CBD5E1] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Connect and automate operations at every asset scale. Unify multi-role dashboard panels, dispatch technical maintenance SLA requests, reserve shared amenities, and monitor telemetry feeds from one corporate deck.
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
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">SOC-2 Type II Certified</span>
                </div>
                <div className="text-slate-300 dark:text-slate-700 hidden sm:block">|</div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4.5 h-4.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Top Rated Enterprise SaaS</span>
                </div>
              </div>

            </div>

            {/* Right Column: High Fidelity Interactive Custom Dashboard Mockup */}
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
                
                {/* Simulated MacOS Browser Bar */}
                <div className="bg-[#F1F5F9] dark:bg-[#111827] px-4 py-3 border-b border-[#E2E8F0] dark:border-[#334155] flex justify-between items-center select-none">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span>
                    <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
                    <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
                  </div>
                  <div className="px-3 py-0.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-md text-[9px] font-mono text-[#64748B] dark:text-[#CBD5E1] w-64 truncate text-center">
                    https://app.propertyflow.com/deck
                  </div>
                  <div className="w-3"></div>
                </div>

                {/* Sub-navigation tabs within hero mockup */}
                <div className="flex border-b border-[#E2E8F0] dark:border-[#334155] bg-slate-50/50 dark:bg-[#111827]/40 justify-start">
                  <button 
                    onClick={() => setHeroTab('analytics')}
                    className={`px-4 py-3 text-xs font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-1.5 transition-colors cursor-pointer ${heroTab === 'analytics' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-2 border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Portfolio Analytics</span>
                  </button>
                  <button 
                    onClick={() => setHeroTab('maintenance')}
                    className={`px-4 py-3 text-xs font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-1.5 transition-colors cursor-pointer ${heroTab === 'maintenance' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-2 border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Incident Dispatch</span>
                  </button>
                  <button 
                    onClick={() => setHeroTab('scheduling')}
                    className={`px-4 py-3 text-xs font-bold border-r border-[#E2E8F0] dark:border-[#334155] flex items-center space-x-1.5 transition-colors cursor-pointer ${heroTab === 'scheduling' ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] border-b-2 border-b-[#0F766E] dark:border-b-[#14B8A6]' : 'text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#111827]/40'}`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Lounge Schedules</span>
                  </button>
                </div>

                {/* Simulated Content Area in Hero Preview */}
                <div className="p-5 sm:p-6 space-y-4">
                  {heroTab === 'analytics' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[10px] font-bold font-mono text-[#64748B] dark:text-[#94A3B8] uppercase block">TOTAL PORTFOLIO INTAKE</span>
                          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-extrabold text-sm">$184,400 / month</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/20 text-[#10B981] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 uppercase">
                          ● SLA Normal
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] p-3 rounded-xl">
                          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium block">Occupancy Rate</span>
                          <span className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-0.5 block">94.8% SLA</span>
                          <span className="text-[9px] text-[#10B981] dark:text-[#10B981] font-semibold mt-1 block">↑ +3.2% vs Atlanta Avg</span>
                        </div>
                        <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] p-3 rounded-xl">
                          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium block">Active SLA Cases</span>
                          <span className="text-base font-extrabold text-[#EF4444] mt-0.5 block">4 Pending</span>
                          <span className="text-[9px] text-[#F59E0B] font-semibold mt-1 block">▲ Under response dispatch</span>
                        </div>
                      </div>

                      {/* Micro Progress Bars */}
                      <div className="p-3 bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Summit Heights (Residential)</span>
                          <span className="font-mono text-[#64748B] dark:text-[#CBD5E1] font-bold">96%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0F766E] dark:bg-[#14B8A6] rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {heroTab === 'maintenance' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="flex justify-between items-center text-xs border-b border-[#E2E8F0] dark:border-[#334155] pb-2">
                        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">URGENT DISPATCH LOGS</span>
                        <span className="text-[9px] font-mono text-[#0F766E] dark:text-[#14B8A6]">UPDATED AT 09:26</span>
                      </div>

                      <div className="space-y-2 font-sans">
                        <div className="p-3 bg-red-50/75 dark:bg-rose-950/25 border border-red-100 dark:border-rose-500/20 rounded-xl flex justify-between items-center">
                          <div className="text-xs">
                            <span className="font-bold text-red-955 dark:text-rose-200 block">Boiler overpressure warning</span>
                            <span className="text-[10px] text-red-750 dark:text-rose-350 font-light block mt-0.5">Basement valve spike — Unit 402</span>
                          </div>
                          <span className="bg-red-500 text-white font-mono text-[9px] px-2 py-0.5 rounded font-extrabold uppercase">
                            Dispatched
                          </span>
                        </div>

                        <div className="p-3 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl flex justify-between items-center">
                          <div className="text-xs">
                            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] block">AC electrical compressor replacement</span>
                            <span className="text-[10px] text-[#64748B] dark:text-[#CBD5E1] font-light block mt-0.5">Assigned to tech Dave Miller</span>
                          </div>
                          <span className="bg-amber-150 dark:bg-amber-500/10 text-[#F59E0B] dark:text-amber-400 font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase border border-amber-200/50 dark:border-amber-500/20">
                            Assigned
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {heroTab === 'scheduling' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-[#334155] pb-2 text-xs">
                        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">SHARED AMENITIES OVERVIEW</span>
                        <span className="text-[9px] font-mono bg-[#CCFBF1] dark:bg-[#14B8A6]/20 text-[#0F766E] dark:text-[#2DD4BF] px-2 rounded font-bold py-0.5">ACTIVE SESSION</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-center">
                          <span className="text-xl block">🏊</span>
                          <span className="text-[10px] font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-1.5 truncate">Skyline Pool</span>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block mt-0.5">8 Slots booked</span>
                        </div>
                        <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-center">
                          <span className="text-xl block">🍹</span>
                          <span className="text-[10px] font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-1.5 truncate">Penthouse</span>
                          <span className="text-[9px] text-[#0F766E] dark:text-[#14B8A6] block mt-0.5">3 Reserv. today</span>
                        </div>
                        <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-center">
                          <span className="text-xl block">🎾</span>
                          <span className="text-[10px] font-bold text-[#0F172A] dark:text-[#F8FAFC] block mt-1.5 truncate">Tennis Court</span>
                          <span className="text-[9px] text-slate-500 dark:text-[#CBD5E1] block">4 Open slots</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-lg text-[10px] text-[#64748B] dark:text-[#CBD5E1] leading-normal font-light">
                        ✔ Full reservation slots automatically align visual sync calendars inside client UI.
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Console Stats Row */}
                <div className="bg-[#FAFBFB] dark:bg-[#111827] p-3 text-center border-t border-[#E2E8F0] dark:border-[#334155] flex justify-center space-x-6 text-[10px] text-[#64748B] dark:text-[#CBD5E1] font-mono leading-none select-none">
                  <span>Ping: 1.4ms</span>
                  <span>Database: Cloud SQL Resilient</span>
                  <span>Authed: SSL Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* KPI Performance Section */}
      <section id="stats" className="py-16 bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#334155] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6]">
              Portfolio Metrics Under Supervision
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-2 font-sans tracking-tight">
              Executive Dashboard Financial Core Metrics
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-[#F8FAFC] dark:bg-[#111827] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6] bg-teal-50 dark:bg-[#14B8A6]/10 border border-teal-100 dark:border-[#14B8A6]/20 px-3.5 py-1.5 rounded-full inline-block">
              Modern Operational Capabilities
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Designed as a Complete Portfolio Command Center
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-[#64748B] dark:text-[#CBD5E1] font-light leading-relaxed">
              Every feature module exists to eliminate structural leaks, missed text notifications, unlogged email trails, and double-booking overlaps. Unify managers, technicians, and tenants seamlessly.
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
                    <span>Explore modular workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Testimonials Block Section */}
      <section id="testimonials" className="py-20 bg-[#F1F5F9] dark:bg-[#0F172A] border-y border-[#E2E8F0] dark:border-[#334155] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6]">
              Client Referrals
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Endorsed by Top Corporate Portfolio Managers
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={r.image} 
                      alt={r.name} 
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-50 dark:ring-[#1E293B]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC]">{r.name}</h4>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium block">{r.role} • <span className="text-[#0F766E] dark:text-[#14B8A6]">{r.company}</span></p>
                    </div>
                  </div>

                  <div className="flex">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#0F172A] dark:text-[#CBD5E1] italic leading-relaxed font-light">
                  "{r.text}"
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Pricing Options Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-[#111827] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#14B8A6] bg-teal-50 dark:bg-[#14B8A6]/10 px-3.5 py-1.5 rounded-full inline-block border border-teal-100 dark:border-[#14B8A6]/20">
              SaaS Pricing Framework
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Flexible Tiers Built for Growth Portfolios
            </h2>
            <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] font-light">
              Choose the layout tier that suits your local agency size or enterprise assets.
            </p>

            {/* Toggle switch with Save 20% */}
            <div className="mt-6 inline-flex p-1 bg-slate-100 dark:bg-[#1E293B] rounded-xl items-center border border-[#E2E8F0] dark:border-[#334155]">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${billingCycle === 'monthly' ? 'bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] shadow-sm' : 'text-[#64748B] dark:text-[#94A3B8]'}`}
              >
                Monthly Billing
              </button>
              <button 
                onClick={() => setBillingCycle('annually')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${billingCycle === 'annually' ? 'bg-[#0F766E] dark:bg-[#14B8A6] text-white shadow-sm' : 'text-[#64748B] dark:text-[#94A3B8]'}`}
              >
                <span>Annually</span>
                <span className="bg-[#10B981] text-[9px] text-white font-bold px-1.5 py-0.5 rounded font-mono uppercase">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`bg-white dark:bg-[#1E293B] rounded-2xl border transition-all flex flex-col justify-between ${plan.popular ? 'border-2 border-[#0F766E] dark:border-[#14B8A6] shadow-xl relative scale-[1.03] z-10' : 'border-[#E2E8F0] dark:border-[#334155] hover:shadow-md'}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#0F766E] dark:bg-[#14B8A6] text-white font-extrabold text-[9px] uppercase tracking-widest px-4 py-1 rounded-full border border-white dark:border-[#1E293B] font-sans">
                    Highly Recommended Tier
                  </span>
                )}
                
                <div className="p-7">
                  <span className="text-[10px] font-extrabold text-[#64748B] dark:text-[#94A3B8] tracking-widest uppercase block">{plan.name}</span>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">${plan.price}</span>
                    <span className="text-[#64748B] dark:text-[#CBD5E1] text-xs ml-1 font-medium select-none">/ month</span>
                  </div>
                  <p className="mt-2 text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed font-light leading-normal">{plan.description}</p>
                  
                  <hr className="border-[#E2E8F0] dark:border-[#334155] my-5" />

                  <ul className="space-y-3 text-xs text-[#64748B] dark:text-[#CBD5E1]">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2.5">
                        <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                        <span className="font-sans font-medium text-slate-700 dark:text-[#CBD5E1] leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-7 pt-0">
                  <button 
                    id={`pricing-cta-${idx}`}
                    onClick={onGetStarted} 
                    className={`w-full py-3 px-4 rounded-[12px] font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer ${plan.popular ? 'bg-[#0F766E] hover:bg-[#115E59] dark:bg-[#14B8A6] dark:hover:bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/25' : 'bg-slate-900 dark:bg-[#111827] dark:hover:bg-[#1E293B] text-white dark:text-[#CBD5E1] dark:border dark:border-[#334155]'}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Corporate Feature Comparison Matrix */}
          <div className="mt-16 border border-[#E2E8F0] dark:border-[#334155] rounded-2xl overflow-hidden bg-[#F8FAFC] dark:bg-[#111827]">
            <div className="p-5 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155]">
              <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Technical Matrix Spec Comparison</h3>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] font-light mt-0.5">Understand core operational limits before requesting corporate deployment contracts.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-[#CBD5E1] min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#334155]">
                    <th className="p-4 font-bold text-[#0F172A] dark:text-[#F8FAFC]">Operational Feature</th>
                    <th className="p-4 font-bold text-[#0F172A] dark:text-[#F8FAFC]">Starter Suite</th>
                    <th className="p-4 font-bold text-[#0F172A] dark:text-[#F8FAFC]">Professional Hub</th>
                    <th className="p-4 font-bold text-[#0F172A] dark:text-[#F8FAFC]">Enterprise Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155] bg-white dark:bg-[#1E293B]">
                  {matrixFeatures.map((feat, fIdx) => (
                    <tr key={fIdx} className="hover:bg-slate-50/50 dark:hover:bg-[#111827]/40">
                      <td className="p-4 font-bold text-[#0F172A] dark:text-[#F8FAFC]">{feat.name}</td>
                      <td className="p-4">
                        {typeof feat.starter === 'boolean' ? (
                          feat.starter ? <Check className="w-4 h-4 text-[#10B981]" /> : <span className="text-[#64748B] dark:text-[#94A3B8]">—</span>
                        ) : (
                          feat.starterText || feat.starter
                        )}
                      </td>
                      <td className="p-4">
                        {typeof feat.pro === 'boolean' ? (
                          feat.pro ? <Check className="w-4 h-4 text-[#10B981]" /> : <span className="text-[#64748B] dark:text-[#94A3B8]">—</span>
                        ) : (
                          feat.pro
                        )}
                      </td>
                      <td className="p-4">
                        {typeof feat.enterprise === 'boolean' ? (
                          feat.enterprise ? <Check className="w-4 h-4 text-[#10B981]" /> : <span className="text-[#64748B] dark:text-[#94A3B8]">—</span>
                        ) : (
                          feat.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

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
            <p className="text-[10px] font-mono text-slate-505 dark:text-[#94A3B8] text-center sm:text-right">
              © 2026 PropertyFlow Command Inc. SOC-2 Certified. SLA Protected. Fully sandboxed on Cloud SQL (PostgreSQL).
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
