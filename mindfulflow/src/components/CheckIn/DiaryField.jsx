import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import { PenTool, Sparkles } from 'lucide-react';
import { microInteractions } from '../../utils/animations';

const JOURNAL_PROMPTS = [
  'Za co jsi dne vděčný?',
  'Jaká byla nejlepší část dnešního dne?',
  'Co tě dnes překvapilo?',
  'Povedlo se ti dnes něco, na co jsi hrdý?',
  'Co bys na dnešku změnil, kdybys mohl?',
  'Jaká malá věc ti dnes udělala radost?',
  'Co ti dnes dodalo nejvíce energie?',
  'O čem zrovna teď přemýšlíš?',
  'Jak jsi se dnes zachoval k ostatním?',
  'Jak ses dnes postaral sám o sebe?'
];

/**
 * Diary text field - Premium Enhanced
 */
const DiaryField = memo(function DiaryField({ value, onChange, maxLength = 280 }) {
  const [isFocused, setIsFocused] = useState(false);
  const remainingChars = maxLength - value.length;

  const insertRandomPrompt = () => {
    const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    const currentValue = value.trim();
    if (currentValue) {
        onChange(`${currentValue}\n\n${randomPrompt}\n`);
    } else {
        onChange(`${randomPrompt}\n`);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="mb-10 w-full"
    >
      <div className="flex items-center justify-between mb-4 px-1 flex-wrap gap-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
             <PenTool className="w-5 h-5 text-purple-300" />
          </div>
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Osobní poznámka</span>
        </h3>
        
        <div className="flex items-center gap-3">
            <motion.button
                whileHover={microInteractions.button.hover}
                whileTap={microInteractions.button.tap}
                onClick={insertRandomPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 hover:text-white rounded-lg transition-colors text-sm font-medium"
            >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Inspirace
            </motion.button>
            <span className={`text-xs font-mono font-medium py-1 px-3 rounded-full border transition-colors duration-300 ${
                remainingChars < 20 
                    ? 'text-rose-300 border-rose-500/30 bg-rose-500/10' 
                    : 'text-white/40 border-white/10 bg-white/5'
            }`}>
                {remainingChars}
            </span>
        </div>
      </div>
      
      <div 
        className="relative group"
      >
        {/* Animated Glow Border */}
        <div className={`absolute -inset-0.5 rounded-[1.2rem] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 opacity-0 blur transition duration-500 ${isFocused ? 'opacity-70' : 'group-hover:opacity-30'}`} />
        
        <div className="relative glass-card rounded-[1.2rem] p-0.5 bg-[#0f172a] h-full overflow-hidden">
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
            className="w-full h-full min-h-[140px] xs:min-h-[160px] bg-transparent rounded-[1.1rem] p-4 xs:p-6 text-base xs:text-lg text-white placeholder-white/30 outline-none focus:outline-none focus:ring-0 resize-none leading-relaxed transition-all duration-300"
            />
        </div>
      </div>
    </motion.div>
  );
});

export default DiaryField;
