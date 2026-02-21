import { memo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PARTICLE_COLORS = [
  'from-yellow-300 to-amber-500',
  'from-violet-400 to-purple-600',
  'from-emerald-300 to-teal-500',
  'from-rose-400 to-pink-600',
  'from-sky-300 to-blue-500',
  'from-orange-300 to-red-500',
];

const PARTICLE_SHAPES = ['rounded-full', 'rounded-sm', 'rounded-md'];

const SuccessOverlay = memo(function SuccessOverlay({ successParticles, onClose }) {
  const closedRef = useRef(false);

  const safeClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    onClose?.();
  }, [onClose]);

  // Lock scroll completely
  useEffect(() => {
    const originalBodyStyle = window.getComputedStyle(document.body).overflow;
    const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      document.body.style.overflow = originalBodyStyle === 'hidden' ? 'auto' : originalBodyStyle;
      document.documentElement.style.overflow = originalHtmlStyle === 'hidden' ? 'auto' : originalHtmlStyle;
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  // Auto-close after 2.4s
  useEffect(() => {
    const t = window.setTimeout(() => safeClose(), 2400);
    return () => window.clearTimeout(t);
  }, [safeClose]);

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') safeClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [safeClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25, ease: [0.2, 0.8, 0.2, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } }}
      onClick={safeClose}
      role="dialog"
      aria-modal="true"
      aria-label="Uloženo"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md touch-none"
    >
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {successParticles.map((p, i) => {
          const colorClass = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
          const shapeClass = PARTICLE_SHAPES[i % PARTICLE_SHAPES.length];
          const size = 6 + (i % 4) * 3;
          return (
            <motion.div
              key={i}
              className={`absolute bg-gradient-to-r ${colorClass} ${shapeClass}`}
              style={{ width: size, height: size }}
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + p.xOffset,
                y: window.innerHeight / 2 + p.yOffset,
                opacity: [1, 1, 0],
                scale: [0, 1.6, 0.8],
                rotate: p.rotate,
              }}
              transition={{
                duration: p.duration * 1.1,
                ease: [0.2, 0.8, 0.2, 1],
                times: [0, 0.5, 1],
              }}
            />
          );
        })}
      </div>

      {/* Main dialog card */}
      <motion.div
        className="relative bg-[#0f172a] border border-white/10 rounded-[3rem] p-12 text-center max-w-sm w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.7, y: 60, opacity: 0 }}
        animate={{
          scale: 1,
          y: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 280, damping: 22, mass: 0.8 },
        }}
        exit={{
          scale: 0.85,
          y: 30,
          opacity: 0,
          transition: { duration: 0.25, ease: [0.65, 0, 0.35, 1] },
        }}
      >
        {/* BG gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/15 to-teal-500/5 z-0" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Check circle – overshoots then settles */}
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-green-500 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/40"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, mass: 0.8, delay: 0.08 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
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
