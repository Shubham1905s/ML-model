import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider.jsx";
import CaptchaField from "../components/CaptchaField.jsx";
import AlertBox from "../components/AlertBox.jsx";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [captcha, setCaptcha] = useState({ captchaId: "", text: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({
        ...form,
        captchaId: captcha.captchaId,
        captchaText: captcha.text
      });
      const next = location.state?.from || "/";
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t("errors.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section auth-page">
      <div className="panel auth-card">
        <h2>{t("auth.welcomeBack")}</h2>
        <p className="subtitle">{t("auth.loginSubtitle")}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t("auth.email")}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
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
              />
              <button
                type="button"
                className="ghost password-icon-button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={loading}
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
          </label>
          <CaptchaField
            purpose="login"
            value={captcha}
            onChange={setCaptcha}
            disabled={loading}
          />
          <AlertBox
            type="error"
            title={t("auth.loginFailed")}
            message={error}
            onDismiss={() => setError("")}
          />
          <button type="submit" className="primary" disabled={loading}>
            {loading ? t("auth.signingIn") : t("common.login")}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">{t("auth.forgotPassword")}</Link>
          <span>
            {t("auth.noAccount")} <Link to="/register">{t("auth.registerLink")}</Link>
          </span>
        </div>
      </div>
    </main>
  );
}
