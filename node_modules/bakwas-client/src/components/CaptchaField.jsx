import { useCallback, useEffect, useState } from "react";
import api from "../api.js";

export default function CaptchaField({ purpose, value, onChange, disabled = false }) {
  const [captchaId, setCaptchaId] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCaptcha = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/captcha", { params: { purpose } });
      setCaptchaId(response.data.captchaId);
      setCaptchaSvg(response.data.captchaSvg);
      onChange({ text: "", captchaId: response.data.captchaId });
    } catch (err) {
      setError("Could not load captcha.");
    } finally {
      setLoading(false);
    }
  }, [onChange, purpose]);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  return (
    <div className="captcha-block">
      <label>
        CAPTCHA
        <div className="captcha-row">
          <div
            className="captcha-image"
            aria-label="captcha image"
            dangerouslySetInnerHTML={{ __html: captchaSvg }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={loadCaptcha}
            disabled={loading || disabled}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        <input
          value={value.text}
          onChange={(event) =>
            onChange({ text: event.target.value, captchaId: captchaId || value.captchaId })
          }
          maxLength={6}
          required
          placeholder="Enter 6-char captcha"
          disabled={disabled}
        />
      </label>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
