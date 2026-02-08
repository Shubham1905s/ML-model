import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider.jsx";

export default function Layout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

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
      <header className="hero hero-mini">
        <nav className="nav">
          <NavLink to="/" className="logo">
            StayEase
          </NavLink>
          <div className="nav-links">
            <NavLink to="/">Home</NavLink>
            {user && (user.role === "host" || user.role === "admin") && (
              <NavLink to="/host">Host Dashboard</NavLink>
            )}
            {user && user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `ghost-button nav-profile${isActive ? " active" : ""}`
                  }
                >
                  Profile
                </NavLink>
                <button
                  type="button"
                  className="ghost"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="ghost-button">
                  Login
                </NavLink>
                <NavLink to="/register" className="primary">
                  Sign up
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
          <p>Dummy MERN booking platform for demo and planning.</p>
        </div>
        <div>
          <p>Support</p>
          <span>help@stayease.demo</span>
        </div>
      </footer>
    </div>
  );
}
