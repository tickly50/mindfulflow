import { memo, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { PresetSelector } from './PresetSelector';
import { BreathingSession } from './BreathingSession';

/* ─────────────────────────────────────────────────────────────
   Breathing techniques
───────────────────────────────────────────────────────────── */
const TECHNIQUES = [
  {
    id: '478',
    name: '4-7-8',
    subtitle: 'Zklidnění & spánek',
    emoji: '🌙',
    accent: '#c4b5fd',
    bg: ['#0d0a1e', '#1a0e3d'],
    glow: '#7c3aed',
    phases: [
      { name: 'inhale', label: 'NÁDECH', hint: 'Pomalu vdechuj nosem',      seconds: 4 },
      { name: 'hold',   label: 'DRŽÍ',   hint: 'Zadrž dech, uvolni tělo',   seconds: 7 },
      { name: 'exhale', label: 'VÝDECH', hint: 'Pomalu vydechuj ústy',       seconds: 8 },
    ],
    fact: 'Aktivuje parasympatický nervový systém a rychle snižuje úzkost.',
  },
  {
    id: 'box',
    name: 'Box',
    subtitle: 'Soustředění & klid',
    emoji: '🧘',
    accent: '#67e8f9',
    bg: ['#040f1a', '#062035'],
    glow: '#0891b2',
    phases: [
      { name: 'inhale', label: 'NÁDECH', hint: 'Vdechuj pomalu nosem',        seconds: 4 },
      { name: 'hold1',  label: 'DRŽÍ',   hint: 'Drž dech rovnoměrně',         seconds: 4 },
      { name: 'exhale', label: 'VÝDECH', hint: 'Vydechuj pomalu ústy',         seconds: 4 },
      { name: 'hold2',  label: 'PAUZA',  hint: 'Odpočiň si před nádechem',    seconds: 4 },
    ],
    fact: 'Technika elitních vojáků a sportovců pro maximální koncentraci.',
  },
  {
    id: 'equal',
    name: 'Rovnoměrné',
    subtitle: 'Pro začátečníky',
    emoji: '💨',
    accent: '#86efac',
    bg: ['#031a10', '#06311e'],
    glow: '#059669',
    phases: [
      { name: 'inhale', label: 'NÁDECH', hint: 'Hluboký nádech nosem',  seconds: 5 },
      { name: 'exhale', label: 'VÝDECH', hint: 'Pomalý výdech ústy',    seconds: 5 },
    ],
    fact: 'Synchronizuje srdeční tep a uklidňuje nervový systém za minutu.',
  },
];

/* ─────────────────────────────────────────────────────────────
   Root overlay (portal)
───────────────────────────────────────────────────────────── */
const BreathingOverlay = memo(function BreathingOverlay({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null);

  const handleClose = useCallback(() => {
    setSelected(null);
    onClose();
  }, [onClose]);

  const handleBack = useCallback(() => setSelected(null), []);

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && !selected && (
        <PresetSelector
          key="selector"
          techniques={TECHNIQUES}
          onSelect={setSelected}
          onClose={handleClose}
        />
      )}
      {isOpen && selected && (
        <BreathingSession
          key={selected.id}
          technique={selected}
          onClose={handleClose}
          onBack={handleBack}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
});

export default BreathingOverlay;
