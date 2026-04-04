import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const SettingsContext = createContext();

const THEME_META_COLORS = { dark: '#0d1117', light: '#fafaf9' };

function applyThemeToDocument(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
  const meta = document.getElementById('meta-theme-color');
  if (meta) {
    meta.setAttribute('content', THEME_META_COLORS[theme] || THEME_META_COLORS.dark);
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      theme: 'dark',
      hapticsEnabled: true,
      soundEnabled: true,
      soundscape: 'rain',
      customBreathing: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    };
    const saved = localStorage.getItem('mindfulflow_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          theme: parsed.theme === 'light' ? 'light' : 'dark',
          customBreathing: {
            ...defaultSettings.customBreathing,
            ...(parsed.customBreathing || {}),
          },
        };
      } catch (_e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    applyThemeToDocument(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    localStorage.setItem('mindfulflow_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const contextValue = useMemo(() => ({ settings, updateSettings }), [settings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);
