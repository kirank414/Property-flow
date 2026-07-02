import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';
import LandingLoader from './landing/LandingLoader.tsx';
import LandingNavbar from './landing/LandingNavbar.tsx';
import LandingHero from './landing/LandingHero.tsx';
import LandingStats from './landing/LandingStats.tsx';
import LandingFeatures from './landing/LandingFeatures.tsx';
import LandingBenefits from './landing/LandingBenefits.tsx';
import LandingHowItWorks from './landing/LandingHowItWorks.tsx';
import LandingTechStack from './landing/LandingTechStack.tsx';
import LandingCTA from './landing/LandingCTA.tsx';
import LandingFooter from './landing/LandingFooter.tsx';
import DemoCredentialsModal from './DemoCredentialsModal.tsx';

interface LandingPageProps {
  onLoginClick: () => void;
  onGetStarted: () => void;
  onLogout?: () => void;
  currentUser?: User | null;
}

export default function LandingPage({
  onLoginClick,
  onGetStarted,
  onLogout,
  currentUser = null
}: LandingPageProps) {
  const [pageLoading, setPageLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  // Monitor cursor glow coords (Desktop pointer-only)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);

    const handlePointerMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (mediaQuery.matches) {
      window.addEventListener('pointermove', handlePointerMove);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Intersection Observer for scroll tracking (Scroll Spy)
  useEffect(() => {
    if (pageLoading) return;

    const sections = ['home-section', 'features-section', 'how-it-works-section', 'technology-section'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // Track section scroll visibility
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace('-section', '');
          setActiveSection(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [pageLoading]);

  if (pageLoading) {
    return <LandingLoader onComplete={() => setPageLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans selection:bg-[#CCFBF1] selection:text-[#0F766E] scroll-smooth antialiased transition-colors duration-200">
      
      {/* Desktop Cursor Glow */}
      {isPointerDevice && (
        <div 
          className="fixed pointer-events-none z-50 w-[350px] h-[350px] rounded-full bg-teal-500/[0.04] blur-[80px] -translate-x-1/2 -translate-y-1/2"
          style={{ left: mousePos.x, top: mousePos.y, willChange: 'left, top' }}
        />
      )}

      {/* Navigation Bar */}
      <LandingNavbar 
        currentUser={currentUser}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLoginClick={onLoginClick}
        onGetStarted={onGetStarted}
        onLogout={onLogout}
      />

      {/* Main Structural Layout */}
      <main className="relative z-10">
        <LandingHero 
          currentUser={currentUser}
          onLoginClick={onLoginClick}
          onGetStarted={onGetStarted}
        />

        <LandingStats />

        <LandingFeatures />

        <LandingBenefits />

        <LandingHowItWorks />

        <LandingTechStack />

        <LandingCTA onLoginClick={onLoginClick} />
      </main>

      {/* Footer */}
      <LandingFooter 
        currentUser={currentUser}
        onDemoClick={() => setIsDemoModalOpen(true)}
        onSectionChange={setActiveSection}
      />

      {/* Shared Credentials Modal */}
      <DemoCredentialsModal 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLoginClick={onLoginClick}
      />

    </div>
  );
}
