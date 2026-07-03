import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  magneticPull?: number; // Default 8
  tiltAngle?: number;    // Default 3
}

export default function MagneticButton({ 
  children, 
  className = '', 
  magneticPull = 8,
  tiltAngle = 3,
  ...props 
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !btnRef.current) return;

    const btn = btnRef.current;
    
    // Smooth, snappy spring-like easing for premium feel
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const rotateXTo = gsap.quickTo(btn, 'rotateX', { duration: 0.4, ease: 'power2.out' });
    const rotateYTo = gsap.quickTo(btn, 'rotateY', { duration: 0.4, ease: 'power2.out' });

    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const diffX = e.clientX - centerX;
      const diffY = e.clientY - centerY;
      
      const tiltX = -(diffY / rect.height) * tiltAngle * 2;
      const tiltY = (diffX / rect.width) * tiltAngle * 2;

      // Clamp movement
      xTo(Math.max(-magneticPull, Math.min(magneticPull, diffX * 0.2))); 
      yTo(Math.max(-magneticPull, Math.min(magneticPull, diffY * 0.2)));
      
      // Clamp tilt
      rotateXTo(Math.max(-tiltAngle, Math.min(tiltAngle, tiltX)));
      rotateYTo(Math.max(-tiltAngle, Math.min(tiltAngle, tiltY)));
    };

    const onMouseLeave = () => {
      xTo(0);
      yTo(0);
      rotateXTo(0);
      rotateYTo(0);
    };

    btn.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', onMouseMove);
      btn.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [magneticPull, tiltAngle]);

  return (
    <button
      ref={btnRef}
      className={`interactive-button flex items-center justify-center focus:outline-none ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
    </button>
  );
}
