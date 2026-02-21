// ─── Premium Animation System ────────────────────────────────────────────────
// Framer Motion variants & configs – MindfulFlow
// Principle: every entrance has intentional motion (Y + opacity + optional scale)
// Exits are always faster than entrances.

// ─── Spring Presets ──────────────────────────────────────────────────────────
export const springConfig = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.5,
};

export const springConfigFast = {
  type: "spring",
  stiffness: 300,
  damping: 26,
  mass: 0.4,
};

export const springConfigSlow = {
  type: "spring",
  stiffness: 180,
  damping: 24,
  mass: 0.8,
};

export const springBounce = {
  type: "spring",
  stiffness: 350,
  damping: 15,
  mass: 0.5,
};

// ─── Easing Curves ───────────────────────────────────────────────────────────
export const easeConfig = {
  smooth: [0.32, 0.72, 0, 1], // Out-Expo, very premium
  butter: [0.25, 1, 0.5, 1], // Deceleration
  bounce: [0.34, 1.56, 0.64, 1],
  inOut: [0.65, 0, 0.35, 1],
  out: [0.0, 0.0, 0.2, 1],
};

export const transitionConfig = {
  fast: { duration: 0.15, ease: [0.32, 0.72, 0, 1] },
  base: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
  slow: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
};

// ─── Page Transition Variants ─────────────────────────────────────────────────
// Used by App.jsx for view switching. Improved to prevent jumping and scrolling artifacts.
export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(2px)",
    transition: {
      duration: 0.2,
      ease: [0.65, 0, 0.35, 1],
    },
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
        staggerChildren: 0.07,
        delayChildren: 0.05,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] },
    },
  },

  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.02 },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  },

  staggerContainerFast: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.055, delayChildren: 0.0 },
    },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },

  // Standard item: slide up + fade in
  item: {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 220,
        damping: 22,
        mass: 0.7,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.18, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Gentle fade – for low-key elements
  fadeIn: {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      y: -4,
      transition: { duration: 0.18, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Scale pop – modals, overlays, success cards
  scale: {
    hidden: { opacity: 0, scale: 0.93, y: 8 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 22,
        mass: 0.7,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 4,
      transition: { duration: 0.18, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Modal: spring scale + subtle y
  modalScale: {
    hidden: { opacity: 0, scale: 0.93, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 26, mass: 0.7 },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 10,
      transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Slide up – toasts, banners, tray panels
  slideUp: {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.7,
      },
    },
    exit: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.18, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Slide right – horizontal lists, drawer-style
  slideRight: {
    hidden: { opacity: 0, x: -16 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 220,
        damping: 24,
        mass: 0.7,
      },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.15, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // List item – journal cards, any list
  listItem: {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 22,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Pop – badges, indicators
  pop: {
    hidden: { opacity: 0, scale: 0.6 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 18, mass: 0.5 },
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      transition: { duration: 0.12, ease: [0.65, 0, 0.35, 1] },
    },
  },

  // Greeting hero elements
  heroTitle: {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8,
        delay: 0.05,
      },
    },
  },

  heroEmoji: {
    hidden: { opacity: 0, y: -30, rotate: -15, scale: 0.7 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 240,
        damping: 16,
        mass: 0.7,
      },
    },
  },

  heroSubtitle: {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.18 },
    },
  },

  heroQuote: {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1], delay: 0.28 },
    },
  },
};

// ─── Micro-interactions (hover / tap) ─────────────────────────────────────────
export const microInteractions = {
  button: {
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.5 },
    },
    tap: {
      scale: 0.96,
      transition: { type: "spring", stiffness: 600, damping: 25, mass: 0.4 },
    },
  },
  card: {
    hover: {
      y: -2,
      scale: 1.01,
      transition: { type: "spring", stiffness: 300, damping: 20, mass: 0.5 },
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 22, mass: 0.4 },
    },
  },
  icon: {
    hover: {
      scale: 1.1,
      rotate: 3,
      transition: { type: "spring", stiffness: 400, damping: 18, mass: 0.4 },
    },
    tap: {
      scale: 0.9,
      rotate: -3,
      transition: { type: "spring", stiffness: 600, damping: 20, mass: 0.3 },
    },
  },
};

export const hoverVariants = {
  lift: {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 20, mass: 0.6 },
    },
    tap: {
      y: -2,
      scale: 0.97,
      transition: { type: "spring", stiffness: 400, damping: 22, mass: 0.5 },
    },
  },
};
