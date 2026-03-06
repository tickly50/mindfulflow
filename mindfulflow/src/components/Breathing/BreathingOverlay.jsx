import { useEffect, useState, memo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
// Settings context and soundscape hooks removed.
import { haptics } from '../../utils/haptics';

/* ─────────────────────────────────────────────
   Techniques
────────────────────────────────────────────── */
const TECHNIQUES = [
  {
    id: '478',
    name: '4-7-8',
    subtitle: 'Zklidnění & spánek',
    emoji: '🌙',
    accent: '#a78bfa',
    bg: ['#0d0a1e', '#1a0e3d'],
    glow: '#7c3aed',
    phases: [
      { name: 'inhale', label: 'Nádech',  hint: 'Pomalu vdechuj nosem',        seconds: 4 },
      { name: 'hold',   label: 'Zadrž',   hint: 'Zadrž dech, uvolni tělo',     seconds: 7 },
      { name: 'exhale', label: 'Výdech',  hint: 'Pomalu vydechuj ústy',         seconds: 8 },
    ],
    fact: 'Aktivuje parasympatický nervový systém a rychle snižuje úzkost.',
  },
  {
    id: 'box',
    name: 'Box',
    subtitle: 'Soustředění & klid',
    emoji: '🧘',
    accent: '#67e8f9',
    bg: ['#040f1a', '#062035'],
    glow: '#0891b2',
    phases: [
      { name: 'inhale', label: 'Nádech',  hint: 'Vdechuj pomalu nosem',         seconds: 4 },
      { name: 'hold1',  label: 'Zadrž',   hint: 'Drž dech rovnoměrně',          seconds: 4 },
      { name: 'exhale', label: 'Výdech',  hint: 'Vydechuj pomalu ústy',          seconds: 4 },
      { name: 'hold2',  label: 'Pauza',   hint: 'Odpočiň si před nádechem',     seconds: 4 },
    ],
    fact: 'Technika elitních vojáků a sportovců pro maximální koncentraci.',
  },
  {
    id: 'relax',
    name: '5-5',
    subtitle: 'Rychlé uklidnění',
    emoji: '💨',
    accent: '#6ee7b7',
    bg: ['#031a10', '#06311e'],
    glow: '#059669',
    phases: [
      { name: 'inhale', label: 'Nádech',  hint: 'Hluboký nádech nosem',         seconds: 5 },
      { name: 'exhale', label: 'Výdech',  hint: 'Pomalý výdech ústy',            seconds: 5 },
    ],
    fact: 'Synchronizuje srdeční tep a uklidňuje nervový systém za minutu.',
  },
];

/* ─────────────────────────────────────────────
   Silk background waves
────────────────────────────────────────────── */
const SilkBg = memo(function SilkBg({ bg, accent }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${bg[0]} 0%, ${bg[1]} 100%)` }}
      />
      {/* Floating blobs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 300 + i * 80,
            height: 300 + i * 80,
            background: `radial-gradient(circle, ${accent}${['18', '10', '08'][i]} 0%, transparent 70%)`,
            top: `${[10, 55, 30][i]}%`,
            left: `${[15, 60, 45][i]}%`,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            scale: [1, 1.15 + i * 0.05, 1],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            y: [0, (i % 2 === 0 ? 15 : -15), 0],
          }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
        />
      ))}
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }} />
    </div>
  );
});

/* ─────────────────────────────────────────────
   Floating particles
────────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 10 + Math.random() * 80,
  y: 10 + Math.random() * 80,
  size: 2.5 + Math.random() * 4,
  dur: 7 + Math.random() * 10,
  delay: Math.random() * 6,
  dx: (Math.random() - 0.5) * 20,
  dy: -(15 + Math.random() * 25),
}));

const Particles = memo(function Particles({ accent }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: accent }}
          animate={{ x: [0, p.dx, 0], y: [0, p.dy, 0], opacity: [0, 0.5, 0], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
});

/* ─────────────────────────────────────────────
   Technique card
────────────────────────────────────────────── */
const TechCard = memo(function TechCard({ t, index, onSelect }) {
  const timing = t.phases.map(p => `${p.seconds}s`).join(' · ');
  return (
    <motion.button
      onClick={() => onSelect(t)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden transition-colors hover:bg-white/5"
      style={{
        background: `linear-gradient(135deg, ${t.glow}22 0%, transparent 100%)`,
        border: `1px solid ${t.accent}25`,
      }}
      aria-label={`${t.name} Dýchání`}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full" style={{ background: t.accent }} />

      <span className="text-3xl leading-none" aria-hidden="true">{t.emoji}</span>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-base leading-tight">{t.name} Dýchání</div>
        <div className="text-sm mt-0.5" style={{ color: `${t.accent}cc` }}>{t.subtitle}</div>
        <div className="text-xs mt-1.5 text-white/60">{timing}</div>
      </div>

      <motion.div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${t.accent}18`, border: `1px solid ${t.accent}30` }}
        whileHover={{ scale: 1.1 }}
        aria-hidden="true"
      >
        <ChevronLeft className="w-4 h-4 rotate-180" style={{ color: t.accent }} />
      </motion.div>
    </motion.button>
  );
});

