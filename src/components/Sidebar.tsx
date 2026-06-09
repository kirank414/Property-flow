import React from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  TrendingUp, 
  Shield, 
  User, 
  Activity, 
  LogOut 
} from 'lucide-react';
import { User as UserType } from '../types.ts';

interface SidebarProps {
  currentUser: UserType;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentUser, activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Operations Feed', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties Index', icon: Building2 },
    { id: 'maintenance', label: 'Repair Dispatch', icon: Wrench, badge: 'activeRequests' },
    { id: 'amenities', label: 'Facility Booking', icon: Calendar },
    { id: 'analytics', label: 'Portfolio KPIs', icon: TrendingUp },
    { id: 'monitor', label: 'Live Core Monitor', icon: Activity },
    { id: 'profile', label: 'Personal Space', icon: User }
  ];

  // Admin access control logic
  const isAuthorizedForAdmin = currentUser.role === 'Admin';
  
  return (
    <aside className="w-full md:w-64 bg-slate-900 dark:bg-[#111827] text-slate-100 flex flex-col md:h-screen sticky top-0 md:sticky border-r border-slate-800 dark:border-[#334155] shrink-0 z-30">
      {/* Top Brand Logo */}
      <div className="h-16 border-b border-slate-800 dark:border-[#334155] px-6 flex items-center space-x-2.5">
        <div className="w-9 h-9 bg-primary-teal rounded-lg flex items-center justify-center text-white shadow-md shadow-primary-teal/20">
          <Building2 className="w-5 h-5 text-accent-teal" />
        </div>
        <div>
          <span className="font-extrabold text-sm tracking-tight text-white block">PropertyFlow</span>
          <span className="text-[10px] text-teal-400 font-mono tracking-widest block font-bold uppercase font-sans">PORTFOLIO V2</span>
        </div>
      </div>

      {/* User Info Capsule */}
      <div className="p-4 border-b border-slate-800 dark:border-[#334155] bg-slate-950/45 flex items-center space-x-3">
        <img 
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'} 
          alt={currentUser.name} 
          className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-teal/40"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white truncate leading-snug">{currentUser.name}</div>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className={`inline-flex px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              currentUser.role === 'Admin' ? 'bg-slate-800 text-slate-300 border border-slate-750' :
              currentUser.role === 'Manager' ? 'bg-primary-teal/20 text-accent-teal border border-primary-teal/30' :
              currentUser.role === 'Staff' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' :
              'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
            }`}>
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all leading-none border ${
                isActive 
                  ? 'bg-primary-teal text-white border-primary-teal/40 shadow-sm shadow-primary-teal/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-accent-teal' : 'text-slate-450'}`} />
                <span className="font-sans">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono ${isActive ? 'bg-primary-teal/30 text-accent-teal' : 'bg-slate-800 text-slate-400'}`}>
                  {item.badge === 'activeRequests' ? '4' : 'New'}
                </span>
              )}
            </button>
          );
        })}

        {/* Administration View Router Link */}
        {isAuthorizedForAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all leading-none border mt-4 ${
              activeTab === 'admin' 
                ? 'bg-primary-teal text-white border-primary-teal/40 shadow-sm shadow-primary-teal/10' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-transparent'
            }`}
          >
            <Shield className={`w-4.5 h-4.5 ${activeTab === 'admin' ? 'text-accent-teal' : 'text-slate-450'}`} />
            <span className="font-sans">System Admin</span>
          </button>
        )}
      </nav>

      {/* Logout Row */}
      <div className="p-4 border-t border-slate-800 dark:border-[#334155]">
        <button
          onClick={onLogout}
          className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all border border-transparent cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span className="font-sans">Disconnect System</span>
        </button>
      </div>
    </aside>
  );
}
