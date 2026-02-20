import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { variants, microInteractions } from '../../utils/animations';
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

/**
 * Context tags selector - Premium Enhanced
 */
const ContextTags = memo(function ContextTags({ selectedTags, onTagToggle, availableTags, onDeleteTag }) {

  const container = variants.staggerContainerFast;

  return (
    <motion.div
      className="mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-wrap gap-3">
        {/* Removed AnimatePresence mode="popLayout" as it creates issues with static lists */}
        {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            // Fallback to Hash if icon not found
            const Icon = ICON_MAP[tag.icon] || Hash;
            const isCustom = tag.id.toString().startsWith('custom_');
            
            return (
              <motion.button
                key={tag.id}
                variants={variants.pop}
                whileHover={microInteractions.button.hover}
                whileTap={microInteractions.button.tap}
                onClick={() => onTagToggle(tag.id)}
                className={`
                  relative px-5 py-3 rounded-2xl flex items-center gap-2.5 transition-all duration-300 border overflow-hidden group/tag touch-none
                  ${isSelected 
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 border-violet-400/50 text-white shadow-lg shadow-violet-500/25' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }
                  ${isCustom ? 'pr-9' : ''} 
                `}
                style={{
                  willChange: 'transform'
                }}
              >
                {/* Glow effect for selected items - removed layoutId to prevent conflicts */}
                {isSelected && (
                    <motion.div 
                        className="absolute inset-0 rounded-2xl bg-violet-400/20 blur-md -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}

                {Icon && <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white/90'}`} />}
                
                <span className={`text-sm tracking-wide font-bold ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {tag.label}
                </span>

                {isCustom && onDeleteTag && (
                    <div
                        onClick={(e) => onDeleteTag(tag.id, e)}
                        className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors
                            ${isSelected 
                                ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                                : 'hover:bg-white/10 text-white/40 hover:text-white/90'
                            }
                        `}
                    >
                        <X className="w-3.5 h-3.5" />
                    </div>
                )}
              </motion.button>
            );
        })}
      </div>
    </motion.div>
  );
});

export default ContextTags;
