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
        '--aurora-p': c.p,
        '--aurora-s': c.s,
        '--aurora-t': c.t,
      }}
    >
      {/* Base radial gradient – colour transition only, no layout change */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--aurora-p) 0%, transparent 80%)',
          transition: 'background 2s ease-in-out',
        }}
      />

      {/* Moving Aurora Orbs – pure CSS keyframe animations, GPU-only */}
      <div className="absolute inset-0 opacity-60">
        {/* Orb 1: Top Left */}
        <div
          className="aurora-orb aurora-orb-1 absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--aurora-s) 0%, transparent 70%)',
            transition: 'background 2s ease-in-out',
          }}
        />

        {/* Orb 2: Bottom Right */}
        <div
          className="aurora-orb aurora-orb-2 absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--aurora-t) 0%, transparent 70%)',
            transition: 'background 2s ease-in-out',
          }}
        />

        {/* Orb 3: Center drifting */}
        <div
          className="aurora-orb aurora-orb-3 absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, var(--aurora-p) 0%, transparent 70%)',
            transition: 'background 2s ease-in-out',
          }}
        />
      </div>

      {/* Cinematic noise texture – static, zero animation cost */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
});

export default BackgroundAurora;
