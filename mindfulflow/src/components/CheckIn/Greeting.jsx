import { memo, useMemo } from 'react';
import { getDailyQuote } from '../../utils/quotes';

/**
 * Dynamic greeting based on time of day - Premium Enhanced
 */
const Greeting = memo(function Greeting() {
  // Get time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { text: 'Dobré ráno', emoji: '🌅', gradient: 'from-amber-300 via-orange-400 to-rose-500' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Dobré odpoledne', emoji: '☀️', gradient: 'from-yellow-300 via-amber-400 to-orange-500' };
    } else if (hour >= 17 && hour < 22) {
      return { text: 'Dobrý večer', emoji: '🌆', gradient: 'from-violet-300 via-purple-400 to-indigo-500' };
    } else {
      return { text: 'Dobrý večer', emoji: '🌙', gradient: 'from-indigo-300 via-violet-400 to-purple-500' };
    }
  }, []);

  const quote = useMemo(() => getDailyQuote(), []);

  return (
    <div className="text-center mb-12 relative z-10">
      <div className="inline-flex flex-col items-center gap-4 mb-6">
        <span className="text-6xl md:text-7xl filter drop-shadow-lg">
          {greeting.emoji}
        </span>
        
        <div className="relative">
          <h2 
            className={`text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r ${greeting.gradient} bg-clip-text text-transparent`}
            style={{
              textShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
              lineHeight: 1.2
            }}
          >
            {greeting.text}
          </h2>
          
          {/* Subtle glow behind text */}
          <div className={`absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r ${greeting.gradient} -z-10 rounded-full transform scale-150`} />
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-white/80 text-xl font-light tracking-wide">
          Jak se dnes cítíš?
        </p>
      
        {/* Daily Quote - Premium Glass Card */}
        <div className="max-w-xl mx-auto">
          <div className="relative quote-hover">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div 
              className="relative glass px-8 py-6 rounded-3xl border border-white/10 shadow-2xl hover:bg-white/5"
              style={{ isolation: 'isolate' }}
            >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                <p className="text-white/90 text-lg italic font-medium leading-relaxed font-serif tracking-wide">
                  "{quote}"
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Greeting;
