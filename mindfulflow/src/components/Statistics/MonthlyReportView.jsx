import { useState, memo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Sparkles, Calendar } from 'lucide-react';
import { generateMonthlyReportData, MOOD_COLORS, MOOD_LABELS } from '../../utils/moodCalculations';

const ReportSession = memo(function ReportSession({ onClose, entries }) {
  const [slide, setSlide] = useState(0);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const now = new Date();
    // Default to current month
    const data = generateMonthlyReportData(entries, now.getMonth(), now.getFullYear());
    setReportData(data);
  }, [entries]);

  const nextSlide = useCallback(() => {
    setSlide(s => {
      if (s < 3) return s + 1;
      onClose();
      return s;
    });
  }, [onClose]);

  const prevSlide = useCallback(() => {
    setSlide(s => (s > 0 ? s - 1 : s));
  }, []);

  // Lock body scroll and handle Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [slide, reportData, nextSlide, prevSlide, onClose]);

  if (!reportData || reportData.totalEntries === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
      >
        <div className="bg-[#0f172a] p-8 rounded-3xl max-w-sm w-full text-center relative border border-white/10 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full">
            <X className="w-5 h-5"/>
          </button>
          <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nedostatek dat</h3>
          <p className="text-white/60">Pro vytvoření měsíčního reportu potřebujeme více záznamů v tomto měsíci.</p>
        </div>
      </motion.div>
    );
  }

  const slides = [
    // Slide 1: Intro
    (
      <div key="intro" className="flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-8 shadow-glow-violet"
        >
          <Sparkles className="w-16 h-16 text-white" />
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Přehled měsíce
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-xl text-white/70"
        >
          Pojďme se podívat, jak se ti tento měsíc dařilo.
        </motion.p>
      </div>
    ),
    // Slide 2: Entries & Avg Mood
    (
      <div key="stats" className="flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12">
          <p className="text-white/60 text-lg mb-2">Tento měsíc jsi vytvořil(a)</p>
          <div className="text-7xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            {reportData.totalEntries}
          </div>
          <p className="text-xl text-white/80">záznamů nálady</p>
        </motion.div>
        
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-white/60 text-lg mb-4">Tvá průměrná nálada byla</p>
          <div 
            className="inline-flex items-center justify-center w-28 h-28 rounded-full shadow-lg"
            style={{ 
              background: MOOD_COLORS[Math.round(reportData.averageMood)]?.gradient || '#333',
              boxShadow: `0 0 30px ${MOOD_COLORS[Math.round(reportData.averageMood)]?.primary}50`
            }}
          >
            <span className="text-5xl text-white font-bold">{reportData.averageMood}</span>
          </div>
          <p className="text-2xl text-white mt-6 font-semibold">
            {MOOD_LABELS[Math.round(reportData.averageMood)]}
          </p>
        </motion.div>
      </div>
    ),
    // Slide 3: Top Tags
    (
      <div key="tags" className="flex flex-col items-center justify-start pt-24 h-full text-center px-6 w-full mx-auto">
        <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-bold text-white mb-10">
          Co tě nejvíce ovlivňovalo?
        </motion.h2>
        <div className="w-full space-y-4">
          {reportData.topTags.map((tag, i) => (
            <motion.div 
              key={tag.id}
              initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between border border-white/10 shadow-md"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <span className="text-xl font-medium text-white">{tag.label}</span>
              </div>
              <span className="text-white/50 text-lg">{tag.count}x</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    // Slide 4: Best Day
    (
      <div key="best" className="flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="mb-10">
          <Award className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_40px_rgba(250,204,21,0.6)]" />
        </motion.div>
        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl font-bold text-white mb-6">
          Nejlepší den
        </motion.h2>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl text-white/80 leading-relaxed max-w-sm">
          Tvůj nejlepší den v tomto měsíci byl<br/>
          <strong className="text-3xl text-white block mt-4 bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
            {reportData.bestDayDate}
          </strong>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          onClick={onClose}
          className="mt-16 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          Skvělá práce!
        </motion.button>
      </div>
    )
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-[#0f172a] sm:p-4 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-[#0f172a] pointer-events-none" />

      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all shadow-lg border border-white/10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Progress Bar (Stories style) */}
      <div className="absolute top-6 left-6 right-24 flex gap-2 z-50">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: i < slide ? '100%' : '0%' }}
              animate={{ width: i <= slide ? '100%' : '0%' }}
              transition={{ duration: i === slide ? 5 : 0.3, ease: 'linear' }}
              onAnimationComplete={() => {
                if (i === slide && slide < slides.length - 1) {
                  setSlide(s => s + 1);
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Slides Area */}
      <div className="relative w-full max-w-md h-[40rem] sm:h-[45rem] max-h-screen bg-black/20 sm:rounded-[3rem] border-y sm:border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {slides[slide]}
          </motion.div>
        </AnimatePresence>

        {/* Tap areas for prev/next like Instagram */}
        <div className="absolute inset-y-0 left-0 w-[40%] z-40 cursor-pointer" onClick={prevSlide} />
        <div className="absolute inset-y-0 right-0 w-[60%] z-40 cursor-pointer" onClick={nextSlide} />
      </div>
    </motion.div>
  );
});

export default function MonthlyReportView({ isOpen, onClose, entries }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && <ReportSession onClose={onClose} entries={entries} />}
    </AnimatePresence>,
    document.body
  );
}
