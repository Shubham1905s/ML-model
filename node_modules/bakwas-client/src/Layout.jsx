import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <header className="hero hero-mini">
        <nav className="nav">
          <NavLink to="/" className="logo">
            StayEase
          </NavLink>
          <div className="nav-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/host">Host Dashboard</NavLink>
            <NavLink to="/admin">Admin</NavLink>
            <button type="button" className="primary">Login</button>
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
