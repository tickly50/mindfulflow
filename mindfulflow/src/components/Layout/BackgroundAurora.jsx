import { memo } from 'react';
import { useReducedMotion } from 'framer-motion';
import useIsLowEndDevice from '../../hooks/useIsLowEndDevice';

/**
 * Premium dynamic Aurora background that reacts to the current mood.
 * Fully CSS-driven – zero JS animation overhead, GPU-composited transforms only.
 *
 * Mood cross-fade: each mood has its own absolutely-positioned radial overlay.
 * Only the active mood's overlay has opacity > 0, and we transition only opacity
 * (compositor-thread op). The aurora orbs use CSS custom properties for color
 * but those are swapped instantly (no background transition) – the orbs' continuous
 * transform animations mask any instant color change.
 */

const MOOD_PALETTES = {
  null: { p: '#3b4a6b', s: '#5b6fa8', t: '#6d5b97' },
  1:    { p: '#7f1d1d', s: '#991b1b', t: '#b91c1c' },
  2:    { p: '#78350f', s: '#92400e', t: '#b45309' },
  3:    { p: '#713f12', s: '#854d0e', t: '#a16207' },
  4:    { p: '#064e3b', s: '#065f46', t: '#047857' },
  5:    { p: '#4c1d95', s: '#5b21b6', t: '#6d28d9' },
};

const MOOD_KEYS = Object.keys(MOOD_PALETTES);

const BackgroundAurora = memo(function BackgroundAurora({ currentMood }) {
  const activeMoodKey = String(currentMood ?? 'null');
  const activeColors  = MOOD_PALETTES[activeMoodKey] ?? MOOD_PALETTES.null;
  const prefersReduced = useReducedMotion();
  const lowEnd = useIsLowEndDevice();

  const shouldAnimate = !prefersReduced && !lowEnd;

  return (
    <div
      className="fixed inset-0 -z-50 overflow-hidden bg-[#0f172a] pointer-events-none"
      aria-hidden="true"
      style={{ contain: 'paint style' }}
    >
      {/* Base radial gradient per mood – cross-fade via opacity only (compositor) */}
      {MOOD_KEYS.map((key) => {
        const c = MOOD_PALETTES[key];
        return (
          <div
            key={key}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${c.p} 0%, transparent 80%)`,
              opacity: key === activeMoodKey ? 0.3 : 0,
              transition: 'opacity 2s ease-in-out',
              willChange: 'opacity',
            }}
          />
        );
      })}

      {/* Moving Aurora Orbs – pure CSS keyframe animations, GPU-only transform */}
      {/* Colors switch instantly (no background transition) – not perceptible during animation */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="aurora-orb aurora-orb-1 absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${activeColors.s} 0%, transparent 60%)`,
            animation: shouldAnimate ? undefined : 'none',
          }}
        />
        {shouldAnimate ? (
          <>
            <div
              className="aurora-orb aurora-orb-2 absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full"
              style={{
                background: `radial-gradient(circle, ${activeColors.t} 0%, transparent 60%)`,
                animation: shouldAnimate ? undefined : 'none',
              }}
            />
            <div
              className="aurora-orb aurora-orb-3 absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full opacity-30"
              style={{
                background: `radial-gradient(circle, ${activeColors.p} 0%, transparent 60%)`,
                animation: shouldAnimate ? undefined : 'none',
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
});

export default BackgroundAurora;
