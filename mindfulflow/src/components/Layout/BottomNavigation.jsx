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
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden glass-strong border-t border-white/10 pb-safe"
      style={{
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
        paddingBottom: 'env(safe-area-inset-bottom)' // Podpora pro iP hone s tlustým "home bar"
      }}
    >
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-colors relative outline-none focus:outline-none ${
                isActive ? 'text-violet-400' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <motion.div
                whileTap={microInteractions.icon.tap}
                className="relative z-10 flex flex-col items-center"
              >
                <Icon 
                  className={`w-6 h-6 mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' : ''}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                  {item.label}
                </span>
              </motion.div>

              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

export default BottomNavigation;
