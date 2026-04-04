import { AnimatePresence } from 'framer-motion';
import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { calculateStreak as calcStreakPure } from '../../utils/moodCalculations';
import { downloadBackup, importData, clearAllEntries } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
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

const NAV = [
  { id: 'checkin', label: 'Check-In' },
  { id: 'journal', label: 'Deník' },
  { id: 'statistics', label: 'Statistiky' },
  { id: 'achievements', label: 'Úspěchy' },
];

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
          const text = typeof event.target?.result === 'string' ? event.target.result : '';
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
    return () => window.removeEventListener('keydown', handleEsc);
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
      <header className="rounded-xl border border-zinc-600/90 bg-zinc-900/95 p-3 sm:p-4 mb-6 md:mb-8 sticky top-0 z-40 max-w-full min-w-0">
        <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 md:flex-initial">
            <button
              type="button"
              className="md:hidden touch-target shrink-0 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 -ml-1"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileNavOpen ? 'Zavřít menu' : 'Otevřít menu'}
              onClick={() => {
                haptics.light();
                setMobileNavOpen((o) => !o);
              }}
            >
              {mobileNavOpen ? <X className="w-6 h-6" strokeWidth={2} /> : <Menu className="w-6 h-6" strokeWidth={2} />}
            </button>
            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-lg bg-violet-600 flex items-center justify-center border border-violet-500">
              <span className="text-xl sm:text-2xl leading-none">🧘</span>
            </div>
            <h1 className="font-bold text-fluid-2xl md:text-fluid-3xl text-zinc-100 truncate min-w-0 leading-tight">
              MindfulFlow
            </h1>

            {streak > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-violet-500/40 bg-violet-950/50 text-violet-200 text-sm font-semibold ml-2 shrink-0"
                title={`${streak} dní v řadě!`}
              >
                <Flame className="w-4 h-4 text-violet-400 shrink-0" />
                <span>{streak}</span>
              </div>
            )}
          </div>

          <nav
            className="hidden md:flex gap-1 p-1 rounded-lg border border-zinc-700 bg-zinc-950/80 max-w-full min-w-0"
            aria-label="Hlavní navigace"
          >
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  if (currentView !== id) haptics.light();
                  onViewChange(id);
                }}
                className={`px-3 lg:px-4 py-2 min-h-[44px] rounded-md text-xs lg:text-sm font-semibold whitespace-nowrap transition-colors ${
                  currentView === id
                    ? 'bg-violet-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto md:ml-0 shrink-0">
            <button
              type="button"
              onClick={() => {
                haptics.medium();
                setMobileNavOpen(false);
                onBreathingClick();
              }}
              aria-label="Dechová cvičení"
              className="px-3 sm:px-4 min-h-[44px] rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 border border-violet-500 transition-colors"
            >
              <Wind className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">Dýchání</span>
            </button>

            <button
              type="button"
              onClick={() => {
                haptics.light();
                setMobileNavOpen(false);
                setShowSettings(true);
              }}
              aria-label="Nastavení"
              className="touch-target rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white shrink-0"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <button
              type="button"
              aria-label="Zavřít menu"
              className="fixed inset-0 z-[45] bg-black/60 md:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <nav
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigace aplikace"
              className="fixed top-0 right-0 bottom-0 z-[46] w-[min(100%,20rem)] flex flex-col border-l border-zinc-600 bg-zinc-950 pt-safe pb-6 px-4 md:hidden"
            >
              <div className="flex items-center justify-between gap-2 py-4 border-b border-zinc-700 mb-4 shrink-0">
                <span className="font-semibold text-zinc-100 truncate">Menu</span>
                <button
                  type="button"
                  className="touch-target rounded-lg border border-zinc-600 bg-zinc-800"
                  aria-label="Zavřít menu"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ul className="flex flex-col gap-1 overflow-y-auto flex-1">
                {MOBILE_NAV.map(({ id, label, Icon }) => {
                  const active = currentView === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => handleMobileNav(id)}
                        className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 min-h-[48px] text-left font-semibold transition-colors ${
                          active
                            ? 'bg-violet-600 text-white'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <Icon className="w-6 h-6 shrink-0" strokeWidth={2} />
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
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
        onRequestDeleteAll={() => setShowDeleteConfirm(true)}
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
