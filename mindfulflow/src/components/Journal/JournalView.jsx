import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/db';
import { CONTEXT_TAGS } from '../../utils/moodCalculations';
import { useState, useMemo, memo } from 'react';
import { useToast } from '../../context/ToastContext';
import JournalFilters from './JournalFilters';
import JournalTimeline from './JournalTimeline';
import JournalEditor from './JournalEditor';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../common/ConfirmModal';

const JournalView = memo(function JournalView() {
  const [filterMood, setFilterMood] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({ mood: 3, tags: [], diary: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, entryId: null });
  const { success, error } = useToast();

  // Fetch all entries
  const allEntries = useLiveQuery(() => db.moods.toArray(), []);

  // Fetch custom tags
  const customTagsSettings = useLiveQuery(() => db.settings.get('customTags'));
  
  // Memoized lists & helpers
  const customTags = useMemo(() => customTagsSettings?.value || [], [customTagsSettings]);
  const allTags = useMemo(() => [...CONTEXT_TAGS, ...customTags], [customTags]);

  const getContextLabel = (id) => {
    const tag = allTags.find(t => t.id === id);
    return tag ? tag.label : id;
  };

  const entries = useMemo(() => {
    if (!allEntries) return [];
    // Sort by timestamp descending (newest first)
    const sorted = [...allEntries].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;
      return dateB - dateA;
    });

    return sorted.filter(entry => {
      // Mood Filter
      if (filterMood && Math.round(entry.mood) !== filterMood) return false;
      
      // Tag Filter
      if (filterTag && (!entry.tags || !entry.tags.includes(filterTag))) return false;
      
      return true;
    });
  }, [allEntries, filterMood, filterTag]);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, entryId: id });
  };

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

  const startEdit = (entry) => {
    setEditingEntry(entry);
    setEditForm({
      mood: entry.mood,
      tags: entry.tags || [],
      diary: entry.diary || ''
    });
  };

  const handleUpdate = async () => {
    if (!editingEntry) return;
    
    try {
      const { updateMoodEntry } = await import('../../utils/storage');
      await updateMoodEntry(editingEntry.id, {
        mood: editForm.mood,
        tags: editForm.tags,
        diary: editForm.diary
      });
      setEditingEntry(null);
      success('Záznam aktualizován');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update entry:', err);
      error('Nepodařilo se aktualizovat záznam');
    }
  };

  if (!entries) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Tvůj Deník</h2>
        <p className="text-white/60 text-lg">Všechny tvé myšlenky a pocity na jednom místě</p>
      </div>

      <JournalFilters 
        filterMood={filterMood}
        setFilterMood={setFilterMood}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        allTags={allTags}
      />

      <JournalTimeline 
        entries={entries}
        filterMood={filterMood}
        filterTag={filterTag}
        onEdit={startEdit}
        onDelete={handleDeleteClick}
        getContextLabel={getContextLabel}
      />

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
