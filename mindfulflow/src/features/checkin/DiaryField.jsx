import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState, useRef, useEffect } from 'react';

import { microInteractions } from '../../utils/animations';
import { PenTool, Sparkles } from 'lucide-react';

const JOURNAL_PROMPTS = [
  'Za co jsi dnes vděčný?',
  'Jaká byla nejlepší část dnešního dne?',
  'Co tě dnes překvapilo?',
  'Povedlo se ti dnes něco, na co jsi hrdý?',
  'Co bys na dnešku změnil, kdybys mohl?',
  'Jaká malá věc ti dnes udělala radost?',
  'Co ti dnes dodalo nejvíce energie?',
  'O čem zrovna teď přemýšlíš?',
  'Jak jsi se dnes zachoval k ostatním?',
  'Jak ses dnes postaral sám o sebe?',
];

const DiaryField = memo(function DiaryField({ value, onChange, maxLength = 1000 }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const textareaRef = useRef(null);

  const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).filter(Boolean).length;
  const charCount = value.length;
  const nearLimit = charCount > maxLength * 0.9;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="mb-10 w-full"
    >
      <div className="relative flex items-center justify-between mb-4 px-1 flex-wrap gap-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-500/35 to-violet-800/20 rounded-xl md:backdrop-blur-md shadow-glow-accent ring-1 ring-white/12">
            <PenTool className="w-5 h-5 text-violet-200" />
          </div>
          <span className="bg-gradient-to-r from-violet-100 to-violet-200 bg-clip-text text-transparent font-display">
            Osobní poznámka
          </span>
          <span className="text-xs font-normal text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            nepovinné
          </span>
        </h3>

        <div className="flex items-center gap-3" ref={menuRef}>
          <motion.button
            whileHover={microInteractions.button.hover}
            whileTap={microInteractions.button.tap}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/25 hover:bg-violet-500/45 text-violet-100 hover:text-white rounded-lg transition-colors text-sm font-medium z-10 relative font-display"
          >
            <Sparkles className="w-4 h-4 text-violet-300" />
            Inspirace
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-72 top-[calc(100%+0.5rem)] z-50 max-h-72 overflow-y-auto rounded-2xl bg-[#0f111a]/95 backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                <div className="p-3 flex flex-col gap-1.5">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 px-1">
                    Otázky pro inspiraci
                  </h4>
                  {JOURNAL_PROMPTS.map((prompt, idx) => (
                    <p
                      key={idx}
                      className="px-3 py-2.5 text-sm text-slate-300 bg-white/5 rounded-xl border border-white/5 leading-relaxed"
                    >
                      {prompt}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/40">{wordCount} slov</span>
            <span
              className={`text-xs font-mono font-medium py-1 px-2.5 rounded-full border transition-colors duration-300 ${
                nearLimit
                  ? 'text-rose-300 border-rose-500/30 bg-rose-500/10'
                  : 'text-white/50 border-white/10 bg-white/5'
              }`}
            >
              {charCount}/{maxLength}
            </span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div
          className={`absolute -inset-1 rounded-[1.5rem] bg-violet-500/25 blur-xl transition-opacity duration-500 pointer-events-none ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`relative rounded-[1.2rem] h-full overflow-hidden backdrop-blur-xl border transition-all duration-300 shadow-inner ${
            isFocused
              ? 'border-violet-400/50 bg-black/40 shadow-[inset_0_0_18px_rgba(124,58,237,0.12)]'
              : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                onChange(e.target.value);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Jak se cítíš? Co ti dnes udělalo radost, nebo naopak starosti? ..."
            className="w-full h-full min-h-[160px] xs:min-h-[200px] bg-transparent p-4 xs:p-6 text-base xs:text-lg text-white placeholder-white/30 outline-none focus:outline-none focus:ring-0 resize-none leading-relaxed transition-all duration-300"
          />
        </div>
      </div>
    </motion.div>
  );
});

export default DiaryField;
