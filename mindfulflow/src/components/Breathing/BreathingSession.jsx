import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import { BreathingCircle } from './BreathingCircle';
import { Controls } from './Controls';
import { useBreathingAudio } from './useBreathingAudio';
import { haptics } from '../../utils/haptics';

/* ─── Phase-reactive background ──────────────────────────────── */
const BLOBS = [
  { top: '10%', left: '18%' },
  { top: '58%', left: '65%' },
  { top: '35%', left: '48%' },
];

const SessionBg = memo(function SessionBg({ bg, accent, glow, phaseName, isRunning }) {
  const glowOpacity =
    !isRunning           ? 0.28
    : phaseName === 'inhale'           ? 1.0
    : phaseName?.startsWith('hold')    ? 0.62
    : /* exhale / hold2 */               0.32;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${bg[0]} 0%, ${bg[1]} 100%)` }}
      />

      {/* Phase-reactive glow — animates opacity */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: glowOpacity }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 55%, ${glow}48 0%, ${glow}10 50%, transparent 72%)`,
        }}
      />

      {/* Slow-drifting ambient blobs */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  320 + i * 80,
            height: 320 + i * 80,
            background: `radial-gradient(circle, ${accent}${['15', '0d', '08'][i]} 0%, transparent 70%)`,
            top:  b.top,
            left: b.left,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            scale: [1, 1.12 + i * 0.04, 1],
            x: [0, (i % 2 === 0 ?  22 : -22), 0],
            y: [0, (i % 2 === 0 ?  16 : -16), 0],
          }}
          transition={{
            duration: 9 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.8,
          }}
        />
      ))}

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
});

/* ─── Floating particles ──────────────────────────────────────── */
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id:    i,
  x:     8  + Math.random() * 84,
  y:     8  + Math.random() * 84,
  size:  2  + Math.random() * 3.5,
  dur:   8  + Math.random() * 12,
  delay: Math.random() * 7,
  dx:    (Math.random() - 0.5) * 22,
  dy:    -(18 + Math.random() * 28),
}));

