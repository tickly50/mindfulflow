import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import Moon from 'lucide-react/dist/esm/icons/moon';
import Users from 'lucide-react/dist/esm/icons/users';
import Heart from 'lucide-react/dist/esm/icons/heart';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import ActivityIcon from 'lucide-react/dist/esm/icons/activity';
import Tag from 'lucide-react/dist/esm/icons/tag';
import { calculateActivityStats, MOOD_COLORS } from '../../utils/moodCalculations';
import { springConfigFast } from '../../utils/animations';

const iconMap = {
  Briefcase,
  Moon,
  Users,
  Heart,
  DollarSign,
  MessageCircle,
  Activity: ActivityIcon,
};

/**
 * Activity Stats component
 * Shows average mood per activity/tag
 */
const ActivityStats = memo(function ActivityStats({ data }) {
  const stats = useMemo(() => calculateActivityStats(data), [data]);

  if (!stats || stats.length === 0) return null;

  // Take top 6 most frequent activities
  const topStats = stats.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springConfigFast}
      className="glass-card p-5 sm:p-6 rounded-[2rem] border border-white/10 ring-1 ring-white/5 backdrop-blur-xl bg-[#0f172a]/40 shadow-glass-lg flex flex-col h-[350px] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[2rem]" />
      <h3 className="text-lg font-bold text-white mb-4 relative z-10">Vliv aktivit na náladu</h3>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 premium-scroll relative z-10">
        {topStats.map((stat, idx) => {
          const IconComponent = iconMap[stat.icon] || Tag;
          const hasRecords = stat.count > 0;
          const moodLevel = hasRecords ? Math.round(stat.average) : 3; // default to neutral if no records
          const moodColor = MOOD_COLORS[moodLevel] || MOOD_COLORS[3];
          
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5  hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-white/70">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{stat.label}</div>
                  <div className="text-white/60 text-xs">{stat.count} záznamů</div>
                </div>
              </div>
              
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm shadow-sm"
                style={{ 
                  background: hasRecords ? moodColor.gradient : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: hasRecords ? `0 4px 15px -3px ${moodColor.primary}40` : 'none',
                  color: hasRecords ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'
                }}
              >
                {hasRecords ? stat.average : '-'}
              </div>
            </motion.div>
          );
        })}
        {stats.length > 6 && (
           <div className="text-center text-white/60 text-xs pt-2">
             a {stats.length - 6} dalších...
           </div>
        )}
      </div>
    </motion.div>
  );
});

export default ActivityStats;
