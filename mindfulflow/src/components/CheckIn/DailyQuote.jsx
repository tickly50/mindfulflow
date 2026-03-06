import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Quote from 'lucide-react/dist/esm/icons/quote';

const QUOTES = [
  "Nadechni klid, vydechni napětí.",
  "Dnes je nový den, plný nových příležitostí.",
  "Tvoje pocity jsou platné a důležité.",
  "Zastav se a uvědom si tento okamžik.",
  "Laskavost k sobě samému je klíčem.",
  "Každý malý krok se počítá.",
  "Jsi silnější, než si myslíš.",
  "Dopřej si čas na odpočinek.",
  "Všechno, co potřebuješ, je už v tobě.",
  "Nech odejít to, co nemůžeš změnit.",
  "Tvoje mysl je tvoje útočiště.",
  "Věř procesu a buď trpělivý/á.",
  "Dýchej zhluboka. Všechno zvládneš.",
  "Vděčnost mění, jak vidíš svět.",
  "Jsi přesně tam, kde máš být.",
];

const DailyQuote = memo(function DailyQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Determine quote deterministically by day of the year, so it changes daily
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const index = dayOfYear % QUOTES.length;
    setQuote(QUOTES[index]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-12 h-12 text-white" />
      </div>
      <p className="text-white/80 font-medium text-lg leading-relaxed relative z-10 font-serif italic">
        "{quote}"
      </p>
    </motion.div>
  );
});

export default DailyQuote;
