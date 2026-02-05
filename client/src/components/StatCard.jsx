export default function StatCard({ label, value, hint }) {
  return (
    <div className="panel">
      <div>
        <p>{label}</p>
        {hint && <span>{hint}</span>}
      </div>
      <strong>{value}</strong>
    </div>
  );
}
