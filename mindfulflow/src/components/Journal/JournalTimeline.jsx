import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import JournalCard from './JournalCard';
import { variants } from '../../utils/animations';

export default function JournalTimeline({ 
  entries, 
  filterMood, 
  filterTag, 
  onEdit, 
  onDelete, 
  getContextLabel 
}) {
  if (entries.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 pointer-events-none" />
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-white/20">
          <MessageSquare className="w-10 h-10 text-white/50" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
          {(filterMood || filterTag) ? 'Žádné záznamy nalazeny' : 'Zatím je tu ticho'}
        </h3>
        <p className="text-white/50 max-w-md mx-auto leading-relaxed px-6">
          {(filterMood || filterTag) 
            ? 'Zkus upravit filtry, možná se tvé myšlenky skrývají jinde.' 
            : 'Tvůj deník čeká na první příběh. Až si zapíšeš svůj první Check-In, objeví se tady.'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6 pb-20 relative"
      initial="hidden"
      animate="show"
      variants={variants.container}
    >
      {/* Decorative vertical line */}
      <div className="absolute left-[39px] top-6 bottom-10 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent hidden sm:block" />

      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => (
          <div key={entry.id || index} className="relative pl-0 sm:pl-20">
             {/* Timeline dot connecting to the line */}
             <div className="absolute left-[33px] top-10 w-3 h-3 rounded-full bg-white/20 border-2 border-[#1a1b26] hidden sm:block z-10" />
             
             <JournalCard 
               entry={entry} 
               onEdit={onEdit} 
               onDelete={onDelete}
               getContextLabel={getContextLabel}
             />
          </div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
