import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { BrandLogo } from "../components/common/BrandLogo";
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
        <div className="topbar-main">
          <div className="topbar-brand">
            <BrandLogo compact />
          </div>
          <nav className="topbar-nav">
            <NavLink to="/" end className={({ isActive }) => `store-nav-link ${isActive ? "active" : ""}`}>
              Dashboard
            </NavLink>
            <NavLink to="/assistant" className={({ isActive }) => `store-nav-link ${isActive ? "active" : ""}`}>
              Assistant
            </NavLink>
            <NavLink to="/activity" className={({ isActive }) => `store-nav-link ${isActive ? "active" : ""}`}>
              Activity
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `store-nav-link ${isActive ? "active" : ""}`}>
              Profile
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `store-nav-link ${isActive ? "active" : ""}`}>
              Settings
            </NavLink>
          </nav>
        </div>
        <div className="topbar-actions">
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
          <NavLink to="/profile" className="user-menu user-avatar-link" aria-label="Open profile">
            <div className="user-avatar">
              {user?.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>}
            </div>
          </NavLink>
          <button className="button secondary topbar-logout" onClick={logout}>
            <LogOut size={16} />
          </button>
        </div>
      </header>
      <main className="reveal-up">
        <Outlet />
      </main>
    </div>
  );
};
