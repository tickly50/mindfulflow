import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { memo } from 'react';
import { microInteractions, reducedMotionVariants } from '../../utils/animations';
import { Check, Briefcase, Moon, Users, Heart, DollarSign, MessageCircle, Star, Hash, X } from 'lucide-react';

// Icon mapping to avoid importing the entire library
const ICON_MAP = {
  Briefcase,
  Moon,
  Users,
  Heart,
  DollarSign,
  MessageCircle,
  Star,
  Hash
};

const tagVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: [0.65, 0, 0.35, 1] } }
};

/**
 * Context tags selector - Premium Enhanced
 */
const ContextTags = memo(function ContextTags({ selectedTags, onTagToggle, availableTags, onDeleteTag }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 xs:gap-3">
        <AnimatePresence initial={false}>
          {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              // Fallback to Hash if icon not found
              const Icon = ICON_MAP[tag.icon] || Hash;
              const isCustom = tag.id.toString().startsWith('custom_');
              return (
                <motion.button
                  key={tag.id}
                  variants={prefersReduced ? reducedMotionVariants.item : tagVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover={prefersReduced ? undefined : microInteractions.button.hover}
                  whileTap={microInteractions.button.tap}
                  onClick={() => onTagToggle(tag.id)}
                  className={`
                    relative px-3 py-2.5 min-h-[44px] xs:px-5 xs:py-3 rounded-2xl flex items-center gap-2 xs:gap-2.5 transition-all duration-300 border overflow-hidden group/tag outline-none focus:outline-none focus-visible:outline-none
                    ${isSelected 
                      ? 'bg-gradient-to-br from-violet-600 to-violet-700 border-violet-300/50 text-white shadow-glow-accent' 
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-sm'
                    }
                    ${isCustom ? 'pr-8 xs:pr-9' : ''} 
                  `}
                  style={{
                    willChange: 'transform, opacity'
                  }}
                >
                  {/* Glow effect for selected items */}
                  {isSelected && (
                      <motion.div 
                          className="absolute inset-0 rounded-2xl bg-violet-400/22 blur-md -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                      />
                  )}

                  {Icon && <Icon className={`w-3.5 h-3.5 xs:w-4 xs:h-4 ${isSelected ? 'text-white' : 'text-white/90'}`} />}
                  
                  <span className={`text-xs xs:text-sm tracking-wide font-bold ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      {tag.label}
                  </span>

                  {isCustom && onDeleteTag && (
                      <div
                          role="button"
                          aria-label={`Smazat tag ${tag.label}`}
                          onClick={(e) => onDeleteTag(tag.id, e)}
                          className={`absolute right-0.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl transition-colors outline-none focus:outline-none focus-visible:outline-none
                              ${isSelected 
                                  ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                                  : 'hover:bg-white/10 text-white/60 hover:text-white/90'
                              }
                          `}
                      >
                          <X className="w-4 h-4" />
                      </div>
                  )}
                </motion.button>
              );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default ContextTags;
