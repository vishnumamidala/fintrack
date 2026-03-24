import { Moon, Sun } from "lucide-react";

export const ThemeToggle = ({ darkMode, onToggle }) => (
  <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
  </button>
);

