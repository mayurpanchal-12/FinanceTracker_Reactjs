import { useMemo } from 'react';

function getMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export default function useBudgetRows(mainTransactions, categories, budgets) {
  const thisMonth = getMonthKey();

//calculate amount spent by category for the current month
  const spentByCategory = useMemo(() => {
    const categorySpent = {};
    mainTransactions
      .filter((t) => t.type === 'expense' && t.date?.startsWith(thisMonth))
      .forEach((t) => {
        categorySpent[t.category] = (categorySpent[t.category] || 0) + Number(t.amount);
      });
    return categorySpent;
  }, [mainTransactions, thisMonth]);                                     

  // filter out 'Salary' from categories for budget rows
  const expenseCategories = categories.filter((c) => c !== 'Salary');

 // Build budget rows for each expense category
  const rows = expenseCategories.map((cat) => {
    const spent = spentByCategory[cat] || 0; // amount spent in this category 
    const limit = budgets[cat] ? Number(budgets[cat]) : null; // budget limit for this category
    const pct = limit ? Math.round((spent / limit) * 100) : null; // percentage of budget spent
    const status =
      pct === null ? null : pct >= 100 ? 'over' : pct >= 80 ? 'near' : 'ok'; // budget status
    return { cat, spent, limit, pct, status };
  });

  const totalBudgeted = rows.reduce((s, r) => s + (r.limit || 0), 0);// total budgeted amount across all categories 
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0); // total spent amount across all categories
  const overCount = rows.filter((r) => r.status === 'over').length; // number of categories that are over budget
  const nearCount = rows.filter((r) => r.status === 'near').length; // number of categories that are near budget

  return { rows, expenseCategories, totalBudgeted, totalSpent, overCount, nearCount };
}