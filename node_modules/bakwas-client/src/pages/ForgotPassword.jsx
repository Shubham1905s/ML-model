import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResetToken("");
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section auth-page">
      <div className="panel auth-card">
        <h2>Reset your password</h2>
        <p className="subtitle">We will send a secure reset link to your email.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        {resetToken && (
          <div className="panel muted">
            <p className="small">Dev token (copy into reset page):</p>
            <code className="code-block">{resetToken}</code>
            <p>
              <Link to="/reset-password">Go to reset page</Link>
            </p>
          </div>
        )}
        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </main>
  );
}
