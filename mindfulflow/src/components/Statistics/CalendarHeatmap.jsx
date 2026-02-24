import { motion, useReducedMotion } from 'framer-motion';
import { memo, useMemo } from 'react';
import { MOOD_COLORS } from '../../utils/moodCalculations';
import { springConfigFast } from '../../utils/animations';

const EMPTY = [];

/**
 * Calendar Heatmap
 * GitHub-style contribution graph for mood
 * Shows last 365 days or current year
 */
const CalendarHeatmap = memo(function CalendarHeatmap({ data }) {
  const reducedMotion = useReducedMotion();
  const safeData = data ?? EMPTY;

  // Optimize data lookups with a Map - O(1) instead of O(n) per cell
  const dataMap = useMemo(() => {
    const map = new Map();
    safeData.forEach(entry => {
      const dateKey = new Date(entry.timestamp).toDateString();
      map.set(dateKey, entry);
    });
    return map;
  }, [safeData]);

  // Generate last 52 weeks of dates
  const weeks = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // roughly 1 year back

    // Adjust start date to previous Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeksArray = [];
    let currentDate = new Date(startDate);
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeksArray.push(week);
    }
    return weeksArray;
  }, []);

  // Helper to get color for a date - now O(1)
  const getColorForDate = (date) => {
    const entry = dataMap.get(date.toDateString());
    if (!entry) return 'rgba(255,255,255,0.05)';
    return MOOD_COLORS[entry.mood]?.primary || 'rgba(255,255,255,0.1)';
  };
  
  const getTitleForDate = (date) => {
    const entry = dataMap.get(date.toDateString());
    const dateStr = date.toLocaleDateString('cs-CZ');
    return entry ? `${dateStr}: Nálada ${entry.mood}/5` : `${dateStr}: Žádný záznam`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reducedMotion ? { duration: 0 } : springConfigFast}
      className="glass p-4 sm:p-6 rounded-[2rem] !border-transparent lg:col-span-2 overflow-hidden"
    >
      <h3 className="text-lg font-bold text-white mb-4">Roční Přehled</h3>
      
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-[3px] min-w-max">
          {weeks.map((week, wIndex) => (
            <div key={`week-${wIndex}`} className="flex flex-col gap-[3px]">
              {week.map((date, dIndex) => {
                 const color = getColorForDate(date);
                 return (
                  <div 
                    key={`day-${wIndex}-${dIndex}`}
                    className="w-3 h-3 rounded-[2px] transition-all duration-300 hover:scale-150 relative group"
                    style={{ backgroundColor: color }}
                    title={getTitleForDate(date)}
                  >
                     {/* Tooltip on hover (CSS only for perf) */}
                  </div>
                 );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-2 mt-4 text-xs text-white/40">
        <span>Méně</span>
        <div className="w-3 h-3 rounded-[2px] bg-white/5" />
        <div className="w-3 h-3 rounded-[2px] bg-indigo-900" />
        <div className="w-3 h-3 rounded-[2px] bg-indigo-600" />
        <div className="w-3 h-3 rounded-[2px] bg-indigo-400" />
        <div className="w-3 h-3 rounded-[2px] bg-indigo-200" />
        <span>Více</span>
      </div>
    </motion.div>
  );
});

export default CalendarHeatmap;
