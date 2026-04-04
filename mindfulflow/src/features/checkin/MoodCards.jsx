import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { memo } from 'react';
import { MOOD_LABELS } from '../../utils/moodConstants';
import { reducedMotionVariants } from '../../utils/animations';

import { haptics } from '../../utils/haptics';
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
  1: 'from-violet-950/55 to-zinc-950/80',
  2: 'from-violet-900/45 to-violet-950/60',
  3: 'from-violet-800/40 to-violet-950/55',
  4: 'from-violet-700/38 to-violet-900/50',
  5: 'from-violet-600/35 to-violet-800/45',
};

const MOOD_BORDER_ACTIVE = {
  1: 'border-violet-500/55',
  2: 'border-violet-400/55',
  3: 'border-violet-400/50',
  4: 'border-violet-300/55',
  5: 'border-violet-300/60',
};

const MOOD_RING_COLORS = {
  1: 'ring-violet-600/55',
  2: 'ring-violet-500/55',
  3: 'ring-violet-500/50',
  4: 'ring-violet-400/55',
  5: 'ring-violet-300/55',
};

const MOOD_GLOW_COLORS = {
  1: 'rgba(91,33,182,0.28)',
  2: 'rgba(109,40,217,0.26)',
  3: 'rgba(124,58,237,0.24)',
  4: 'rgba(139,92,246,0.26)',
  5: 'rgba(167,139,250,0.28)',
};

const MOOD_INDICATOR_COLORS = {
  1: 'bg-violet-800 shadow-violet-900/45',
  2: 'bg-violet-700 shadow-violet-800/40',
  3: 'bg-violet-600 shadow-violet-700/40',
  4: 'bg-violet-500 shadow-violet-600/40',
  5: 'bg-violet-400 shadow-violet-500/45',
};

const easeStudio = [0.16, 1, 0.3, 1];

// Stagger container for mood cards
const cardContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.14,
    },
  },
};

// Individual card — cinematic rise
const cardItem = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.58, ease: easeStudio },
  },
};

const MoodCards = memo(function MoodCards({ onMoodSelect, selectedMood }) {
  const prefersReduced = useReducedMotion();
  const containerVariant = prefersReduced ? reducedMotionVariants.container : cardContainer;
  const itemVariant = prefersReduced ? reducedMotionVariants.item : cardItem;

  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-5 gap-[clamp(0.5rem,2vw,1.25rem)] mb-6 md:mb-10 lg:mb-12 w-full max-w-[90rem] mx-auto"
    >
      {[1, 2, 3, 4, 5].map((mood) => {
        const Icon = MOOD_ICONS[mood];
        const isSelected = selectedMood === mood;

        return (
          <motion.button
            key={mood}
            variants={itemVariant}
            whileHover={
              prefersReduced
                ? undefined
                : { scale: 1.03, y: -6, transition: { type: 'spring', stiffness: 360, damping: 22 } }
            }
            whileTap={prefersReduced ? undefined : { scale: 0.96 }}
            onClick={() => {
              haptics.medium();
              onMoodSelect(mood);
            }}
            aria-label={`Vybrat náladu: ${MOOD_LABELS[mood]}`}
            className={`group relative rounded-2xl xs:rounded-[2rem] p-1 h-full min-h-[clamp(7.5rem,28vw,12.5rem)] lg:min-h-[200px] font-display
              ${mood === 5 ? 'col-span-2 lg:col-span-1' : ''}
              ${isSelected
                ? `ring-2 xs:ring-4 ring-offset-2 xs:ring-offset-4 ring-offset-[#0a0f14] ${MOOD_RING_COLORS[mood]}`
                : 'ring-0'
              }
            `}
            style={{
              backfaceVisibility: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 1px rgba(255,255,255,0.06)',
              transform: 'translateZ(0)',
            }}
          >
            {/* Active Glow Layer (GPU accelerated opacity instead of box-shadow transition) */}
            <div
              className="absolute inset-0 rounded-2xl xs:rounded-[2rem] pointer-events-none"
              style={{
                boxShadow: `0 0 32px ${MOOD_GLOW_COLORS[mood]}, 0 8px 24px rgba(0,0,0,0.3)`,
                opacity: isSelected ? 1 : 0,
                transition: 'opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'opacity'
              }}
            />

            {/* Card Background (Frosted Glass Base) */}
            <div
              className={`absolute inset-0 rounded-2xl xs:rounded-[2rem] bg-gradient-to-br ${MOOD_GRADIENTS[mood]}`}
              style={{
                opacity: isSelected ? 0.8 : 0.3,
                transition: 'opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'opacity'
              }}
            />

            {/* Inner Content Container */}
            <div
              className={`relative h-full w-full bg-white/5 rounded-xl xs:rounded-[1.8rem] border
                ${isSelected ? MOOD_BORDER_ACTIVE[mood] : 'border-white/10 group-hover:border-white/20'}
                flex flex-col items-center justify-center gap-2 xs:gap-4 p-3 xs:p-6 overflow-hidden`}
              style={{
                transition: 'border-color 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Hover background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${MOOD_GRADIENTS[mood]} opacity-0 group-hover:opacity-25`}
                style={{
                  transition: 'opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'opacity'
                }}
              />

              {/* Emoji with 3D Pop */}
              <motion.div
                className="text-4xl xs:text-6xl relative z-10"
                animate={
                  prefersReduced
                    ? { opacity: isSelected ? 1 : 0.85 }
                    : isSelected
                      ? { scale: 1.25, y: -4, rotate: [-2, 2, 0] }
                      : { scale: 1, y: 0, rotate: 0 }
                }
                transition={{ type: 'spring', stiffness: 300, damping: 18, mass: 0.5 }}
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
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-white/60"
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
