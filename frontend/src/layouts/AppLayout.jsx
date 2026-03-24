import { LogOut, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <div className="page-orb orb-one" />
      <div className="page-orb orb-two" />
      <header className="topbar reveal-up">
        <div>
          <p className="eyebrow">Financial OS</p>
          <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
        </div>
        <div className="topbar-actions">
          <nav className="topbar-nav">
            <NavLink to="/" end className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}>
              Dashboard
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}>
              <Settings size={14} />
              Settings
            </NavLink>
          </nav>
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
          <button className="button secondary" onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>
      <main className="reveal-up">
        <Outlet />
      </main>
    </div>
  );
};
