import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { tokens } from '../../theme/tokens';

gsap.registerPlugin(ScrollTrigger);

interface LandingCTAProps {
  onLoginClick: () => void;
}

export default function LandingCTA({ onLoginClick }: LandingCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.98, y: 15 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: tokens.animations.durations.reveal,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  return (
    <section className="py-20 bg-[#0B0F19] border-t border-slate-800/40 relative select-none overflow-hidden flex items-center justify-center">
      {/* Background Radial Glow */}
      <div className="absolute w-[80%] max-w-[800px] aspect-square rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div 
        ref={containerRef}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 opacity-0"
      >
        {/* Glassmorphic CTA Panel */}
        <div className="bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-500/25 to-transparent" />
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold bg-teal-500/10 border border-teal-500/20 text-teal-300 uppercase tracking-widest leading-none mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Ready to Deploy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 font-sans">
            Ready to Streamline Operations?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mb-8 leading-relaxed font-light">
            Bring tenants, landlords, and service technicians under one automated real-time roof. Start coordinating maintenance and amenities seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <motion.button
              onClick={onLoginClick}
              className="w-full sm:w-auto px-8 py-4 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-teal-500/10 cursor-pointer flex items-center justify-center space-x-2 border border-teal-400/25 focus:outline-none"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: tokens.animations.durations.interactive }}
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
