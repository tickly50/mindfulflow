// Mood constants and UI utilities
import { Briefcase, Moon, Users, Heart, DollarSign, MessageCircle } from 'lucide-react';

export const MOOD_LABELS = {
  1: 'Špatně',
  2: 'Ve stresu',
  3: 'Unaveně',
  4: 'Klidně',
  5: 'Skvěle',
};

export const MOOD_ADJECTIVES = {
  1: 'Špatná',
  2: 'Stresová',
  3: 'Unavená',
  4: 'Klidná',
  5: 'Skvělá',
};

/** Fialová + jemný teal — prémiový wellness tón */
export const MOOD_COLORS = {
  1: {
    primary: '#5b21b6',
    gradient: 'linear-gradient(145deg, #1c1917 0%, #4c1d95 55%, #115e59 100%)',
    text: '#ddd6fe',
  },
  2: {
    primary: '#6d28d9',
    gradient: 'linear-gradient(145deg, #312e81 0%, #5b21b6 50%, #0f766e 100%)',
    text: '#e9d5ff',
  },
  3: {
    primary: '#8b5cf6',
    gradient: 'linear-gradient(145deg, #4c1d95 0%, #7c3aed 45%, #14b8a6 100%)',
    text: '#f3e8ff',
  },
  4: {
    primary: '#8b5cf6',
    gradient: 'linear-gradient(145deg, #5b21b6 0%, #8b5cf6 50%, #2dd4bf 100%)',
    text: '#ede9fe',
  },
  5: {
    primary: '#a78bfa',
    gradient: 'linear-gradient(145deg, #6d28d9 0%, #a78bfa 40%, #5eead4 100%)',
    text: '#f5f3ff',
  },
};

export const CONTEXT_TAG_ICONS = {
  Briefcase,
  Moon,
  Users,
  Heart,
  DollarSign,
  MessageCircle,
};

export const CONTEXT_TAGS = [
  { id: 'work', label: 'Práce', icon: 'Briefcase' },
  { id: 'sleep', label: 'Spánek', icon: 'Moon' },
  { id: 'family', label: 'Rodina', icon: 'Users' },
  { id: 'health', label: 'Zdraví', icon: 'Heart' },
  { id: 'finance', label: 'Finance', icon: 'DollarSign' },
  { id: 'social', label: 'Sociální život', icon: 'MessageCircle' },
];
