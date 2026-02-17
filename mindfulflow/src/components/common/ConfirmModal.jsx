import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

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
  // Lock body scroll when modal is open and handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        onConfirm();
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1a1f2e]/90 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
              <p className="text-white/70 leading-relaxed text-base">
                {message}
              </p>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-base font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-6 py-2.5 rounded-xl text-base font-medium text-white shadow-lg transition-transform active:scale-95 ${
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
