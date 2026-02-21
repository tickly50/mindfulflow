import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { MOOD_LABELS } from '../../utils/moodCalculations';
import { variants as globalVariants, microInteractions } from '../../utils/animations';
import { Frown, CloudRain, Meh, Smile, Sparkles, Check } from 'lucide-react';

const MOOD_ICONS = {
  1: Frown,
  2: CloudRain,
  3: Meh,
  4: Smile,
  5: Sparkles,
};

const MOOD_EMOJI = {
  1: '😔',
  2: '😰',
  3: '😴',
  4: '😌',
  5: '✨',
};

const MOOD_GRADIENTS = {
  1: 'from-red-600/50 to-red-900/50',
  2: 'from-blue-900/40 to-slate-900/40',
  3: 'from-indigo-900/40 to-slate-900/40',
  4: 'from-violet-600/30 to-fuchsia-600/30',
  5: 'from-amber-400/30 to-orange-500/30',
};

const MOOD_BORDER_ACTIVE = {
  1: 'border-red-500/60',
  2: 'border-blue-400/60',
  3: 'border-indigo-400/60',
  4: 'border-violet-400/60',
  5: 'border-amber-400/60',
};

const MOOD_RING_COLORS = {
  1: 'ring-red-500/60',
  2: 'ring-blue-500/60',
  3: 'ring-indigo-500/60',
  4: 'ring-violet-500/60',
  5: 'ring-amber-500/60',
};

const MOOD_GLOW_COLORS = {
  1: 'rgba(239,68,68,0.25)',
  2: 'rgba(59,130,246,0.20)',
  3: 'rgba(99,102,241,0.20)',
  4: 'rgba(139,92,246,0.25)',
  5: 'rgba(245,158,11,0.25)',
};

const MOOD_INDICATOR_COLORS = {
  1: 'bg-red-500 shadow-red-500/40',
  2: 'bg-blue-500 shadow-blue-500/40',
  3: 'bg-indigo-500 shadow-indigo-500/40',
  4: 'bg-violet-500 shadow-violet-500/40',
  5: 'bg-amber-500 shadow-amber-500/40',
};

// Stagger container for mood cards
const cardContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

// Individual card entrance – rises from below with spring
const cardItem = {
  hidden: { opacity: 0, y: 24, scale: 0.93 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      mass: 0.5,
    },
  },
};

const MoodCards = memo(function MoodCards({ onMoodSelect, selectedMood }) {
  return (
    <motion.div
      variants={cardContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-5 gap-3 xs:gap-4 lg:gap-6 mb-12 max-w-6xl mx-auto [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1"
    >
      {[1, 2, 3, 4, 5].map((mood) => {
        const Icon = MOOD_ICONS[mood];
        const isSelected = selectedMood === mood;

        return (
          <motion.button
            key={mood}
            variants={cardItem}
            whileHover={microInteractions.card.hover}
            whileTap={microInteractions.card.tap}
            onClick={() => onMoodSelect(mood)}
            className={`group relative overflow-hidden rounded-2xl xs:rounded-[2rem] p-1 h-full min-h-[140px] xs:min-h-[180px]
              ${isSelected
                ? `ring-2 xs:ring-4 ring-offset-2 xs:ring-offset-4 ring-offset-[#0f172a] ${MOOD_RING_COLORS[mood]}`
                : 'ring-0'
              }
            `}
            style={{
              backfaceVisibility: 'hidden',
              boxShadow: isSelected
                ? `0 0 32px ${MOOD_GLOW_COLORS[mood]}, 0 8px 24px rgba(0,0,0,0.3)`
                : '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'box-shadow 0.3s cubic-bezier(0.25,0.1,0.25,1)',
            }}
          >
            {/* Card Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${MOOD_GRADIENTS[mood]} backdrop-blur-xl`}
              style={{
                opacity: isSelected ? 0.7 : 0.45,
                transition: 'opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}
            />

            <div
              className={`relative h-full w-full bg-[#1a1b26]/40 rounded-xl xs:rounded-[1.8rem] border
                ${isSelected ? MOOD_BORDER_ACTIVE[mood] : 'border-white/5 group-hover:border-white/15'}
                flex flex-col items-center justify-center gap-2 xs:gap-4 p-3 xs:p-6 overflow-hidden`}
              style={{
                transition: 'border-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}
            >
              {/* Hover background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${MOOD_GRADIENTS[mood]} opacity-0 group-hover:opacity-25`}
                style={{
                  transition: 'opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
                }}
              />

              {/* Emoji */}
              <motion.div
                className="text-4xl xs:text-6xl drop-shadow-2xl filter relative z-10"
                animate={isSelected ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
                style={{ willChange: 'transform' }}
              >
                {MOOD_EMOJI[mood]}
              </motion.div>

              {/* Label + Icon */}
              <div className="flex flex-col items-center gap-1 z-10 text-center w-full px-2">
                <div className="flex items-center justify-center gap-2 w-full">
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0 ${
                        isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                      }`}
                      style={{ transition: 'color 0.2s' }}
                    />
                  )}
                  <span
                    className={`text-base xs:text-lg font-bold tracking-wide whitespace-nowrap flex-shrink-0 ${
                      isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`}
                    style={{ transition: 'color 0.2s', WebkitFontSmoothing: 'antialiased' }}
                  >
                    {MOOD_LABELS[mood]}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50"
                  style={{ transition: 'color 0.2s' }}
                >
                  Level {mood}
                </span>
              </div>

              {/* Selection indicator – pops in */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${MOOD_INDICATOR_COLORS[mood]}`}
                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 45 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 20, mass: 0.4 }}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <motion.svg
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 0.3, delay: 0.05, ease: 'easeOut' },
                        opacity: { duration: 0.1 },
                      }}
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
});

export default MoodCards;
