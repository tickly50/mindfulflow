import { motion } from 'framer-motion';
import { springConfig } from '../../utils/animations';
import { memo, useState } from 'react';
import { BookOpen, PenTool } from 'lucide-react';

/**
 * Diary text field - Premium Enhanced
 */
const DiaryField = memo(function DiaryField({ value, onChange, maxLength = 280 }) {
  const [isFocused, setIsFocused] = useState(false);
  const remainingChars = maxLength - value.length;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="mb-10 w-full"
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
             <PenTool className="w-5 h-5 text-purple-300" />
          </div>
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Osobní poznámka</span>
        </h3>
        <span className={`text-xs font-mono font-medium py-1 px-3 rounded-full border transition-colors duration-300 ${
            remainingChars < 20 
                ? 'text-rose-300 border-rose-500/30 bg-rose-500/10' 
                : 'text-white/40 border-white/10 bg-white/5'
        }`}>
            {remainingChars}
        </span>
      </div>
      
      <div 
        className="relative group"
      >
        {/* Animated Glow Border */}
        <div className={`absolute -inset-0.5 rounded-[1.2rem] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 opacity-0 blur transition duration-500 ${isFocused ? 'opacity-70' : 'group-hover:opacity-30'}`} />
        
        <div className="relative glass-card rounded-2xl p-1 bg-[#0f172a] h-full">
            <textarea
            value={value}
            onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                onChange(e.target.value);
                }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Jak se cítíš? Co ti dnes udělalo radost, nebo naopak starosti? ..."
            className="w-full h-full min-h-[140px] xs:min-h-[160px] bg-black/20 rounded-xl p-4 xs:p-6 text-base xs:text-lg text-white placeholder-white/30 outline-none focus:outline-none focus:ring-0 resize-none leading-relaxed transition-all duration-300"
            />
        </div>
      </div>
    </motion.div>
  );
});

export default DiaryField;
