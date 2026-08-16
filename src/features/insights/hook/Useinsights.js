import { useMemo } from 'react';

// month key helpers - offset 0 = current month, -1 = last month, etc.
// pin day to 1 before offsetting, otherwise setMonth() overflows on
// 29th/30th/31st (e.g. May 31 - 1 month => "April 31" doesn't exist,
// JS rolls it forward to May 1 and you get the same month twice)
function getMonthKey(offset = 0) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// "YYYY-MM-DD" parsed as local date, not UTC (new Date("2024-06-15") is UTC
// midnight and can render as the previous day depending on timezone)
function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function sumAmount(transactions) {
  return transactions.reduce((sum, t) => {
    const amt = Number(t.amount);
    return Number.isFinite(amt) ? sum + amt : sum;
  }, 0);
}

export default function useInsights(mainTransactions) {
  return useMemo(() => {
    if (!mainTransactions?.length) return null;

    const thisMonth = getMonthKey(0);
    const lastMonth = getMonthKey(-1);

    const thisMonthTx = mainTransactions.filter((t) => t.date?.startsWith(thisMonth));
    const lastMonthTx = mainTransactions.filter((t) => t.date?.startsWith(lastMonth));

    const thisIncome = sumAmount(thisMonthTx.filter((t) => t.type === 'income'));
    const thisExpense = sumAmount(thisMonthTx.filter((t) => t.type === 'expense'));
    const lastIncome = sumAmount(lastMonthTx.filter((t) => t.type === 'income'));
    const lastExpense = sumAmount(lastMonthTx.filter((t) => t.type === 'expense'));

    // category totals for this month only
    const categoryMap = {};
    for (const t of thisMonthTx) {
      if (t.type !== 'expense') continue;
      const amt = Number(t.amount);
      if (!Number.isFinite(amt)) continue;
      categoryMap[t.category] = (categoryMap[t.category] || 0) + amt;
    }
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || null;

    const biggestExpense = [...thisMonthTx]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => Number(b.amount) - Number(a.amount))[0] || null;

    const biggestIncome = [...thisMonthTx]
      .filter((t) => t.type === 'income')
      .sort((a, b) => Number(b.amount) - Number(a.amount))[0] || null;

    // const savingsRate = thisIncome > 0
    //   ? Math.round(((thisIncome - thisExpense) / thisIncome) * 100)
    //   : 0;

    const savingsRate = thisIncome > 0
  ? Math.round(((thisIncome - thisExpense) / thisIncome) * 100)
  : thisExpense > 0
    ? -100
    : 0;

    // most active weekday, this month
    const dayMap = {};
    thisMonthTx.forEach((t) => {
      const parsed = parseLocalDate(t.date);
      if (!parsed) return;
      const day = parsed.toLocaleDateString('en-US', { weekday: 'long' });
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0] || null;

    const incomeChange = lastIncome > 0
      ? Math.round(((thisIncome - lastIncome) / lastIncome) * 100)
      : null;
    const expenseChange = lastExpense > 0
      ? Math.round(((thisExpense - lastExpense) / lastExpense) * 100)
      : null;

    const totalIncome = sumAmount(mainTransactions.filter((t) => t.type === 'income'));
    const totalExpense = sumAmount(mainTransactions.filter((t) => t.type === 'expense'));

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