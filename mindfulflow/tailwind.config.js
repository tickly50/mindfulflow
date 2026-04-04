/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        app: '680px',
        content: 'min(100%, 80rem)',
        'prose-narrow': 'min(100%, 42rem)',
      },
      spacing: {
        section: '24px',
      },
      fontSize: {
        'fluid-xs': ['clamp(0.6875rem, 0.5vw + 0.6rem, 0.75rem)', { lineHeight: '1.35' }],
        'fluid-sm': ['clamp(0.8125rem, 0.35vw + 0.75rem, 0.9375rem)', { lineHeight: '1.55' }],
        'fluid-base': ['clamp(0.9375rem, 0.4vw + 0.82rem, 1.0625rem)', { lineHeight: '1.65' }],
        'fluid-lg': ['clamp(1.0625rem, 0.9vw + 0.75rem, 1.25rem)', { lineHeight: '1.5' }],
        'fluid-xl': ['clamp(1.25rem, 1.2vw + 0.85rem, 1.5rem)', { lineHeight: '1.35' }],
        'fluid-2xl': ['clamp(1.5rem, 2vw + 0.75rem, 2rem)', { lineHeight: '1.2' }],
        'fluid-3xl': ['clamp(1.75rem, 3.5vw + 0.65rem, 2.75rem)', { lineHeight: '1.12' }],
        'fluid-4xl': ['clamp(2rem, 5vw + 0.5rem, 3.75rem)', { lineHeight: '1.08' }],
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        'serif-body': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        theme: {
          bg: 'var(--bg)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          text: 'var(--text)',
          muted: 'var(--text-muted)',
          border: 'var(--border)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
          glow: 'var(--accent-glow)',
          secondary: 'var(--accent-secondary)',
        },
      },
      transitionDuration: {
        theme: '400ms',
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      screens: {
        xs: '475px',
      },
      boxShadow: {
        'glow-accent': '0 0 24px var(--accent-glow)',
        'glow-teal': '0 0 20px rgba(94, 234, 212, 0.12)',
        'card-soft': '0 1px 0 rgba(255, 255, 255, 0.04) inset',
        'depth-sm': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'depth-lg': '0 8px 24px rgba(0, 0, 0, 0.18)',
        studio: '0 8px 32px rgba(0, 0, 0, 0.15)',
        glass: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
