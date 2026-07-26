// frontend/src/context/ThemeContext.jsx

import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    // Only respect explicit saved values
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    // ✅ Default theme for new visitors
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Ensure we never leave both classes behind
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Helps browser render built-in UI (inputs/scrollbars) correctly
    root.style.colorScheme = theme;

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};