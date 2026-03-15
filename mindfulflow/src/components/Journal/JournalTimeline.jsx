import { AnimatePresence, motion } from 'framer-motion';
import { memo, useMemo } from 'react';

import JournalCard from './JournalCard';
import { MessageSquare } from 'lucide-react';

// Easing used for all list entrances: fast out, smooth settle (quintic-out feel)
const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_IN  = [0.55, 0, 1, 0.45];

function getDateLabel(timestamp) {
  const date = new Date(timestamp);
  const now  = new Date();

  const startOfToday     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  if (date >= startOfToday)     return 'Dnes';
  if (date >= startOfYesterday) return 'Včera';
  if (date >= startOfWeek) {
    return date.toLocaleDateString('cs-CZ', { weekday: 'long' });
  }
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

function groupEntriesByDate(entries) {
  const groups = [];
  let currentLabel = null;
  let currentGroup = [];

  for (const entry of entries) {
    const label = getDateLabel(entry.timestamp);
    if (label !== currentLabel) {
      if (currentGroup.length > 0) groups.push({ label: currentLabel, entries: currentGroup });
      currentLabel = label;
      currentGroup = [entry];
    } else {
      currentGroup.push(entry);
    }
  }
  if (currentGroup.length > 0) groups.push({ label: currentLabel, entries: currentGroup });
  return groups;
}

// Pre-assign a global stagger index to every card across all groups
function assignGlobalIndices(groups) {
  let idx = 0;
  return groups.map((group) => ({
    ...group,
    entries: group.entries.map((entry) => ({ entry, idx: idx++ })),
  }));
}

const JournalTimeline = memo(function JournalTimeline({
  entries,
  filterMood,
  filterTag,
  searchQuery,
  onEdit,
  onDelete,
  getContextLabel,
}) {
  const groups        = useMemo(() => groupEntriesByDate(entries), [entries]);
  const indexedGroups = useMemo(() => assignGlobalIndices(groups), [groups]);

  /* ─── Empty State ──────────────────────────────────────────────────── */
  if (entries.length === 0) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
        className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5 relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.3, ease: EASE_OUT }}
          className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/20"
        >
          <MessageSquare className="w-10 h-10 text-white/50" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.25, ease: EASE_OUT }}
          className="text-2xl font-bold text-white mb-3 tracking-tight"
        >
          {filterMood || filterTag || searchQuery ? 'Žádné záznamy nenalezeny' : 'Zatím je tu ticho'}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.25, ease: EASE_OUT }}
          className="text-white/50 max-w-md mx-auto leading-relaxed px-6"
        >
          {filterMood || filterTag || searchQuery
            ? 'Zkus upravit filtry nebo vyhledávání.'
            : 'Tvůj deník čeká na první příběh. Až si zapíšeš svůj první Check-In, objeví se tady.'}
        </motion.p>
      </motion.div>
    );
  }

  /* ─── List ─────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-8 pb-20">
      {indexedGroups.map((group, groupIdx) => (
        <div key={group.label}>
          {/* Date group header — fades in slightly before its cards */}
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
              duration: 0.2,
              ease: EASE_OUT,
              delay: group.entries[0]
                ? Math.min(group.entries[0].idx, 6) * 0.03
                : groupIdx * 0.04,
            }}
            className="flex items-center gap-3 mb-4 px-1"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/40 first-letter:capitalize">
              {group.label}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          {/* Cards */}
          <div className="space-y-3">
            <AnimatePresence mode="sync">
              {group.entries.map(({ entry, idx }) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_IN } }}
                  transition={{
                    duration: 0.2,
                    ease: EASE_OUT,
                    delay: Math.min(idx, 6) * 0.03,
                  }}
                >
                  <JournalCard
                    entry={entry}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    getContextLabel={getContextLabel}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
});

export default JournalTimeline;
