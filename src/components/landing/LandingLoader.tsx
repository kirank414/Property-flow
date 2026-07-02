import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2 } from 'lucide-react';

interface LandingLoaderProps {
  onComplete: () => void;
}

export default function LandingLoader({ onComplete }: LandingLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade-out transition to complete
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0B0F19]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Logo container */}
          <div className="relative flex flex-col items-center">
            {/* Glowing Backdrop */}
            <div className="absolute w-24 h-24 rounded-full bg-teal-500/10 blur-xl animate-pulse" />

            <div className="w-16 h-16 bg-[#0F766E] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-900/30 border border-teal-500/20">
              <Building2 className="w-8 h-8 text-[#5EEAD4]" />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-white font-sans">
              PropertyFlow
            </h1>
            <p className="mt-2 text-xs text-slate-400 font-mono tracking-widest uppercase">
              Initializing Operations...
            </p>

            {/* Premium Progress Bar */}
            <div className="w-48 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden border border-slate-700/30">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
