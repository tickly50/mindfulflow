import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCALE_BY_PHASE = {
  inhale: 1.42,
  hold:   1.42,
  hold1:  1.42,
  exhale: 0.65,
  hold2:  0.65,
  idle:   0.86,
};

function phaseTransition(effectivePhase, seconds) {
  if (effectivePhase === 'idle') {
    return { type: 'spring', stiffness: 55, damping: 18 };
  }
  if (effectivePhase.startsWith('hold')) {
    // Snap to hold position quickly — no re-animation needed (scale unchanged)
    return { type: 'spring', stiffness: 260, damping: 58 };
  }
  // inhale / exhale: spring that breathes over the full phase duration
  return {
    type: 'spring',
    duration: seconds * 0.94,
    bounce: effectivePhase === 'inhale' ? 0.07 : 0.03,
  };
}

export const BreathingCircle = memo(function BreathingCircle({
  phaseName,
  phaseDuration,
  phaseLabel,
  accent,
  glow,
  isRunning,
  isPreparing,
  prepCount,
  remaining,
  phaseIdx,
}) {
  const effectivePhase = isRunning && !isPreparing ? (phaseName ?? 'idle') : 'idle';
  const targetScale    = SCALE_BY_PHASE[effectivePhase] ?? 0.86;
  const transition     = phaseTransition(effectivePhase, phaseDuration);

  // SVG ring geometry
  const R    = 116;
  const CX   = 128;
  const CY   = 128;
  const CIRC = 2 * Math.PI * R;

  const orbLabel = isPreparing ? 'PŘIPRAV SE' : phaseLabel;
  const orbCount = isPreparing ? prepCount     : remaining;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: 'min(300px, 84vw)', height: 'min(300px, 84vw)' }}
    >
      {/* SVG timer ring */}
      <svg
        width="100%" height="100%"
        viewBox="0 0 256 256"
        className="absolute inset-0 pointer-events-none"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
        />
        {isRunning && (
          <motion.circle
            key={isPreparing ? 'prep-ring' : `ring-${phaseIdx}`}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={isPreparing ? 'rgba(255,255,255,0.22)' : accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: isPreparing ? 3 : phaseDuration,
              ease: 'linear',
            }}
          />
        )}
      </svg>

      {/* Trailing outer rings */}
      {[1.22, 1.10].map((factor, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width:  `${factor * 100}%`,
            height: `${factor * 100}%`,
            border: `1px solid ${accent}${i === 0 ? '0f' : '1c'}`,
          }}
          animate={{ scale: targetScale }}
          transition={{ ...transition, delay: (i + 1) * 0.07 }}
        />
      ))}

      {/* Ambient glow bloom */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-8%',
          background: `radial-gradient(circle, ${glow}3a 0%, ${glow}0e 55%, transparent 72%)`,
        }}
        animate={{ scale: targetScale * 1.08, opacity: isRunning ? 1 : 0.38 }}
        transition={transition}
      />

      {/* Main orb */}
      <motion.div
        className="rounded-full relative overflow-hidden flex flex-col items-center justify-center gap-0.5"
        style={{
          width: '62%',
          height: '62%',
          background: `radial-gradient(circle at 37% 32%, ${accent}f8, ${glow}cc)`,
          boxShadow: `
            0 0 55px ${glow}58,
            0 0 110px ${glow}1e,
            inset 0 2px 28px ${accent}a5,
            inset 0 -8px 30px rgba(0,0,0,0.40)
          `,
          willChange: 'transform',
        }}
        animate={{ scale: targetScale }}
        transition={transition}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '44%',
            height: '24%',
            top: '14%',
            left: '20%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.30) 0%, transparent 80%)',
          }}
        />

        {/* Phase label */}
        <AnimatePresence mode="wait">
          <motion.span
            key={isPreparing ? 'prep-lbl' : (orbLabel ?? 'idle-lbl')}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22 }}
            className="font-bold tracking-[0.18em] text-white/88 uppercase"
            style={{ fontSize: 'clamp(8px, 2.3vw, 11px)' }}
          >
            {isRunning ? (orbLabel ?? '') : ''}
          </motion.span>
        </AnimatePresence>

        {/* Countdown number */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`num-${orbCount}`}
            initial={{ scale: 0.6,  opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{    scale: 1.28, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="font-black text-white tabular-nums"
            style={{
              fontSize: 'clamp(34px, 11vw, 54px)',
              lineHeight: 1,
              textShadow: `0 0 22px ${glow}80, 0 0 44px ${accent}35`,
            }}
          >
            {isRunning ? orbCount : ''}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Phase-transition ripple */}
      <AnimatePresence>
        {isRunning && !isPreparing && (
          <motion.div
            key={`ripple-${phaseIdx}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '64%',
              height: '64%',
              border: `1.5px solid ${accent}65`,
            }}
            initial={{ scale: targetScale * 0.88, opacity: 0.80 }}
            animate={{ scale: targetScale * 2.25, opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});
