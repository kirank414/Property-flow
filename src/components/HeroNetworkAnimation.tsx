import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'motion/react';

export default function HeroNetworkAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);
  const pulsesRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Removed floating node animation so they stay anchored to lines

    // Pulses traveling along lines
    pulsesRef.current.forEach((pulse, i) => {
      const line = linesRef.current[i];
      if (!line || !pulse) return;
      
      const x1 = line.getAttribute('x1');
      const y1 = line.getAttribute('y1');
      const x2 = line.getAttribute('x2');
      const y2 = line.getAttribute('y2');

      if (!x1 || !y1 || !x2 || !y2) return;

      gsap.fromTo(pulse, 
        { attr: { cx: x1, cy: y1 }, opacity: 0 },
        { 
          attr: { cx: x2, cy: y2 }, 
          opacity: 1, 
          duration: "random(2, 4)", 
          repeat: -1, 
          ease: "power2.inOut",
          delay: i * 0.6,
          onRepeat: () => {
             gsap.fromTo(pulse, { opacity: 1 }, { opacity: 0, duration: 0.5, delay: "random(1, 2)" });
          }
        }
      );
    });

  }, []);

  const networkData = [
    { id: 1, x: 18, y: 12, color: 'bg-teal-500', label: 'Property Sync' },
    { id: 2, x: 82, y: 12, color: 'bg-cyan-500', label: 'Maintenance' },
    { id: 3, x: 82, y: 85, color: 'bg-indigo-500', label: 'Scheduling' },
    { id: 4, x: 18, y: 85, color: 'bg-blue-500', label: 'Tenant Portal' },
    { id: 5, x: 50, y: 48, color: 'bg-teal-300', label: 'PropertyFlow Core', main: true },
  ];

  const connections = [
    { from: 1, to: 5 },
    { from: 2, to: 5 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
    { from: 1, to: 2 },
    { from: 3, to: 4 },
  ];

  return (
    <div className="w-full h-full relative flex items-center justify-center p-2 sm:p-4 lg:p-0">
      <div 
        ref={containerRef}
        className="w-full h-full min-h-[400px] relative rounded-3xl overflow-hidden border border-teal-500/10 bg-[#0F172A]/50 backdrop-blur-2xl shadow-2xl shadow-teal-900/20"
      >
        {/* Subtle Background Grid inside visualization */}
        <div className="absolute inset-0 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {connections.map((conn, i) => {
            const fromNode = networkData.find(n => n.id === conn.from);
            const toNode = networkData.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            return (
              <g key={`conn-${i}`}>
                {/* Static Connection */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="rgba(20, 184, 166, 0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                {/* Invisible Line for Pulse Path extraction */}
                <line
                  ref={el => { linesRef.current[i] = el; }}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="transparent"
                />
                {/* Animated Pulse */}
                <circle
                  ref={el => { pulsesRef.current[i] = el; }}
                  r="2.5"
                  fill="#5EEAD4"
                  style={{ filter: 'drop-shadow(0 0 6px #5EEAD4)' }}
                />
              </g>
            );
          })}
        </svg>

        {/* Animated Nodes */}
        {networkData.map((node, i) => (
          <div
            key={`${node.id}-remount`}
            className="absolute z-10 w-0 h-0 flex items-center justify-center"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {/* Pulsing Aura */}
            <motion.div 
              className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${node.color} opacity-[0.15] blur-xl`}
              animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: node.main ? 2 : 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              style={{ willChange: "transform, opacity" }}
            />
            
            {/* Core Node */}
            <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${node.main ? 'w-10 h-10' : 'w-6 h-6'} rounded-full ${node.color} shadow-lg shadow-black/50 border border-white/20`}>
              {node.main ? (
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" />
              ) : (
                <div className="w-2 h-2 bg-white/90 rounded-full" />
              )}
            </div>
            
            {/* Label */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 top-[12px] mt-2 px-3 py-1.5 bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-full ${node.main ? 'text-xs' : 'text-[10px]'} text-slate-200 font-mono tracking-widest shadow-xl whitespace-nowrap text-center`}>
              {node.label}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
