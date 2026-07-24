// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light Theme
        'background': '#F9FAFB', // Almost white, very light gray
        'foreground': '#FFFFFF', // Card backgrounds, etc.
        'card': '#FFFFFF',
        'card-foreground': '#030712', // Text on cards
        'popover': '#FFFFFF',
        'popover-foreground': '#030712',
        'primary': '#6366F1', // Indigo-500
        'primary-foreground': '#FFFFFF', // Text on primary buttons
        'secondary': '#F3F4F6', // Gray-100, for secondary buttons, backgrounds
        'secondary-foreground': '#1F2937', // Text on secondary
        'muted': '#F3F4F6', // Gray-100, for subtle backgrounds
        'muted-foreground': '#6B7280', // Gray-500, for placeholder text, etc.
        'accent': '#ECFDF5', // Green-50, for highlights
        'accent-foreground': '#065F46', // Green-800
        'destructive': '#EF4444', // Red-500
        'destructive-foreground': '#FFFFFF',
        'border': '#E5E7EB', // Gray-200
        'input': '#E5E7EB',
        'ring': '#6366F1', // Focus rings

        // Dark Theme
        'dark-background': '#030712', // Very dark blue/black
        'dark-foreground': '#111827', // Dark gray for card backgrounds
        'dark-card': '#09090B', // Slightly lighter than background
        'dark-card-foreground': '#F9FAFB', // Text on cards
        'dark-popover': '#09090B',
        'dark-popover-foreground': '#F9FAFB',
        'dark-primary': '#818CF8', // Lighter indigo for contrast
        'dark-primary-foreground': '#030712',
        'dark-secondary': '#1F2937', // Gray-800
        'dark-secondary-foreground': '#F9FAFB',
        'dark-muted': '#1F2937',
        'dark-muted-foreground': '#9CA3AF', // Gray-400
        'dark-accent': '#1F2937', // Darker accent background
        'dark-accent-foreground': '#A7F3D0', // Lighter green
        'dark-destructive': '#F87171', // Lighter red
        'dark-destructive-foreground': '#030712',
        'dark-border': '#1F2937', // Gray-800
        'dark-input': '#1F2937',
        'dark-ring': '#818CF8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}