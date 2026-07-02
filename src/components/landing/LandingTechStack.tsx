import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Monitor, Server, Cloud } from 'lucide-react';
import { tokens } from '../../theme/tokens';

gsap.registerPlugin(ScrollTrigger);

export default function LandingTechStack() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(containerRef.current.querySelectorAll('.tech-card'),
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: tokens.animations.durations.reveal,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  const techCategories = [
    {
      title: 'Property Directory Module',
      icon: Monitor,
      items: ['Multi-Unit Records', 'Owner-Manager Assignments', 'Occupancy Analytics', 'Tenant Associations'],
      color: 'text-teal-400',
      borderColor: 'border-teal-500/10'
    },
    {
      title: 'Maintenance Routing Hub',
      icon: Server,
      items: ['Priority Request Submissions', 'Automatic Technician Routing', 'Socket-Driven Status Updates', 'Tenant Satisfaction Ratings'],
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/10'
    },
    {
      title: 'Amenity Reservation System',
      icon: Database,
      items: ['Time Block Allocation', 'Conflict-Prevention Checks', 'Check-In/Out Tracking', 'Capacity Threshold Warnings'],
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/10'
    },
    {
      title: 'Analytical Dashboards',
      icon: Cloud,
      items: ['System SLA Targets (≤48h)', 'Occupancy Ratio Tracking', 'Live System Performance Logs', 'Role-Based Navigation Guards'],
      color: 'text-rose-400',
      borderColor: 'border-rose-500/10'
    }
  ];

  return (
    <section 
      id="technology-section"
      ref={containerRef}
      className="py-20 bg-[#0B0F19] border-t border-slate-800/40 select-none scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full inline-block border border-teal-500/20">
            Platform Modules
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Core Functional Ecosystem
          </h2>
          <p className="mt-4 text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            PropertyFlow coordinates rental units, active maintenance requests, calendar reservations, and live analytics under one responsive pipeline.
          </p>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techCategories.map((cat, i) => (
            <motion.div
              key={i}
              className={`tech-card bg-[#111827] border ${cat.borderColor} p-6 rounded-2xl flex flex-col justify-between h-72 opacity-0 group`}
              whileHover={{ 
                y: -5,
                borderColor: 'rgba(20, 184, 166, 0.3)'
              }}
              transition={{ duration: tokens.animations.durations.interactive }}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-teal-400/20 transition-colors">
                    <cat.icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">
                    Tier 0{i + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                  {cat.title}
                </h3>
                
                <ul className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 font-mono flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/60 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                Full-stack Sync
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
