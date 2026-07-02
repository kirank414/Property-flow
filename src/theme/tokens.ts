export const tokens = {
  colors: {
    bg: {
      primary: '#0B0F19',       // Deep slate-black
      secondary: '#111827',     // Dark slate card base
      accentTeal: '#0F766E',    // Base Teal
      accentTealLight: '#14B8A6', // Glow Teal
      accentCyan: '#06B6D4',    // Glow Cyan
      accentIndigo: '#6366F1',  // Tech Stack / Highlights purple accent
    },
    text: {
      primary: '#F8FAFC',       // Slate 50
      secondary: '#CBD5E1',     // Slate 300
      muted: '#64748B',         // Slate 500
      accent: '#5EEAD4',        // Minty Teal 300
    },
    borders: {
      slate: 'rgba(51, 65, 85, 0.4)', // border-slate-700/40
      slateLight: 'rgba(51, 65, 85, 0.2)', // border-slate-700/20
      teal: 'rgba(20, 184, 166, 0.2)', // border-teal-500/20
    }
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    subtle: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    card: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    glowTeal: '0 0 20px 2px rgba(20, 184, 166, 0.15)',
    glowCyan: '0 0 20px 2px rgba(6, 182, 212, 0.15)',
  },
  animations: {
    durations: {
      interactive: 0.2, // 200ms
      reveal: 0.6,      // 600ms
      hero: 0.9,        // 900ms
      ambient: 18,      // 18s loop
    },
    ease: {
      smooth: 'easeInOut',
      power2: 'power2.inOut',
      power3: 'power3.out',
    }
  }
};
