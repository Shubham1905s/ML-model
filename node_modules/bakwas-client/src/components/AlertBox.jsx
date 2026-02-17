export default function AlertBox({ type = "error", title, message, onDismiss }) {
  if (!message) return null;

  return (
    <div className={`alert-box alert-${type}`} role="alert">
      <div className="alert-icon" aria-hidden="true">
        {type === "error" ? "⚠" : type === "success" ? "✓" : "ℹ"}
      </div>
      <div className="alert-content">
        {title && <p className="alert-title">{title}</p>}
        <p className="alert-message">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="alert-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
