import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { haptics } from '../../utils/haptics';
import { Home, BookHeart, BarChart3, Award } from 'lucide-react';

const navItems = [
  { id: 'checkin', icon: Home, label: 'Check-In', ariaLabel: 'Domů' },
  { id: 'journal', icon: BookHeart, label: 'Deník', ariaLabel: 'Deník' },
  { id: 'statistics', icon: BarChart3, label: 'Statistiky', ariaLabel: 'Statistiky' },
  { id: 'achievements', icon: Award, label: 'Úspěchy', ariaLabel: 'Úspěchy' },
];

const BottomNavigation = memo(function BottomNavigation({ currentView, onViewChange }) {
  return (
    <nav
      className="fixed z-50 sm:hidden w-full px-6 pointer-events-none flex justify-center"
      style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
    >
      <div
        className="max-w-[340px] w-full flex justify-between items-center px-2 py-2 rounded-full pointer-events-auto backdrop-blur-xl bg-white/5"
        style={{
          boxShadow: '0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
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
              className="relative flex flex-col items-center justify-center min-w-[72px] h-[52px] rounded-2xl outline-none focus:outline-none touch-manipulation overflow-hidden"
            >
              {/* Animated active pill background */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-2xl bg-white/8"
                  style={{ willChange: "transform" }}
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <motion.div
                animate={isActive ? { y: -1, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.5 }}
                style={{ willChange: 'transform' }}
              >
                <Icon
                  className={`w-[22px] h-[22px] transition-colors duration-220 ${
                    isActive ? 'text-violet-300' : 'text-white/55'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={isActive ? { filter: 'drop-shadow(0 0 5px rgba(167,139,250,0.55))' } : undefined}
                />
              </motion.div>

              {/* Label — always in flow, opacity-only transition (no layout shift) */}
              <motion.span
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 3 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28, mass: 0.5 }}
                className="text-[9px] font-bold tracking-wide text-violet-200 mt-0.5 leading-none"
                style={{ willChange: 'transform, opacity' }}
                aria-hidden={!isActive}
              >
                {item.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

export default BottomNavigation;
