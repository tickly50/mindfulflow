import { memo } from 'react';
import { motion } from 'framer-motion';
import { Home, BookHeart, BarChart3, Award } from 'lucide-react';
import { microInteractions } from '../../utils/animations';

const BottomNavigation = memo(function BottomNavigation({ currentView, onViewChange }) {
  const navItems = [
    { id: 'checkin', icon: Home, label: 'Check-In' },
    { id: 'journal', icon: BookHeart, label: 'Deník' },
    { id: 'statistics', icon: BarChart3, label: 'Statistiky' },
    { id: 'achievements', icon: Award, label: 'Úspěchy' },
  ];

  return (
    <nav 
      className="fixed z-50 sm:hidden transition-all duration-300 w-full px-4 pointer-events-none"
      style={{
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div 
        className="mx-auto max-w-md flex justify-between items-center px-3 py-2.5 rounded-[2rem] relative overflow-visible pointer-events-auto"
        style={{
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`group relative flex flex-col items-center justify-center min-w-[64px] h-[52px] rounded-2xl transition-all duration-300 outline-none focus:outline-none touch-manipulation webkit-tap-highlight-transparent ${
                isActive ? 'text-[var(--theme-accent,#a78bfa)]' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <motion.div 
                whileTap={microInteractions.icon.tap}
                className="relative z-10 flex flex-col items-center gap-1 w-full h-full justify-center"
              >
                <Icon 
                  className={`w-6 h-6 transition-all duration-300 ease-out ${
                    isActive 
                      ? 'scale-110 drop-shadow-[0_0_12px_var(--theme-accent,#a78bfa)]' 
                      : 'scale-100'
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                
                <span 
                  className={`text-[10px] sm:text-[11px] font-medium tracking-wide transition-all duration-300 ease-out ${
                    isActive 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform translate-y-1 absolute -bottom-4'
                  }`}
                >
                  {item.label}
                </span>

                {/* Subtle active indicator dot instead of heavy layout box for maximum performance */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute -bottom-2 w-1 h-1 rounded-full bg-[var(--theme-accent,#a78bfa)] shadow-[0_0_8px_var(--theme-accent,#a78bfa)]"
                  />
                )}
              </motion.div>

              {/* Seamless CSS active background instead of layoutId lag */}
              <div 
                className={`absolute inset-0 bg-white/5 rounded-2xl -z-10 transition-all duration-300 pointer-events-none origin-bottom ${
                   isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`} 
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
});

export default BottomNavigation;
