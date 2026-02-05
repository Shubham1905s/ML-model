import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import HostDashboard from "./pages/HostDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BecomeHost from "./pages/BecomeHost.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="host" element={<HostDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="become-host" element={<BecomeHost />} />
      </Route>
    </Routes>
  );
}
