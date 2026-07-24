// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // =========================================================
        // Semantic Tokens (keep your existing keys to avoid breakage)
        // =========================================================

        // Light Theme (warm luxury)
        background: "#FBF7F3", // Warm ivory (page background)
        foreground: "#FFFFFF", // Surface (cards, nav surface, etc.)
        card: "#FFFFFF",
        "card-foreground": "#2B2A28", // Charcoal ink on cards
        popover: "#FFFFFF",
        "popover-foreground": "#2B2A28",

        // Primary = Rose Gold touch (soft, premium)
        primary: "#D8B2A1", // Light rose gold
        "primary-foreground": "#2B2A28", // Ink on rose gold (premium + accessible)

        // Secondary = Cream / soft warmth
        secondary: "#F6EFEA", // Creamy warm neutral
        "secondary-foreground": "#2B2A28",

        muted: "#F3ECE6", // Soft warm muted background
        "muted-foreground": "#7A6E67", // Warm gray text

        // Accent = light rose pink wash (badges, subtle highlights)
        accent: "#F4DDE3", // Light rose pink
        "accent-foreground": "#4B2C33", // Deep plum-brown

        destructive: "#E25555",
        "destructive-foreground": "#FFFFFF",

        border: "#E9DED8", // Warm border (no cold gray)
        input: "#E9DED8",
        ring: "#D8B2A1", // Rose-gold focus ring

        // Extra ink tokens (safe to start using without breaking old usage)
        ink: "#2B2A28", // Primary text
        "ink-muted": "#7A6E67",

        // =========================================================
        // Dark Theme (warm dark, not blue/tech)
        // =========================================================
        "dark-background": "#171312", // Warm charcoal
        "dark-foreground": "#1E1817", // Surface behind cards/sections
        "dark-card": "#1D1716",
        "dark-card-foreground": "#F7F2EE",
        "dark-popover": "#1D1716",
        "dark-popover-foreground": "#F7F2EE",

        "dark-primary": "#D8B2A1",
        "dark-primary-foreground": "#171312",

        "dark-secondary": "#2A2322",
        "dark-secondary-foreground": "#F7F2EE",

        "dark-muted": "#241D1C",
        "dark-muted-foreground": "#C9BCB6",

        "dark-accent": "#3A2A2D",
        "dark-accent-foreground": "#F4DDE3",

        "dark-destructive": "#F07171",
        "dark-destructive-foreground": "#171312",

        "dark-border": "#3A2F2D",
        "dark-input": "#3A2F2D",
        "dark-ring": "#D8B2A1",

        "dark-ink": "#F7F2EE",
        "dark-ink-muted": "#C9BCB6",

        // =========================================================
        // Brand Palette (optional utilities for future components)
        // =========================================================
        brand: {
          ivory: "#FBF7F3",
          cream: "#F6EFEA",
          rosePink: "#F4DDE3",
          roseGold: "#D8B2A1",
          warmGold: "#C7A35B",
          plum: "#3D2A3A",
          sage: "#A8B9A3",
          lavender: "#C8B6D8",
          charcoal: "#2B2A28",
          warmGray: "#7A6E67",
        },
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      // Boutique depth: softer, warmer shadows (less “gray UI card”)
      boxShadow: {
        soft: "0 10px 30px -20px rgba(43, 42, 40, 0.25)",
        lift: "0 22px 60px -30px rgba(43, 42, 40, 0.35)",
        glow: "0 0 0 6px rgba(216, 178, 161, 0.22)", // rose-gold glow
      },

      // Premium motion defaults (we'll reuse in components)
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        250: "250ms",
        400: "400ms",
        600: "600ms",
      },
    },
  },
  plugins: [],
};