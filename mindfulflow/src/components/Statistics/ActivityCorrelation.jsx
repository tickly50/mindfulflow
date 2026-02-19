import { memo, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { MOOD_COLORS } from '../../utils/moodCalculations';
import { calculateActivityStats } from '../../utils/moodCalculations';
import { springConfigFast } from '../../utils/animations';

const EMPTY = [];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-strong p-3 rounded-xl border border-white/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{/** icon placeholder */}</span>
          <p className="font-bold text-white">{data.label}</p>
        </div>
        <p className="text-white/60 text-sm">Průměrná nálada: <span className="text-white font-bold">{data.average}</span></p>
        <p className="text-white/40 text-xs">{data.count} záznamů</p>
      </div>
    );
  }
  return null;
};

/**
 * Activity Correlation Chart
 * Shows which activities are associated with better/worse moods
 */
const ActivityCorrelation = memo(function ActivityCorrelation({ data }) {
  const reducedMotion = useReducedMotion();
  const safeData = data ?? EMPTY;

  const chartData = useMemo(() => {
    const activityStats = calculateActivityStats(safeData);
    // Take top 8 most frequent activities
    return activityStats.slice(0, 8);
  }, [safeData]);

  if (chartData.length === 0) return null;

  const shouldAnimate = !reducedMotion && chartData.length <= 10;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass p-4 sm:p-6 rounded-[2rem] border-none h-[350px] flex flex-col"
    >
      <h3 className="text-lg font-bold text-white mb-1">Vliv Aktivit</h3>
      <p className="text-white/40 text-xs mb-4">Co ti dělá největší radost?</p>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" domain={[0, 5]} hide />
            <YAxis 
              dataKey="label" 
              type="category" 
              width={80} 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={CustomTooltip} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar
              dataKey="average"
              radius={[0, 4, 4, 0]}
              barSize={20}
              isAnimationActive={shouldAnimate}
              animationDuration={shouldAnimate ? 450 : 0}
            >
              {chartData.map((entry, index) => {
                 const moodColor = MOOD_COLORS[Math.round(entry.average)]?.primary || '#8b5cf6';
                 return <Cell key={`cell-${index}`} fill={moodColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export default ActivityCorrelation;
