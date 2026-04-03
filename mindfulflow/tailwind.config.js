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
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Mood-based gradient colors
        mood: {
          1: '#ef4444', // red-500 (Špatně)
          2: '#f59e0b', // amber-500 (Ve stresu)
          3: '#eab308', // yellow-500 (Unaveně)
          4: '#10b981', // emerald-500 (Klidně)
          5: '#8b5cf6', // violet-500 (Skvěle)
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.7)' },
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
        'glow-violet': '0 0 30px rgba(139, 92, 246, 0.5)',
        'glow-violet-strong': '0 0 50px rgba(139, 92, 246, 0.7)',
        'glow-fuchsia': '0 0 40px rgba(217, 70, 239, 0.45)',
        'glow-cyan': '0 0 36px rgba(34, 211, 238, 0.35)',
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
        'glow-emerald-strong': '0 0 50px rgba(16, 185, 129, 0.6)',
        'glow-orange': '0 0 30px rgba(234, 88, 12, 0.5)',
        'depth-sm': '0 4px 24px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.06) inset',
        'depth-lg': '0 24px 80px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.08) inset',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.15)',
        'studio': '0 25px 50px -12px rgba(0, 0, 0, 0.65), 0 0 80px rgba(139, 92, 246, 0.12)',
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
