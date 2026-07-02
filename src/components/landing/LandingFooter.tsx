import React from 'react';
import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';
import { tokens } from '../../theme/tokens';
import { User } from '../../types.ts';

interface LandingFooterProps {
  currentUser: User | null;
  onDemoClick: () => void;
  onSectionChange: (section: string) => void;
}

export default function LandingFooter({ currentUser, onDemoClick, onSectionChange }: LandingFooterProps) {
  
  const handleLinkClick = (id: string) => {
    onSectionChange(id);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(`${id}-section`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#0B0F19] text-slate-400 py-12 border-t border-slate-800/40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-[#0F766E] rounded-lg flex items-center justify-center text-white">
              <Building2 className="w-4.5 h-4.5 text-[#5EEAD4]" />
            </div>
            <span className="text-white font-extrabold text-base tracking-tight font-sans">
              PropertyFlow
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex space-x-6 text-xs uppercase tracking-wider font-semibold">
            <button 
              onClick={() => handleLinkClick('home')}
              className="text-slate-400 hover:text-teal-400 transition-colors bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
            >
              Home
            </button>
            <button 
              onClick={() => handleLinkClick('features')}
              className="text-slate-400 hover:text-teal-400 transition-colors bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
            >
              Features
            </button>
            <button 
              onClick={() => handleLinkClick('how-it-works')}
              className="text-slate-400 hover:text-teal-400 transition-colors bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleLinkClick('technology')}
              className="text-slate-400 hover:text-teal-400 transition-colors bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
            >
              Technology
            </button>
          </div>

          {/* Action Trigger */}
          {!currentUser ? (
            <motion.button
              onClick={onDemoClick}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-teal-500/30 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] cursor-pointer focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: tokens.animations.durations.interactive }}
            >
              View Demo Credentials
            </motion.button>
          ) : (
            <div className="text-[10px] font-mono text-slate-500">
              Authenticated Session Active
            </div>
          )}

        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-500 font-mono text-center sm:text-left">
            © 2026 PropertyFlow. Modern Real-Time Property operations system. All Rights Reserved.
          </p>
          <div className="flex space-x-4 text-[10px] font-mono text-slate-500">
            <span>v1.2.0-stable</span>
            <span>•</span>
            <span>PostgreSQL Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
