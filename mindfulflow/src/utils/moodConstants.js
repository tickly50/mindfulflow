// Mood constants and UI utilities

/**
 * Mood labels in Czech (1-5 scale)
 */
export const MOOD_LABELS = {
  1: "Špatně",
  2: "Ve stresu",
  3: "Unaveně",
  4: "Klidně",
  5: "Skvěle",
};

/**
 * Mood adjectives in Czech (1-5 scale) - Feminine form for "Nálada"
 */
export const MOOD_ADJECTIVES = {
  1: "Špatná",
  2: "Stresová",
  3: "Unavená",
  4: "Klidná",
  5: "Skvělá",
};

/**
 * Mood colors - Premium Palette
 * Each mood has a specific gradient configuration for a deep, rich look
 */
export const MOOD_COLORS = {
  1: {
    // Angry/Bad -> Deep Crimson/Charcoal
    primary: "#ef4444",
    gradient: "linear-gradient(135deg, #18181b 0%, #290505 50%, #450a0a 100%)",
    text: "#fca5a5",
  },
  2: {
    // Stressed -> Deep Amber/Brown
    primary: "#f59e0b",
    gradient: "linear-gradient(135deg, #18181b 0%, #271a00 50%, #451a03 100%)",
    text: "#fcd34d",
  },
  3: {
    // Tired -> Deep Indigo/Slate
    // 3 is middle. Let's make it "Calm Slate".
    primary: "#94a3b8",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    text: "#e2e8f0",
  },
  4: {
    // Calm -> Deep Emerald/Teal
    primary: "#10b981",
    gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)",
    text: "#6ee7b7",
  },
  5: {
    // Great -> Deep Violet/Fuchsia
    primary: "#8b5cf6",
    gradient: "linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #5b21b6 100%)",
    text: "#c4b5fd",
  },
};

/**
 * Context tags available for mood entries
 */
export const CONTEXT_TAGS = [
  { id: "work", label: "Práce", icon: "Briefcase" },
  { id: "sleep", label: "Spánek", icon: "Moon" },
  { id: "family", label: "Rodina", icon: "Users" },
  { id: "health", label: "Zdraví", icon: "Heart" },
  { id: "finance", label: "Finance", icon: "DollarSign" },
  { id: "social", label: "Sociální život", icon: "MessageCircle" },
];

/**
 * Generate premium gradient based on mood
 * @param {number} avgMood - Average mood (1-5)
 * @returns {string} CSS gradient string
 */
export const getGradientForMood = (avgMood) => {
  // Round to nearest integer for color selection
  const moodLevel = Math.round(Math.max(1, Math.min(5, avgMood)));

  // If undefined (e.g. loading), return a neutral dark gradient
  if (!MOOD_COLORS[moodLevel])
    return "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)";

  return MOOD_COLORS[moodLevel].gradient;
};

/**
 * Interpolate between two colors based on a factor
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {string} Interpolated hex color
 */
export const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return rgbToHex(r, g, b);
};

/**
 * Convert hex color to RGB object
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Convert RGB values to hex color
 */
export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
