// ─── Premium Animation System ────────────────────────────────────────────────
// Framer Motion variants & configs – MindfulFlow
// Principle: every entrance has intentional motion (Y + opacity + optional scale)
// Exits are always faster than entrances.
//
// Usage with useReducedMotion:
//   import { useReducedMotion } from 'framer-motion';
//   import { reducedMotionVariants } from './animations';
//   const prefersReduced = useReducedMotion();
//   const myVariants = prefersReduced ? reducedMotionVariants.item : variants.item;

// ─── Spring Presets ──────────────────────────────────────────────────────────
export const springConfigFast = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.5,
};

export const springConfigGentle = {
  type: "spring",
  stiffness: 200,
  damping: 28,
  mass: 0.8,
};

export const springConfigSnappy = {
  type: "spring",
  stiffness: 400,
  damping: 35,
  mass: 0.4,
};

// ─── Easing Curves ───────────────────────────────────────────────────────────
export const easeConfig = {
  smooth: [0.4, 0.0, 0.2, 1.0],
  butter: [0.25, 0.1, 0.25, 1.0],
  bounce: [0.34, 1.56, 0.64, 1],
  inOut: [0.4, 0.0, 0.2, 1.0],
  out: [0.0, 0.0, 0.2, 1.0],
  expo: [0.16, 1, 0.3, 1],
};

// ─── Page Transition Variants ─────────────────────────────────────────────────
// Used by App.jsx for view switching. Improved to prevent jumping and scrolling artifacts.
const easeStudio = [0.16, 1, 0.3, 1];

export const pageVariants = {
  initial: { opacity: 0, y: 28, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: easeStudio },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.99,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

// ─── Component Variants ───────────────────────────────────────────────────────

export const variants = {
  // Container: orchestrates children stagger
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.06,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.4, 0.0, 0.2, 1.0] },
    },
  },

  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.04 },
    },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  },

  staggerContainerFast: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.02 },
    },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },

  // Standard item: cinematic rise
  item: {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeStudio },
    },
    exit: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  },

  // Gentle fade – for low-key elements
  fadeIn: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.25, ease: [0.4, 0.0, 0.2, 1.0] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.4, 0.0, 0.2, 1.0] },
    },
  },

  // Fade – modals, overlays, success cards
  scale: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Modal fade
  modalScale: {
    hidden: { opacity: 0, scale: 0.97 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.15, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Slide up – toasts, banners, tray panels
  slideUp: {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.52, ease: easeStudio },
    },
    exit: {
      opacity: 0,
      y: -12,
      transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Slide right – horizontal lists, drawer-style
  slideRight: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // List item – journal cards, any list
  listItem: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Pop – badges, indicators
  pop: {
    hidden: { opacity: 0, scale: 0.85 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.12, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Tab content switching — clean crossfade
  tabContent: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
    },
  },

  // Greeting hero elements — pure fade, no movement
  heroTitle: {
    hidden: { opacity: 0, y: 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.62, ease: easeStudio, delay: 0.08 },
    },
  },

  heroEmoji: {
    hidden: { opacity: 0, y: -28, scale: 0.85 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 22, mass: 0.7 },
    },
  },

  heroSubtitle: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeStudio, delay: 0.14 },
    },
  },

  heroQuote: {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: easeStudio, delay: 0.22 },
    },
  },
};

// ─── Reduced Motion Variants ─────────────────────────────────────────────────
// Opacity-only variants for users with prefers-reduced-motion.
// GPU composited (opacity only) — zero layout impact, zero jank.
export const reducedMotionVariants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  },
  item: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  },
  scale: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  },
  slideUp: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  },
  listItem: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },
  // Page transition — opacity-only for a11y
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, transition: { duration: 0.14 } },
  },
};

// ─── Micro-interactions (hover / tap) ─────────────────────────────────────────
export const microInteractions = {
  button: {
    hover: {
      scale: 1.035,
      transition: { type: "spring", stiffness: 420, damping: 26, mass: 0.45 },
    },
    tap: {
      scale: 0.94,
      transition: { type: "spring", stiffness: 620, damping: 28, mass: 0.35 },
    },
  },
  card: {
    hover: {
      scale: 1.018,
      transition: { type: "spring", stiffness: 340, damping: 26, mass: 0.5 },
    },
    tap: {
      scale: 0.97,
      transition: { type: "spring", stiffness: 450, damping: 24, mass: 0.4 },
    },
  },
  icon: {
    hover: {
      scale: 1.12,
      rotate: 5,
      transition: { type: "spring", stiffness: 440, damping: 19, mass: 0.4 },
    },
    tap: {
      scale: 0.88,
      rotate: -5,
      transition: { type: "spring", stiffness: 650, damping: 22, mass: 0.3 },
    },
  },
};

