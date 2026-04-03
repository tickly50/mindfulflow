import { memo } from 'react';
import { useReducedMotion } from 'framer-motion';
import useIsLowEndDevice from '../../hooks/useIsLowEndDevice';

/**
 * Multi-layer aurora + mesh — mood-reactive, GPU-friendly.
 */

const MOOD_PALETTES = {
  null: { p: '#312e81', s: '#7c3aed', t: '#0e7490', mesh: '#4f46e5' },
  1: { p: '#7f1d1d', s: '#dc2626', t: '#991b1b', mesh: '#ef4444' },
  2: { p: '#9a3412', s: '#ea580c', t: '#c2410c', mesh: '#fb923c' },
  3: { p: '#854d0e', s: '#ca8a04', t: '#a16207', mesh: '#facc15' },
  4: { p: '#064e3b', s: '#10b981', t: '#047857', mesh: '#34d399' },
  5: { p: '#4c1d95', s: '#a855f7', t: '#7c3aed', mesh: '#c084fc' },
};

const MOOD_KEYS = Object.keys(MOOD_PALETTES);

const BackgroundAurora = memo(function BackgroundAurora({ currentMood }) {
  const activeMoodKey = String(currentMood ?? 'null');
  const activeColors = MOOD_PALETTES[activeMoodKey] ?? MOOD_PALETTES.null;
  const prefersReduced = useReducedMotion();
  const lowEnd = useIsLowEndDevice();

  const shouldAnimate = !prefersReduced && !lowEnd;

  return (
    <div
      className="fixed inset-0 -z-50 overflow-hidden bg-[#020617] pointer-events-none"
      aria-hidden="true"
      style={{ contain: 'paint style' }}
    >
      {/* Animated mesh ribbon — slow drift */}
      <div
        className="absolute inset-[-40%] opacity-[0.22]"
        style={{
          background: `
            conic-gradient(from 180deg at 50% 50%,
              ${activeColors.mesh}00 0deg,
              ${activeColors.s}55 120deg,
              ${activeColors.t}44 240deg,
              ${activeColors.mesh}00 360deg)
          `,
          animation: shouldAnimate ? 'aurora-mesh-spin 48s linear infinite' : undefined,
        }}
      />

      {/* Base radial mood wash */}
      {MOOD_KEYS.map((key) => {
        const c = MOOD_PALETTES[key];
        return (
          <div
            key={key}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 90% 70% at 50% 45%, ${c.p} 0%, transparent 72%)`,
              opacity: key === activeMoodKey ? 0.42 : 0,
              transition: 'opacity 2.2s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity',
            }}
          />
        );
      })}

      {/* Aurora orbs */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="aurora-orb aurora-orb-1 absolute top-[-12%] left-[-12%] w-[46%] h-[46%] rounded-full blur-[2px]"
          style={{
            background: `radial-gradient(circle, ${activeColors.s} 0%, transparent 62%)`,
            animation: shouldAnimate ? undefined : 'none',
          }}
        />
        {shouldAnimate ? (
          <>
            <div
              className="aurora-orb aurora-orb-2 absolute bottom-[-22%] right-[-12%] w-[52%] h-[52%] rounded-full blur-[2px]"
              style={{
                background: `radial-gradient(circle, ${activeColors.t} 0%, transparent 62%)`,
              }}
            />
            <div
              className="aurora-orb aurora-orb-3 absolute top-[28%] left-[18%] w-[34%] h-[34%] rounded-full opacity-35 blur-[1px]"
              style={{
                background: `radial-gradient(circle, ${activeColors.p} 0%, transparent 60%)`,
              }}
            />
            <div
              className="aurora-orb aurora-orb-4 absolute top-[55%] right-[8%] w-[28%] h-[28%] rounded-full opacity-25 blur-[3px]"
              style={{
                background: `radial-gradient(circle, ${activeColors.mesh} 0%, transparent 58%)`,
              }}
            />
          </>
        ) : null}
      </div>

      {/* Bottom vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(2,6,23,0.95) 0%, transparent 35%, transparent 100%)',
        }}
      />
    </div>
  );
});

export default BackgroundAurora;
