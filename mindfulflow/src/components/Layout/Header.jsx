import Wind from 'lucide-react/dist/esm/icons/wind';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Flame from 'lucide-react/dist/esm/icons/flame';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Download from 'lucide-react/dist/esm/icons/download';
import Upload from 'lucide-react/dist/esm/icons/upload';
import X from 'lucide-react/dist/esm/icons/x';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Volume2 from 'lucide-react/dist/esm/icons/volume-2';
import VolumeX from 'lucide-react/dist/esm/icons/volume-x';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import MonitorSmartphone from 'lucide-react/dist/esm/icons/monitor-smartphone';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { calculateStreak, downloadBackup, importData, clearAllEntries } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import { springConfigFast, easeConfig, variants, microInteractions } from '../../utils/animations';
import ConfirmModal from '../common/ConfirmModal';
import { db } from '../../utils/db';
import { useSettings } from '../../context/SettingsContext';
import { haptics } from '../../utils/haptics';



/**
 * Main application header with navigation, streak badge and settings.
 */
const Header = memo(function Header({ onBreathingClick, currentView, onViewChange }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const { success, error } = useToast();
  const { settings, updateSettings } = useSettings();

  // Live streak update
  const streak = useLiveQuery(async () => {
    return await calculateStreak();
  }, []) || 0;

  // Fetch settings on mount (e.g., if we added other settings)
  useEffect(() => {
    // Other setup logic could go here
  }, [showSettings]);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = await importData(event.target.result);
        if (result) {
          success('Data byla úspěšně nahrána!');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          error('Chyba při nahrávání dat.');
        }
      } catch (_err) {
        error('Neplatný soubor.');
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset input
  };

  const handleDeleteAllClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeleteAll = async () => {
     const result = await clearAllEntries();
     if (result) {
       // success('Všechna data byla smazána.'); // Toast won't be seen anyway if we reload instantly
       window.location.reload();
     } else {
       error('Nepodařilo se smazat data.');
     }
     setShowDeleteConfirm(false);
  };

  const handleDownload = async () => {
    const result = await downloadBackup();
    if (result) {
      success('Záloha byla stažena.');
    } else {
      error('Nepodařilo se stáhnout zálohu.');
    }
  };

  // Lock body scroll and handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) return; // Don't close settings if confirmation modal is open
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showSettings, showDeleteConfirm]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          transition: springConfigFast
        }}
        className="glass-strong rounded-2xl p-4 mb-8 sticky top-0 z-40"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Logo and Title */}
          <div 
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-glow-violet overflow-hidden">
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
              <span className="text-2xl relative z-10 drop-shadow-md">🧘</span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent tracking-tight hidden md:block drop-shadow-sm">
              MindfulFlow
            </h1>

            {/* Streak counter badge */}
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={streak} // Re-animate on change
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 25,
                  mass: 0.5
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold ml-2"
                title={`${streak} dní v řadě!`}
                style={{ 
                  willChange: 'transform, opacity'
                }}
              >
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{streak}</span>
              </motion.div>
            )}
          </div>

          {/* Main navigation (hidden on mobile, moved to BottomNavigation) */}
          <nav className="hidden sm:flex gap-2 overflow-x-auto hide-scrollbar">
            {['checkin', 'journal', 'statistics', 'achievements'].map((view) => (
              <button
                key={view}
                onClick={() => {
                  if (currentView !== view) haptics.light();
                  onViewChange(view);
                }}
                className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg text-sm font-medium relative whitespace-nowrap ${
                  currentView === view
                    ? 'bg-gradient-to-r from-violet-500/30 to-purple-500/30 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                style={{
                  boxShadow: currentView === view 
                    ? '0 0 20px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(139, 92, 246, 0.1)' 
                    : 'none',
                  transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {view === 'checkin' && 'Check-In'}
                {view === 'journal' && 'Deník'}
                {view === 'statistics' && 'Statistiky'}
                {view === 'achievements' && 'Úspěchy'}
                {currentView === view && (
                  <motion.div
                    key={view}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-purple-400"
                    style={{ borderRadius: '2px' }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {/* SOS Breathing Button */}
            <button
              onClick={() => {
                haptics.medium();
                onBreathingClick();
              }}
              aria-label="Dechová cvičení"
              className="group bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2 rounded-xl font-bold text-white flex items-center gap-2 shadow-glow-orange relative overflow-hidden transition-all hover:scale-105 active:scale-95 outline-none focus:outline-none"
            >
              {/* Animated glimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Wind className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 drop-shadow-md" />
              <span className="hidden lg:inline relative z-10 drop-shadow-md tracking-wide">Dýchání</span>
            </button>
          
            {/* Settings Toggle */}
            <motion.button
              onClick={() => {
                haptics.light();
                setShowSettings(true);
              }}
              aria-label="Nastavení"
              whileHover={{ 
                rotate: 90,
                transition: { duration: 0.2, ease: easeConfig.smooth }
              }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white outline-none focus:outline-none focus:ring-0"
              style={{ 
                transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Settings Modal - Portalled to body to escape Header transforms */}
      {createPortal(
        <AnimatePresence mode="wait">
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: easeConfig.smooth }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <motion.div 
                className="absolute inset-0 bg-black/60 pointer-events-auto"
                onClick={() => setShowSettings(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                variants={variants.modalScale}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl pb-8 px-8 shadow-2xl overflow-hidden text-left max-h-[90vh] overflow-y-auto premium-scroll pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#0f172a] pt-8 z-10 pb-4 border-b border-white/5">
                  <h2 className="text-2xl font-bold text-white">Nastavení</h2>
                  <motion.button 
                    onClick={() => setShowSettings(false)}
                    aria-label="Zavřít"
                    className="p-2 hover:bg-white/10 rounded-full"
                    whileHover={{ 
                      rotate: 90,
                      transition: { duration: 0.2, ease: easeConfig.smooth }
                    }}
                    style={{ 
                      transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <X className="w-6 h-6 text-white/60" />
                  </motion.button>
                </div>

                <div className="space-y-6 select-none">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 mb-4">
                    <h3 className="font-semibold text-lg text-white mb-2">Záloha dat</h3>
                    <p className="text-sm text-white/60 mb-6">Stáhni si zálohu svých záznamů nebo nahraj data ze zálohy.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        onClick={handleDownload}
                        whileHover={microInteractions.button.hover}
                        whileTap={microInteractions.button.tap}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-base whitespace-nowrap"
                        style={{ 
                          transition: 'background-color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
                        }}
                      >
                        <Download className="w-5 h-5" />
                        Exportovat
                      </motion.button>
                      <motion.button
                        onClick={() => fileInputRef.current?.click()}
                        whileHover={microInteractions.button.hover}
                        whileTap={microInteractions.button.tap}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-base whitespace-nowrap"
                        style={{ 
                          transition: 'background-color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
                        }}
                      >
                        <Upload className="w-5 h-5" />
                        Importovat
                      </motion.button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".json"
                        className="hidden"
                      />
                    </div>
                  </div>



                  <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 mb-4">
                    <h3 className="font-semibold text-lg text-red-400 mb-2">Nebezpečná zóna</h3>
                    <p className="text-sm text-red-400/60 mb-6">Tato akce nenávratně smaže všechna data.</p>
                    
                    <motion.button
                      onClick={handleDeleteAllClick}
                      whileHover={microInteractions.button.hover}
                      whileTap={microInteractions.button.tap}
                      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium border border-red-500/20 text-base outline-none focus:outline-none"
                      style={{ 
                        transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                      Smazat všechna data
                    </motion.button>
                  </div>

                  <div className="p-6 rounded-2xl bg-violet-500/5 border border-violet-500/10 mb-4">
                    <h3 className="font-semibold text-lg text-violet-400 mb-2">O aplikaci</h3>
                    <p className="text-sm text-violet-400/80 leading-relaxed mb-4">
                      MindfulFlow je tvůj osobní průvodce pro sledování nálady a péči o duševní zdraví. 
                      Vytvořeno s důrazem na soukromí a klid.
                    </p>
                    <div className="flex items-center gap-3 text-sm text-violet-400/60">
                      <span className="px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 font-mono">v1.0</span>
                      <span>•</span>
                      <span>Offline Ready</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center text-sm text-white/60">
                  MindfulFlow v1.0 • Built with ❤️
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
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

