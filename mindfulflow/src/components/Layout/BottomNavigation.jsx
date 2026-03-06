import { memo } from 'react';
import { motion } from 'framer-motion';
import Home from 'lucide-react/dist/esm/icons/home';
import BookHeart from 'lucide-react/dist/esm/icons/book-heart';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import Award from 'lucide-react/dist/esm/icons/award';
import { microInteractions } from '../../utils/animations';
import { haptics } from '../../utils/haptics';

const BottomNavigation = memo(function BottomNavigation({ currentView, onViewChange }) {
  const navItems = [
    { id: 'checkin', icon: Home, label: 'Check-In', ariaLabel: 'Domů' },
    { id: 'journal', icon: BookHeart, label: 'Deník', ariaLabel: 'Deník' },
    { id: 'statistics', icon: BarChart3, label: 'Statistiky', ariaLabel: 'Statistiky' },
    { id: 'achievements', icon: Award, label: 'Úspěchy', ariaLabel: 'Úspěchy' },
  ];

  return (
    <nav 
      className="fixed z-50 sm:hidden w-full px-6 pointer-events-none flex justify-center"
      style={{
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div 
        className="max-w-[340px] w-full flex justify-between items-center px-4 py-3 rounded-full relative overflow-hidden pointer-events-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(45, 25, 90, 0.95) 0%, rgba(15, 10, 40, 0.98) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }}
      >
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isActive) haptics.light();
                onViewChange(item.id);
              }}
              aria-label={item.ariaLabel}
              className={`group relative flex flex-col items-center justify-center min-w-[64px] h-[52px] rounded-2xl transition-colors duration-300 outline-none focus:outline-none touch-manipulation ${
                isActive ? 'text-[var(--theme-accent,#a78bfa)]' : 'text-white/60 hover:text-white/70'
              }`}
            >
              <div 
                className="relative z-10 flex flex-col items-center gap-1 w-full h-full justify-center press-effect"
              >
                <Icon 
                  className={`w-6 h-6 transition-transform duration-300 ease-out will-change-transform ${
                    isActive 
                      ? 'scale-110 text-violet-300' 
                      : 'scale-100'
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2}
                  style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.6))' } : undefined}
                />
                
                <span 
                  className={`text-[10px] font-bold tracking-wide transition-[transform,opacity,color] duration-300 ease-out will-change-transform ${
                    isActive 
                      ? 'opacity-100 translate-y-0 text-violet-200' 
                      : 'opacity-0 translate-y-1 absolute -bottom-4'
                  }`}
                >
                  {item.label}
                </span>


              </div>

              <div 
                className={`absolute inset-0 bg-white/5 rounded-2xl -z-10 transition-[transform,opacity] duration-300 pointer-events-none origin-bottom will-change-transform ${
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
