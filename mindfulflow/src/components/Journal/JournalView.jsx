import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/db';
import { CONTEXT_TAGS } from '../../utils/moodConstants';
import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { updateMoodEntry } from '../../utils/storage';
import JournalFilters from './JournalFilters';
import JournalTimeline from './JournalTimeline';
import JournalEditor from './JournalEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { variants } from '../../utils/animations';
import ConfirmModal from '../common/ConfirmModal';

function SkeletonCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay }}
      className="rounded-[2rem] border border-white/8 bg-white/4 p-5 sm:p-6"
    >
      <div className="flex gap-4 items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex gap-3 items-center">
            <div className="h-6 w-20 bg-white/8 rounded-full animate-pulse" />
            <div className="h-4 w-36 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
          <div className="h-4 w-3/4 bg-white/4 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-white/4 rounded-lg animate-pulse" style={{ animationDelay: '0.25s' }} />
            <div className="h-6 w-20 bg-white/4 rounded-lg animate-pulse" style={{ animationDelay: '0.28s' }} />
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/8 shrink-0 animate-pulse" />
      </div>
    </motion.div>
  );
}

const JournalView = memo(function JournalView() {
  const [filterMood, setFilterMood] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({ mood: 3, tags: [], diary: '', sleep: 7 });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, entryId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { success, error } = useToast();

  // Load ALL entries once — filtering happens in JS so filters never cause
  // a useLiveQuery re-run (which would make allEntries go undefined → flash)
  const allEntries = useLiveQuery(
    () => db.moods.orderBy('timestamp').reverse().toArray()
  );

  const customTagsSettings = useLiveQuery(() => db.settings.get('customTags'));
  const customTags = useMemo(() => customTagsSettings?.value || [], [customTagsSettings]);
  const allTags = useMemo(() => [...CONTEXT_TAGS, ...customTags], [customTags]);

  const getContextLabel = useCallback(
    (id) => {
      const tag = allTags.find((t) => t.id === id);
      return tag ? tag.label : id;
    },
    [allTags]
  );

  // All filtering is pure JS — instant, no async flash
  const entries = useMemo(() => {
    if (!allEntries) return [];
    const q = searchQuery.trim().toLowerCase();
    return allEntries.filter((entry) => {
      if (filterMood && Math.round(entry.mood) !== filterMood) return false;
      if (filterTag && (!entry.tags || !entry.tags.includes(filterTag))) return false;
      if (q) {
        const inDiary = entry.diary && entry.diary.toLowerCase().includes(q);
        const inTags = entry.tags && entry.tags.some((t) => {
          const label = allTags.find((tag) => tag.id === t)?.label || t;
          return label.toLowerCase().includes(q);
        });
        if (!inDiary && !inTags) return false;
      }
      return true;
    });
  }, [allEntries, filterMood, filterTag, searchQuery, allTags]);

  // Reset to page 1 on any filter change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [filterMood, filterTag, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(entries.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const visibleEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return entries.slice(start, start + itemsPerPage);
  }, [entries, currentPage]);

  const handleDeleteClick = useCallback((id) => {
    setDeleteModal({ isOpen: true, entryId: id });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
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
  }, [deleteModal.entryId, success, error]);

  const startEdit = useCallback((entry) => {
    setEditingEntry(entry);
    setEditForm({
      mood: entry.mood,
      tags: entry.tags || [],
      diary: entry.diary || '',
      sleep: entry.sleep || 7,
    });
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!editingEntry) return;
    try {
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
  }, [editingEntry, editForm, success, error]);

  // True initial load only (allEntries never goes undefined again after first resolve)
  const isInitialLoad = allEntries === undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Header */}
      <motion.div
        variants={variants.slideUp}
        initial="hidden"
        animate="show"
        className="mb-8 text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Tvůj Deník</h2>
        <p className="text-white/60 text-lg">Všechny tvé myšlenky a pocity na jednom místě</p>
      </motion.div>

      <motion.div variants={variants.fadeIn} initial="hidden" animate="show">
        <JournalFilters
          filterMood={filterMood}
          setFilterMood={setFilterMood}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          allTags={allTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </motion.div>

      {/* Entry count */}
      <AnimatePresence mode="wait">
        {!isInitialLoad && (
          <motion.div
            key="count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="mb-5 flex items-center gap-2"
          >
            <span className="text-sm text-white/40">
              {entries.length === 0
                ? 'Žádné záznamy'
                : entries.length === 1
                ? '1 záznam'
                : entries.length >= 2 && entries.length <= 4
                ? `${entries.length} záznamy`
                : `${entries.length} záznamů`}
            </span>
            {(filterMood || filterTag || searchQuery) && allEntries && (
              <span className="text-xs text-white/25">z {allEntries.length} celkem</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {isInitialLoad ? (
        <div className="space-y-4">
          <SkeletonCard delay={0} />
          <SkeletonCard delay={0.05} />
          <SkeletonCard delay={0.1} />
        </div>
      ) : (
        <JournalTimeline
          entries={visibleEntries}
          allEntriesCount={allEntries?.length ?? 0}
          filterMood={filterMood}
          filterTag={filterTag}
          searchQuery={searchQuery}
          onEdit={startEdit}
          onDelete={handleDeleteClick}
          getContextLabel={getContextLabel}
        />
      )}

      {/* Pagination */}
      {!isInitialLoad && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center gap-1.5 mt-6 mb-8 flex-wrap"
        >
          {/* Prev button */}
          <button
            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl font-medium transition-colors bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Předchozí stránka"
          >
            ‹
          </button>

          {(() => {
            const pages = [];
            const addPage = (p) => pages.push(
              <button
                key={p}
                onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                  currentPage === p
                    ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {p}
              </button>
            );
            const addEllipsis = (key) => pages.push(
              <span key={key} className="w-10 h-10 flex items-center justify-center text-white/30 text-lg">…</span>
            );

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) addPage(i);
            } else {
              addPage(1);
              if (currentPage > 3) addEllipsis('start');
              for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) addPage(i);
              if (currentPage < totalPages - 2) addEllipsis('end');
              addPage(totalPages);
            }
            return pages;
          })()}

          {/* Next button */}
          <button
            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl font-medium transition-colors bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Další stránka"
          >
            ›
          </button>
        </motion.div>
      )}

      <JournalEditor
        editingEntry={editingEntry}
        setEditingEntry={setEditingEntry}
        editForm={editForm}
        setEditForm={setEditForm}
        handleUpdate={handleUpdate}
        allTags={allTags}
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
