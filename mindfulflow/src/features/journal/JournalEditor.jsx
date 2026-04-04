import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useMemo } from 'react';
import { MOOD_COLORS, CONTEXT_TAGS } from '../../utils/moodConstants';
import useScrollLock from '../../hooks/useScrollLock';
import { useToast } from '../../context/ToastContext';
import { variants } from '../../utils/animations';
import SleepSlider from '../checkin/SleepSlider';
import { Pencil, Save, X } from 'lucide-react';

const EDITOR_MAX_LENGTH = 1000;

export default function JournalEditor({
  editingEntry,
  setEditingEntry,
  editForm,
  setEditForm,
  handleUpdate,
  allTags,
}) {
  useScrollLock(!!editingEntry);
  const { error } = useToast();

  const tagsToShow = useMemo(() => {
    if (allTags && allTags.length > 0) return allTags;
    return CONTEXT_TAGS;
  }, [allTags]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setEditingEntry(null);
    };
    if (editingEntry) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [editingEntry, setEditingEntry]);

  const toggleEditTag = (tagId) => {
    setEditForm((prev) => {
      const tags = prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags };
    });
  };

  const charCount = editForm.diary.length;
  const nearLimit = charCount > EDITOR_MAX_LENGTH * 0.9;

  const handleSave = () => {
    if (!editForm.diary || editForm.diary.trim() === '') {
      error('Pro uložení musíš napsat osobní poznámku.');
      return;
    }
    handleUpdate();
  };

  return (
    <>
      {createPortal(
        <AnimatePresence mode="wait">
          {editingEntry && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingEntry(null)}
                className="absolute inset-0 bg-[var(--bg)]/80 md:backdrop-blur-md"
              />
              <motion.div
                variants={variants.scale}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative w-full max-w-2xl bg-theme-card p-4 xs:p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-theme-border shadow-depth-lg will-change-transform flex flex-col max-h-[90vh] overflow-hidden transition-colors duration-theme"
              >
                {/* Close Button */}
                <button
                  aria-label="Zavřít úpravu"
                  onClick={() => setEditingEntry(null)}
                  className="absolute top-2 right-2 sm:top-6 sm:right-6 p-3 text-theme-muted hover:text-theme-text rounded-full hover:bg-[var(--accent-glow)] transition-colors z-10"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <h3 className="text-xl sm:text-2xl font-bold text-theme-text mb-5 sm:mb-7 flex items-center gap-2 sm:gap-3 select-none flex-shrink-0 tracking-tight">
                  <span className="p-2 sm:p-3 bg-[var(--accent-glow)] rounded-xl text-[var(--accent-soft)]">
                    <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  Upravit záznam
                </h3>

                <div className="space-y-5 sm:space-y-7 flex-1 overflow-y-auto premium-scroll pr-1 sm:pr-2">
                  {/* Mood Selection */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-semibold text-theme-muted uppercase tracking-wider">
                      Nálada
                    </label>
                    <div className="flex justify-between gap-1 sm:gap-2 bg-theme-elevated p-2 rounded-2xl border border-theme-border">
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <button
                          key={mood}
                          onClick={() => setEditForm({ ...editForm, mood })}
                          className={`flex-1 h-10 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                            editForm.mood === mood
                              ? 'shadow-lg ring-2 ring-white/20 scale-105 sm:scale-110 z-10 relative'
                              : 'opacity-40 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: MOOD_COLORS[mood].primary,
                            color: MOOD_COLORS[mood].text,
                          }}
                        >
                          <span className="font-bold text-base sm:text-lg">{mood}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Selection */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-semibold text-theme-muted uppercase tracking-wider">
                      Kategorie
                    </label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {tagsToShow.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleEditTag(tag.id)}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                            editForm.tags.includes(tag.id)
                              ? 'bg-[var(--accent-glow)] text-theme-text border-[var(--accent)]/35 shadow-glow-accent'
                              : 'bg-theme-elevated text-theme-muted border-transparent hover:bg-[var(--accent-glow)] hover:text-theme-text'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sleep Selection */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs sm:text-sm font-semibold text-theme-muted uppercase tracking-wider">
                      Spánek
                    </label>
                    <div className="bg-theme-elevated p-2 sm:p-4 rounded-2xl border border-theme-border">
                      <SleepSlider
                        value={editForm.sleep}
                        onChange={(val) => setEditForm({ ...editForm, sleep: val })}
                      />
                    </div>
                  </div>

                  {/* Diary Text */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs sm:text-sm font-semibold text-theme-muted uppercase tracking-wider">
                        Poznámka
                      </label>
                      <span
                        className={`text-xs font-mono py-0.5 px-2 rounded-full border transition-colors ${
                          nearLimit
                            ? 'text-rose-300 border-rose-500/30 bg-rose-500/10'
                            : 'text-theme-muted border-theme-border'
                        }`}
                      >
                        {charCount}/{EDITOR_MAX_LENGTH}
                      </span>
                    </div>
                    <textarea
                      value={editForm.diary}
                      onChange={(e) => {
                        if (e.target.value.length <= EDITOR_MAX_LENGTH) {
                          setEditForm({ ...editForm, diary: e.target.value });
                        }
                      }}
                      className="w-full min-h-[140px] sm:min-h-[180px] bg-theme-elevated border border-theme-border rounded-2xl p-4 sm:p-5 text-base sm:text-lg text-theme-text resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 ring-inset focus:border-transparent hover:border-[var(--accent)]/25 transition-colors select-text leading-relaxed"
                      placeholder="Co se ti honí hlavou?"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-4 pb-2 border-t border-theme-border shrink-0">
                    <button
                      onClick={() => setEditingEntry(null)}
                      className="flex-1 px-4 py-3 sm:py-4 rounded-xl bg-theme-elevated text-theme-muted hover:bg-[var(--accent-glow)] hover:text-theme-text font-medium transition-colors text-sm sm:text-base"
                    >
                      Zrušit
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-[2] px-4 py-3 sm:py-4 rounded-xl bg-[var(--accent)] text-white font-bold hover:opacity-95 hover:shadow-glow-accent transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
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
