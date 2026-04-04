import { useState, useEffect, memo, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { microInteractions } from '../../utils/animations';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/db';
import Greeting from './Greeting';
import MoodCards from './MoodCards';
import ContextTags from './ContextTags';
import DiaryField from './DiaryField';
import SleepSlider from './SleepSlider';
import SuccessOverlay from './SuccessOverlay';
import { saveMoodEntry } from '../../utils/storage';
import { devError } from '../../utils/devLog';
import { CONTEXT_TAGS } from '../../utils/moodConstants';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import { haptics } from '../../utils/haptics';
import { Sparkles, Plus, ChevronRight } from 'lucide-react';

// Main check-in view for recording mood and context
const CheckInView = memo(function CheckInView({ onMoodChange }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [diaryText, setDiaryText] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCycle, setSuccessCycle] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  // Custom Tag State
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [tempTags, setTempTags] = useState([]);
  const [tagToDelete, setTagToDelete] = useState(null);
  
  const { error } = useToast();
  const customTagsSettings = useLiveQuery(() => db.settings.get('customTags'));

  // Refs for cleanup
  const prevShowSuccessRef = useRef(false);
  const scrollToTopAfterSuccessRef = useRef(false);
  const moodTimeoutRef = useRef(null);
  const formAnchorRef = useRef(null);
  const isMountedMoodRef = useRef(false);
  const isScrollAnimatingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    };
  }, []);

  // Data preparation
  const allTags = useMemo(() => {
    const dbTags = customTagsSettings?.value || [];
    const combined = [...dbTags, ...tempTags];
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
    return [...CONTEXT_TAGS, ...unique];
  }, [customTagsSettings, tempTags]);

  const [successParticles] = useState(() => {
      // 14 particles – enough visual impact, lighter on mobile GPU
      return [...Array(14)].map(() => ({
        xOffset: (Math.random() - 0.5) * 900,
        yOffset: (Math.random() - 0.5) * 900,
        duration: 1.2 + Math.random() * 0.6,
        rotate: Math.random() * 360,
      }));
  });

   // Handlers
  const handleMoodSelect = useCallback((mood) => {
    setSelectedMood((prevSelected) => {
      const newMood = prevSelected === mood ? null : mood;
      if (onMoodChange) {
        // Defer parent update to avoid 'Cannot update during render' error
        if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
        moodTimeoutRef.current = setTimeout(() => onMoodChange(newMood), 0);
      }
      return newMood;
    });
  }, [onMoodChange]);

  // After success overlay truly closes (scroll unlocked), return to top smoothly
  useEffect(() => {
    const prev = prevShowSuccessRef.current;
    if (prev && !showSuccess && scrollToTopAfterSuccessRef.current) {
      scrollToTopAfterSuccessRef.current = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevShowSuccessRef.current = showSuccess;
  }, [showSuccess]);

  // Block user scroll during programmatic scroll animation
  const lockScroll = useCallback(() => {
    isScrollAnimatingRef.current = true;
    const prevent = (e) => { if (isScrollAnimatingRef.current) e.preventDefault(); };
    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      window.removeEventListener('wheel', prevent);
      window.removeEventListener('touchmove', prevent);
    };
  }, []);

  // Scroll to form when mood selected, scroll to top when deselected
  useEffect(() => {
    if (!isMountedMoodRef.current) {
      isMountedMoodRef.current = true;
      return;
    }
    if (selectedMood !== null) {
      setTimeout(() => {
        if (!formAnchorRef.current) return;
        const targetY = formAnchorRef.current.getBoundingClientRect().top + window.scrollY - 12;
        const unlock = lockScroll();
        animate(window.scrollY, targetY, {
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => window.scrollTo(0, v),
          onComplete: () => { isScrollAnimatingRef.current = false; unlock(); },
        });
      }, 80);
    } else {
      const unlock = lockScroll();
      animate(window.scrollY, 0, {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => window.scrollTo(0, v),
        onComplete: () => { isScrollAnimatingRef.current = false; unlock(); },
      });
    }
  }, [selectedMood, lockScroll]);

  const handleTagToggle = useCallback((tagId) => {
    haptics.light();
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  }, []);

  const handleAddCustomTag = async () => {
    if (!newTagLabel.trim()) return;
    const newTag = { id: `custom_${Date.now()}`, label: newTagLabel.trim(), icon: 'Star' };
    
    // Optimistic update - IMMEDIATE UI FEEDBACK
    haptics.success();
    setTempTags(prev => [...prev, newTag]);
    setNewTagLabel('');
    setIsAddingTag(false); // Close immediately
    handleTagToggle(newTag.id);

    // Background DB update
    try {
        const currentDbTags = await db.settings.get('customTags');
        const existingTags = currentDbTags?.value || [];
        await db.settings.put({ key: 'customTags', value: [...existingTags, newTag] });
    } catch (_err) {
        // Rollback on failure
        setTempTags(prev => prev.filter(t => t.id !== newTag.id));
        handleTagToggle(newTag.id); // Untoggle if it was toggled
        if (error) error('Nepodařilo se uložit vlastní tag.');
    }
  };

  const handleDeleteTag = useCallback(async (tagId, e) => {
    e.stopPropagation(); // Prevent toggling the tag
    haptics.heavy();
    setTagToDelete(tagId);
  }, []);

  const handleConfirmDeleteTag = useCallback(async () => {
    const tagId = tagToDelete;
    if (!tagId) return;

    // Optimistic update
    setTempTags(prev => prev.filter(t => t.id !== tagId));
    if (selectedTags.includes(tagId)) {
        handleTagToggle(tagId);
    }

    try {
        const currentDbTags = await db.settings.get('customTags');
        const existingTags = currentDbTags?.value || [];
        const newTags = existingTags.filter(t => t.id !== tagId);
        await db.settings.put({ key: 'customTags', value: newTags });
    } catch (_err) {
        error('Nepodařilo se smazat tag');
    }
    setTagToDelete(null);
  }, [tagToDelete, selectedTags, handleTagToggle, error]);

  const resetCheckInState = useCallback(() => {
    setSelectedMood(null);
    if (onMoodChange) onMoodChange(null);
    setSelectedTags([]);
    setDiaryText('');
    setSleepHours(7);
    setIsAddingTag(false);
    setNewTagLabel('');
  }, [onMoodChange]);

  const handleSuccessClose = useCallback(() => {
    // Avoid double-scroll: we want the "scroll-to-top" to happen after overlay unmounts.
    scrollToTopAfterSuccessRef.current = true;

    setShowSuccess(false);
    resetCheckInState();
  }, [resetCheckInState]);

  const handleSubmit = useCallback(async () => {
    if (!selectedMood || isSaving) return;
    haptics.medium();
    setIsSaving(true);
    try {
      const entry = {
        mood: selectedMood,
        tags: selectedTags,
        diary: diaryText,
        sleep: sleepHours,
        timestamp: new Date().toISOString(),
      };

      await saveMoodEntry(entry);
      setShowSuccess(true);
      setSuccessCycle((c) => c + 1);
    } catch (err) {
      devError(err);
      error('Nepodařilo se uložit záznam.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedMood, selectedTags, diaryText, sleepHours, error, isSaving]);

  const canSubmit = selectedMood !== null;

  return (
    <div className="w-full max-w-app mx-auto pb-8 md:pb-12 min-w-0 px-0 sm:px-1">
          {/* Section 1: Introduction & Mood */}
          <div className="scroll-mt-4">
              <Greeting />
              <MoodCards
                onMoodSelect={handleMoodSelect}
                selectedMood={selectedMood}
              />
          </div>

          {/* Scroll anchor – scrolled into view when a mood is selected */}
          <div ref={formAnchorRef} />

          {/* Section 2: Progressive Disclosure Details */}
          <AnimatePresence mode="wait">
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                style={{ willChange: 'opacity' }}
              >
                <div className="pt-4 xs:pt-6 scroll-mt-4">
                     {/* Glass Container for Details */}
                     <div className="p-5 sm:p-6 rounded-xl border border-theme-border bg-theme-card w-full min-w-0 transition-[background-color,border-color] duration-theme">
                        {/* Sleep Slider */}
                        <SleepSlider value={sleepHours} onChange={setSleepHours} />

                        {/* Tags Section */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                                <h3 className="text-lg sm:text-xl font-bold text-theme-text flex items-center gap-2 tracking-tight">
                                    <Sparkles className="w-5 h-5 text-[var(--accent-soft)]" />
                                    Co ovlivnilo tvou náladu?
                                </h3>
                                <motion.button 
                                  whileHover={microInteractions.button.hover}
                                  whileTap={microInteractions.button.tap}
                                  onClick={() => setIsAddingTag(!isAddingTag)}
                                  className="text-xs font-bold text-theme-text px-4 py-2 bg-[var(--accent-glow)] hover:bg-[var(--accent)]/20 rounded-xl transition-[background-color] duration-theme flex items-center justify-center gap-1.5 group w-full sm:w-auto"
                                >
                                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                                  {isAddingTag ? 'Zavřít' : 'Vlastní tag'}
                                </motion.button>
                            </div>

                            {/* Custom Tag Input */}
                            <AnimatePresence>
                                {isAddingTag && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.15 } }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      className="origin-top mb-4"
                    >
                                      <div className="flex gap-2 items-center bg-theme-elevated p-1.5 xs:p-2 rounded-2xl border border-theme-border pr-1.5 xs:pr-2">
                                        <input
                                          type="text"
                                          value={newTagLabel}
                                          onChange={(e) => setNewTagLabel(e.target.value)}
                                          placeholder="Název nového tagu..."
                                          className="flex-1 min-w-0 rounded-2xl border-none bg-transparent px-3 py-2 text-sm text-theme-text placeholder-theme-muted focus:outline-none focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]/50 xs:text-base"
                                          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                                          autoFocus
                                        />
                                        <button
                                          onClick={handleAddCustomTag}
                                          className="bg-[var(--accent)] hover:opacity-95 text-white px-4 xs:px-6 py-2 rounded-xl font-bold transition-opacity duration-theme shadow-glow-accent text-sm xs:text-base whitespace-nowrap"
                                        >
                                          Přidat
                                        </button>
                                      </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <ContextTags
                                selectedTags={selectedTags}
                                onTagToggle={handleTagToggle}
                                availableTags={allTags}
                                onDeleteTag={handleDeleteTag}
                            />
                        </div>

                        {/* Diary */}
                        <DiaryField value={diaryText} onChange={setDiaryText} />

                        {/* Submit Button */}
                        {/* Made button extra wide on mobile (w-full) and stick to bottom inside its container */}
                        <div className="flex justify-center mt-6 sm:mt-8">
                            <motion.button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canSubmit || showSuccess || isSaving}
                                aria-busy={isSaving}
                                className="w-full md:w-auto md:min-w-[280px] rounded-xl bg-[var(--accent)] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-4 md:px-8 md:py-5 flex items-center justify-center gap-3 text-lg font-semibold text-white border border-white/15 transition-opacity duration-theme"
                            >
                              <span>{isSaving ? 'Ukládám…' : 'Uložit záznam'}</span>
                              <ChevronRight className="w-5 h-5 shrink-0" aria-hidden />
                            </motion.button>
                        </div>

                     </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Overlay */}
          <AnimatePresence mode="wait">
            {showSuccess && (
              <SuccessOverlay
                key={`success-${successCycle}`}
                onClose={handleSuccessClose}
                successParticles={successParticles}
              />
            )}
          </AnimatePresence>

          {/* Tag Delete Confirmation */}
          <ConfirmModal
            isOpen={!!tagToDelete}
            onClose={() => setTagToDelete(null)}
            onConfirm={handleConfirmDeleteTag}
            title="Smazat tag"
            message="Opravdu chceš smazat tento tag? Tuto akci nelze vrátit zpět."
            confirmText="Smazat"
            isDangerous={true}
          />
        </div>
  );
});

export default CheckInView;
