import { memo } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/common/GlassCard';
import { MOOD_COLORS, MOOD_LABELS } from '../../utils/moodConstants';
import { Clock, Tag, Pencil, Trash2, Calendar, Moon } from 'lucide-react';

const formatDate = (date) =>
  date.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' });

const JournalCard = memo(function JournalCard({ entry, onEdit, onDelete, getContextLabel }) {
  const moodColor = MOOD_COLORS[Math.round(entry.mood)] || MOOD_COLORS[3];
  const date = new Date(entry.timestamp);

  return (
    /*
     * Hover lift: CSS transform only (GPU-composited, zero JS overhead).
     * The -translate-y-0.5 (-2px) gives a subtle but satisfying lift.
     * Shadow transition makes the card feel like it's rising off the page.
     */
    <div className="group -translate-y-0 hover:-translate-y-0.5 transition-[transform] duration-200 ease-out">
      <GlassCard
        className={`
          p-5 sm:p-6
          border-white/10 hover:border-white/20
          shadow-[0_2px_16px_rgba(0,0,0,0.2)]
          hover:shadow-[0_8px_32px_rgba(139,92,246,0.12),0_4px_16px_rgba(0,0,0,0.25)]
          transition-[border-color,box-shadow] duration-200
        `}
      >
        <div className="flex gap-3 sm:gap-6 items-start justify-between">

          {/* ── Main Content ─────────────────────────────────────────── */}
          <div className="flex-1 space-y-3 min-w-0">

            {/* Badge + timestamp row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span
                className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 bg-white/5 items-center justify-center shrink-0"
                style={{ color: moodColor.text }}
              >
                {MOOD_LABELS[Math.round(entry.mood)]}
              </span>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/45 text-[13px] sm:text-sm">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="capitalize">{formatDate(date)}</span>
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5" />
                  {date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {typeof entry.sleep === 'number' && (
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Moon className="w-3.5 h-3.5" />
                    {entry.sleep}h
                  </span>
                )}
              </div>
            </div>

            {/* Diary text */}
            {entry.diary && (
              <p className="text-white/85 text-[15px] sm:text-base leading-relaxed font-serif italic pl-4 border-l-2 border-white/15 break-words">
                {entry.diary}
              </p>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((ctxId) => (
                  <span
                    key={ctxId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs text-white/50"
                  >
                    <Tag className="w-3 h-3 opacity-40" />
                    {getContextLabel(ctxId)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Right column: mood badge + actions ───────────────────── */}
          <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">

            {/* Mood badge */}
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold ring-1 ring-white/10 relative"
              style={{ background: moodColor.gradient }}
            >
              {Math.round(entry.mood)}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />
            </div>

            {/* Edit / Delete — always visible on mobile, fade in on desktop hover */}
            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
              <motion.button
                whileTap={{ scale: 0.85, transition: { duration: 0.1 } }}
                onClick={() => onEdit(entry)}
                aria-label="Upravit záznam"
                className="p-3.5 sm:p-2.5 text-white/45 hover:text-violet-300 hover:bg-violet-500/10 rounded-full transition-colors duration-150"
              >
                <Pencil className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85, transition: { duration: 0.1 } }}
                onClick={() => onDelete(entry.id)}
                aria-label="Smazat záznam"
                className="p-3.5 sm:p-2.5 text-white/45 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors duration-150"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
});

export default JournalCard;