/* ─────────────────────────────────────────────
   Selector screen
────────────────────────────────────────────── */
const TechniqueSelector = memo(function TechniqueSelector({ onSelect, onClose }) {
  const allTechniques = TECHNIQUES;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      style={{ background: '#080812' }}
      role="dialog"
      aria-label="Výběr dýchacího cvičení"
    >
      {/* Header */}
      <div className="relative flex items-center justify-center px-6 pt-12 pb-6">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="text-center"
        >
          <div className="text-3xl mb-2" aria-hidden="true">🌬️</div>
          <h1 className="text-xl font-bold text-white tracking-tight">Dýchací cvičení</h1>
          <p className="text-sm text-white/60 mt-1">Vyber techniku pro tuto chvíli</p>
        </motion.div>

        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute right-5 top-10 p-2.5 rounded-xl transition-colors hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          aria-label="Zavřít"
        >
          <X className="w-5 h-5 text-white/60" />
        </motion.button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-3">
        {allTechniques.map((t, i) => (
          <TechCard key={t.id} t={t} index={i} onSelect={onSelect} />
        ))}

        {/* Bottom tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/20 text-xs mt-2 px-4"
        >
          Pravidelné dýchání snižuje kortizol a zlepšuje koncentraci
        </motion.p>
      </div>
    </motion.div>
  );
});

/* ─────────────────────────────────────────────
   Session screen
────────────────────────────────────────────── */
const BreathingSession = memo(function BreathingSession({ technique, onClose, onBack }) {
  const { phases, accent, bg, glow, fact } = technique;
  
  const [isPreparing, setIsPreparing] = useState(true);
  const [prepCount, setPrepCount]     = useState(3);
  const [phaseIdx, setPhaseIdx]       = useState(0);
  const [remaining, setRemaining]     = useState(0);
  const [cycles, setCycles]           = useState(0);

  const phase = phases[phaseIdx];
  const startRef = useRef(0);

  // Screen lock & Keyboard
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.warn('Wake Lock error:', err);
      }
    };
    requestWakeLock();

    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', esc);
    
    return () => { 
      document.body.style.overflow = ''; 
      window.removeEventListener('keydown', esc); 
      if (wakeLock !== null) wakeLock.release().catch(() => {});
    };
  }, [onClose]);

  // Preparation ticks
  useEffect(() => {
    if (!isPreparing) return;
    
    startRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const left = Math.ceil(3 - elapsed);
      
      if (left <= 0) {
        setIsPreparing(false);
        haptics.breathingIn();
      } else {
        setPrepCount(left);
      }
    }, 1000); 
    return () => clearInterval(interval);
  }, [isPreparing]);

  // Main cycle ticks
  useEffect(() => {
    if (isPreparing) return;
    
    startRef.current = Date.now();
    setRemaining(phase.seconds);

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const left = Math.ceil(phase.seconds - elapsed);
      
      if (left <= 0) {
        setPhaseIdx(prev => {
          const next = (prev + 1) % phases.length;
          const nextPhase = phases[next];
          
          if (nextPhase.name.startsWith('inhale')) {
            haptics.breathingIn();
          } else if (nextPhase.name.startsWith('exhale')) {
            haptics.breathingOut();
          } else {
            haptics.light();
          }
          
          if (next === 0) setCycles(c => c + 1);
          return next;
        });
      } else {
        setRemaining(left);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPreparing, phaseIdx, phase.seconds, phases.length]);

  // Visuals
  const R = 120, CX = 130, CY = 130;
  const CIRC = 2 * Math.PI * R;

  const displayLabel = isPreparing ? 'Připrav se' : phase.label;
  const displayHint  = isPreparing ? 'Zaujměte pohodlnou pozici' : phase.hint;
  const displayNum   = isPreparing ? prepCount : remaining;
  const displayTargetScale = isPreparing ? 0.9 : phase.name.startsWith('inhale') ? 1.45 : phase.name.startsWith('hold') ? 1.45 : 0.65;
  const easingConfig = isPreparing ? 'easeInOut' : phase.name.startsWith('hold') ? 'linear' : [0.25, 1, 0.5, 1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      role="dialog"
      aria-label="Dechové cvičení aktivní"
    >
      <SilkBg bg={bg} accent={accent} />
      <Particles accent={accent} />

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-11 pb-2">
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-1 text-sm px-3 py-2 rounded-xl transition-colors hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}
          aria-label="Zpět na výběr"
        >
          <ChevronLeft className="w-4 h-4" />
          Změnit
        </motion.button>



        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.92 }}
          className="p-2.5 rounded-xl transition-colors hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          aria-label="Zavřít cvičení"
        >
          <X className="w-5 h-5 text-white/60" />
        </motion.button>
      </div>

      {/* ── Centre ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-5" aria-live="polite">
        <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
          {/* SVG ring */}
          <svg
            width="260" height="260"
            viewBox="0 0 260 260"
            className="absolute inset-0 pointer-events-none drop-shadow-xl"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
            <motion.circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={isPreparing ? 'rgba(255,255,255,0.3)' : accent}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: isPreparing ? 3 : phase.seconds, ease: 'linear' }}
              key={isPreparing ? 'prep' : `run-${phaseIdx}`}
            />
          </svg>

          {/* Halo inner-glow (No Blur CSS for maximum performance) */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '85%', height: '85%',
              background: `radial-gradient(circle, ${glow}40 0%, transparent 60%)`,
            }}
            animate={{ scale: displayTargetScale }}
            transition={{ duration: isPreparing ? 1 : phase.seconds, ease: easingConfig }}
          />

          {/* Core 3D orb (No backdrop-blur, raw gradients) */}
          <motion.div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 170, height: 170,
              background: `radial-gradient(circle at 35% 35%, ${accent}f2, ${glow}99)`,
              boxShadow: `0 0 80px ${glow}60, inset 0 2px 35px ${accent}d0, inset 0 -10px 40px rgba(0,0,0,0.4)`,
              willChange: 'transform',
            }}
            animate={{ scale: displayTargetScale }}
            transition={{ duration: isPreparing ? 1 : phase.seconds, ease: easingConfig }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={displayNum}
                initial={{ scale: 0.6, opacity: 0, y: 5 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.3, opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="text-7xl font-bold text-white tabular-nums select-none tracking-tighter"
                style={{ textShadow: `0 6px 30px ${glow}99, 0 0 60px ${accent}` }}
              >
                {displayNum}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {!isPreparing && (
            <motion.div
              key={`ripple-${phaseIdx}`}
              className="absolute rounded-full"
              style={{ width: '60%', height: '60%', border: `1.5px solid ${accent}` }}
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          )}
        </div>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={displayLabel}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-1.5 text-center px-4"
          >
            <h2
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: isPreparing ? '#fff' : accent, textShadow: isPreparing ? '0 0 10px rgba(255,255,255,0.2)' : `0 0 32px ${glow}cc` }}
            >
              {displayLabel}
            </h2>
            <p className="text-[15px] font-medium" style={{ color: isPreparing ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.5)' }}>
              {displayHint}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom ── */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-5 pb-10">
        <div className="flex items-center gap-2 h-4">
          {!isPreparing && phases.map((p, i) => (
            <motion.div
              key={i}
              animate={{ width: i === phaseIdx ? 24 : 7, background: i === phaseIdx ? accent : 'rgba(255,255,255,0.18)' }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>

        <div className="h-8 flex items-center justify-center">
          <AnimatePresence>
            {cycles > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
              >
                ✦ {cycles} {cycles === 1 ? 'cyklus' : cycles < 5 ? 'cykly' : 'cyklů'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full max-w-xs rounded-2xl px-5 py-4 text-center mt-2"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-white/60 text-[13px] leading-relaxed font-medium">{fact}</p>
        </motion.div>
      </div>
    </motion.div>
  );
});

/* ─────────────────────────────────────────────
   Root export
────────────────────────────────────────────── */
const BreathingOverlay = memo(function BreathingOverlay({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null);

  const handleClose = useCallback(() => { setSelected(null); onClose(); }, [onClose]);
  const handleBack  = useCallback(() => setSelected(null), []);

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && !selected && (
        <TechniqueSelector key="sel" onSelect={setSelected} onClose={handleClose} />
      )}
      {isOpen && selected && (
        <BreathingSession key={selected.id} technique={selected} onClose={handleClose} onBack={handleBack} />
      )}
    </AnimatePresence>,
    document.body
  );
});

export default BreathingOverlay;
