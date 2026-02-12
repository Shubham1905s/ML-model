import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";

export default function Register() {
  const { requestRegisterOtp, verifyRegisterOtp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "guest",
    termsAccepted: false
  });
  const [otp, setOtp] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }
      if (!form.termsAccepted) {
        setError("Please accept terms and conditions.");
        setLoading(false);
        return;
      }
      const response = await requestRegisterOtp(form);
      setOtpStage(true);
      if (response.otpPreview) {
        setSuccessMessage(`OTP sent. Dev OTP preview: ${response.otpPreview}`);
      } else {
        setSuccessMessage("OTP sent to your email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyRegisterOtp({ email: form.email, otp });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section auth-page">
      <div className="panel auth-card">
        <h2>Create account</h2>
        <p className="subtitle">Join to book stays or host your space.</p>
        <form className="auth-form" onSubmit={otpStage ? handleVerifyOtp : handleCreateAccount}>
          <label>
            Full name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Mobile number
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              required
              disabled={otpStage}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              disabled={otpStage}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              disabled={otpStage}
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm({ ...form, confirmPassword: event.target.value })
              }
              required
              disabled={otpStage}
            />
          </label>
          <label>
            Account type
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              disabled={otpStage}
            >
              <option value="guest">Guest</option>
              <option value="host">Host</option>
            </select>
          </label>
          {!otpStage && (
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(event) => setForm({ ...form, termsAccepted: event.target.checked })}
              />
              I agree to the Terms and Conditions
            </label>
          )}
          {otpStage && (
            <label>
              Enter OTP
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                maxLength={6}
                required
                placeholder="6-digit OTP"
              />
            </label>
          )}
          {successMessage && <p className="success">{successMessage}</p>}
          {error && <p className="error">{error}</p>}
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Please wait..." : otpStage ? "Verify OTP" : "Create account"}
          </button>
        </form>
        <div className="auth-links">
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
    </main>
  );
}
