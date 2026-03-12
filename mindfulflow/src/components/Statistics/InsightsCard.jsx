import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { calculateInsights } from '../../utils/moodCalculations';
import { CONTEXT_TAG_ICONS } from '../../utils/moodConstants';
import { Lightbulb, Info } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const IconMap = { ...CONTEXT_TAG_ICONS, Lightbulb, Info };

const InsightsCard = memo(function InsightsCard({ entries }) {
  const insights = useMemo(() => {
    if (entries && entries.length > 0) {
      return calculateInsights(entries);
    }
    return [];
  }, [entries]);

  if (insights.length === 0) return null;

  return (
    <GlassCard className="p-6 sm:p-8 mb-8">
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow-violet ring-1 ring-white/20">
            <Lightbulb className="w-6 h-6 text-white drop-shadow-md" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Chytré postřehy</h3>
            <p className="text-sm font-medium text-white/60">Analýza tvých dat</p>
          </div>
        </div>
        
        <div className="space-y-4">
        {insights.map((insight, i) => {
          const Icon = IconMap[insight.icon] || Info;
          const isPositive = insight.type === 'positive';
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`p-4 rounded-2xl border flex gap-4 ${
                isPositive 
                  ? 'bg-emerald-500/10 border-emerald-500/20' 
                  : 'bg-orange-500/10 border-orange-500/20'
              }`}
            >
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`font-semibold mb-1 ${
                  isPositive ? 'text-emerald-400' : 'text-orange-400'
                }`}>
                  {insight.title}
                </h4>
                <p className="text-sm text-white/80 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </GlassCard>
  );
});

export default InsightsCard;
