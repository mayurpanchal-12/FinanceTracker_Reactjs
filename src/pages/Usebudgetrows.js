import { useMemo } from 'react';

function getMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export default function useBudgetRows(mainTransactions, categories, budgets) {
  const thisMonth = getMonthKey();

  const spentMap = useMemo(() => {
    const map = {};
    mainTransactions
      .filter((t) => t.type === 'expense' && t.date?.startsWith(thisMonth))
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      });
    return map;
  }, [mainTransactions, thisMonth]);

  const expenseCategories = categories.filter((c) => c !== 'Salary');

  const rows = expenseCategories.map((cat) => {
    const spent = spentMap[cat] || 0;
    const limit = budgets[cat] ? Number(budgets[cat]) : null;
    const pct = limit ? Math.round((spent / limit) * 100) : null;
    const status =
      pct === null ? null : pct >= 100 ? 'over' : pct >= 80 ? 'near' : 'ok';
    return { cat, spent, limit, pct, status };
  });

  const totalBudgeted = rows.reduce((s, r) => s + (r.limit || 0), 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const overCount = rows.filter((r) => r.status === 'over').length;
  const nearCount = rows.filter((r) => r.status === 'near').length;

  return { rows, expenseCategories, totalBudgeted, totalSpent, overCount, nearCount };
}