import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const InstallPrompt = () => {
  const { isHere, isIOS, isStandalone, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show prompt if available and not standalone
    if (!isStandalone && (isHere || isIOS)) {
      // Delay slightly to not annoy immediately
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isStandalone, isHere, isIOS]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <div className="bg-slate-900/90 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-white font-semibold text-lg">Nainstalovat aplikaci</h3>
                    <p className="text-slate-400 text-sm">
                        {isIOS 
                            ? "Přidej si MindfulFlow na plochu pro nejlepší zážitek." 
                            : "Nainstaluj si aplikaci pro offline přístup a rychlejší načítání."}
                    </p>
                </div>
                <button 
                    onClick={handleDismiss} 
                    className="text-slate-400 hover:text-white p-1"
                >
                    <X size={20} />
                </button>
            </div>

            {isIOS ? (
                <div className="space-y-2 text-sm text-slate-300 bg-white/5 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Share size={16} className="text-blue-400" />
                        <span>1. Klikni na tlačítko <strong>Sdílet</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PlusSquare size={16} className="text-blue-400" />
                        <span>2. Vyber <strong>Přidat na plochu</strong></span>
                    </div>
                </div>
            ) : (
                <button
                    onClick={promptInstall}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <Download size={18} />
                    Nainstalovat
                </button>
            )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;
