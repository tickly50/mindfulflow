import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import JournalCard from './JournalCard';
import { variants } from '../../utils/animations';

// Container: stagger each card from the left
const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const JournalTimeline = memo(function JournalTimeline({
  entries,
  filterMood,
  filterTag,
  onEdit,
  onDelete,
  getContextLabel,
}) {
  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 pointer-events-none" />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
          className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-white/20"
        >
          <MessageSquare className="w-10 h-10 text-white/50" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="text-2xl font-bold text-white mb-3 tracking-tight"
        >
          {(filterMood || filterTag) ? 'Žádné záznamy nalezeny' : 'Zatím je tu ticho'}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="text-white/50 max-w-md mx-auto leading-relaxed px-6"
        >
          {(filterMood || filterTag)
            ? 'Zkus upravit filtry, možná se tvé myšlenky skrývají jinde.'
            : 'Tvůj deník čeká na první příběh. Až si zapíšeš svůj první Check-In, objeví se tady.'}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6 pb-20 relative"
      variants={listContainer}
      initial="hidden"
      animate="show"
    >
      {/* Decorative timeline line */}
      <motion.div
        className="absolute left-[39px] top-6 bottom-10 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent hidden sm:block"
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
      />

      <AnimatePresence mode="wait">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout="position"
            variants={variants.listItem}
            initial="hidden"
            animate="show"
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] },
            }}
            className="relative pl-0 sm:pl-20"
          >
            {/* Timeline dot */}
            <motion.div
              className="absolute left-[33px] top-10 w-3 h-3 rounded-full bg-violet-400/60 border-2 border-[#1a1b26] hidden sm:block z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1 + index * 0.06,
                type: 'spring',
                stiffness: 400,
                damping: 18,
              }}
            />
            <JournalCard
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
              getContextLabel={getContextLabel}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

export default JournalTimeline;
