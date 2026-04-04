import { motion, AnimatePresence } from 'framer-motion';
import { memo, useRef } from 'react';
import { MOOD_COLORS, MOOD_LABELS } from '../../utils/moodConstants';
import { X, Search } from 'lucide-react';

const EASE_OUT = [0.22, 1, 0.36, 1];

const JournalFilters = memo(function JournalFilters({
  filterMood,
  setFilterMood,
  filterTag,
  setFilterTag,
  allTags,
  searchQuery,
  setSearchQuery,
}) {
  const searchRef = useRef(null);
  const hasActiveFilter = filterMood || filterTag || searchQuery;

  return (
    <div className="mb-6 md:mb-8 flex flex-col gap-4 min-w-0 w-full">

      {/* ── Search input ──────────────────────────────────────── */}
      <div className="relative w-full min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none z-[1]" />
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hledat v záznámech..."
          className="w-full min-w-0 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-12 py-3.5 min-h-[48px] text-fluid-sm text-white placeholder-white/35 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/28 hover:border-white/18 transition-[border-color,box-shadow] duration-150"
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15, ease: EASE_OUT }}
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-white/40 hover:text-white/80 rounded-xl hover:bg-white/10 transition-colors duration-150"
              aria-label="Vymazat hledání"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mood filters + clear button ───────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex bg-white/5 p-1.5 rounded-3xl border border-white/10 shadow-glass">
          {[1, 2, 3, 4, 5].map((mood) => (
            <button
              key={mood}
              onClick={() => setFilterMood(filterMood === mood ? null : mood)}
              className={`min-w-[44px] min-h-[44px] w-11 h-11 xs:w-12 xs:h-12 rounded-[1.1rem] flex items-center justify-center relative outline-none transition-none ${
                filterMood === mood ? 'shadow-lg scale-110 z-10' : 'opacity-40 hover:opacity-80'
              }`}
              style={{
                backgroundColor: filterMood === mood ? MOOD_COLORS[mood].primary : 'transparent',
                color: filterMood === mood ? MOOD_COLORS[mood].text : MOOD_COLORS[mood].primary,
              }}
              title={MOOD_LABELS[mood]}
              aria-label={`Filtrovat ${MOOD_LABELS[mood]}`}
            >
              <span className="font-bold text-lg leading-none">{mood}</span>
              {filterMood === mood && (
                <span className="absolute inset-0 rounded-[1.1rem] border-[3px] border-white/35 pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {hasActiveFilter && (
          <button
            onClick={() => { setFilterMood(null); setFilterTag(null); setSearchQuery(''); }}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-red-500/10 text-red-400 text-fluid-sm font-medium hover:bg-red-500/18 transition-colors duration-150 border border-red-500/20 w-full sm:w-auto"
          >
            <X className="w-3.5 h-3.5" />
            Vymazat vše
          </button>
        )}
      </div>

      {/* ── Tag filters ───────────────────────────────────────── */}
      {allTags && allTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {allTags.map((tag) => (
            <motion.button
              key={tag.id}
              whileTap={{ scale: 0.92, transition: { duration: 0.1 } }}
              onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)}
              className={`px-4 py-2.5 min-h-[44px] rounded-xl text-fluid-xs sm:text-fluid-sm font-bold tracking-wide transition-[background-color,border-color,color,box-shadow,transform] duration-150 border outline-none inline-flex items-center justify-center ${
                filterTag === tag.id
                  ? 'bg-teal-600 text-white border-teal-400/50 shadow-glow-accent scale-105'
                  : 'bg-white/5 text-white/55 border-white/10 hover:border-white/20 hover:text-white/85 hover:bg-white/8'
              }`}
            >
              {tag.label}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
});

export default JournalFilters;
