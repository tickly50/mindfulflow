import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Save, X } from 'lucide-react';
import { MOOD_COLORS, CONTEXT_TAGS } from '../../utils/moodCalculations';
import { variants } from '../../utils/animations';
import SleepSlider from '../CheckIn/SleepSlider';

export default function JournalEditor({ editingEntry, setEditingEntry, editForm, setEditForm, handleUpdate }) {
  const toggleEditTag = (tagId) => {
    setEditForm(prev => {
      const tags = prev.tags.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags };
    });
  };

  return (
    <AnimatePresence mode="wait">
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-2xl bg-[#1a1b26] p-8 rounded-[2rem] border border-white/10 shadow-2xl will-change-transform overflow-y-auto max-h-[90vh] premium-scroll"
            style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setEditingEntry(null)}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 select-none">
              <span className="p-3 bg-violet-500/10 rounded-xl text-violet-400">
                 <Pencil className="w-6 h-6" />
              </span>
              Upravit záznam
            </h3>

            <div className="space-y-8 select-none">
              {/* Mood Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white/40 uppercase tracking-wider">Nálada</label>
                <div className="flex justify-between bg-black/20 p-2 rounded-2xl border border-white/5">
                  {[1, 2, 3, 4, 5].map(mood => (
                    <button
                      key={mood}
                      onClick={() => setEditForm({ ...editForm, mood })}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        editForm.mood === mood ? 'shadow-lg ring-2 ring-white/20 scale-110' : 'opacity-40 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: MOOD_COLORS[mood].primary, color: MOOD_COLORS[mood].text }}
                    >
                      <span className="font-bold text-lg">{mood}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white/40 uppercase tracking-wider">Kategorie</label>
                <div className="flex flex-wrap gap-2">
                  {CONTEXT_TAGS.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleEditTag(tag.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
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
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white/40 uppercase tracking-wider">Spánek</label>
                <div className="bg-black/20 p-2 sm:p-4 rounded-2xl border border-white/5">
                  <SleepSlider value={editForm.sleep} onChange={(val) => setEditForm({ ...editForm, sleep: val })} />
                </div>
              </div>

              {/* Diary Text */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white/40 uppercase tracking-wider">Poznámka</label>
                <textarea
                  value={editForm.diary}
                  onChange={(e) => setEditForm({ ...editForm, diary: e.target.value })}
                  className="w-full h-40 bg-black/20 border border-white/10 rounded-2xl p-5 text-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20 transition-colors select-text"
                  placeholder="Co se ti honí hlavou?"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => setEditingEntry(null)}
                  className="flex-1 px-6 py-4 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white font-medium transition-colors"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-[2] px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-violet-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Uložit změny
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
