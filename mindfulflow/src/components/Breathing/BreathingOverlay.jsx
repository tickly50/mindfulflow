import { useEffect, useState, memo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * SOS Breathing overlay - Ultra-smooth Performance Edition
 * Supports multiple breathing patterns with hardware-accelerated animations
 */
const PHASES = [
  // 4-7-8 Breathing pattern: 4s inhale, 7s hold, 8s exhale
  { name: 'inhale', seconds: 4 },
  { name: 'hold', seconds: 7 },
  { name: 'exhale', seconds: 8 },
];

const BreathingSession = memo(function BreathingSession({ onClose }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(PHASES[0].seconds);
  const animationRef = useRef(null);

  // Drive phase changes + numeric countdown in a single, well‑managed interval
  useEffect(() => {
    let intervalId;

    const tick = () => {
      setRemainingSeconds((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Phase complete → advance to next phase and reset counter
        setPhaseIndex((current) => {
          const nextIndex = (current + 1) % PHASES.length;
          return nextIndex;
        });

        return 0; // Will be immediately reset below by a separate effect
      });
    };

    intervalId = window.setInterval(tick, 1000);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  // Whenever phase changes, reset the countdown cleanly
  useEffect(() => {
    setRemainingSeconds(PHASES[phaseIndex].seconds);
  }, [phaseIndex]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const breathingPhase = PHASES[phaseIndex].name;

  const getPhaseConfig = () => {
    switch (breathingPhase) {
      case 'inhale':
        return {
          scale: 1.4,
          opacity: 1,
          color: 'from-violet-400/60 to-purple-500/60',
          text: 'Nádech',
          instruction: 'Pomalu vdechuj nosem',
          duration: 4
        };
      case 'hold':
        return {
          scale: 1.4,
          opacity: 0.9,
          color: 'from-blue-400/60 to-indigo-500/60',
          text: 'Zadrž',
          instruction: 'Zadrž dech',
          duration: 7
        };
      case 'exhale':
        return {
          scale: 0.7,
          opacity: 0.6,
          color: 'from-emerald-400/60 to-green-500/60',
          text: 'Výdech',
          instruction: 'Pomalu vydechuj ústy',
          duration: 8
        };
      default:
        return {
          scale: 1,
          opacity: 1,
          color: 'from-violet-400/60 to-purple-500/60',
          text: 'Dýchej',
          instruction: 'Sleduj kroužek',
          duration: 1
        };
    }
  };

  const phaseConfig = getPhaseConfig();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backdropFilter: 'blur(16px)', transform: 'translateZ(0)' }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Close button */}
        <motion.button
          onClick={onClose}
          whileHover={{ 
            scale: 1.1, 
            rotate: 90, 
            transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] } 
          }}
          whileTap={{ 
            scale: 0.95, 
            transition: { duration: 0.1 } 
          }}
          className="absolute top-4 right-4 glass-strong rounded-full p-3 hover:bg-white/25 transition-all"
          style={{ transform: 'translateZ(0)' }}
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="text-2xl md:text-3xl font-bold text-white mb-4"
        >
          SOS Dýchací Cvičení
        </motion.h2>

        {/* Breathing circle with enhanced animations */}
        <div className="relative my-12">
          <motion.div
            ref={animationRef}
            animate={{
              scale: phaseConfig.scale,
              opacity: phaseConfig.opacity,
            }}
            transition={{
              duration: phaseConfig.duration,
              ease: breathingPhase === 'hold' ? 'linear' : [0.33, 1, 0.68, 1],
            }}
            className={`w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br ${phaseConfig.color} flex items-center justify-center relative`}
            style={{
              boxShadow: '0 0 80px rgba(139, 92, 246, 0.6)',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform, opacity'
            }}
          >
            {/* Inner circle */}
            <div 
              className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center"
              style={{ transform: 'translateZ(0)' }}
            >
              {/* Count display */}
              <motion.div
                key={breathingPhase}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                className="text-6xl md:text-7xl font-bold text-white"
                style={{ 
                  transform: 'translateZ(0)',
                  willChange: 'transform, opacity'
                }}
              >
                {remainingSeconds}
              </motion.div>
            </div>
            
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white/30"
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.6, 0.35]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'mirror'
              }}
              style={{ 
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
            />
          </motion.div>
        </div>

        {/* Breathing phase text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={breathingPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="text-center"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              {phaseConfig.text}
            </div>
            <p className="text-white/70 text-lg">
              {phaseConfig.instruction}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="glass-strong rounded-2xl p-6 max-w-md text-center"
        >
          <p className="text-white/80 text-sm">
            Technika 4-7-8: Vdechuj 4 sekundy, zadrž 7 sekund, vydechuj 8 sekund. 
            Toto cvičení pomáhá zklidnit mysl a snížit stres.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
});

const BreathingOverlay = memo(function BreathingOverlay({ isOpen, onClose }) {
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && <BreathingSession onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );
});

export default BreathingOverlay;
