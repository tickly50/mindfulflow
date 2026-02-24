import { useMemo } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { calculateInsights } from '../../utils/moodCalculations';

export default function InsightsCard({ entries }) {
  const insights = useMemo(() => {
    if (entries && entries.length > 0) {
      return calculateInsights(entries);
    }
    return [];
  }, [entries]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white/5  rounded-3xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow-violet">
          <Icons.Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Chytré postřehy</h3>
          <p className="text-sm text-white/50">Analýza tvých dat</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, i) => {
          const Icon = Icons[insight.icon] || Icons.Info;
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
  );
}
