
function getAllMonths(start, end) {
  const startDate = new Date(start + '-01');
  const endDate = new Date(end + '-01');
  const months = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}

export function aggregateMonthlyData(transactions) {
  if (!transactions.length) {
    return { labels: [], incomeData: [], expenseData: [], balanceData: [] };
  }
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const monthMap = {};
  let runningBalance = 0;

  sorted.forEach((tx) => {
    const month = tx.date.slice(0, 7);
    if (!monthMap[month]) monthMap[month] = { income: 0, expense: 0, balance: 0 };
    if (tx.type === 'income') {
      monthMap[month].income += Number(tx.amount);
      runningBalance += Number(tx.amount);
    } else {
      monthMap[month].expense += Number(tx.amount);
      runningBalance -= Number(tx.amount);
    }
    monthMap[month].balance = runningBalance;
  });

  const allMonthDates = getAllMonths(
    sorted[0].date.slice(0, 7),
    sorted[sorted.length - 1].date.slice(0, 7)
  );
  const labels = allMonthDates.map((d) =>
    d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  );

  let lastBalance = 0;
  const incomeData = [];
  const expenseData = [];
  const balanceData = [];

  allMonthDates.forEach((d) => {
    const key = d.toISOString().slice(0, 7);
    const income = monthMap[key]?.income || 0;
    const expense = monthMap[key]?.expense || 0;
    if (monthMap[key]?.balance !== undefined) lastBalance = monthMap[key].balance;
    incomeData.push(income);
    expenseData.push(expense);
    balanceData.push(lastBalance);
  });

  return { labels, incomeData, expenseData, balanceData };
}
