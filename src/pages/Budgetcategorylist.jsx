import { ProgressBar, StatusBadge } from './Budgetindicators';

const fmt = (n) =>
  Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const CATEGORY_ICONS = {
  Food: '🍛',
  Transport: '🚗',
  Shopping: '🛍️',
  Bills: '💡',
  Other: '📦',
  Salary: '💰',
};

export default function BudgetCategoryList({
  rows,
  expenseCategories,
  monthLabel,
  editingCat,
  inputVal,
  onInputChange,
  onKeyDown,
  onSave,
  onCancelEdit,
  onStartEdit,
  onRemove,
}) {
  return (
    <section className="card my-3 overflow-hidden">
      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-border">
        <span className="section-label">Category Budgets — {monthLabel}</span>
        <span className="text-xs text-text-light font-medium">{expenseCategories.length} categories</span>
      </div>

      <ul className="budget-list">
        {rows.map(({ cat, spent, limit, pct, status }) => (
          <li
            key={cat}
            className={`budget-row hover:bg-primary/3 ${status === 'over' ? 'budget-row--over' : status === 'near' ? 'budget-row--near' : ''}`}
          >
            <div className="budget-row__left">
              <span className="budget-cat-icon">{CATEGORY_ICONS[cat] || '📁'}</span>
              <div>
                <p className="budget-cat-name">{cat}</p>
                <p className="budget-cat-spent text-text-light">
                  ₹{fmt(spent)} spent
                  {limit ? ` of ₹${fmt(limit)}` : ' — no limit set'}
                </p>
              </div>
            </div>

            <div className="budget-row__progress">
              {limit ? (
                <>
                  <ProgressBar pct={pct} status={status} />
                  <StatusBadge status={status} pct={pct} />
                </>
              ) : (
                <p className="text-xs text-text-light/60 italic">No budget set</p>
              )}
            </div>

            <div className="budget-row__actions">
              {editingCat === cat ? (
                <div className="budget-edit-inline">
                  <span className="text-text-light text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    min="1"
                    className="budget-edit-input field"
                    value={inputVal}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                    placeholder="e.g. 5000"
                  />
                  <button onClick={onSave} className="btn-primary text-xs px-3 py-1.5">Save</button>
                  <button onClick={onCancelEdit} className="btn-ghost text-xs px-3 py-1.5">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartEdit(cat, limit)}
                    className="budget-action-btn budget-action-btn--edit bg-primary/6 hover:bg-primary/12"
                  >
                    {limit ? 'Edit' : 'Set limit'}
                  </button>
                  {limit && (
                    <button
                      onClick={() => onRemove(cat)}
                      className="budget-action-btn budget-action-btn--remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}