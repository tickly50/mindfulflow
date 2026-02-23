import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../utils/db';
import { microInteractions } from '../../utils/animations';
import { Palette } from 'lucide-react';

const themes = [
  { id: 'default', label: 'Půlnoční oceán', color: '#0f172a' },
  { id: 'forest', label: 'Lesní ambient', color: '#064e3b' },
  { id: 'sunset', label: 'Západ slunce', color: '#450a0a' },
  { id: 'amethyst', label: 'Ametystový sen', color: '#2e1065' },
];

export default function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState('default');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await db.settings.get('theme');
        if (saved && saved.value) {
          setActiveTheme(saved.value);
        }
      } catch (e) {
        console.error("Failed to load theme setting", e);
      }
    };
    loadTheme();
  }, []);

  const handleThemeChange = async (themeId) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    try {
      await db.settings.put({ key: 'theme', value: themeId });
    } catch (e) {
      console.error("Failed to save theme setting", e);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 mb-4 relative z-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-violet-400" />
          Téma aplikace
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <motion.button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            whileHover={microInteractions.button.hover}
            whileTap={microInteractions.button.tap}
            className={`flex flex-col items-center justify-center p-3 rounded-xl relative transition-colors ${
              activeTheme === theme.id 
                ? 'bg-white/10' 
                : 'bg-black/20 hover:bg-white/5'
            }`}
          >
            <div 
              className="w-8 h-8 rounded-full mb-2 shadow-inner border border-white/10"
              style={{ backgroundColor: theme.color }}
            />
            <span className="text-sm text-white/90 font-medium">{theme.label}</span>
            {activeTheme === theme.id && (
              <motion.div
                layoutId="activeThemeHighlight"
                className="absolute inset-0 border-2 border-violet-400/50 rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
