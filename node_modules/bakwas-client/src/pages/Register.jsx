import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider.jsx";
import AlertBox from "../components/AlertBox.jsx";

export default function Register() {
  const { t } = useTranslation();
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
        setError(t("errors.passwordMismatch"));
        setLoading(false);
        return;
      }
      if (form.password.length < 8) {
        setError(t("errors.passwordMin"));
        setLoading(false);
        return;
      }
      if (!form.termsAccepted) {
        setError(t("errors.acceptTerms"));
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
      setError(err.response?.data?.message || t("errors.networkError"));
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
      setError(err.response?.data?.message || t("auth.registrationError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section auth-page">
      <div className="panel auth-card">
        <h2>{t("auth.createAccount")}</h2>
        <p className="subtitle">{t("auth.signupSubtitle")}</p>
        <form className="auth-form" onSubmit={otpStage ? handleVerifyOtp : handleCreateAccount}>
          <label>
            {t("auth.fullName")}
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            {t("auth.mobileNumber")}
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              required
              disabled={otpStage}
            />
          </label>
          <label>
            {t("auth.email")}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              disabled={otpStage}
            />
          </label>
          <label>
            {t("auth.password")}
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              disabled={otpStage}
            />
          </label>
          <label>
            {t("auth.confirmPassword")}
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
            {t("auth.accountType")}
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              disabled={otpStage}
            >
              <option value="guest">{t("auth.guest")}</option>
              <option value="host">{t("auth.host")}</option>
            </select>
          </label>
          {!otpStage && (
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(event) => setForm({ ...form, termsAccepted: event.target.checked })}
              />
              {t("auth.termsAccepted")}
            </label>
          )}
          {otpStage && (
            <label>
              {t("forgotPassword.enterOtp")}
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                maxLength={6}
                required
                placeholder={t("forgotPassword.enterOtp")}
              />
            </label>
          )}
          {successMessage && (
            <AlertBox
              type="success"
              title={t("common.success")}
              message={successMessage}
              onDismiss={() => setSuccessMessage("")}
            />
          )}
          {error && (
            <AlertBox
              type="error"
              title={t("auth.registrationError")}
              message={error}
              onDismiss={() => setError("")}
            />
          )}
          <button type="submit" className="primary" disabled={loading}>
            {loading ? t("auth.pleaseWait") : otpStage ? t("forgotPassword.verifyOtp") : t("auth.createAccount")}
          </button>
        </form>
        <div className="auth-links">
          <span>
            {t("auth.haveAccount")} <Link to="/login">{t("auth.loginLink")}</Link>
          </span>
        </div>
      </div>
    </main>
  );
}
