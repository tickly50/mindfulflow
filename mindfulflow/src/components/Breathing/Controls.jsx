import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';

export const Controls = memo(function Controls({
  isRunning,
  isPreparing,
  soundEnabled,
  cycles,
  totalPhases,
  phaseIdx,
  accent,
  onTogglePlay,
  onToggleSound,
  prefersReduced,
}) {
  const isActive   = isRunning || isPreparing;
  const cycleLabel = cycles === 1 ? 'cyklus' : cycles < 5 ? 'cykly' : 'cyklů';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Phase-progress dots */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28 }}
            className="flex items-center gap-2"
          >
            {Array.from({ length: totalPhases }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 6,
                  borderRadius: 9999,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.18)',
                  flexShrink: 0,
                }}
              >
                <motion.div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: accent,
                    transformOrigin: 'left center',
                  }}
                  animate={{
                    scaleX:  i === phaseIdx ? 1 : 8 / 28,
                    opacity: i === phaseIdx ? 1 : 0,
                  }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls row */}
      <div className="flex items-center gap-7">

        {/* Sound toggle */}
        <motion.button
          onClick={onToggleSound}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border:     '1px solid rgba(255,255,255,0.10)',
          }}
          aria-label={soundEnabled ? 'Vypnout zvuk' : 'Zapnout zvuk'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={soundEnabled ? 'vol-on' : 'vol-off'}
              initial={{ scale: 0.55, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{    scale: 0.55, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {soundEnabled
                ? <Volume2 className="w-5 h-5 text-white/55" />
                : <VolumeX className="w-5 h-5 text-white/25" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Main play / stop button */}
        <motion.button
          onClick={onTogglePlay}
          whileTap={{ scale: 0.93 }}
          className="rounded-full flex items-center justify-center relative"
          style={{
            width:  78,
            height: 78,
            background: `radial-gradient(circle at 40% 35%, ${accent}f2, ${accent}88)`,
            boxShadow:  `0 0 40px ${accent}52, 0 0 75px ${accent}20, inset 0 1px 15px rgba(255,255,255,0.22)`,
          }}
          aria-label={isActive ? 'Zastavit' : 'Spustit'}
        >
          {/* Animated pulse ring when active */}
          {isActive && !prefersReduced && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `1.5px solid ${accent}60` }}
              animate={{ scale: [1, 1.28, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={isActive ? 'stop-icon' : 'play-icon'}
              initial={{ scale: 0.5, opacity: 0, rotate: -18 }}
              animate={{ scale: 1,   opacity: 1, rotate: 0   }}
              exit={{    scale: 0.5, opacity: 0, rotate:  18 }}
              transition={{ duration: 0.2 }}
            >
              {isActive
                ? <Square className="w-7 h-7 text-white fill-white" />
                : <Play   className="w-7 h-7 text-white fill-white ml-1" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Cycle counter */}
        <div className="w-12 h-12 flex items-center justify-center">
          <AnimatePresence>
            {cycles > 0 && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{    scale: 0.7, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <span
                  className="text-[22px] font-black tabular-nums leading-none"
                  style={{ color: accent }}
                >
                  {cycles}
                </span>
                <span className="text-[8px] text-white/35 font-semibold leading-none mt-0.5 tracking-wider uppercase">
                  {cycleLabel}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
});
