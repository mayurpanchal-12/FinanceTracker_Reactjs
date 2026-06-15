export default function useRowHighlight(
  filteredTransactions,
  summary,
  search
) {
  // const hasActiveSearch = search && String(search).trim() !== '';
  const hasActiveSearch = String(search ?? '').trim() !== '';
  const overallBalance = summary.balance
  
  const shouldAutoHighlight =
    filteredTransactions.length >= 10 &&
    overallBalance !== 0;

  const pickTopIds = (type, count) =>
    filteredTransactions
      .filter((t) => t.type === type)
      .slice()
      .sort((a, b) => {
        const d = Number(b.amount) - Number(a.amount);

        if (d !== 0) return d;

        const dd = String(b.date).localeCompare(String(a.date));

        return dd !== 0
          ? dd
          : Number(b.id) - Number(a.id);
      })
      .slice(0, count)
      .map((t) => t.id);

  const autoIncomeIds =
    shouldAutoHighlight && overallBalance > 0
      ? new Set(pickTopIds('income', 2))
      : new Set();

  const autoExpenseIds =
    shouldAutoHighlight && overallBalance < 0
      ? new Set(pickTopIds('expense', 2))
      : new Set();

  return (tx) => {
    if (autoIncomeIds.has(tx.id))
      return 'bg-emerald-500/4 border-l-2 border-l-emerald-400';

    if (autoExpenseIds.has(tx.id))
      return 'bg-red-500/4 border-l-2 border-l-red-400';

    if (tx.highlighted)
      return 'bg-amber-500/4 border-l-2 border-l-amber-400';

    if (hasActiveSearch)
      return 'bg-primary/3 border-l-2 border-l-primary/40';

    return '';
  };
}