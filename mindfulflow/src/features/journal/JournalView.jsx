import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/db';
import { CONTEXT_TAGS } from '../../utils/moodConstants';
import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { useMoodEntriesCount, useMoodEntriesPage } from '../../utils/queries';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { devError } from '../../utils/devLog';
import { useToast } from '../../context/ToastContext';
import { updateMoodEntry } from '../../utils/storage';
import JournalFilters from './JournalFilters';
import JournalTimeline from './JournalTimeline';
import JournalEditor from './JournalEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { variants } from '../../utils/animations';
import ConfirmModal from '../../components/common/ConfirmModal';

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
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 280);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({ mood: 3, tags: [], diary: '', sleep: 7 });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, entryId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { success, error } = useToast();

  const customTagsSettings = useLiveQuery(() => db.settings.get('customTags'));
  const customTags = useMemo(() => customTagsSettings?.value || [], [customTagsSettings]);
  const allTags = useMemo(() => [...CONTEXT_TAGS, ...customTags], [customTags]);
  const normalizedSearchQuery = useMemo(
    () => debouncedSearch.trim().toLowerCase(),
    [debouncedSearch]
  );
  const tagLabelsById = useMemo(
    () =>
      Object.fromEntries(
        allTags.map((tag) => [tag.id, String(tag.label || tag.id).toLowerCase()])
      ),
    [allTags]
  );

  const getContextLabel = useCallback(
    (id) => {
      const tag = allTags.find((t) => t.id === id);
      return tag ? tag.label : id;
    },
    [allTags]
  );

  const matchesJournalFilters = useCallback((entry) => {
    if (filterMood && Math.round(entry.mood) !== filterMood) return false;
    if (filterTag && (!entry.tags || !entry.tags.includes(filterTag))) return false;

    if (normalizedSearchQuery) {
      const inDiary = entry.diary?.toLowerCase().includes(normalizedSearchQuery);
      const inTags = entry.tags?.some((tagId) =>
        (tagLabelsById[tagId] || String(tagId).toLowerCase()).includes(normalizedSearchQuery)
      );

      if (!inDiary && !inTags) return false;
    }

    return true;
  }, [filterMood, filterTag, normalizedSearchQuery, tagLabelsById]);

  const pageOffset = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
  const pageQuery = useMemo(
    () => ({
      reverse: true,
      limit: itemsPerPage,
      offset: pageOffset,
      filter: matchesJournalFilters,
    }),
    [itemsPerPage, pageOffset, matchesJournalFilters]
  );

  const paginatedEntries = useMoodEntriesPage(pageQuery, [matchesJournalFilters]);
  const filteredEntriesCount = useMoodEntriesCount({ filter: matchesJournalFilters }, [matchesJournalFilters]);
  const allEntriesCount = useMoodEntriesCount();

  // Reset to page 1 on any filter change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [filterMood, filterTag, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil((filteredEntriesCount || 0) / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const visibleEntries = paginatedEntries?.entries || [];

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
      devError(err);
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
      devError('Failed to update entry:', err);
      error('Nepodařilo se aktualizovat záznam');
    }
  }, [editingEntry, editForm, success, error]);

  const isInitialLoad =
    paginatedEntries === undefined ||
    filteredEntriesCount === undefined ||
    allEntriesCount === undefined;

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
          searchQuery={searchInput}
          setSearchQuery={setSearchInput}
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
              {filteredEntriesCount === 0
                ? 'Žádné záznamy'
                : filteredEntriesCount === 1
                ? '1 záznam'
                : filteredEntriesCount >= 2 && filteredEntriesCount <= 4
                ? `${filteredEntriesCount} záznamy`
                : `${filteredEntriesCount} záznamů`}
            </span>
            {(filterMood || filterTag || searchInput) && allEntriesCount !== undefined && (
              <span className="text-xs text-white/25">z {allEntriesCount} celkem</span>
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
          allEntriesCount={allEntriesCount ?? 0}
          filterMood={filterMood}
          filterTag={filterTag}
          searchQuery={searchInput}
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
