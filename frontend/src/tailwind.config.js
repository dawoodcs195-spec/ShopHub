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

        // Rose Gold Primary
        primary: "#D8B2A1",
        "primary-foreground": "#2B2A28",
        "primary-hover": "#CFA593", // subtle deepen for hover

        // Secondary / Muted
        secondary: "#F6EFEA",
        "secondary-foreground": "#2B2A28",

        muted: "#F3ECE6",
        "muted-foreground": "#7A6E67",

        // Accent (light rose pink)
        accent: "#F4DDE3",
        "accent-foreground": "#4B2C33",

        destructive: "#E25555",
        "destructive-foreground": "#FFFFFF",

        border: "#E9DED8",
        input: "#E9DED8",
        ring: "#D8B2A1",

        // Ink tokens
        ink: "#2B2A28",
        "ink-muted": "#7A6E67",

        // Compatibility tokens for your existing classes:
        // text-text-primary / text-text-secondary / text-text-muted
        text: {
          primary: "#2B2A28",
          secondary: "#7A6E67",
          muted: "#9A8F89",
        },

        // Dark Theme (warm dark)
        "dark-background": "#171312",
        "dark-foreground": "#F7F2EE",

        "dark-surface": "#1E1817",
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
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        soft: "0 10px 30px -20px rgba(43, 42, 40, 0.25)",
        lift: "0 22px 60px -30px rgba(43, 42, 40, 0.35)",
        glow: "0 0 0 6px rgba(216, 178, 161, 0.22)",
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