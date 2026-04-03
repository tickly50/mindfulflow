import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import useScrollLock from '../../hooks/useScrollLock';
import { easeConfig, variants } from '../../utils/animations';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Smazat',
  cancelText = 'Zrušit',
  isDangerous = false 
}) {
  useScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onClose();
        onConfirm();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onConfirm]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, ease: easeConfig.smooth } }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: easeConfig.out } }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 md:backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            variants={variants.modalScale}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1a1f2e]/90 p-8 shadow-2xl md:backdrop-blur-xl"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
              <p className="text-white/70 leading-relaxed text-base">
                {message}
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end w-full">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 min-h-[48px] rounded-xl text-fluid-base font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors touch-manipulation"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onClose();
                  onConfirm();
                }}
                className={`w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-xl text-fluid-base font-medium text-white shadow-lg transition-transform active:scale-95 touch-manipulation ${
                  isDangerous 
                    ? 'bg-red-500/80 hover:bg-red-500 shadow-red-500/20' 
                    : 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/20'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
