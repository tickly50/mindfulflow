/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
        'glow-emerald-strong': '0 0 50px rgba(16, 185, 129, 0.6)',
        'glow-orange': '0 0 30px rgba(234, 88, 12, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.15)',
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