const Particles = memo(function Particles({ accent }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left:       `${p.x}%`,
            top:        `${p.y}%`,
            width:      p.size,
            height:     p.size,
            background: accent,
          }}
          animate={{
            x:       [0, p.dx, 0],
            y:       [0, p.dy, 0],
            opacity: [0, 0.45, 0],
            scale:   [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: p.dur,
            delay:    p.delay,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

/* ─── Session screen ──────────────────────────────────────────── */
export const BreathingSession = memo(function BreathingSession({ technique, onClose, onBack }) {
  const { phases, accent, bg, glow, fact, name } = technique;

  const [isRunning,   setIsRunning]   = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepCount,   setPrepCount]   = useState(3);
  const [phaseIdx,    setPhaseIdx]    = useState(0);
  const [remaining,   setRemaining]   = useState(phases[0].seconds);
  const [cycles,      setCycles]      = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const startRef = useRef(0);
  const { playTone, setEnabled } = useBreathingAudio();

  // Keep audio hook in sync with UI toggle
  useEffect(() => { setEnabled(soundEnabled); }, [soundEnabled, setEnabled]);

  // Screen wake lock while running
  useEffect(() => {
    if (!isRunning) return;
    let lock = null;
    const req = async () => {
      try {
        if ('wakeLock' in navigator) lock = await navigator.wakeLock.request('screen');
      } catch (_) {}
    };
    req();
    return () => { if (lock) lock.release().catch(() => {}); };
  }, [isRunning]);

  // Keyboard escape
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  // 3-2-1 prep countdown
  useEffect(() => {
    if (!isPreparing) return;
    setPrepCount(3);
    startRef.current = Date.now();

    const id = setInterval(() => {
      const left = Math.ceil(3 - (Date.now() - startRef.current) / 1000);
      if (left <= 0) {
        clearInterval(id);
        setIsPreparing(false);
        setPhaseIdx(0);
        setRemaining(phases[0].seconds);
        playTone(phases[0].name);
        haptics.breathingIn();
      } else {
        setPrepCount(left);
      }
    }, 80);

    return () => clearInterval(id);
  }, [isPreparing, phases, playTone]);

  // Main breathing timer
  useEffect(() => {
    if (!isRunning || isPreparing) return;
    const phase = phases[phaseIdx];
    startRef.current = Date.now();
    setRemaining(phase.seconds);

    const id = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const left    = Math.ceil(phase.seconds - elapsed);

      if (left <= 0) {
        setPhaseIdx((prev) => {
          const next      = (prev + 1) % phases.length;
          const nextPhase = phases[next];

          playTone(nextPhase.name);
          if (nextPhase.name.startsWith('inhale')) haptics.breathingIn();
          else if (nextPhase.name.startsWith('exhale')) haptics.breathingOut();
          else haptics.light();

          if (next === 0) setCycles((c) => c + 1);
          return next;
        });
      } else {
        setRemaining(left);
      }
    }, 80);

    return () => clearInterval(id);
  }, [isRunning, isPreparing, phaseIdx, phases, playTone]);

  const handleTogglePlay = useCallback(() => {
    if (isRunning || isPreparing) {
      // Stop & reset
      setIsRunning(false);
      setIsPreparing(false);
      setPhaseIdx(0);
      setRemaining(phases[0].seconds);
      setCycles(0);
    } else {
      // Start prep countdown
      setIsRunning(true);
      setIsPreparing(true);
    }
  }, [isRunning, isPreparing, phases]);

  const phase           = phases[phaseIdx];
  const currentPhase    = isRunning && !isPreparing ? phase.name : null;

  const hint =
    !isRunning   ? 'Najdi pohodlnou polohu a stiskni start'
    : isPreparing ? 'Zaujmi pohodlnou pozici'
    : phase.hint;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{    opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      role="dialog"
      aria-label="Dechové cvičení"
    >
      <SessionBg
        bg={bg}
        accent={accent}
        glow={glow}
        phaseName={currentPhase}
        isRunning={isRunning}
      />
      <Particles accent={accent} />

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-2">
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}
          aria-label="Zpět na výběr"
        >
          <ChevronLeft className="w-4 h-4" />
          Změnit
        </motion.button>

        <p className="text-sm font-semibold text-white/42 select-none">{name} Dýchání</p>

        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.92 }}
          className="p-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          aria-label="Zavřít cvičení"
        >
          <X className="w-5 h-5 text-white/50" />
        </motion.button>
      </div>

      {/* ── Centre ── */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center gap-7 px-5"
        aria-live="polite"
      >
        <BreathingCircle
          phaseName={isRunning && !isPreparing ? phase.name     : null}
          phaseDuration={phase.seconds}
          phaseLabel={isRunning && !isPreparing ? phase.label   : null}
          accent={accent}
          glow={glow}
          isRunning={isRunning}
          isPreparing={isPreparing}
          prepCount={prepCount}
          remaining={remaining}
          phaseIdx={phaseIdx}
        />

        {/* Hint text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={hint}
            initial={{ y: 9, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{    y: -9, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="text-[15px] font-medium text-white/44 text-center max-w-[280px] leading-snug"
          >
            {hint}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Bottom ── */}
      <div className="relative z-10 px-5 pb-10 flex flex-col items-center gap-5">
        <Controls
          isRunning={isRunning && !isPreparing}
          isPreparing={isPreparing}
          soundEnabled={soundEnabled}
          cycles={cycles}
          totalPhases={phases.length}
          phaseIdx={phaseIdx}
          accent={accent}
          onTogglePlay={handleTogglePlay}
          onToggleSound={() => setSoundEnabled((s) => !s)}
        />

        {/* Fact card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          className="w-full max-w-[320px] rounded-2xl px-5 py-3.5 text-center"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p className="text-white/40 text-[12.5px] leading-relaxed">{fact}</p>
        </motion.div>
      </div>
    </motion.div>
  );
});
