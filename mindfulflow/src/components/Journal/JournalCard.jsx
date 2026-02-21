import { motion } from 'framer-motion';
import { Clock, Tag, Pencil, Trash2, Calendar, Moon } from 'lucide-react';
import { MOOD_COLORS, MOOD_LABELS } from '../../utils/moodCalculations';
import { variants, microInteractions } from '../../utils/animations';

export default function JournalCard({ entry, onEdit, onDelete, getContextLabel }) {
  const moodColor = MOOD_COLORS[Math.round(entry.mood)] || MOOD_COLORS[3];
  const date = new Date(entry.timestamp);

  // Helper to format date nicely
  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <motion.div
      variants={variants.item}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={microInteractions.card.hover}
      className="relative pl-8 sm:pl-0 group"
      style={{ willChange: 'auto' }}
    >
      {/* Timeline line for mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10 sm:hidden" />
      
      {/* Timeline dot for mobile */}
      <div 
        className="absolute left-[-5px] top-6 w-3 h-3 rounded-full sm:hidden ring-4 ring-[#1a1b26]"
        style={{ 
          backgroundColor: moodColor.primary
        }} 
      />

      <div 
        className="glass p-6 rounded-3xl !border-0 !border-none ring-0 outline-none"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
          boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`,
          borderWidth: 0,
          borderColor: 'transparent'
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
          
          {/* Main Content */}
          <div className="flex-1 space-y-3">
            {/* Header: Badge & Time */}
            <div className="flex flex-wrap items-center gap-3">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white/10 bg-white/5 flex items-center justify-center"
                style={{ 
                  color: moodColor.text
                }}
              >
                {MOOD_LABELS[Math.round(entry.mood)]}
              </span>
              
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Calendar className="w-3 h-3" />
                <span className="capitalize">{formatDate(entry.timestamp)}</span>
                <span className="text-white/20">•</span>
                <Clock className="w-3 h-3" />
                {date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                {typeof entry.sleep === 'number' && (
                  <>
                    <span className="text-white/20">•</span>
                    <Moon className="w-3 h-3" />
                    <span>{entry.sleep}h</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Diary Entry */}
            {entry.diary && (
              <div className="relative">
                 <p className="text-white/90 text-lg leading-relaxed font-serif italic pl-4 border-l-2 border-white/10 break-all">
                  {entry.diary}
                </p>
              </div>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {entry.tags.map(ctxId => (
                  <span 
                    key={ctxId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs text-white/60 border border-white/5 hover:bg-white/10"
                    style={{ 
                      transition: 'background-color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
                    }}
                  >
                    <Tag className="w-3 h-3 opacity-50" />
                    {getContextLabel(ctxId)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Mood Circle & Actions */}
          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-6">
             {/* Mood Circle */}
             <div 
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ring-1 ring-white/10"
                style={{ 
                  background: moodColor.gradient,
                  boxShadow: `0 10px 25px -5px ${moodColor.primary}50`
                }}
             >
               {Math.round(entry.mood)}
               <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
             </div>
             
             {/* Action Buttons (Opacity transition on group hover) */}
             <div 
               className="flex gap-2 sm:opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
               style={{
                 transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                 willChange: 'opacity, transform'
               }}
             >
               <motion.button 
                 whileHover={microInteractions.icon.hover}
                 whileTap={microInteractions.icon.tap}
                 onClick={() => onEdit(entry)}
                 className="p-2 text-white/40 hover:text-violet-300 hover:bg-white/10 rounded-full focus:outline-none outline-none"
                 title="Upravit"
                 style={{ 
                   transition: 'color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), background-color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
                 }}
               >
                 <Pencil className="w-4 h-4" />
               </motion.button>
               <motion.button 
                 whileHover={microInteractions.icon.hover}
                 whileTap={microInteractions.icon.tap}
                 onClick={() => onDelete(entry.id)}
                 className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-full focus:outline-none outline-none"
                 title="Smazat"
                 style={{ 
                   transition: 'color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), background-color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
                 }}
               >
                 <Trash2 className="w-4 h-4" />
               </motion.button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
