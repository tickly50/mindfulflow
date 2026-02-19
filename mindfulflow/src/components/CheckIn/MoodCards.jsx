import { motion } from 'framer-motion';
import { memo } from 'react';
import { MOOD_LABELS } from '../../utils/moodCalculations';
import { variants as globalVariants, microInteractions } from '../../utils/animations';
import { Frown, CloudRain, Meh, Smile, Sparkles } from 'lucide-react';

/**
 * Map mood levels to icons
 */
const MOOD_ICONS = {
  1: Frown,
  2: CloudRain,
  3: Meh,
  4: Smile,
  5: Sparkles,
};

/**
 * Map mood levels to emoji
 */
const MOOD_EMOJI = {
  1: '😔',
  2: '😰',
  3: '😴',
  4: '😌',
  5: '✨',
};

// Static config objects hoisted OUTSIDE the component —
// these NEVER change, so they must not be recreated on every render.
const MOOD_GRADIENTS = {
  1: 'from-red-600/50 to-red-900/50',
  2: 'from-blue-900/40 to-slate-900/40',
  3: 'from-indigo-900/40 to-slate-900/40',
  4: 'from-violet-600/30 to-fuchsia-600/30',
  5: 'from-amber-400/30 to-orange-500/30'
};

const MOOD_BORDER_COLORS = {
  1: 'group-hover:border-red-500/50',
  2: 'group-hover:border-blue-400/50',
  3: 'group-hover:border-indigo-400/50',
  4: 'group-hover:border-violet-400/50',
  5: 'group-hover:border-amber-400/50'
};

const MOOD_RING_COLORS = {
  1: 'ring-red-500/50',
  2: 'ring-blue-500/50',
  3: 'ring-indigo-500/50',
  4: 'ring-violet-500/50',
  5: 'ring-amber-500/50'
};

const MOOD_INDICATOR_COLORS = {
  1: 'bg-red-500 shadow-red-500/40',
  2: 'bg-blue-500 shadow-blue-500/40',
  3: 'bg-indigo-500 shadow-indigo-500/40',
  4: 'bg-violet-500 shadow-violet-500/40',
  5: 'bg-amber-500 shadow-amber-500/40'
};

/**
 * Interactive mood selection cards - Ultra-smooth Performance Edition
 */
const MoodCards = memo(function MoodCards({ onMoodSelect, selectedMood }) {
  
  // Using global variants for consistency
  const container = globalVariants.staggerContainerFast;
  const item = globalVariants.item;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-12 max-w-6xl mx-auto"
      style={{ transform: 'translateZ(0)' }}
    >
      {[1, 2, 3, 4, 5].map((mood) => {
        const Icon = MOOD_ICONS[mood];
        const isSelected = selectedMood === mood;

        return (
          <motion.button
            key={mood}
            variants={item}
            whileHover={microInteractions.card.hover}
            whileTap={microInteractions.card.tap}
            onClick={() => onMoodSelect(mood)}
            className={`group relative overflow-hidden rounded-[2rem] p-1 h-full min-h-[160px] xs:min-h-[180px]
                ${isSelected ? `ring-4 ring-offset-4 ring-offset-[#0f172a] ${MOOD_RING_COLORS[mood]}` : 'ring-0'}
            `}
            style={{ 
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: isSelected ? 'auto' : 'transform'
            }}
          >
            {/* Card Background with Glass effect */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${MOOD_GRADIENTS[mood]} backdrop-blur-xl opacity-40 group-hover:opacity-60`}
              style={{ 
                transition: 'opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                transform: 'translateZ(0)'
              }}
            />
            
            <div 
              className={`relative h-full w-full bg-[#1a1b26]/40 rounded-[1.8rem] border border-white/5 ${MOOD_BORDER_COLORS[mood]} flex flex-col items-center justify-center gap-4 p-4 xs:p-6 overflow-hidden`}
              style={{ 
                transition: 'border-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                transform: 'translateZ(0)'
              }}
            >
                
                {/* Background Glow */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t ${MOOD_GRADIENTS[mood]} opacity-0 group-hover:opacity-20`}
                  style={{ 
                    transition: 'opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    transform: 'translateZ(0)'
                  }}
                />

                {/* Emoji with 3D feel */}
                <motion.div 
                  className="text-5xl xs:text-6xl drop-shadow-2xl filter"
                  animate={isSelected ? { scale: 1.18 } : { scale: 1 }}
                  transition={{ 
                    type: 'tween',
                    duration: 0.18,
                    ease: [0.33, 1, 0.68, 1]
                  }}
                  style={{ 
                    transform: 'translateZ(0)',
                    willChange: isSelected ? 'transform' : 'auto'
                  }}
                >
                  {MOOD_EMOJI[mood]}
                </motion.div>
                
                {/* Icon and Label Container */}
                <div className="flex flex-col items-center gap-1 z-10 text-center w-full px-2">
                    <div className="flex items-center justify-center gap-2 w-full">
                         {Icon && (
                          <Icon 
                            className={`w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0 ${
                              isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                            }`}
                            style={{ 
                              transition: 'color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
                            }}
                          />
                        )}
                        <span 
                          className={`text-base xs:text-lg font-bold tracking-wide whitespace-nowrap flex-shrink-0 ${
                            isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                          }`}
                          style={{ 
                            transition: 'color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                            transform: 'translateZ(0)',
                            WebkitFontSmoothing: 'antialiased'
                          }}
                        >
                          {MOOD_LABELS[mood]}
                        </span>
                    </div>
                    {/* Mood Number */}
                     <span 
                       className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50"
                       style={{ 
                         transition: 'color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
                       }}
                     >
                        Level {mood}
                    </span>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${MOOD_INDICATOR_COLORS[mood]}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "tween",
                      duration: 0.15,
                      ease: [0.33, 1, 0.68, 1]
                    }}
                    style={{ 
                      transform: 'translateZ(0)',
                      willChange: 'transform, opacity'
                    }}
                  >
                     <motion.svg 
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ 
                          pathLength: { duration: 0.25, delay: 0.06 },
                          opacity: { duration: 0.12, delay: 0.06 }
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
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
});

export default MoodCards;
