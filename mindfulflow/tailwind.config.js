/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'fluid-xs': ['clamp(0.6875rem, 0.5vw + 0.6rem, 0.75rem)', { lineHeight: '1.35' }],
        'fluid-sm': ['clamp(0.8125rem, 0.35vw + 0.75rem, 0.9375rem)', { lineHeight: '1.45' }],
        'fluid-base': ['clamp(0.9375rem, 0.4vw + 0.82rem, 1.0625rem)', { lineHeight: '1.55' }],
        'fluid-lg': ['clamp(1.0625rem, 0.9vw + 0.75rem, 1.25rem)', { lineHeight: '1.4' }],
        'fluid-xl': ['clamp(1.25rem, 1.2vw + 0.85rem, 1.5rem)', { lineHeight: '1.3' }],
        'fluid-2xl': ['clamp(1.5rem, 2vw + 0.75rem, 2rem)', { lineHeight: '1.2' }],
        'fluid-3xl': ['clamp(1.75rem, 3.5vw + 0.65rem, 2.75rem)', { lineHeight: '1.15' }],
        'fluid-4xl': ['clamp(2rem, 5vw + 0.5rem, 3.75rem)', { lineHeight: '1.1' }],
        'fluid-5xl': ['clamp(2.25rem, 6vw + 0.5rem, 4.5rem)', { lineHeight: '1.08' }],
      },
      spacing: {
        'fluid-section': 'clamp(2rem, 6vw, 5rem)',
        'fluid-card': 'clamp(1rem, 3vw, 2.5rem)',
        'fluid-gap': 'clamp(0.75rem, 2vw, 1.5rem)',
      },
      maxWidth: {
        'content': 'min(100%, 80rem)',
        'prose-narrow': 'min(100%, 42rem)',
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        sans: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        // Mood-based gradient colors
        mood: {
          1: '#ef4444',
          2: '#f59e0b',
          3: '#eab308',
          4: '#14b8a6',
          5: '#f59e0b',
        },
        // Extended palette for premium design
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          strong: 'rgba(255, 255, 255, 0.15)',
        }
      },
      animation: {
        'breathing': 'breathing 4s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in-scale': 'fade-in-scale 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(45, 212, 191, 0.45)' },
          '50%': { boxShadow: '0 0 42px rgba(45, 212, 191, 0.72)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'glow-accent': '0 0 34px rgba(45, 212, 191, 0.42)',
        'glow-accent-strong': '0 0 52px rgba(45, 212, 191, 0.65)',
        'glow-violet': '0 0 34px rgba(45, 212, 191, 0.42)',
        'glow-violet-strong': '0 0 52px rgba(45, 212, 191, 0.65)',
        'glow-hot': '0 0 38px rgba(251, 113, 133, 0.4)',
        'glow-fuchsia': '0 0 40px rgba(251, 113, 133, 0.38)',
        'glow-cyan': '0 0 36px rgba(34, 211, 238, 0.35)',
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
        'glow-emerald-strong': '0 0 50px rgba(16, 185, 129, 0.6)',
        'glow-orange': '0 0 32px rgba(249, 115, 22, 0.48)',
        'glow-red': '0 0 28px rgba(244, 63, 94, 0.35)',
        'depth-sm': '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.07) inset',
        'depth-lg': '0 28px 90px rgba(0, 0, 0, 0.58), 0 0 0 1px rgba(255,255,255,0.09) inset',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.22)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.28)',
        'studio': '0 28px 56px -14px rgba(0, 0, 0, 0.72), 0 0 90px rgba(45, 212, 191, 0.1)',
      },
      backdropBlur: {
        'xs': '4px',
        'glass': '16px',
        'glass-strong': '24px',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}
