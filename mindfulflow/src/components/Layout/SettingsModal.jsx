import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { easeConfig, variants, microInteractions } from '../../utils/animations';
import {
  Trash2,
  Download,
  Upload,
  X,
  Vibrate,
  Volume2,
} from 'lucide-react';

/**
 * Full-screen settings panel (portalled to `document.body`).
 */
export default function SettingsModal({
  open,
  onClose,
  settings,
  updateSettings,
  fileInputRef,
  onImportFile,
  onDownloadBackup,
  onRequestDeleteAll,
}) {
  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: easeConfig.smooth }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            className="absolute inset-0 bg-black/60 pointer-events-auto"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easeConfig.smooth }}
          />
          <motion.div
            variants={variants.modalScale}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative w-full min-w-0 max-w-2xl bg-theme-elevated border border-theme-border rounded-3xl pb-6 sm:pb-8 px-[clamp(1rem,4vw,2rem)] shadow-depth-lg overflow-hidden text-left max-h-[min(90vh,100dvh)] overflow-y-auto premium-scroll pointer-events-auto transition-[background-color,border-color] duration-theme"
            onClick={(e) => e.stopPropagation()}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 sticky top-0 bg-theme-elevated pt-6 sm:pt-8 z-10 pb-4 border-b border-theme-border">
              <h2 className="text-fluid-2xl font-bold text-theme-text truncate tracking-tight">Nastavení</h2>
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Zavřít"
                className="touch-target shrink-0 hover:bg-[var(--accent-glow)] rounded-full"
                whileHover={{
                  rotate: 90,
                  transition: { duration: 0.2, ease: easeConfig.smooth },
                }}
                style={{
                  transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <X className="w-6 h-6 text-theme-muted" />
              </motion.button>
            </div>

            <div className="space-y-6 select-none">
              <div className="p-6 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent)]/20 mb-4">
                <h3 className="font-semibold text-lg text-[var(--accent-soft)] mb-2">O aplikaci</h3>
                <p className="text-sm text-theme-text/85 leading-relaxed mb-4">
                  MindfulFlow je tvůj osobní průvodce pro sledování nálady a péči o duševní zdraví. Vytvořeno s
                  důrazem na soukromí a klid.
                </p>
                <div className="flex items-center gap-3 text-sm text-theme-muted">
                  <span className="px-2 py-1 rounded-md bg-theme-card border border-theme-border font-mono">
                    v1.0
                  </span>
                  <span>•</span>
                  <span>Offline Ready</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-theme-card border border-theme-border mb-4">
                <h3 className="font-semibold text-lg text-theme-text mb-4">Předvolby</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-theme-elevated flex items-center justify-center">
                        <Vibrate className="w-4 h-4 text-theme-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-theme-text">Haptická odezva</p>
                        <p className="text-xs text-theme-muted">Vibrace při interakcích</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                        settings.hapticsEnabled ? 'bg-[var(--accent)]' : 'bg-theme-elevated'
                      }`}
                      role="switch"
                      aria-checked={settings.hapticsEnabled}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-theme-elevated flex items-center justify-center">
                        <Volume2 className="w-4 h-4 text-theme-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-theme-text">Zvuky dýchání</p>
                        <p className="text-xs text-theme-muted">Tóny při dechových cvičeních</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                        settings.soundEnabled ? 'bg-[var(--accent)]' : 'bg-theme-elevated'
                      }`}
                      role="switch"
                      aria-checked={settings.soundEnabled}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-theme-card border border-theme-border mb-4">
                <h3 className="font-semibold text-lg text-theme-text mb-2">Záloha dat</h3>
                <p className="text-sm text-theme-muted mb-6 leading-relaxed">Stáhni si zálohu svých záznamů nebo nahraj data ze zálohy.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    onClick={onDownloadBackup}
                    whileHover={microInteractions.button.hover}
                    whileTap={microInteractions.button.tap}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-[var(--accent)] hover:opacity-95 text-white font-medium text-base whitespace-nowrap"
                    style={{
                      transition: 'background-color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                  >
                    <Download className="w-5 h-5" />
                    Exportovat
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={microInteractions.button.hover}
                    whileTap={microInteractions.button.tap}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-theme-elevated hover:bg-[var(--accent-glow)] text-theme-text font-medium text-base whitespace-nowrap border border-theme-border"
                    style={{
                      transition: 'background-color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                  >
                    <Upload className="w-5 h-5" />
                    Importovat
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onImportFile}
                    accept=".json"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 mb-4">
                <h3 className="font-semibold text-lg text-red-400 mb-2">Nebezpečná zóna</h3>
                <p className="text-sm text-red-400/60 mb-6">Tato akce nenávratně smaže všechna data.</p>

                <motion.button
                  type="button"
                  onClick={onRequestDeleteAll}
                  whileHover={microInteractions.button.hover}
                  whileTap={microInteractions.button.tap}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium border border-red-500/20 text-base outline-none focus:outline-none"
                  style={{
                    transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                  Smazat všechna data
                </motion.button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-theme-muted">
              MindfulFlow v1.0 • Built with <span aria-hidden="true">❤️</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
