export function ProgressBar({ pct, status }) {
  const color =
    status === 'over'
      ? 'bg-red-500'
      : status === 'near'
      ? 'bg-amber-400'
      : 'bg-emerald-500';
  return (
    <div className="budget-bar-track">
      <div
        className={`budget-bar-fill ${color}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

export function StatusBadge({ status, pct }) {
  if (status === 'over')
    return <span className="budget-badge budget-badge--over">🔴 Over by {pct - 100}%</span>;
  if (status === 'near')
    return <span className="budget-badge budget-badge--near">🟡 {pct}% used</span>;
  return <span className="budget-badge budget-badge--ok">🟢 {pct}% used</span>;
}