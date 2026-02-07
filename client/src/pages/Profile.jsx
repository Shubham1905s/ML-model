import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || ""
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setProfile({
      name: user?.name || "",
      phone: user?.phone || ""
    });
  }, [user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setProfileMessage("");
    try {
      const response = await updateProfile(profile);
      setProfileMessage(response.message || "Profile updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed.");
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setPasswordMessage("");
    try {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (passwords.newPassword.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      const response = await changePassword(
        passwords.currentPassword,
        passwords.newPassword
      );
      setPasswordMessage(response.message || "Password updated.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed.");
    }
  };

  return (
    <main className="section auth-page">
      <div className="panel auth-card">
        <h2>Your profile</h2>
        <p className="subtitle">Manage your account details and password.</p>
        <form className="auth-form" onSubmit={handleProfileSubmit}>
          <label>
            Full name
            <input
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
              placeholder="+1 555 0101"
            />
          </label>
          <label>
            Email
            <input value={user?.email || ""} disabled />
          </label>
          <label>
            Role
            <input value={user?.role || ""} disabled />
          </label>
          {profileMessage && <p className="success">{profileMessage}</p>}
          <button type="submit" className="primary">Save profile</button>
        </form>
      </div>

      <div className="panel auth-card">
        <h3>Change password</h3>
        <form className="auth-form" onSubmit={handlePasswordSubmit}>
          <label>
            Current password
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(event) =>
                setPasswords({ ...passwords, currentPassword: event.target.value })
              }
              required
            />
          </label>
          <label>
            New password
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(event) =>
                setPasswords({ ...passwords, newPassword: event.target.value })
              }
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(event) =>
                setPasswords({ ...passwords, confirmPassword: event.target.value })
              }
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          {passwordMessage && <p className="success">{passwordMessage}</p>}
          <button type="submit" className="primary">Update password</button>
        </form>
      </div>
    </main>
  );
}
