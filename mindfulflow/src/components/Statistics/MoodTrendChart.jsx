import { memo, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { MOOD_LABELS, MOOD_COLORS } from '../../utils/moodCalculations';
import { springConfigFast } from '../../utils/animations';

const EMPTY = [];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const moodColor = MOOD_COLORS[data.mood]?.primary || '#8b5cf6';
    
    return (
      <div className="glass-strong p-3 rounded-xl border border-white/20 shadow-xl backdrop-blur-md">
        <p className="text-white/60 text-xs mb-1">{data.fullDate}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColor }} />
          <p className="text-white font-bold">{data.moodLabel}</p>
          <span className="text-white/40 text-xs">({data.mood}/5)</span>
        </div>
        {data.note && (
          <p className="text-white/80 text-sm max-w-[200px] mt-2 italic border-t border-white/10 pt-2">
            "{data.note}"
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomActiveDot = ({ cx, cy, payload }) => {
  if (!payload) return null;
  const color = MOOD_COLORS[payload.mood]?.primary || '#8b5cf6';
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={5} 
      fill={color} 
      stroke="rgba(255,255,255,0.8)" 
      strokeWidth={2} 
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    />
  );
};

/**
 * Mood Trend Chart
 * Visualizes mood history with a smooth area chart
 */
const MoodTrendChart = memo(function MoodTrendChart({ data }) {
  const reducedMotion = useReducedMotion();
  const safeData = data ?? EMPTY;

  // Format data for chart (memoized to avoid expensive date formatting on every render)
  const chartData = useMemo(() => {
    return safeData.map((entry) => ({
      ...entry,
      date: new Date(entry.timestamp).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' }),
      fullDate: new Date(entry.timestamp).toLocaleString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      moodLabel: MOOD_LABELS[entry.mood],
    }));
  }, [safeData]);

  if (chartData.length === 0) return null;

  // Recharts animations are CPU-expensive on weaker devices; keep them subtle and data-size aware
  const shouldAnimate = !reducedMotion && chartData.length <= 60;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass p-4 sm:p-6 rounded-[2rem] border-none h-[400px] w-full"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Vývoj Nálady</h3>
          <p className="text-white/50 text-sm">Tvoje emoční křivka v čase</p>
        </div>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={[1, 5]} 
              ticks={[1, 2, 3, 4, 5]}
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip 
              content={CustomTooltip} 
              cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '5 5' }} 
              isAnimationActive={false}
            />
            <Area 
              type="monotone" 
              dataKey="mood" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMood)" 
              dot={false}
              activeDot={<CustomActiveDot />}
              isAnimationActive={shouldAnimate}
              animationDuration={shouldAnimate ? 650 : 0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export default MoodTrendChart;
