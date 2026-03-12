import { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';

const TechCard = memo(function TechCard({ t, index, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(t)}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.11, duration: 0.44, ease: [0.33, 1, 0.68, 1] }}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${t.glow}1c 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${t.accent}24`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 inset-y-4 w-[3px] rounded-r-full"
        style={{ background: `linear-gradient(to bottom, ${t.accent}ee, ${t.glow}88)` }}
      />

      <span className="text-[30px] leading-none pl-2" aria-hidden="true">{t.emoji}</span>

      <div className="flex-1 min-w-0 pl-1">
        <div className="font-bold text-white text-[15px] leading-tight">{t.name} Dýchání</div>
        <div
          className="text-[13px] mt-0.5 font-medium"
          style={{ color: `${t.accent}cc` }}
        >
          {t.subtitle}
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {t.phases.map((p, i) => (
            <span
              key={i}
              className="text-[11px] text-white/38 tabular-nums font-medium"
            >
              {p.label}&nbsp;{p.seconds}s{i < t.phases.length - 1 ? ' ·' : ''}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${t.accent}14`, border: `1px solid ${t.accent}28` }}
        whileHover={{ scale: 1.1 }}
        aria-hidden="true"
      >
        <ChevronRight className="w-4 h-4" style={{ color: `${t.accent}cc` }} />
      </motion.div>
    </motion.button>
  );
});

export const PresetSelector = memo(function PresetSelector({ techniques, onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      style={{ background: '#070711' }}
      role="dialog"
      aria-label="Výběr dýchacího cvičení"
    >
      {/* Ambient blobs — one per technique */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {techniques.map((t, i) => (
          <motion.div
            key={t.id}
            className="absolute rounded-full"
            style={{
              width: 360,
              height: 360,
              background: `radial-gradient(circle, ${t.glow}18 0%, transparent 70%)`,
              top:  `${[6, 52, 88][i]}%`,
              left: `${[78, 4,  68][i]}%`,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.65, 1, 0.65] }}
            transition={{
              duration: 8 + i * 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.8,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between px-6 pt-14 pb-8">
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05, duration: 0.38 }}
        >
          <p className="text-[10px] font-bold text-white/30 tracking-[0.25em] uppercase mb-1">
            MindfulFlow
          </p>
          <h1 className="text-[28px] font-extrabold text-white tracking-tight leading-none">
            Dýchání
          </h1>
          <p className="text-sm text-white/42 mt-1.5">Vyber techniku pro tuto chvíli</p>
        </motion.div>

        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="p-2.5 rounded-xl mt-1"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          aria-label="Zavřít"
        >
          <X className="w-5 h-5 text-white/50" />
        </motion.button>
      </div>

      {/* Technique cards */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-3">
        {techniques.map((t, i) => (
          <TechCard key={t.id} t={t} index={i} onSelect={onSelect} />
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.58 }}
          className="text-center text-white/18 text-[11px] mt-4 px-6 leading-relaxed"
        >
          Pravidelné vědomé dýchání snižuje kortizol, zklidňuje mysl a zlepšuje soustředění.
        </motion.p>
      </div>
    </motion.div>
  );
});
