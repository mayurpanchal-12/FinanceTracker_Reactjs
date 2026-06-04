import { useMemo } from 'react';

function getMonthKey(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return d.toISOString().slice(0, 7);
}

export default function useInsights(mainTransactions) {
  return useMemo(() => {
    if (!mainTransactions.length) return null;

    const thisMonth = getMonthKey(0);
    const lastMonth = getMonthKey(-1);

    const thisMonthTx = mainTransactions.filter((t) => t.date?.startsWith(thisMonth));
    const lastMonthTx = mainTransactions.filter((t) => t.date?.startsWith(lastMonth));

    const thisIncome = thisMonthTx.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const thisExpense = thisMonthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    const lastIncome = lastMonthTx.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const lastExpense = lastMonthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    const categoryMap = {};
    mainTransactions.filter((t) => t.type === 'expense').forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    });
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

    const biggestExpense = [...mainTransactions]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => Number(b.amount) - Number(a.amount))[0];

    const biggestIncome = [...mainTransactions]
      .filter((t) => t.type === 'income')
      .sort((a, b) => Number(b.amount) - Number(a.amount))[0];

    const savingsRate = thisIncome > 0
      ? Math.round(((thisIncome - thisExpense) / thisIncome) * 100)
      : 0;

    const dayMap = {};
    mainTransactions.forEach((t) => {
      const day = new Date(t.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];

    const incomeChange = lastIncome > 0 ? Math.round(((thisIncome - lastIncome) / lastIncome) * 100) : null;
    const expenseChange = lastExpense > 0 ? Math.round(((thisExpense - lastExpense) / lastExpense) * 100) : null;

    const totalIncome = mainTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = mainTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    return {
      thisIncome, thisExpense,
      lastIncome, lastExpense,
      topCategory,
      biggestExpense,
      biggestIncome,
      savingsRate,
      mostActiveDay,
      incomeChange,
      expenseChange,
      totalIncome,
      totalExpense,
      thisMonth,
      lastMonth,
    };
  }, [mainTransactions]);
}