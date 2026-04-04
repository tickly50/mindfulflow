import { motion, useReducedMotion } from 'framer-motion';
import { variants, reducedMotionVariants } from '../utils/animations';

import { Check, X, Info, AlertTriangle } from 'lucide-react';

export const Toast = ({ message, type, onClose }) => {
  const prefersReduced = useReducedMotion();
  const slideVariants = prefersReduced ? reducedMotionVariants.slideUp : variants.slideUp;

  const icons = {
    success: <Check className="w-5 h-5 text-violet-400" />,
    error: <X className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-400" />
  };

  const bgColors = {
    success: 'bg-violet-500/10 border-violet-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
    warning: 'bg-orange-500/10 border-orange-500/20'
  };

  return (
    <motion.div
      variants={slideVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg w-full max-w-[min(100%,24rem)] sm:min-w-[min(100%,300px)] sm:w-auto ${bgColors[type] || bgColors.info} bg-[#0f172a]/95 min-w-0`}
    >
      <div className="shrink-0">{icons[type] || icons.info}</div>
      <p className="text-white/90 text-sm font-medium flex-1">{message}</p>
      <motion.button 
        onClick={onClose} 
        aria-label="Zavřít okno"
        className="text-white/60 hover:text-white min-w-[44px] min-h-[44px] inline-flex items-center justify-center shrink-0 -mr-1 rounded-lg"
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
