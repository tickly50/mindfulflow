import { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from '../components/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    // Clear timeout if exists
    if (timeoutRefs.current.has(id)) {
      clearTimeout(timeoutRefs.current.get(id));
      timeoutRefs.current.delete(id);
    }
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration) {
      const timeoutId = setTimeout(() => {
        removeToast(id);
      }, duration);
      timeoutRefs.current.set(id, timeoutId);
    }
  }, [removeToast]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    const timeouts = timeoutRefs.current;
    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  const success = (msg) => addToast(msg, 'success');
  const error = (msg) => addToast(msg, 'error');
  const info = (msg) => addToast(msg, 'info');

  const contextValue = useMemo(() => ({ addToast, removeToast, success, error, info }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[9999] flex flex-col gap-3 items-stretch sm:items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

