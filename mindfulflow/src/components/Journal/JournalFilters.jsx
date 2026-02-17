import { motion } from 'framer-motion';
import { MOOD_COLORS, MOOD_LABELS } from '../../utils/moodCalculations';
import { X } from 'lucide-react';

export default function JournalFilters({ 
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
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner">
          {[1, 2, 3, 4, 5].map(mood => (
            <button
              key={mood}
              onClick={() => setFilterMood(filterMood === mood ? null : mood)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                filterMood === mood ? 'shadow-lg ring-1 ring-white/20' : 'opacity-40 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: filterMood === mood ? MOOD_COLORS[mood].primary : 'transparent',
                color: filterMood === mood ? MOOD_COLORS[mood].text : MOOD_COLORS[mood].primary
              }}
              title={MOOD_LABELS[mood]}
            >
              <span className="font-bold text-lg">{mood}</span>
              {filterMood === mood && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-xl border-2 border-white/20"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  filterTag === tag.id 
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/30 shadow-[0_0_15px_-5px_var(--tw-shadow-color)] shadow-violet-500/30' 
                    : 'bg-white/5 text-white/50 border-transparent hover:border-white/10 hover:text-white/80 hover:bg-white/10'
                }`}
              >
                {tag.label}
              </button>
            ))}
         </div>
      )}
    </div>
  );
}
