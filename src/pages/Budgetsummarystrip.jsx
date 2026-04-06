const fmt = (n) =>
  Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function BudgetSummaryStrip({ monthLabel, totalBudgeted, totalSpent, overCount, nearCount }) {
  return (
    <section className="budget-summary-strip card my-3">
      <div className="budget-summary-item">
        <span className="section-label">Month</span>
        <p className="budget-summary-value text-text-main">{monthLabel}</p>
      </div>
      <div className="budget-summary-divider" />
      <div className="budget-summary-item">
        <span className="section-label">Total Budgeted</span>
        <p className="budget-summary-value text-primary">
          {totalBudgeted > 0 ? `₹${fmt(totalBudgeted)}` : '—'}
        </p>
      </div>
      <div className="budget-summary-divider" />
      <div className="budget-summary-item">
        <span className="section-label">Total Spent</span>
        <p className={`budget-summary-value ${totalSpent > totalBudgeted && totalBudgeted > 0 ? 'text-red-500' : 'text-text-main'}`}>
          ₹{fmt(totalSpent)}
        </p>
      </div>
      <div className="budget-summary-divider" />
      <div className="budget-summary-item">
        <span className="section-label">Alerts</span>
        <p className="budget-summary-value">
          {overCount > 0 && <span className="text-red-500 font-bold">{overCount} over </span>}
          {nearCount > 0 && <span className="text-amber-500 font-bold">{nearCount} near </span>}
          {overCount === 0 && nearCount === 0 && <span className="text-emerald-600 font-bold">All good ✓</span>}
        </p>
      </div>
    </section>
  );
}