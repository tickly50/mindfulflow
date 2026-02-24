import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/db';
import { CONTEXT_TAGS } from '../../utils/moodCalculations';
import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import JournalFilters from './JournalFilters';
import JournalTimeline from './JournalTimeline';
import JournalEditor from './JournalEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { variants } from '../../utils/animations';
import ConfirmModal from '../common/ConfirmModal';

const JournalView = memo(function JournalView() {
  const [filterMood, setFilterMood] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({ mood: 3, tags: [], diary: '', sleep: 7 });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, entryId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { success, error } = useToast();

  const allEntries = useLiveQuery(async () => {
    let collection = db.moods.orderBy('timestamp').reverse();
    
    if (filterMood || filterTag) {
      // Need JS filtering if multiple complex filters apply, 
      // but at least we can do it after fetching if Dexie filters are too complex,
      // However, we can use filter function directly in DB
      collection = collection.filter(entry => {
        if (filterMood && Math.round(entry.mood) !== filterMood) return false;
        if (filterTag && (!entry.tags || !entry.tags.includes(filterTag))) return false;
        return true;
      });
    }
    
    return await collection.toArray();
  }, [filterMood, filterTag]);

  const entries = useMemo(() => allEntries || [], [allEntries]);

  const customTagsSettings = useLiveQuery(() => db.settings.get('customTags'));
  const customTags = useMemo(() => customTagsSettings?.value || [], [customTagsSettings]);
  const allTags = useMemo(() => [...CONTEXT_TAGS, ...customTags], [customTags]);

  const getContextLabel = useCallback((id) => {
    const tag = allTags.find((t) => t.id === id);
    return tag ? tag.label : id;
  }, [allTags]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterMood, filterTag]);

  const totalPages = Math.max(1, Math.ceil(entries.length / itemsPerPage));
  
  // Ensure we don't stay on a page that no longer exists after deleting
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const visibleEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return entries.slice(startIndex, startIndex + itemsPerPage);
  }, [entries, currentPage]);

  const handleDeleteClick = useCallback((id) => {
    setDeleteModal({ isOpen: true, entryId: id });
  }, []);

  const handleConfirmDelete = async () => {
    const id = deleteModal.entryId;
    if (!id) return;
    try {
      await db.moods.delete(id);
      success('Záznam smazán');
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      error('Nepodařilo se smazat záznam');
    }
    setDeleteModal({ isOpen: false, entryId: null });
  };

  const startEdit = useCallback((entry) => {
    setEditingEntry(entry);
    setEditForm({ mood: entry.mood, tags: entry.tags || [], diary: entry.diary || '', sleep: entry.sleep || 7 });
  }, []);

  const handleUpdate = async () => {
    if (!editingEntry) return;
    try {
      const { updateMoodEntry } = await import('../../utils/storage');
      await updateMoodEntry(editingEntry.id, {
        mood: editForm.mood,
        tags: editForm.tags,
        diary: editForm.diary,
        sleep: editForm.sleep,
      });
      setEditingEntry(null);
      success('Záznam aktualizován');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update entry:', err);
      error('Nepodařilo se aktualizovat záznam');
    }
  };

  if (allEntries === undefined) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Animated header */}
      <motion.div
        variants={variants.slideUp}
        initial="hidden"
        animate="show"
        className="mb-10 text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Tvůj Deník</h2>
        <p className="text-white/60 text-lg">Všechny tvé myšlenky a pocity na jednom místě</p>
      </motion.div>

      <motion.div
        variants={variants.fadeIn}
        initial="hidden"
        animate="show"
      >
        <JournalFilters
          filterMood={filterMood}
          setFilterMood={setFilterMood}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          allTags={allTags}
        />
      </motion.div>

      <JournalTimeline
        entries={visibleEntries}
        filterMood={filterMood}
        filterTag={filterTag}
        onEdit={startEdit}
        onDelete={handleDeleteClick}
        getContextLabel={getContextLabel}
      />

      {totalPages > 1 && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="flex justify-center items-center gap-2 mt-6 mb-8"
        >
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => {
                  setCurrentPage(pageNumber);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${
                  currentPage === pageNumber
                    ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </motion.div>
      )}

      <JournalEditor
        editingEntry={editingEntry}
        setEditingEntry={setEditingEntry}
        editForm={editForm}
        setEditForm={setEditForm}
        handleUpdate={handleUpdate}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Smazat záznam"
        message="Opravdu chceš tento záznam nenávratně smazat?"
        isDangerous={true}
      />
    </div>
  );
});

export default JournalView;
