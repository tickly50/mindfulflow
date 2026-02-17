import { memo, useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { springConfigFast } from '../../utils/animations';

const EMPTY = [];

/**
 * Time Analysis Chart
 * Visualizes mood by time of day (Morning, Afternoon, Evening, Night)
 */
const TimeAnalysis = memo(function TimeAnalysis({ data }) {
  const reducedMotion = useReducedMotion();
  const safeData = data ?? EMPTY;

  const chartData = useMemo(() => {
    // Buckets
    const timeBuckets = {
      'Ráno (6-11)': { total: 0, count: 0 },
      'Poledne (11-14)': { total: 0, count: 0 },
      'Odpoledne (14-18)': { total: 0, count: 0 },
      'Večer (18-22)': { total: 0, count: 0 },
      'Noc (22-6)': { total: 0, count: 0 },
    };

    safeData.forEach((entry) => {
      const hour = new Date(entry.timestamp).getHours();
      let bucket = 'Noc (22-6)';

      if (hour >= 6 && hour < 11) bucket = 'Ráno (6-11)';
      else if (hour >= 11 && hour < 14) bucket = 'Poledne (11-14)';
      else if (hour >= 14 && hour < 18) bucket = 'Odpoledne (14-18)';
      else if (hour >= 18 && hour < 22) bucket = 'Večer (18-22)';

      timeBuckets[bucket].total += entry.mood;
      timeBuckets[bucket].count += 1;
    });

    return Object.keys(timeBuckets).map((key) => ({
      subject: key,
      A:
        timeBuckets[key].count > 0
          ? Math.round((timeBuckets[key].total / timeBuckets[key].count) * 10) / 10
          : 0,
      fullMark: 5,
    }));
  }, [safeData]);

  if (chartData.length === 0) return null;

  const shouldAnimate = !reducedMotion && chartData.length <= 10;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springConfigFast}
      className="glass p-4 sm:p-6 rounded-[2rem] border-none h-[350px] flex flex-col"
    >
      <h3 className="text-lg font-bold text-white mb-1">Denní Rytmus</h3>
      <p className="text-white/40 text-xs mb-4">Kdy se cítíš nejlépe?</p>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} />
            <Radar
              name="Mood"
              dataKey="A"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.5}
              isAnimationActive={shouldAnimate}
              animationDuration={shouldAnimate ? 450 : 0}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export default TimeAnalysis;
