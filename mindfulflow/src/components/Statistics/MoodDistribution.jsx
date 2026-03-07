import { memo, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { MOOD_LABELS, MOOD_COLORS } from '../../utils/moodConstants';
import { springConfigFast } from '../../utils/animations';

const EMPTY = [];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-3 rounded-xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-md shadow-glass-lg text-xs ring-1 ring-white/5">
        <p className="font-bold text-white mb-1">{data.name}</p>
        <p className="text-white/70">{data.value} záznamů</p>
      </div>
    );
  }
  return null;
};

const legendFormatter = (value) => (
  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{value}</span>
);

/**
 * Mood Distribution Chart
 * Visualizes the breakdown of moods using a Pie Chart
 */
const MoodDistribution = memo(function MoodDistribution({ data }) {
  const reducedMotion = useReducedMotion();
  const safeData = data ?? EMPTY;

  const chartData = useMemo(() => {
    // Aggregate data by mood
    const moodCounts = safeData.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(moodCounts).map((mood) => ({
      name: MOOD_LABELS[mood],
      value: moodCounts[mood],
      mood: parseInt(mood, 10),
      color: MOOD_COLORS[mood]?.primary || '#8b5cf6',
    }));
  }, [safeData]);

  if (chartData.length === 0) return null;

  const shouldAnimate = !reducedMotion && chartData.length <= 10;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springConfigFast}
      className="glass-card p-5 sm:p-6 rounded-[2rem] border border-white/10 ring-1 ring-white/5 backdrop-blur-xl bg-[#0f172a]/40 shadow-glass-lg h-[350px] flex flex-col relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[2rem]" />
      <h3 className="text-lg font-bold text-white mb-4 relative z-10">Rozložení Nálad</h3>
      
      <div className="flex-1 w-full min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
              isAnimationActive={shouldAnimate}
              animationDuration={shouldAnimate ? 500 : 0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={legendFormatter}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export default MoodDistribution;
