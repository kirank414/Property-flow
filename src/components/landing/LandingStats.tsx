import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, CheckCircle, Flame, Clock } from 'lucide-react';
import { tokens } from '../../theme/tokens';

gsap.registerPlugin(ScrollTrigger);

export default function LandingStats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Viewport entrance stagger reveal using GSAP
    gsap.fromTo(containerRef.current.querySelectorAll('.stat-card'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: tokens.animations.durations.reveal,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none' // Fire once on enter
        }
      }
    );
  }, []);

  const stats = [
    {
      label: 'Maintenance Resolution SLA',
      value: '≤ 48 Hours',
      desc: 'Target Ticket Resolution Speed',
      icon: Clock,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/10'
    },
    {
      label: 'Ticket Completion rate',
      value: '≥ 90%',
      desc: 'Overall request completion target',
      icon: CheckCircle,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/10'
    },
    {
      label: 'Booking conflicts',
      value: '0',
      desc: 'Conflict-free reservations goal',
      icon: Flame,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/10'
    },
    {
      label: 'System Response SLA',
      value: '≤ 2.0s',
      desc: 'API roundtrip speed goal',
      icon: Activity,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/10'
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="py-16 bg-[#0B0F19] border-t border-slate-800/40 relative select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`stat-card bg-[#111827] p-6 rounded-2xl border ${stat.borderColor} hover:border-slate-700/60 transition-colors flex flex-col justify-between h-40 opacity-0`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  Target metric 0{i + 1}
                </span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-none font-sans">
                  {stat.value}
                </h3>
                <span className="text-[11px] font-bold text-slate-300 block mt-2 uppercase tracking-wide">
                  {stat.label}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-light">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
