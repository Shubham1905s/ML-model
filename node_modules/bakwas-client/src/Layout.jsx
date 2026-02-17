import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./auth/AuthProvider.jsx";
import { useTheme } from "./ThemeProvider.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";

export default function Layout() {
  const { t } = useTranslation();
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="app">
      <header className={`site-header${isScrolled ? " scrolled" : ""}`}>
        <nav className="nav">
          <NavLink to="/" className="logo">
            StayEase
          </NavLink>
          <div className="nav-links">
            <LanguageSelector />
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <NavLink to="/">{t("nav.home")}</NavLink>
            {user && (user.role === "host" || user.role === "admin") && (
              <NavLink to="/host">{t("nav.hostDashboard")}</NavLink>
            )}
            {user && user.role === "admin" && <NavLink to="/admin">{t("nav.admin")}</NavLink>}
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `ghost-button nav-profile${isActive ? " active" : ""}`
                  }
                >
                  {t("common.profile")}
                </NavLink>
                <button
                  type="button"
                  className="ghost"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="ghost-button">
                  {t("common.login")}
                </NavLink>
                <NavLink to="/register" className="primary">
                  {t("common.signup")}
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
      <footer className="footer">
        <div>
          <h3>StayEase</h3>
          <p>{t("footer.description")}</p>
        </div>
        <div>
          <p>{t("footer.support")}</p>
          <span>{t("footer.supportEmail")}</span>
        </div>
      </footer>
    </div>
  );
}
