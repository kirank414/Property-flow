import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Building2, Wrench, Calendar, Users, ShieldAlert } from 'lucide-react';
import { tokens } from '../../theme/tokens';
import { User } from '../../types.ts';

interface LandingHeroProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onGetStarted: () => void;
}

export default function LandingHero({ currentUser, onLoginClick, onGetStarted }: LandingHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const pulsesRef = useRef<(SVGCircleElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);

  // GSAP Mouse Parallax and Pulse Timeline
  useEffect(() => {
    // 1. Mouse movement parallax (Desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; // Disable on mobile/tablet

      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30; // Max 30px offset
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to('.hero-parallax-bg', {
        x: xPos * 0.5,
        y: yPos * 0.5,
        duration: 1,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      gsap.to(networkRef.current, {
        x: -xPos * 0.8,
        y: -yPos * 0.8,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 2. GSAP Pulse Timeline along connection paths
    const pulseTimeline = gsap.timeline({ repeat: -1 });

    pulsesRef.current.forEach((pulse, index) => {
      const line = linesRef.current[index];
      if (!line || !pulse) return;

      const x1 = line.getAttribute('x1');
      const y1 = line.getAttribute('y1');
      const x2 = line.getAttribute('x2');
      const y2 = line.getAttribute('y2');

      if (!x1 || !y1 || !x2 || !y2) return;

      pulseTimeline.fromTo(pulse,
        { attr: { cx: x1, cy: y1 }, opacity: 0 },
        {
          attr: { cx: x2, cy: y2 },
          opacity: 1,
          duration: 3 + index * 0.5,
          ease: 'power1.inOut',
          repeat: -1,
          delay: index * 0.8
        },
        0
      );
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      pulseTimeline.kill();
    };
  }, []);

  const systemNodes = [
    { id: 'core', label: 'PropertyFlow Engine', x: 50, y: 50, color: 'text-teal-400', icon: Building2, main: true },
    { id: 'prop', label: 'Properties & Units', x: 20, y: 25, color: 'text-cyan-400', icon: Building2 },
    { id: 'tenant', label: 'Tenant Directory', x: 20, y: 75, color: 'text-indigo-400', icon: Users },
    { id: 'maint', label: 'Maintenance Queue', x: 80, y: 25, color: 'text-rose-400', icon: Wrench },
    { id: 'book', label: 'Amenity Bookings', x: 80, y: 75, color: 'text-amber-400', icon: Calendar }
  ];

  const systemConnections = [
    { from: 'prop', to: 'core' },
    { from: 'tenant', to: 'core' },
    { from: 'maint', to: 'core' },
    { from: 'book', to: 'core' }
  ];

  // Container variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: tokens.animations.durations.hero,
        ease: [0.16, 1, 0.3, 1] // Custom premium ease-out
      }
    }
  };

  return (
    <section 
      id="home-section"
      ref={heroRef}
      className="relative min-h-[90vh] md:min-h-screen pt-24 pb-20 flex items-center overflow-hidden bg-[#0B0F19] select-none"
    >
      {/* Background Parallax blobs (GSAP animated cursor offset) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="hero-parallax-bg absolute top-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-teal-500/10 blur-[100px] will-change-transform" />
        <div className="hero-parallax-bg absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/10 blur-[120px] will-change-transform" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Premium Entrance Staggered Typography */}
          <motion.div 
            className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold bg-teal-500/10 border border-teal-500/20 text-teal-300 uppercase tracking-widest leading-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Real-Time Property Rental Operations</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.1] font-sans"
            >
              Operate Rentals with<br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Absolute Clarity
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed"
            >
              PropertyFlow links landlords, managers, support staff, and tenants in a single unified pipeline. Coordinate maintenance requests, schedule amenities, and track portfolio-wide KPIs in real time.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
            >
              {currentUser ? (
                <motion.button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/10 border border-teal-400/20 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2 focus:outline-none"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: tokens.animations.durations.interactive }}
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={onLoginClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-white font-bold bg-[#0F766E] hover:bg-[#115E59] shadow-lg shadow-teal-500/10 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2 border border-teal-500/20 focus:outline-none"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: tokens.animations.durations.interactive }}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
              
              <button
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-slate-300 bg-slate-900/40 border border-slate-800 hover:bg-slate-900/60 font-bold transition-all text-xs uppercase tracking-wider cursor-pointer focus:outline-none"
              >
                View Features
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Premium Connection & Booking Flow Visual (Glassmorphic) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div 
              ref={networkRef}
              className="w-full max-w-[480px] aspect-[4/3] relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-md shadow-2xl flex items-center justify-center select-none"
            >
              {/* Inner ambient radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.08)_0%,transparent_70%)] pointer-events-none" />

              {/* Connections SVG Line & Pulse Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {systemConnections.map((conn, index) => {
                  const fromNode = systemNodes.find(n => n.id === conn.from)!;
                  const toNode = systemNodes.find(n => n.id === conn.to)!;
                  return (
                    <g key={index}>
                      {/* Base Connection line */}
                      <line
                        ref={el => { linesRef.current[index] = el; }}
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke="url(#lineGrad)"
                        strokeWidth="1.5"
                      />
                      {/* Active floating pulse */}
                      <circle
                        ref={el => { pulsesRef.current[index] = el; }}
                        r="3.5"
                        fill="#5EEAD4"
                        filter="drop-shadow(0 0 6px rgba(20, 184, 166, 0.8))"
                        className="opacity-0"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* System Nodes UI layout */}
              {systemNodes.map(node => (
                <div 
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-help z-10"
                >
                  {/* Glowing core/outer ring */}
                  <div className={`p-2.5 rounded-xl bg-slate-900 border ${
                    node.main 
                      ? 'border-teal-500/50 shadow-lg shadow-teal-500/10' 
                      : 'border-slate-800'
                  } group-hover:border-teal-400 transition-colors`}>
                    <node.icon className={`w-5 h-5 ${node.color}`} />
                  </div>
                  <span className="mt-2 text-[10px] font-mono tracking-wider font-semibold text-slate-400 group-hover:text-white transition-colors bg-slate-950/80 px-2 py-0.5 rounded border border-slate-900 whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
