// frontend/src/context/ThemeContext.jsx

import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    const userPrefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return savedTheme || (userPrefersDark ? "dark" : "light");
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const oldTheme = theme === "dark" ? "light" : "dark";

    root.classList.remove(oldTheme);
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