// Premium Animation Configuration
// Pure opacity transitions — zero position jumping

export const springConfig = {
  type: "spring",
  stiffness: 150,
  damping: 20,
  mass: 0.8,
  velocity: 0
};

export const springConfigFast = {
  type: "spring",
  stiffness: 240,
  damping: 24,
  mass: 0.7,
  velocity: 0
};

export const springConfigSlow = {
  type: "spring",
  stiffness: 90,
  damping: 22,
  mass: 1.0,
  velocity: 0
};

export const easeConfig = {
  smooth: [0.33, 1, 0.68, 1],
  butter: [0.2, 0.8, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  inOut: [0.65, 0, 0.35, 1]
};

export const transitionConfig = {
  fast: { duration: 0.18, ease: [0.33, 1, 0.68, 1] },
  base: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] },
  slow: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }
};

// ─── All variants are PURE OPACITY ────────────────────────────
// No y/x/scale changes = zero positional jumping
export const variants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.18, ease: [0.33, 1, 0.68, 1] }
    }
  },

  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.025, delayChildren: 0.01 }
    },
    exit: { opacity: 0, transition: { duration: 0.12 } }
  },

  staggerContainerFast: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: 0.005 }
    },
    exit: { opacity: 0, transition: { duration: 0.08 } }
  },

  // Pure fade — zero position movement
  item: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.33, 1, 0.68, 1] }
    }
  },

  fadeIn: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.33, 1, 0.68, 1] }
    }
  },

  // Very subtle scale (0.98 → 1) for cards/modals — no jump
  scale: {
    hidden: { opacity: 0, scale: 0.98 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.15, ease: [0.33, 1, 0.68, 1] }
    }
  },

  // Modal scale — clean pop-in, very subtle
  modalScale: {
    hidden: { opacity: 0, scale: 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 280, damping: 26, mass: 0.7 }
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      transition: { duration: 0.15, ease: [0.33, 1, 0.68, 1] }
    }
  },

  // Slide Up — for toasts only (enters from bottom edge of screen)
  slideUp: {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      y: 8,
      transition: { duration: 0.15, ease: [0.33, 1, 0.68, 1] }
    }
  },

  slideRight: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: [0.33, 1, 0.68, 1] }
    }
  },

  // List item removal — fade only, no x offset
  listItem: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.18, ease: [0.33, 1, 0.68, 1] }
    }
  },

  // Pop — subtle scale only
  pop: {
    hidden: { opacity: 0, scale: 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.12, ease: [0.33, 1, 0.68, 1] }
    }
  }
};

// Micro-interactions (hover/tap only — not entrance animations)
// Using tween over spring for hover: avoids JS spring simulation on rapid pointer-enters
export const microInteractions = {
  button: {
    hover: {
      scale: 1.03,
      transition: { type: "tween", duration: 0.12, ease: [0.33, 1, 0.68, 1] }
    },
    tap: {
      scale: 0.96,
      transition: { type: "tween", duration: 0.08, ease: [0.33, 1, 0.68, 1] }
    }
  },
  card: {
    hover: {
      y: -3,
      transition: { type: "tween", duration: 0.15, ease: [0.33, 1, 0.68, 1] }
    },
    tap: {
      scale: 0.98,
      transition: { type: "tween", duration: 0.1, ease: [0.33, 1, 0.68, 1] }
    }
  },
  icon: {
    hover: {
      scale: 1.1,
      transition: { type: "tween", duration: 0.12, ease: [0.33, 1, 0.68, 1] }
    },
    tap: {
      scale: 0.9,
      transition: { type: "tween", duration: 0.08, ease: [0.33, 1, 0.68, 1] }
    }
  }
};

export const hoverVariants = {
  lift: {
    rest: { y: 0 },
    hover: { y: -3, transition: { duration: 0.16, ease: [0.33, 1, 0.68, 1] } },
    tap: { y: -1, transition: { duration: 0.08 } }
  }
};
