import { useMemo } from 'react';
import { motion } from 'framer-motion';

const IconMap = {
  Lightbulb, Info, Briefcase, Moon, Users, Heart, DollarSign, MessageCircle
};
import { calculateInsights } from '../../utils/moodCalculations';
import { Lightbulb, Info, Briefcase, Moon, Users, Heart, DollarSign, MessageCircle } from 'lucide-react';

export default function InsightsCard({ entries }) {
  const insights = useMemo(() => {
    if (entries && entries.length > 0) {
      return calculateInsights(entries);
    }
    return [];
  }, [entries]);

  if (insights.length === 0) return null;

  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8 mb-8 border border-white/10 ring-1 ring-white/5 backdrop-blur-xl bg-[#0f172a]/40 shadow-glass-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[2rem]" />
      
      <div className="relative z-10">
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
    </div>
  );
}
