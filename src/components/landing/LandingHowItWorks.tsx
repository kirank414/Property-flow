import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Wrench, Calendar, Bell, Star } from 'lucide-react';
import { tokens } from '../../theme/tokens';

gsap.registerPlugin(ScrollTrigger);

export default function LandingHowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(containerRef.current.querySelectorAll('.flow-step'),
      { opacity: 0, scale: 0.95, y: 20 },
      {
        opacity: 1,
        scale: 1,
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

  const steps = [
    {
      title: 'Tenant Action Initiated',
      desc: 'Resident enters a maintenance request or reserves an amenity block. Live validations check schemas immediately.',
      icon: Calendar,
      color: 'text-teal-400'
    },
    {
      title: 'Conflict & Role Check',
      desc: 'System checks for scheduling conflicts and routes the operation to designated managers or technicians.',
      icon: Wrench,
      color: 'text-cyan-400'
    },
    {
      title: 'Real-Time Notification',
      desc: 'Sockets trigger immediate status highlights on the manager and staff panels without page reloads.',
      icon: Bell,
      color: 'text-indigo-400'
    },
    {
      title: 'Resolution & Rating',
      desc: 'Technicians check out. Tenants submit 1-5 star reviews, immediately feeding the portfolio KPI averages.',
      icon: Star,
      color: 'text-amber-400'
    }
  ];

  return (
    <section 
      id="how-it-works-section"
      ref={containerRef}
      className="py-20 bg-[#0B0F19] border-t border-slate-800/40 select-none scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full inline-block border border-teal-500/20">
            System Workflow
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            How PropertyFlow Operates
          </h2>
          <p className="mt-4 text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            A cohesive lifecycle connecting tenants, property staff, and administrators with instant event synchronization.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1.5px] bg-slate-800 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flow-step flex flex-col items-center text-center bg-[#111827] border border-slate-800/80 p-6 rounded-2xl relative z-10 opacity-0 group"
              whileHover={{ y: -4 }}
              transition={{ duration: tokens.animations.durations.interactive }}
            >
              {/* Step number badge */}
              <span className="absolute top-3 right-3 text-[10px] font-mono text-slate-600 group-hover:text-teal-400 font-extrabold transition-colors">
                STEP 0{index + 1}
              </span>

              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:border-teal-400/30 transition-colors">
                <step.icon className={`w-5 h-5 ${step.color}`} />
              </div>

              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
