// Mood constants and UI utilities
import { Briefcase, Moon, Users, Heart, DollarSign, MessageCircle } from 'lucide-react';

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
 * Map from icon name string (as stored in CONTEXT_TAGS) to Lucide React component.
 * Used by ActivityStats and InsightsCard to resolve icon components.
 */
export const CONTEXT_TAG_ICONS = {
  Briefcase,
  Moon,
  Users,
  Heart,
  DollarSign,
  MessageCircle,
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

