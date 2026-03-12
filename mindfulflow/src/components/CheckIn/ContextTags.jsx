import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { memo } from 'react';
import { variants, microInteractions, reducedMotionVariants } from '../../utils/animations';
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
  hidden: { opacity: 0, scale: 0.85, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25, mass: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15, ease: [0.65, 0, 0.35, 1] } }
};

/**
 * Context tags selector - Premium Enhanced
 */
const ContextTags = memo(function ContextTags({ selectedTags, onTagToggle, availableTags, onDeleteTag }) {
  const prefersReduced = useReducedMotion();
  const container = prefersReduced ? reducedMotionVariants.container : variants.staggerContainerFast;

  return (
    <motion.div
      className="mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-wrap gap-2 xs:gap-3">
        <AnimatePresence>
          {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              // Fallback to Hash if icon not found
              const Icon = ICON_MAP[tag.icon] || Hash;
              const isCustom = tag.id.toString().startsWith('custom_');
              return (
                <motion.button
                  key={tag.id}
                  variants={prefersReduced ? reducedMotionVariants.item : tagVariants}
                  whileHover={prefersReduced ? undefined : microInteractions.button.hover}
                  whileTap={microInteractions.button.tap}
                  onClick={() => onTagToggle(tag.id)}
                  className={`
                    relative px-3 py-2 xs:px-5 xs:py-3 rounded-2xl flex items-center gap-2 xs:gap-2.5 transition-all duration-300 border overflow-hidden group/tag outline-none focus:outline-none focus-visible:outline-none
                    ${isSelected 
                      ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 border-violet-400/50 text-white shadow-glow-violet' 
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
                          className="absolute inset-0 rounded-2xl bg-violet-400/20 blur-md -z-10"
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
                          className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 xs:p-1.5 rounded-full transition-colors outline-none focus:outline-none focus-visible:outline-none
                              ${isSelected 
                                  ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                                  : 'hover:bg-white/10 text-white/60 hover:text-white/90'
                              }
                          `}
                      >
                          <X className="w-3.5 h-3.5" />
                      </div>
                  )}
                </motion.button>
              );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default ContextTags;
