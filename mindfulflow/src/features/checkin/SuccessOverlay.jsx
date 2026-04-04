import { memo, useCallback, useEffect, useRef } from 'react';
import useScrollLock from '../../hooks/useScrollLock';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';

import { haptics } from '../../utils/haptics';
import { Check } from 'lucide-react';

const PARTICLE_COLORS = [
  'from-violet-300 to-violet-500',
  'from-violet-400 to-violet-600',
  'from-violet-500 to-violet-700',
  'from-fuchsia-400 to-violet-600',
  'from-violet-200 to-violet-400',
  'from-purple-400 to-violet-600',
];

const PARTICLE_SHAPES = ['rounded-full', 'rounded-sm', 'rounded-md'];

const SuccessOverlay = memo(function SuccessOverlay({ successParticles, onClose }) {
  const prefersReduced = useReducedMotion();
  const closedRef = useRef(false);

  const safeClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    haptics.success();
  }, []);

  // Auto-close after 2.4s
  useEffect(() => {
    const t = window.setTimeout(() => safeClose(), 2400);
    return () => window.clearTimeout(t);
  }, [safeClose]);

  // ESC to close
  // ESC to close
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') safeClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [safeClose]);

  useScrollLock(true, true);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } }}
      onClick={safeClose}
      role="dialog"
      aria-modal="true"
      aria-label="Uloženo"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
      }}
      className="touch-none"
    >
      {/* Particles — skipped for reduced motion */}
      {!prefersReduced && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {successParticles.map((p, i) => {
            const colorClass = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
            const shapeClass = PARTICLE_SHAPES[i % PARTICLE_SHAPES.length];
            const size = 6 + (i % 4) * 3;
            return (
              <motion.div
                key={i}
                className={`absolute bg-gradient-to-r ${colorClass} ${shapeClass}`}
                style={{ width: size, height: size, willChange: 'transform, opacity' }}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  opacity: 1,
                }}
                animate={{
                  x: window.innerWidth / 2 + p.xOffset,
                  y: window.innerHeight / 2 + p.yOffset,
                  opacity: [1, 0.8, 0],
                  rotate: p.rotate,
                }}
                transition={{
                  duration: p.duration,
                  ease: [0.32, 0.72, 0, 1],
                  times: [0, 0.4, 1],
                }}
              />
            );
          })}
        </div>
      )}

      {/* Main dialog card */}
      <motion.div
        className="relative bg-zinc-900 border border-zinc-600 rounded-3xl p-12 text-center max-w-sm w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={prefersReduced ? { opacity: 0 } : { scale: 0.7, y: 60, opacity: 0 }}
        animate={
          prefersReduced
            ? { opacity: 1, transition: { duration: 0.2 } }
            : { scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24, mass: 0.6 } }
        }
        exit={
          prefersReduced
            ? { opacity: 0, transition: { duration: 0.15 } }
            : { scale: 0.85, y: 30, opacity: 0, transition: { duration: 0.25, ease: [0.65, 0, 0.35, 1] } }
        }
        style={{ willChange: 'transform, opacity' }}
      >
        {/* BG gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-500/15 to-violet-500/5 z-0" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Check circle */}
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-500 to-violet-700 flex items-center justify-center mb-6 shadow-xl shadow-violet-600/35"
            initial={prefersReduced ? { opacity: 0 } : { scale: 0, rotate: -90 }}
            animate={prefersReduced ? { opacity: 1 } : { scale: 1, rotate: 0 }}
            transition={
              prefersReduced
                ? { duration: 0.2, delay: 0.1 }
                : { type: 'spring', stiffness: 300, damping: 20, mass: 0.5, delay: 0.08 }
            }
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            >
              <Check className="w-12 h-12 text-white stroke-[4]" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl font-black text-white mb-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Skvělá práce!
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-white/60 font-medium leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Tvůj záznam byl úspěšně uložen.
            <br />
            Jen tak dál!
          </motion.p>

          {/* Tap hint */}
          <motion.p
            className="text-white/25 text-xs mt-5 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            Klepni pro zavření
          </motion.p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
});

export default SuccessOverlay;
