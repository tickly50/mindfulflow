import { memo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// Fullscreen success overlay after saving an entry
const SuccessOverlay = memo(function SuccessOverlay({ successParticles, onClose }) {
  const closedRef = useRef(false);

  const safeClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    onClose?.();
  }, [onClose]);

  // Lock scroll on mount
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Auto-close after a short moment (premium, non-blocking flow)
  useEffect(() => {
    const t = window.setTimeout(() => {
      safeClose();
    }, 2200);
    return () => window.clearTimeout(t);
  }, [safeClose]);

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') safeClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [safeClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={safeClose}
      role="dialog"
      aria-modal="true"
      aria-label="Uloženo"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm touch-none"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {successParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
            initial={{
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
              opacity: 1,
              scale: 0,
            }}
            animate={{
              x: window.innerWidth / 2 + p.xOffset,
              y: window.innerHeight / 2 + p.yOffset,
              opacity: 0,
              scale: p.scale,
              rotate: p.rotate,
            }}
            transition={{ duration: p.duration, ease: 'easeOut' }}
          />
        ))}
      </div>

      <motion.div
        className="relative bg-[#0f172a] border border-white/10 rounded-[3rem] p-12 text-center max-w-sm w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/5 z-0" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-green-500 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <Check className="w-12 h-12 text-white stroke-[4]" />
          </motion.div>

          <motion.h2
            className="text-3xl font-black text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Skvělá práce!
          </motion.h2>

          <motion.p
            className="text-white/60 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Tvůj záznam byl úspěšně uložen.
            <br />
            Jen tak dál!
          </motion.p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
});

export default SuccessOverlay;

