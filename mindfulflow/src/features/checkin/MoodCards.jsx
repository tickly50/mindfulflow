import { motion, useReducedMotion } from 'framer-motion';
import { memo } from 'react';
import { MOOD_LABELS } from '../../utils/moodConstants';
import { reducedMotionVariants } from '../../utils/animations';

import { haptics } from '../../utils/haptics';
import { Check } from 'lucide-react';

const MOOD_EMOJI = {
  1: '😔',
  2: '😰',
  3: '😴',
  4: '😌',
  5: '✨',
};

const easeStudio = [0.16, 1, 0.3, 1];

const cardContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: easeStudio },
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
      className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8 md:mb-10 w-full mx-auto"
    >
      {[1, 2, 3, 4, 5].map((mood) => {
        const isSelected = selectedMood === mood;

        return (
          <motion.button
            key={mood}
            type="button"
            variants={itemVariant}
            whileHover={prefersReduced ? undefined : { scale: 1.02 }}
            whileTap={prefersReduced ? undefined : { scale: 0.98 }}
            onClick={() => {
              haptics.medium();
              onMoodSelect(mood);
            }}
            aria-label={`Vybrat náladu: ${MOOD_LABELS[mood]}`}
            aria-pressed={isSelected}
            className={`
              relative rounded-xl border p-4 min-h-[118px] sm:min-h-[128px]
              flex flex-col items-center justify-center gap-2 text-center
              transition-colors duration-200
              ${
                isSelected
                  ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                  : 'border-theme-border bg-theme-card hover:border-theme-muted'
              }
            `}
          >
            {isSelected && (
              <span className="absolute top-2 right-2 text-[var(--accent)]" aria-hidden>
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </span>
            )}

            <span className="text-3xl sm:text-4xl leading-none select-none">{MOOD_EMOJI[mood]}</span>

            <span
              className={`text-sm font-medium leading-tight ${
                isSelected ? 'text-theme-text' : 'text-theme-muted'
              }`}
            >
              {MOOD_LABELS[mood]}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
});

export default MoodCards;
