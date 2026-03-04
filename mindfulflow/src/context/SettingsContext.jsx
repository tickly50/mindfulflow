import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      hapticsEnabled: true,
      soundEnabled: true,
      soundscape: 'rain',
      customBreathing: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
    };
    const saved = localStorage.getItem('mindfulflow_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { 
          ...defaultSettings, 
          ...parsed,
          customBreathing: {
            ...defaultSettings.customBreathing,
            ...(parsed.customBreathing || {})
          }
        };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('mindfulflow_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
