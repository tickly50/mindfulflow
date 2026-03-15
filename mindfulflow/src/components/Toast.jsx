import { motion } from 'framer-motion';

import { Check, X, Info, AlertTriangle } from 'lucide-react';

export const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <Check className="w-5 h-5 text-emerald-400" />,
    error: <X className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-400" />
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
    warning: 'bg-orange-500/10 border-orange-500/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
      transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.5 }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg w-full sm:min-w-[300px] sm:w-auto ${bgColors[type] || bgColors.info} bg-[#0f172a]/95`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="shrink-0">{icons[type] || icons.info}</div>
      <p className="text-white/90 text-sm font-medium flex-1">{message}</p>
      <motion.button 
        onClick={onClose} 
        aria-label="Zavřít okno"
        className="text-white/60 hover:text-white p-2 sm:p-3 -mr-2"
        whileHover={{ 
          rotate: 90,
          transition: { duration: 0.2 }
        }}
        style={{ 
          transition: 'color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        <X className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};
