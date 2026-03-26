import { memo, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import { MOOD_LABELS } from '../../utils/moodConstants';

const MOOD_BG = {
  1: 'rgba(239,68,68,0.75)',
  2: 'rgba(245,158,11,0.75)',
  3: 'rgba(148,163,184,0.65)',
  4: 'rgba(16,185,129,0.75)',
  5: 'rgba(139,92,246,0.85)',
};

const MONTH_NAMES = [
  'Leden','Únor','Březen','Duben','Květen','Červen',
  'Červenec','Srpen','Září','Říjen','Listopad','Prosinec',
];

const DAY_NAMES = ['Po','Út','St','Čt','Pá','So','Ne'];

function buildGrid(year, month, heatmapData) {
  const firstDay = new Date(year, month, 1);
  // Monday-based: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cell = heatmapData.get(key) || null;
    cells.push({ day: d, key, cell });
  }

  return cells;
}

const HeatmapCalendar = memo(function HeatmapCalendar({ heatmapData }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [hovered, setHovered] = useState(null);

  const grid = useMemo(
    () => buildGrid(viewYear, viewMonth, heatmapData),
    [viewYear, viewMonth, heatmapData]
  );

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <GlassCard className="p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Kalendář nálad</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Předchozí měsíc"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-white/80 text-sm font-medium px-1 min-w-[110px] text-center">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Další měsíc"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 mb-1.5">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-white/30 text-[10px] font-medium py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map((item, i) => {
          if (!item) return <div key={`empty-${i}`} />;

          const { day, key, cell } = item;
          const isToday = key === todayKey;
          const avgRounded = cell ? Math.round(cell.average) : null;
          const bg = avgRounded ? MOOD_BG[avgRounded] : 'rgba(255,255,255,0.04)';

          return (
            <div
              key={key}
              onMouseEnter={() => cell && setHovered({ key, cell, day })}
              onMouseLeave={() => setHovered(null)}
              className="relative aspect-square rounded-md flex items-center justify-center cursor-default select-none"
              style={{
                background: bg,
                outline: isToday ? '2px solid rgba(139,92,246,0.7)' : 'none',
                transition: 'background 150ms',
              }}
            >
              <span
                className="text-[10px] sm:text-xs font-medium"
                style={{ color: cell ? '#fff' : 'rgba(255,255,255,0.35)' }}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hover info */}
      <div className="mt-3 h-8 flex items-center">
        {hovered ? (
          <div className="text-xs text-white/70">
            <span className="text-white/40">{hovered.day}. {MONTH_NAMES[viewMonth]}: </span>
            <span className="text-white font-medium">
              {MOOD_LABELS[Math.round(hovered.cell.average)]}
            </span>
            <span className="text-white/40 ml-1">
              ({hovered.cell.average}/5 · {hovered.cell.count} {hovered.cell.count === 1 ? 'záznam' : hovered.cell.count < 5 ? 'záznamy' : 'záznamů'})
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/25">Najeď na den pro detail</div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((m) => (
          <div key={m} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: MOOD_BG[m] }} />
            <span className="text-white/40 text-[10px]">{MOOD_LABELS[m]}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
});

export default HeatmapCalendar;
