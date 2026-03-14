import { useMemo, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOOD_COLORS, MOOD_LABELS } from '../../utils/moodConstants';
import { getTags } from '../../utils/moodCalculations';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const formatDate = (date) => {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const MONTH_NAMES = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

const DAY_NAMES = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

// ─── Single memoized cell ─────────────────────────────────────────────────────
// Receives stable `onEnter` / `onLeave` callbacks so it never re-renders when
// a different cell is hovered — only the cell whose data changed will re-render.
const CalendarCell = memo(function CalendarCell({ date, dateStr, dayData, isToday, onEnter, onLeave }) {
  return (
    <div
      className="relative aspect-square"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
    >
      <motion.div
        whileHover={{ scale: 1.1, zIndex: 10 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full h-full rounded-md sm:rounded-lg transition-colors duration-300 flex items-center justify-center relative cursor-default transform-gpu ${
          dayData ? '' : 'bg-white/5 hover:bg-white/10'
        }`}
        style={dayData ? {
          background: MOOD_COLORS[dayData.average]?.gradient || '#333',
          boxShadow: `0 0 15px ${MOOD_COLORS[dayData.average]?.primary}40`,
          border: isToday ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.1)',
          willChange: 'transform',
        } : {
          border: isToday ? '2px solid rgba(255,255,255,0.4)' : undefined,
          willChange: 'transform',
        }}
      >
        <span className={`text-[11px] sm:text-xs font-bold drop-shadow-md ${
          dayData ? 'text-white' : (isToday ? 'text-white/80' : 'text-white/60')
        }`}>
          {date.getDate()}
        </span>

        {isToday && (
          <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-white animate-pulse shadow-[0_0_6px_white]" />
        )}
      </motion.div>
    </div>
  );
});

// ─── Single shared tooltip ────────────────────────────────────────────────────
const CalendarTooltip = memo(function CalendarTooltip({ hoveredDay }) {
  return (
    <AnimatePresence>
      {hoveredDay && hoveredDay.data && (
        <motion.div
          key={hoveredDay.dateStr}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 pointer-events-none transform-gpu"
          style={{
            bottom: `calc(100% + 8px)`,
            left: hoveredDay.x,
            transform: 'translateX(-50%)',
            willChange: 'transform, opacity',
          }}
        >
          <div className="glass-panel px-5 py-3 rounded-2xl text-center whitespace-nowrap min-w-[140px] bg-[#0f172a]/95 md:backdrop-blur-xl shadow-2xl">
            <p className="text-white/60 text-[10px] sm:text-xs font-medium mb-1 uppercase tracking-widest">
              {hoveredDay.date.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
            <p className="text-white font-black text-lg sm:text-xl drop-shadow-lg" style={{ color: MOOD_COLORS[hoveredDay.data.average]?.text }}>
              {MOOD_LABELS[hoveredDay.data.average]}
            </p>
            <p className="text-white/60 text-[10px] sm:text-xs mt-1.5 font-medium">
              {hoveredDay.data.count}{' '}
              {hoveredDay.data.count === 1 ? 'záznam' : hoveredDay.data.count < 5 ? 'záznamy' : 'záznamů'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────
const MoodCalendar = memo(function MoodCalendar({ entries }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return currentYear === now.getFullYear() && currentMonth === now.getMonth();
  }, [currentYear, currentMonth]);

  // Compute today's date string once per render cycle — not once per cell
  const todayStr = useMemo(() => formatDate(new Date()), []);

  const dateData = useMemo(() => {
    if (!entries) return new Map();

    const entryMap = new Map();
    entries.forEach(e => {
      const dateStr = formatDate(e.timestamp);
      if (!entryMap.has(dateStr)) {
        entryMap.set(dateStr, { sum: 0, count: 0, tags: new Set() });
      }
      const dayData = entryMap.get(dateStr);
      dayData.sum += e.mood;
      dayData.count += 1;
      getTags(e).forEach(tag => dayData.tags.add(tag));
    });

    for (const [, data] of entryMap.entries()) {
      data.average = Math.round(data.sum / data.count);
    }

    return entryMap;
  }, [entries]);

  const prevMonth = useCallback(() => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(currentYear, currentMonth, i));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [currentYear, currentMonth, firstDay, daysInMonth]);

  // Stable clear handler shared by all cells
  const handleLeave = useCallback(() => setHoveredDay(null), []);

  // Build a stable enter handler per cell using useCallback with a key.
  // We pass the handler factory into each CalendarCell via a per-cell stable ref.
  // Because CalendarCell is memo'd and its props (dateStr, dayData, isToday) are
  // stable across hover state changes, cells only re-render when their own data changes.
  const handleEnterFactory = useCallback((dateStr, dayData, date, cellIndex) => {
    // Return a stable reference tied to the cell index (not to hoveredDay state),
    // so changing hoveredDay doesn't invalidate these closures.
    return () => {
      // Compute approximate horizontal centre of this cell for tooltip positioning.
      // cellIndex within the 7-column week row: (cellIndex % 7) + 0.5 columns
      const col = cellIndex % 7;
      const pct = ((col + 0.5) / 7) * 100;
      setHoveredDay({ dateStr, data: dayData, date, x: `${pct}%` });
    };
  }, []);

  return (
    <div className="bg-white/5 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none overflow-hidden" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none overflow-hidden" />

      {/* Header and controls */}
      <div className="flex flex-col items-center mb-6 gap-3 relative z-10 w-full">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Kalendář nálad
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1">
          <button
            aria-label="Předchozí měsíc"
            onClick={prevMonth}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-bold text-sm sm:text-base w-24 text-center text-white select-none tracking-wide">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>

          <button
            aria-label="Další měsíc"
            onClick={nextMonth}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            disabled={isCurrentMonth}
            style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar grid — single tooltip rendered here, not inside each cell */}
      <div className="relative z-10 w-full max-w-[260px] sm:max-w-[280px] mx-auto">
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2">
          {DAY_NAMES.map(day => (
            <div key={day} className="text-center font-bold text-white/60 text-[10px] sm:text-xs uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-7 gap-1 sm:gap-1.5 auto-rows-[30px] sm:auto-rows-[34px]">
          {calendarCells.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} className="opacity-0" />;

            const dateStr = formatDate(date);
            const dayData = dateData.get(dateStr);
            const isToday = todayStr === dateStr;

            return (
              <CalendarCell
                key={dateStr}
                date={date}
                dateStr={dateStr}
                dayData={dayData}
                isToday={isToday}
                onEnter={handleEnterFactory(dateStr, dayData, date, i)}
                onLeave={handleLeave}
              />
            );
          })}

          {/* One tooltip for the entire grid — absolutely positioned relative to the grid */}
          <CalendarTooltip hoveredDay={hoveredDay} />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 text-[10px] sm:text-xs font-medium relative z-10">
        <span className="text-white/60">Zabarvení podle průměrné nálady</span>
        <div className="flex items-center justify-center gap-1.5 glass bg-black/20 rounded-full px-4 py-2">
          {Object.entries(MOOD_COLORS).map(([level, color]) => (
            <div
              key={level}
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-transform hover:scale-125 cursor-help"
              style={{ background: color.gradient, boxShadow: `0 0 6px ${color.primary}50` }}
              title={MOOD_LABELS[level]}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default MoodCalendar;
