import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Menu, X } from 'lucide-react';
import { User } from '../../types.ts';
import { tokens } from '../../theme/tokens';

interface LandingNavbarProps {
  currentUser: User | null;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLoginClick: () => void;
  onGetStarted: () => void;
  onLogout?: () => void;
}

export default function LandingNavbar({
  currentUser,
  activeSection,
  onSectionChange,
  onLoginClick,
  onGetStarted,
  onLogout
}: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'technology', label: 'Technology' }
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onSectionChange(id);
    
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(`${id}-section`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-950/75 backdrop-blur-md border-b border-slate-800/80 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer" 
            onClick={() => handleLinkClick('home')}
          >
            <div className="w-9 h-9 bg-[#0F766E] rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-500/10">
              <Building2 className="w-5 h-5 text-[#5EEAD4]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white font-sans">
              PropertyFlow
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`hover:text-teal-400 transition-colors bg-transparent border-0 cursor-pointer p-0 font-semibold text-xs uppercase tracking-wider focus:outline-none ${
                  activeSection === link.id ? 'text-teal-400' : 'text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Access Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!currentUser ? (
              <motion.button 
                id="landing-login-btn"
                onClick={onLoginClick} 
                className="text-slate-300 hover:text-teal-400 text-xs font-bold uppercase tracking-wider transition-colors px-3 py-2 cursor-pointer focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: tokens.animations.durations.interactive }}
              >
                Sign In
              </motion.button>
            ) : (
              <>
                <motion.button 
                  onClick={onGetStarted} 
                  className="text-teal-400 hover:text-teal-300 text-xs font-bold uppercase tracking-wider transition-colors px-3 py-2 cursor-pointer focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: tokens.animations.durations.interactive }}
                >
                  Dashboard
                </motion.button>
                <motion.button 
                  onClick={onLogout} 
                  className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider transition-colors px-3 py-2 cursor-pointer focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: tokens.animations.durations.interactive }}
                >
                  Logout
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 p-2 focus:outline-none bg-transparent border-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-16 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-b border-slate-800/80 p-5 space-y-4 shadow-xl flex flex-col"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: tokens.animations.durations.interactive }}
          >
            {navLinks.map(link => (
              <button 
                key={link.id}
                onClick={() => handleLinkClick(link.id)} 
                className={`block w-full text-left py-1 text-xs font-bold uppercase tracking-wide transition-colors bg-transparent border-0 cursor-pointer focus:outline-none ${
                  activeSection === link.id ? 'text-teal-400' : 'text-slate-300 hover:text-teal-400'
                }`}
              >
                {link.label}
              </button>
            ))}
            <hr className="border-slate-800" />
            <div className="space-y-3 pt-1">
              {!currentUser ? (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                  className="block w-full text-left py-1 text-xs font-bold uppercase tracking-wide text-slate-300 hover:text-teal-400 transition-colors focus:outline-none bg-transparent border-0 cursor-pointer"
                >
                  Sign In
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); onGetStarted(); }} 
                    className="block w-full text-left py-1 text-xs font-bold uppercase tracking-wide text-teal-400 hover:text-teal-300 transition-colors focus:outline-none bg-transparent border-0 cursor-pointer"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); if(onLogout) onLogout(); }} 
                    className="block w-full text-left py-1 text-xs font-bold uppercase tracking-wide text-red-400 hover:text-red-350 transition-colors focus:outline-none bg-transparent border-0 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
