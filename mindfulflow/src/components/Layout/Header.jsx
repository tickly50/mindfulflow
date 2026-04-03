

import { motion, LayoutGroup } from 'framer-motion';
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
import { Wind, Flame, Settings } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import SettingsModal from './SettingsModal';

/**
 * Main application header with navigation, streak badge and settings.
 */
const Header = memo(function Header({ onBreathingClick, currentView, onViewChange }) {
  const [showSettings, setShowSettings] = useState(false);
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

  useScrollLock(showSettings);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) return;
        setShowSettings(false);
      }
    };

    if (showSettings) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showSettings, showDeleteConfirm]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        className="glass-strong rounded-2xl p-4 mb-8 sticky top-0 z-40 font-sans border border-white/10 shadow-studio backdrop-blur-2xl"
        style={{
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 0 40px rgba(139, 92, 246, 0.08)',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-glow-violet overflow-hidden">
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
              <span className="text-2xl relative z-10 drop-shadow-md">🧘</span>
            </div>
            <h1 className="font-display text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-indigo-200 bg-clip-text text-transparent tracking-tight hidden md:block drop-shadow-[0_0_24px_rgba(167,139,250,0.35)]">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold ml-2"
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
            <nav className="hidden sm:flex gap-0.5 overflow-x-auto hide-scrollbar bg-black/25 p-1 rounded-2xl border border-white/10 shadow-depth-sm">
              {['checkin', 'journal', 'statistics', 'achievements'].map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => {
                    if (currentView !== view) haptics.light();
                    onViewChange(view);
                  }}
                  className={`relative px-3 lg:px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap z-10 transition-colors duration-300 font-display ${
                    currentView === view ? 'text-white' : 'text-white/55 hover:text-white/95'
                  }`}
                >
                  {currentView === view && (
                    <motion.div
                      layout
                      layoutId="header-nav-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/50 to-fuchsia-600/40 -z-10"
                      style={{
                        boxShadow:
                          '0 0 28px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
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

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <motion.button
              type="button"
              onClick={() => {
                haptics.medium();
                onBreathingClick();
              }}
              aria-label="Dechová cvičení"
              whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(249, 115, 22, 0.45)' }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="group bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2 rounded-xl font-bold text-white flex items-center gap-2 shadow-glow-orange relative overflow-hidden outline-none focus:outline-none font-display border border-white/10"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Wind className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 drop-shadow-md" />
              <span className="hidden lg:inline relative z-10 drop-shadow-md tracking-wide">Dýchání</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                haptics.light();
                setShowSettings(true);
              }}
              aria-label="Nastavení"
              whileHover={{
                rotate: 90,
                transition: { duration: 0.2, ease: easeConfig.smooth },
              }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white outline-none focus:outline-none focus:ring-0"
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
