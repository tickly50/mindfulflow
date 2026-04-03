import { memo } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

import { haptics } from '../../utils/haptics';
import { springConfigFast } from '../../utils/animations';
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
      <LayoutGroup id="bottom-nav">
        <div
          className="max-w-[340px] w-full flex justify-between items-center px-2 py-2 rounded-full pointer-events-auto backdrop-blur-2xl bg-black/35 border border-white/12 shadow-studio"
          style={{
            boxShadow:
              '0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 32px rgba(139,92,246,0.12)',
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
                className="relative flex flex-col items-center justify-center min-w-[72px] h-[52px] rounded-2xl outline-none focus:outline-none touch-manipulation overflow-visible"
              >
                {isActive && (
                  <motion.div
                    layout
                    layoutId="bottom-nav-pill"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-500/35 to-fuchsia-600/25 border border-white/10"
                    style={{
                      boxShadow: '0 0 24px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    aria-hidden="true"
                  />
                )}

              {/* Icon */}
              <motion.div
                animate={isActive ? { y: -1, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={springConfigFast}
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
                transition={springConfigFast}
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
      </LayoutGroup>
    </nav>
  );
});

export default BottomNavigation;
