import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Zap, Users, BarChart3 } from 'lucide-react';
import { tokens } from '../../theme/tokens';

gsap.registerPlugin(ScrollTrigger);

export default function LandingBenefits() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(containerRef.current.querySelectorAll('.benefit-item'),
      { opacity: 0, x: (i) => i % 2 === 0 ? -30 : 30 },
      {
        opacity: 1,
        x: 0,
        duration: tokens.animations.durations.reveal,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-[#0B0F19] border-t border-slate-800/40 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric layout 1 */}
        <div className="benefit-item grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 opacity-0">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
              For Landlords & Managers
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-sans">
              Complete Control and Portfolio Insights
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Track resolution SLAs across multiple properties from a central dashboard. Control tenant authorizations, audit room booking trends, and check user feedback metrics dynamically calculated to gauge team satisfaction.
            </p>
          </div>
          <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-500 font-bold uppercase">
              Operational View
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <BarChart3 className="w-4.5 h-4.5 text-teal-400" />
                  </div>
                  <span className="text-xs font-bold text-white">Maintenance SLA Target Achievement</span>
                </div>
                <span className="text-xs font-mono font-bold text-teal-400">94.8% achieved</span>
              </div>
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Users className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold text-white">Active Tenant Portal Accounts</span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-400">248 active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Asymmetric layout 2 */}
        <div className="benefit-item grid grid-cols-1 lg:grid-cols-12 gap-12 items-center opacity-0 lg:flex-row-reverse">
          <div className="lg:col-span-7 lg:order-2 space-y-6">
            <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
              For Tenants & Residents
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-sans">
              A Frictionless, Digital Living Experience
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Submit maintenance tickets and upload descriptions instantly. Request slots at the building gym or common room without double-booking concerns, checking status in real time.
            </p>
          </div>
          <div className="lg:col-span-5 lg:order-1 bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-500 font-bold uppercase">
              Tenant View
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Zap className="w-4.5 h-4.5 text-cyan-400" />
                  </div>
                  <span className="text-xs font-bold text-white">Common Room Booking</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">Confirmed (Tonight)</span>
              </div>
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-4.5 h-4.5 text-teal-400" />
                  </div>
                  <span className="text-xs font-bold text-white">Sink Leak Resolution</span>
                </div>
                <span className="text-xs font-mono font-bold text-teal-400">Completed & Rated</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
