// frontend/src/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light Theme (warm luxury)
        background: "#FBF7F3",
        foreground: "#2B2A28",

        surface: "#FFFFFF",
        "surface-muted": "#F6EFEA",

        card: "#FFFFFF",
        "card-foreground": "#2B2A28",
        popover: "#FFFFFF",
        "popover-foreground": "#2B2A28",

        primary: "#D8B2A1",
        "primary-foreground": "#2B2A28",
        "primary-hover": "#CFA593",

        secondary: "#F6EFEA",
        "secondary-foreground": "#2B2A28",

        muted: "#F3ECE6",
        "muted-foreground": "#7A6E67",

        accent: "#F4DDE3",
        "accent-foreground": "#4B2C33",

        destructive: "#E25555",
        "destructive-foreground": "#FFFFFF",

        border: "#E9DED8",
        input: "#E9DED8",
        ring: "#D8B2A1",

        ink: "#2B2A28",
        "ink-muted": "#7A6E67",

        // ✅ Compatibility tokens (NOW theme-aware via CSS variables)
        text: {
          primary: "var(--sh-text-primary)",
          secondary: "var(--sh-text-secondary)",
          muted: "var(--sh-text-muted)",
        },

        // Dark Theme — Warm Candlelight Studio
        "dark-background": "#120D0B",
        "dark-foreground": "#F4EEE9",

        "dark-surface": "#191210",
        "dark-card": "#1B1412",
        "dark-card-foreground": "#F4EEE9",
        "dark-popover": "#1B1412",
        "dark-popover-foreground": "#F4EEE9",

        "dark-primary": "#E2BFAF",
        "dark-primary-foreground": "#120D0B",

        "dark-secondary": "#241A17",
        "dark-secondary-foreground": "#F4EEE9",

        "dark-muted": "#1A1311",
        "dark-muted-foreground": "#CFC2BB",

        "dark-accent": "#2F1D1F",
        "dark-accent-foreground": "#F4DDE3",

        "dark-destructive": "#F07171",
        "dark-destructive-foreground": "#120D0B",

        "dark-border": "#3A2C28",
        "dark-input": "#3A2C28",
        "dark-ring": "#E2BFAF",

        "dark-ink": "#F4EEE9",
        "dark-ink-muted": "#CFC2BB",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        soft: "0 10px 30px -20px rgba(43, 42, 40, 0.25)",
        lift: "0 22px 60px -30px rgba(43, 42, 40, 0.35)",
        glow: "0 0 0 6px rgba(216, 178, 161, 0.22)",
        "dark-glow": "0 0 0 6px rgba(226, 191, 175, 0.18)",
      },

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