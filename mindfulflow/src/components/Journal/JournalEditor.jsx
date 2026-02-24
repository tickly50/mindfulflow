import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Save, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { MOOD_COLORS, CONTEXT_TAGS } from '../../utils/moodCalculations';
import { variants } from '../../utils/animations';
import SleepSlider from '../CheckIn/SleepSlider';

export default function JournalEditor({ editingEntry, setEditingEntry, editForm, setEditForm, handleUpdate }) {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setEditingEntry(null);
    };

    if (editingEntry) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [editingEntry, setEditingEntry]);
  const toggleEditTag = (tagId) => {
    setEditForm(prev => {
      const tags = prev.tags.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags };
    });
  };

  return (
    <>
      {createPortal(
        <AnimatePresence mode="wait">
          {editingEntry && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 pb-safe">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingEntry(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            variants={variants.scale}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative w-full max-w-2xl bg-[#1a1b26] p-4 xs:p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-white/10 shadow-2xl will-change-transform flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden"
            style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setEditingEntry(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 select-none flex-shrink-0">
              <span className="p-2 sm:p-3 bg-violet-500/10 rounded-xl text-violet-400">
                 <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              Upravit záznam
            </h3>

            <div className="space-y-6 sm:space-y-8 select-none flex-1 overflow-y-auto premium-scroll pr-1 sm:pr-2">
              {/* Mood Selection */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-white/40 uppercase tracking-wider">Nálada</label>
                <div className="flex justify-between gap-1 sm:gap-2 bg-black/20 p-2 rounded-2xl border border-white/5">
                  {[1, 2, 3, 4, 5].map(mood => (
                    <button
                      key={mood}
                      onClick={() => setEditForm({ ...editForm, mood })}
                      className={`flex-1 h-10 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                        editForm.mood === mood ? 'shadow-lg ring-2 ring-white/20 scale-105 sm:scale-110 z-10 relative' : 'opacity-40 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: MOOD_COLORS[mood].primary, color: MOOD_COLORS[mood].text }}
                    >
                      <span className="font-bold text-base sm:text-lg">{mood}</span>
                    </button>
                   ))}
                </div>
              </div>

              {/* Tags Selection */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-white/40 uppercase tracking-wider">Kategorie</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {CONTEXT_TAGS.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleEditTag(tag.id)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                        editForm.tags.includes(tag.id)
                          ? 'bg-violet-500/20 text-violet-200 border-violet-500/30 shadow-[0_0_10px_-3px_var(--tw-shadow-color)] shadow-violet-500/30'
                          : 'bg-white/5 text-white/40 border-transparent hover:bg-white/10 hover:text-white/80'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Selection */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-white/40 uppercase tracking-wider">Spánek</label>
                <div className="bg-black/20 p-2 sm:p-4 rounded-2xl border border-white/5">
                  <SleepSlider value={editForm.sleep} onChange={(val) => setEditForm({ ...editForm, sleep: val })} />
                </div>
              </div>

              {/* Diary Text */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-white/40 uppercase tracking-wider">Poznámka</label>
                <textarea
                  value={editForm.diary}
                  onChange={(e) => setEditForm({ ...editForm, diary: e.target.value })}
                  className="w-full h-32 sm:h-40 bg-black/20 border border-white/10 rounded-2xl p-4 sm:p-5 text-base sm:text-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 ring-inset focus:border-transparent hover:border-white/20 transition-colors select-text"
                  placeholder="Co se ti honí hlavou?"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-4 pb-2 border-t border-white/5 shrink-0 mt-6 md:mt-auto">
                <button
                  onClick={() => setEditingEntry(null)}
                  className="flex-1 px-4 py-3 sm:py-4 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white font-medium transition-colors text-sm sm:text-base"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-[2] px-4 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-violet-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  Uložit změny
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
    )}
    </>
  );
}
