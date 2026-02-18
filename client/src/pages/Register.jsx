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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const generateStrongPassword = () => {
    const lowercase = "abcdefghijkmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const numbers = "23456789";
    const symbols = "!@#$%&*?-_";
    const all = `${lowercase}${uppercase}${numbers}${symbols}`;
    const length = 14;
    const cryptoObj = window.crypto || window.msCrypto;
    const randomIndex = (max) => {
      if (cryptoObj && cryptoObj.getRandomValues) {
        const buffer = new Uint32Array(1);
        cryptoObj.getRandomValues(buffer);
        return buffer[0] % max;
      }
      return Math.floor(Math.random() * max);
    };
    const chars = [
      lowercase[randomIndex(lowercase.length)],
      uppercase[randomIndex(uppercase.length)],
      numbers[randomIndex(numbers.length)],
      symbols[randomIndex(symbols.length)]
    ];
    while (chars.length < length) {
      chars.push(all[randomIndex(all.length)]);
    }
    for (let i = chars.length - 1; i > 0; i -= 1) {
      const j = randomIndex(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join("");
  };

  const handleSuggestPassword = () => {
    const suggested = generateStrongPassword();
    setForm({ ...form, password: suggested, confirmPassword: suggested });
    setShowPassword(true);
    setShowConfirmPassword(true);
  };

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
            <div className="password-input-row">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
                disabled={otpStage}
              />
              <button
                type="button"
                className="ghost password-icon-button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={otpStage}
                aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 3l18 18M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9M7.5 7.5C5.2 8.9 3.6 11 3 12c1 1.7 4 6 9 6 1.6 0 3.1-.4 4.4-1.1M12 6c5 0 8 4.3 9 6-.4.7-1.2 2-2.6 3.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 12c1.1-1.9 4.4-6 9-6s7.9 4.1 9 6c-1.1 1.9-4.4 6-9 6s-7.9-4.1-9-6Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                )}
              </button>
            </div>
            <div className="password-actions">
              <button
                type="button"
                className="ghost password-action"
                onClick={handleSuggestPassword}
                disabled={otpStage}
              >
                {t("auth.suggestStrongPassword")}
              </button>
            </div>
          </label>
          <label>
            {t("auth.confirmPassword")}
            <div className="password-input-row">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm({ ...form, confirmPassword: event.target.value })
                }
                required
                disabled={otpStage}
              />
              <button
                type="button"
                className="ghost password-icon-button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                disabled={otpStage}
                aria-label={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              >
                {showConfirmPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 3l18 18M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9M7.5 7.5C5.2 8.9 3.6 11 3 12c1 1.7 4 6 9 6 1.6 0 3.1-.4 4.4-1.1M12 6c5 0 8 4.3 9 6-.4.7-1.2 2-2.6 3.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 12c1.1-1.9 4.4-6 9-6s7.9 4.1 9 6c-1.1 1.9-4.4 6-9 6s-7.9-4.1-9-6Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                )}
              </button>
            </div>
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
