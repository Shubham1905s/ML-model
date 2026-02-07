import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
                <NavLink to="/profile">Profile</NavLink>
                <button type="button" className="ghost" onClick={handleLogout}>
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
