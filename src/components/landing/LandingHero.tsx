import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Building2, Wrench, Calendar, Users } from 'lucide-react';
import { tokens } from '../../theme/tokens';
import { User } from '../../types.ts';
import MagneticButton from '../ui/MagneticButton.tsx';

interface LandingHeroProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onGetStarted: () => void;
}

export default function LandingHero({ currentUser, onLoginClick, onGetStarted }: LandingHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulsesRef = useRef<(SVGCircleElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);
  
  // Floating geometric elements refs
  const floatingGeo1 = useRef<SVGSVGElement>(null);
  const floatingGeo2 = useRef<SVGSVGElement>(null);
  const floatingGeo3 = useRef<SVGSVGElement>(null);

  // Canvas Network Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Nodes
    const numNodes = Math.floor((width * height) / 15000); // adjust density
    const nodes: { x: number, y: number, vx: number, vy: number, baseRadius: number }[] = [];
    
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3, // slow drift
        vy: (Math.random() - 0.5) * 0.3,
        baseRadius: Math.random() * 1.5 + 0.5
      });
    }

    let mouse = { x: -1000, y: -1000 };
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    const handleMouseMoveCanvas = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeaveCanvas = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMoveCanvas);
      document.body.addEventListener('mouseleave', handleMouseLeaveCanvas);
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const maxDist = 180;

      // Update & Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        const dxMouse = mouse.x - node.x;
        const dyMouse = mouse.y - node.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        let alpha = 0.1;
        let radius = node.baseRadius;
        
        if (distMouse < maxDist && !prefersReducedMotion) {
          const intensity = 1 - (distMouse / maxDist);
          alpha = 0.1 + (intensity * 0.4);
          radius = node.baseRadius + (intensity * 1);
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${alpha})`;
        ctx.fill();

        // Draw connections to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            let lineAlpha = 0.05 * (1 - dist / 100);
            
            // Brighten line if near mouse
            if (!prefersReducedMotion) {
               const midX = (node.x + otherNode.x) / 2;
               const midY = (node.y + otherNode.y) / 2;
               const dMouseLine = Math.sqrt(Math.pow(mouse.x - midX, 2) + Math.pow(mouse.y - midY, 2));
               if (dMouseLine < maxDist) {
                 lineAlpha += (1 - dMouseLine / maxDist) * 0.15;
               }
            }

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMoveCanvas);
      document.body.removeEventListener('mouseleave', handleMouseLeaveCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Floating Geometry Parallax & Magnetic Buttons
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Floating Geometry Parallax
    const handleMouseMoveGeo = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5);
      const yPos = (clientY / window.innerHeight - 0.5);

      gsap.to(floatingGeo1.current, { x: xPos * 40, y: yPos * 40, duration: 1.5, ease: 'power2.out' });
      gsap.to(floatingGeo2.current, { x: -xPos * 60, y: -yPos * 60, duration: 2, ease: 'power2.out' });
      gsap.to(floatingGeo3.current, { x: xPos * 20, y: -yPos * 30, duration: 1.8, ease: 'power2.out' });
    };
    
    window.addEventListener('mousemove', handleMouseMoveGeo);

    // Pulse Animation
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
      window.removeEventListener('mousemove', handleMouseMoveGeo);
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
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0B0F19] select-none m-0 p-0"
      style={{ perspective: '1000px' }}
    >
      {/* 1. Interactive Canvas Network Grid */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* 2. Floating Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg ref={floatingGeo1} className="absolute top-[15%] left-[5%] w-64 h-64 opacity-5 text-teal-400" viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" rx="20" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg ref={floatingGeo2} className="absolute bottom-[20%] right-[10%] w-96 h-96 opacity-[0.08] text-indigo-400" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
        <svg ref={floatingGeo3} className="absolute top-[40%] right-[30%] w-40 h-40 opacity-10 text-cyan-400" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-stretch">
          
          {/* Left Column: Premium Entrance Staggered Typography */}
          <motion.div 
            className="lg:col-span-6 space-y-8 text-center lg:text-left flex flex-col items-center justify-center lg:items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center space-x-3 px-4 py-2 rounded-full text-xs lg:text-sm font-bold bg-teal-500/10 border border-teal-500/20 text-teal-300 uppercase tracking-widest leading-none"
            >
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-teal-400" />
              <span>Real-Time Property Rental Operations</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-[72px] xl:text-[84px] font-extrabold tracking-tight text-white leading-[1.05] font-sans"
            >
              Operate Rentals with<br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Absolute Clarity
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed"
            >
              PropertyFlow links landlords, managers, support staff, and tenants in a single unified pipeline. Coordinate maintenance requests, schedule amenities, and track portfolio-wide KPIs in real time.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {currentUser ? (
                <MagneticButton
                  magneticPull={6}
                  tiltAngle={3}
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/10 border border-teal-400/20 text-sm lg:text-base uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-3 focus:outline-none transition-colors hover:from-teal-600 hover:to-cyan-600"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              ) : (
                <MagneticButton
                  magneticPull={6}
                  tiltAngle={3}
                  onClick={onLoginClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-white font-bold bg-[#0F766E] shadow-lg shadow-teal-500/10 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2 border border-teal-500/20 focus:outline-none transition-colors hover:bg-[#115E59]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              )}
              
              <MagneticButton
                magneticPull={6}
                tiltAngle={3}
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-slate-300 bg-slate-900/40 border border-slate-800 font-bold text-xs uppercase tracking-wider cursor-pointer focus:outline-none transition-colors hover:bg-slate-900/60"
              >
                View Features
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right Column: Premium Connection Visual (Glassmorphic) */}
          <div className="lg:col-span-6 flex w-full h-full min-h-[400px]">
            <div 
              className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-md shadow-2xl flex items-center justify-center select-none"
            >
              {/* Connections SVG Line & Pulse Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
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
                      <line
                        ref={el => { linesRef.current[index] = el; }}
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke="url(#lineGrad)"
                        strokeWidth="1.5"
                      />
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
