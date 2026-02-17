// Premium Animation Configuration
// Ultra-smooth animations with hardware acceleration

// Performance-optimized spring configurations
// Performance-optimized spring configurations
export const springConfig = {
  type: "spring",
  stiffness: 120, // Lower stiffness for "buttery" feel (was 260)
  damping: 20,    // Adjusted damping to prevent oscillation but keep it soft
  mass: 1,
  velocity: 0
};

export const springConfigFast = {
  type: "spring",
  stiffness: 200, // Faster but still smooth (was 400)
  damping: 25,
  mass: 1,
  velocity: 0
};

export const springConfigSlow = {
  type: "spring",
  stiffness: 80,
  damping: 20,
  mass: 1.2,
  velocity: 0
};

// Easing functions for smooth transitions
export const easeConfig = {
  smooth: [0.33, 1, 0.68, 1], // Smooth ease-out
  butter: [0.2, 0.8, 0.2, 1], // Ultra-smooth custom bezier
  bounce: [0.68, -0.55, 0.265, 1.55], // Subtle bounce
  inOut: [0.65, 0, 0.35, 1] // Ease-in-out
};

// Optimized transition configurations
export const transitionConfig = {
  fast: { duration: 0.2, ease: easeConfig.smooth },
  base: { duration: 0.4, ease: easeConfig.butter }, // Slightly longer for premium feel
  slow: { duration: 0.6, ease: easeConfig.smooth }
};

export const variants = {
  // Page/Container Transitions
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.2,
        when: "afterChildren",
      } 
    }
  },

  // Stagger Containers - dedicated for lists/grids
  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Slightly faster stagger
        delayChildren: 0.05
      }
    },
    exit: { opacity: 0 }
  },

  staggerContainerFast: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02
      }
    },
    exit: { opacity: 0 }
  },
  
  // Element Entrances (Fade + Slide Up) - GPU optimized
  item: {
    hidden: { 
      opacity: 0, 
      y: 20, // Reduced travel distance for more subtle enter
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: springConfigFast // Use fast spring for entrances
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 } 
    }
  },

  // Simple Fade - optimized for opacity-only changes
  fadeIn: {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { duration: 0.4, ease: easeConfig.butter }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  },

  // Scale Entrances (for cards/modals) - with transform optimization
  scale: {
    hidden: { 
      opacity: 0, 
      scale: 0.95, // Subtle scale
    },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: springConfig
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  },

  // Slide In (for toasts/panels)
  slideUp: {
    hidden: { 
      opacity: 0, 
      y: 30,
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: springConfigFast
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.2 } 
    }
  },

  // Slide from Right (for panels/drawers)
  slideRight: {
    hidden: { 
      opacity: 0, 
      x: 30,
    },
    show: { 
      opacity: 1, 
      x: 0,
      transition: springConfigFast
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 } 
    }
  },

  // Pop effect (for buttons/interactive elements)
  pop: {
    hidden: { 
      scale: 0.9,
      opacity: 0
    },
    show: { 
      scale: 1,
      opacity: 1,
      transition: springConfig
    },
    exit: { 
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.15 } 
    }
  }
};

// Standardized Micro-interactions
export const microInteractions = {
  button: {
    hover: { 
      scale: 1.02, 
      transition: { type: "spring", stiffness: 400, damping: 15 } 
    },
    tap: { 
      scale: 0.97,
      transition: { type: "spring", stiffness: 400, damping: 15 } 
    }
  },
  card: {
    hover: { 
      y: -5, 
      scale: 1.01,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    tap: { 
      scale: 0.98,
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  },
  icon: {
    hover: { 
      scale: 1.15, 
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 15 } 
    },
    tap: { 
      scale: 0.9,
      rotate: -5
    }
  }
};

// Hover animation presets
export const hoverVariants = {
  lift: {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.2, ease: easeConfig.smooth }
    },
    tap: { 
      y: -2, 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },
  scale: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: easeConfig.smooth }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  },
  glow: {
    rest: { filter: "brightness(1)" },
    hover: { 
      filter: "brightness(1.2)",
      transition: { duration: 0.2 }
    }
  }
};

// Gesture animation utilities
export const gestureConfig = {
  drag: {
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.2,
    dragTransition: { bounceStiffness: 600, bounceDamping: 20 }
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 }
  }
};
