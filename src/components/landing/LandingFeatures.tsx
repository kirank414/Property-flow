import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Zap, BarChart3, ShieldCheck } from 'lucide-react';
import { tokens } from '../../theme/tokens';

gsap.registerPlugin(ScrollTrigger);

export default function LandingFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(sectionRef.current.querySelectorAll('.feature-card'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: tokens.animations.durations.reveal,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  const features = [
    {
      title: 'Real-Time Maintenance Hub',
      description: 'Tenants log issues, technicians get notifications, and status moves seamlessly from Pending to Assigned and Completed. Sync is automatic over sockets.',
      icon: Activity,
      color: 'text-teal-400',
      tag: 'Operations'
    },
    {
      title: 'Conflict-Free Amenities',
      description: 'Centralized reservation slots block double-booking. Built-in hooks validate tenant checks and automate check-ins and check-outs for shared resources.',
      icon: Zap,
      color: 'text-cyan-400',
      tag: 'Scheduling'
    },
    {
      title: 'Operational Analytics',
      description: 'Landlords monitor booking ratios, open tickets count, occupancy thresholds, and user satisfaction ratings dynamically calculated from tenant feedback.',
      icon: BarChart3,
      color: 'text-indigo-400',
      tag: 'Data Intelligence'
    }
  ];

  return (
    <section 
      id="features-section"
      ref={sectionRef}
      className="relative py-20 bg-[#0B0F19] border-t border-slate-800/40 select-none scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full inline-block border border-teal-500/20">
            Platform Capabilities
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Streamline Every Operation
          </h2>
          <p className="mt-4 text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Eliminate phone tags, spreadsheets, and booking conflicts with a modern, integrated management engine built for modern rental assets.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              className="feature-card bg-[#111827] rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between h-80 opacity-0 relative group"
              whileHover={{ 
                y: -5,
                borderColor: 'rgba(20, 184, 166, 0.4)' 
              }}
              transition={{ duration: tokens.animations.durations.interactive }}
            >
              <div>
                {/* Feature Icon Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-teal-400/30 transition-colors">
                    <feat.icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {feat.description}
                </p>
              </div>

              {/* Action/Trust Indicator */}
              <div className="pt-4 border-t border-slate-800/60 flex items-center text-[10px] text-slate-400 group-hover:text-white transition-colors font-mono font-semibold uppercase tracking-wider space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Production Ready</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
