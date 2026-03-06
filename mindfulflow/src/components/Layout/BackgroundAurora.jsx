import { memo } from 'react';

/**
 * Premium dynamic Aurora background that reacts to the current mood.
 * Fully CSS-driven – zero JS animation overhead, GPU-composited transforms only.
 */
const BackgroundAurora = memo(function BackgroundAurora({ currentMood }) {
  // CSS custom-property palettes per mood
  const moodVars = {
    null: { p: '#3b4a6b', s: '#5b6fa8', t: '#6d5b97' },
    1:    { p: '#7f1d1d', s: '#991b1b', t: '#b91c1c' }, // Red
    2:    { p: '#78350f', s: '#92400e', t: '#b45309' }, // Amber
    3:    { p: '#713f12', s: '#854d0e', t: '#a16207' }, // Yellow
    4:    { p: '#064e3b', s: '#065f46', t: '#047857' }, // Emerald
    5:    { p: '#4c1d95', s: '#5b21b6', t: '#6d28d9' }, // Violet
  };

  const c = moodVars[currentMood] || moodVars.null;

  return (
    <div
      className="fixed inset-0 -z-50 overflow-hidden bg-[#0f172a] pointer-events-none"
      aria-hidden="true"
      style={{
        contain: 'paint style',
        '--aurora-p': c.p,
        '--aurora-s': c.s,
        '--aurora-t': c.t,
      }}
    >
      {/* Base radial gradient – colour transition only, no layout change */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--aurora-p) 0%, transparent 80%)',
          transition: 'background 2s ease-in-out',
        }}
      />

      {/* Moving Aurora Orbs – pure CSS keyframe animations, GPU-only */}
      <div className="absolute inset-0 opacity-40">
        {/* Orb 1: Top Left */}
        <div
          className="aurora-orb aurora-orb-1 absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--aurora-s) 0%, transparent 60%)',
            transition: 'background 2s ease-in-out',
          }}
        />

        {/* Orb 2: Bottom Right */}
        <div
          className="aurora-orb aurora-orb-2 absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--aurora-t) 0%, transparent 60%)',
            transition: 'background 2s ease-in-out',
          }}
        />

        {/* Orb 3: Center drifting */}
        <div
          className="aurora-orb aurora-orb-3 absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, var(--aurora-p) 0%, transparent 60%)',
            transition: 'background 2s ease-in-out',
          }}
        />
      </div>


    </div>
  );
});

export default BackgroundAurora;
