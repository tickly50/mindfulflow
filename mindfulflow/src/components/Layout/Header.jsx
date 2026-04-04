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
import { Wind, Flame, Settings, Menu, X, Home, BookHeart, BarChart3, Award, Sun, Moon } from 'lucide-react';
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
      <header className="border-b border-theme-border py-3 sm:py-4 sticky top-0 z-40 w-full min-w-0 transition-[border-color] duration-theme">
        <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 md:flex-initial">
            <button
              type="button"
              className="md:hidden touch-target shrink-0 rounded-xl border border-theme-border bg-theme-elevated text-theme-text hover:bg-theme-card -ml-1 transition-colors duration-theme"
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-theme-elevated flex items-center justify-center border border-theme-border">
              <span className="text-lg sm:text-xl leading-none">🧘</span>
            </div>
            <h1 className="font-semibold text-lg sm:text-xl text-theme-text truncate min-w-0 tracking-tight">
              MindfulFlow
            </h1>

            {streak > 0 && (
              <div
                className="flex items-center gap-1 text-sm text-theme-muted ml-2 shrink-0 tabular-nums"
                title={`${streak} dní v řadě!`}
              >
                <Flame className="w-3.5 h-3.5 opacity-70 shrink-0" aria-hidden />
                <span>{streak}</span>
              </div>
            )}
          </div>

          <nav
            className="hidden md:flex gap-5 lg:gap-6 max-w-full min-w-0 items-center"
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
                className={`py-2 min-h-[44px] text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  currentView === id
                    ? 'text-theme-text'
                    : 'text-theme-muted hover:text-theme-text'
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
                haptics.light();
                setMobileNavOpen(false);
                updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
              }}
              aria-label={settings.theme === 'dark' ? 'Světlý režim' : 'Tmavý režim'}
              className="touch-target rounded-lg border border-theme-border bg-theme-card text-theme-muted hover:text-theme-text hover:bg-theme-elevated shrink-0 transition-[background-color,color,border-color] duration-theme ease-out"
            >
              {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                haptics.medium();
                setMobileNavOpen(false);
                onBreathingClick();
              }}
              aria-label="Dechová cvičení"
              className="px-3 sm:px-4 min-h-[44px] rounded-lg border border-theme-border bg-transparent text-theme-text hover:bg-theme-elevated text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors duration-200"
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
              className="touch-target rounded-lg border border-theme-border bg-theme-card text-theme-muted hover:text-theme-text hover:bg-theme-elevated shrink-0 transition-[background-color,color,border-color] duration-theme ease-out"
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
              className="fixed inset-0 z-[45] bg-[var(--bg)]/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <nav
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigace aplikace"
              className="fixed top-0 right-0 bottom-0 z-[46] w-[min(100%,20rem)] flex flex-col border-l border-theme-border bg-theme-card pt-safe pb-6 px-4 md:hidden transition-colors duration-theme"
            >
              <div className="flex items-center justify-between gap-2 py-4 border-b border-theme-border mb-4 shrink-0">
                <span className="font-semibold text-theme-text truncate">Menu</span>
                <button
                  type="button"
                  className="touch-target rounded-xl border border-theme-border bg-theme-elevated"
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
                        className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 min-h-[48px] text-left text-sm font-medium transition-colors duration-200 ${
                          active
                            ? 'bg-theme-elevated text-theme-text'
                            : 'text-theme-muted hover:text-theme-text hover:bg-theme-elevated/60'
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
