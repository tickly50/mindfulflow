import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { calculateStreak as calcStreakPure } from '../../utils/moodCalculations';
import { downloadBackup, importData, clearAllEntries } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import { easeConfig } from '../../utils/animations';
import ConfirmModal from '../common/ConfirmModal';
import { db } from '../../utils/db';
import { useSettings } from '../../features/settings/SettingsContext';
import { haptics } from '../../utils/haptics';
import { Wind, Flame, Settings, Menu, X, Home, BookHeart, BarChart3, Award } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import SettingsModal from './SettingsModal';

const MOBILE_NAV = [
  { id: 'checkin', label: 'Check-In', Icon: Home },
  { id: 'journal', label: 'Deník', Icon: BookHeart },
  { id: 'statistics', label: 'Statistiky', Icon: BarChart3 },
  { id: 'achievements', label: 'Úspěchy', Icon: Award },
];

/**
 * Main application header with navigation, streak badge and settings.
 */
const Header = memo(function Header({ onBreathingClick, currentView, onViewChange }) {
  const [showSettings, setShowSettings] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const { success, error } = useToast();
  const { settings, updateSettings } = useSettings();

  const streak =
    useLiveQuery(async () => {
      const cutoff = new Date(Date.now() - 400 * 86_400_000).toISOString();
      const recentEntries = await db.moods.where('timestamp').above(cutoff).toArray();
      return calcStreakPure(recentEntries);
    }, []) || 0;

  const handleImport = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text =
            typeof event.target?.result === 'string' ? event.target.result : '';
          const result = await importData(text);
          if (result) {
            success('Data byla úspěšně nahrána!');
            setTimeout(() => window.location.reload(), 1500);
          } else {
            error('Chyba při nahrávání dat.');
          }
        } catch {
          error('Neplatný soubor.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [success, error]
  );

  const handleDeleteAllClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDeleteAll = useCallback(async () => {
    const result = await clearAllEntries();
    if (result) {
      window.location.reload();
    } else {
      error('Nepodařilo se smazat data.');
    }
    setShowDeleteConfirm(false);
  }, [error]);

  const handleDownload = useCallback(async () => {
    const result = await downloadBackup();
    if (result) {
      success('Záloha byla stažena.');
    } else {
      error('Nepodařilo se stáhnout zálohu.');
    }
  }, [success, error]);

  useScrollLock(showSettings || mobileNavOpen);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) return;
        setShowSettings(false);
        setMobileNavOpen(false);
      }
    };

    if (showSettings || mobileNavOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showSettings, showDeleteConfirm, mobileNavOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const close = () => {
      if (mq.matches) setMobileNavOpen(false);
    };
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, []);

  const handleMobileNav = useCallback(
    (view) => {
      if (currentView !== view) haptics.light();
      onViewChange(view);
      setMobileNavOpen(false);
    },
    [currentView, onViewChange]
  );

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        className="glass-strong rounded-2xl p-3 sm:p-4 mb-6 md:mb-8 sticky top-0 z-40 font-sans border border-white/12 shadow-studio backdrop-blur-2xl max-w-full min-w-0"
        style={{
          boxShadow:
            '0 24px 70px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.09) inset, 0 0 48px rgba(45, 212, 191, 0.07)',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1 md:flex-initial">
            <motion.button
              type="button"
              className="md:hidden touch-target shrink-0 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 -ml-1"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileNavOpen ? 'Zavřít menu' : 'Otevřít menu'}
              onClick={() => {
                haptics.light();
                setMobileNavOpen((o) => !o);
              }}
            >
              {mobileNavOpen ? <X className="w-6 h-6" strokeWidth={2} /> : <Menu className="w-6 h-6" strokeWidth={2} />}
            </motion.button>
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-600 to-amber-500 flex items-center justify-center shadow-glow-accent overflow-hidden ring-1 ring-white/15">
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-white/15 opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="text-xl sm:text-2xl relative z-10 drop-shadow-md">🧘</span>
            </div>
            <h1 className="font-display text-fluid-2xl md:text-fluid-3xl lg:text-fluid-4xl font-extrabold bg-gradient-to-r from-amber-100 via-teal-100 to-rose-100 bg-clip-text text-transparent tracking-tight truncate min-w-0 drop-shadow-[0_0_28px_rgba(45,212,191,0.28)] leading-none">
              MindfulFlow
            </h1>

            {streak > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={streak}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                  mass: 0.5,
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-sm ml-2 shrink-0"
                title={`${streak} dní v řadě!`}
                style={{
                  willChange: 'transform, opacity',
                }}
              >
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{streak}</span>
              </motion.div>
            )}
          </div>

          <LayoutGroup id="header-nav">
            <nav
              className="hidden md:flex gap-0.5 overflow-x-auto hide-scrollbar bg-black/25 p-1 rounded-2xl border border-white/10 shadow-depth-sm max-w-full min-w-0"
              aria-label="Hlavní navigace"
            >
              {['checkin', 'journal', 'statistics', 'achievements'].map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => {
                    if (currentView !== view) haptics.light();
                    onViewChange(view);
                  }}
                  className={`relative px-3 lg:px-4 py-2.5 min-h-[44px] rounded-xl text-xs lg:text-sm font-semibold whitespace-nowrap z-10 transition-colors duration-300 font-display items-center inline-flex ${
                    currentView === view ? 'text-white' : 'text-white/55 hover:text-white/95'
                  }`}
                >
                  {currentView === view && (
                    <motion.div
                      layout
                      layoutId="header-nav-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-600/55 to-amber-600/35 -z-10"
                      style={{
                        boxShadow:
                          '0 0 32px rgba(45,212,191,0.35), inset 0 1px 0 rgba(255,255,255,0.14)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      aria-hidden="true"
                    />
                  )}
                  {view === 'checkin' && 'Check-In'}
                  {view === 'journal' && 'Deník'}
                  {view === 'statistics' && 'Statistiky'}
                  {view === 'achievements' && 'Úspěchy'}
                </button>
              ))}
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0 shrink-0">
            <motion.button
              type="button"
              onClick={() => {
                haptics.medium();
                setMobileNavOpen(false);
                onBreathingClick();
              }}
              aria-label="Dechová cvičení"
              whileHover={{ scale: 1.05, boxShadow: '0 0 36px rgba(251, 113, 133, 0.42)' }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="group bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 px-3 sm:px-4 min-h-[44px] min-w-[44px] sm:min-w-0 rounded-xl font-bold text-sm text-white inline-flex items-center justify-center gap-2 shadow-glow-orange relative overflow-hidden outline-none focus:outline-none font-display border border-white/15"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Wind className="w-5 h-5 relative z-10 drop-shadow-md shrink-0" />
              <span className="hidden lg:inline relative z-10 drop-shadow-md tracking-wide text-sm font-bold">Dýchání</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                haptics.light();
                setMobileNavOpen(false);
                setShowSettings(true);
              }}
              aria-label="Nastavení"
              whileHover={{
                rotate: 90,
                transition: { duration: 0.2, ease: easeConfig.smooth },
              }}
              className="touch-target rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white outline-none focus:outline-none focus:ring-0 shrink-0"
              style={{
                transition:
                  'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              aria-label="Zavřít menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[45] bg-black/55 backdrop-blur-sm md:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.nav
              key="mobile-nav-panel"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigace aplikace"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="fixed top-0 right-0 bottom-0 z-[46] w-[min(100%,20rem)] max-w-full flex flex-col bg-[#0a1218]/96 backdrop-blur-xl border-l border-white/12 shadow-2xl pt-safe pb-6 px-4 md:hidden"
            >
              <div className="flex items-center justify-between gap-2 py-4 border-b border-white/10 mb-4 shrink-0">
                <span className="font-display font-bold text-fluid-base text-white truncate">Menu</span>
                <button
                  type="button"
                  className="touch-target rounded-xl bg-white/10 text-white hover:bg-white/15"
                  aria-label="Zavřít menu"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ul className="flex flex-col gap-1 overflow-y-auto premium-scroll flex-1 -mx-1 px-1">
                {MOBILE_NAV.map(({ id, label, Icon }) => {
                  const active = currentView === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => handleMobileNav(id)}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 min-h-[52px] text-left font-display font-semibold text-fluid-base transition-colors ${
                          active
                            ? 'bg-gradient-to-r from-teal-700/50 to-amber-700/35 text-white border border-white/18 shadow-[0_0_24px_rgba(45,212,191,0.15)]'
                            : 'text-white/75 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                      >
                        <Icon className="w-6 h-6 shrink-0 opacity-90" strokeWidth={2} />
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        updateSettings={updateSettings}
        fileInputRef={fileInputRef}
        onImportFile={handleImport}
        onDownloadBackup={handleDownload}
        onRequestDeleteAll={handleDeleteAllClick}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDeleteAll}
        title="Smazat všechna data"
        message="Opravdu chceš smazat všechna data? Tuto akci nelze vrátit zpět!"
        confirmText="Smazat vše"
        isDangerous={true}
      />
    </>
  );
});

export default Header;
