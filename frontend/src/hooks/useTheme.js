import { useEffect, useState } from "react";

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("expense-tracker-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("expense-tracker-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return {
    darkMode,
    toggleTheme: () => setDarkMode((prev) => !prev),
  };
};

