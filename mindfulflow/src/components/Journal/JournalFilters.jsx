import { motion } from 'framer-motion';
import { memo } from 'react';
import { MOOD_COLORS, MOOD_LABELS } from '../../utils/moodCalculations';
import X from 'lucide-react/dist/esm/icons/x';

const JournalFilters = memo(function JournalFilters({ 
  filterMood, 
  setFilterMood, 
  filterTag, 
  setFilterTag, 
  allTags 
}) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Mood Filters */}
        <div className="flex bg-white/5 p-1.5 rounded-3xl border border-white/10 md:backdrop-blur-xl shadow-glass">
          {[1, 2, 3, 4, 5].map(mood => (
            <button
              key={mood}
              onClick={() => setFilterMood(filterMood === mood ? null : mood)}
              className={`w-11 h-11 xs:w-12 xs:h-12 rounded-[1.1rem] flex items-center justify-center transition-all relative outline-none ${
                filterMood === mood ? 'shadow-lg scale-110 z-10' : 'opacity-40 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: filterMood === mood ? MOOD_COLORS[mood].primary : 'transparent',
                color: filterMood === mood ? MOOD_COLORS[mood].text : MOOD_COLORS[mood].primary
              }}
              title={MOOD_LABELS[mood]}
              aria-label={`Filtrovat ${MOOD_LABELS[mood]}`}
            >
              <span className="font-bold text-lg">{mood}</span>
              {filterMood === mood && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute inset-0 rounded-[1.1rem] border-[3px] border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Clear Filters */}
        {(filterMood || filterTag) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => { setFilterMood(null); setFilterTag(null); }}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            <X className="w-4 h-4" /> 
            <span>Vymazat filtry</span>
          </motion.button>
        )}
      </div>

      {/* Tag Filters */}
      {allTags && allTags.length > 0 && (
         <div className="flex flex-wrap justify-center gap-2">
            {allTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all border outline-none ${
                  filterTag === tag.id 
                    ? 'bg-violet-500 text-white border-violet-400/50 shadow-glow-violet scale-105' 
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white/90 hover:bg-white/10'
                }`}
              >
                {tag.label}
              </button>
            ))}
         </div>
      )}
    </div>
  );
});

export default JournalFilters;
