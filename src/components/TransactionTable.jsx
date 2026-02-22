import { useTransactions } from '../context/TransactionContext';

export default function TransactionTable() {
  const {
    filteredTransactions,
    filters,
    deleteTransaction,
    setEditingId,
    unhighlightTransaction,
    summary,
  } = useTransactions();

  const hasActiveFilters = filters.month || filters.type || filters.category;
  const hasActiveSearch = filters.search && String(filters.search).trim() !== '';

  const overallBalance = Number(summary?.balance ?? 0);
  const shouldAutoHighlight = filteredTransactions.length >= 10 && overallBalance !== 0;

  const pickTopIds = (type, count) => {
    return filteredTransactions
      .filter((t) => t.type === type)
      .slice()
      .sort((a, b) => {
        const diff = Number(b.amount) - Number(a.amount);
        if (diff !== 0) return diff;
        // tie-breaker: most recent date first, then id
        const dateDiff = String(b.date).localeCompare(String(a.date));
        if (dateDiff !== 0) return dateDiff;
        return Number(b.id) - Number(a.id);
      })
      .slice(0, count)
      .map((t) => t.id);
  };

  const autoIncomeIds =
    shouldAutoHighlight && overallBalance > 0 ? new Set(pickTopIds('income', 2)) : new Set();
  const autoExpenseIds =
    shouldAutoHighlight && overallBalance < 0 ? new Set(pickTopIds('expense', 2)) : new Set();

  return (
    <section className="overflow-x-auto rounded-2xl shadow-md bg-surface-solid mt-2.5">
      <table className="w-full border-collapse whitespace-nowrap">
        <thead>
          <tr>
            <th className="p-4 text-center border-b border-border-solid bg-[#f8fafc] text-text-light font-semibold uppercase text-[0.85rem] tracking-wider sticky top-0 z-10">#</th>
            <th className="p-4 text-center border-b border-border-solid bg-[#f8fafc] text-text-light font-semibold uppercase text-[0.85rem] tracking-wider sticky top-0 z-10">Date</th>
            <th className="p-4 text-center border-b border-border-solid bg-[#f8fafc] text-text-light font-semibold uppercase text-[0.85rem] tracking-wider sticky top-0 z-10">Amount</th>
            <th className="p-4 text-center border-b border-border-solid bg-[#f8fafc] text-text-light font-semibold uppercase text-[0.85rem] tracking-wider sticky top-0 z-10">Description</th>
            <th className="p-4 text-center border-b border-border-solid bg-[#f8fafc] text-text-light font-semibold uppercase text-[0.85rem] tracking-wider sticky top-0 z-10">Type</th>
            <th className="p-4 text-center border-b border-border-solid bg-[#f8fafc] text-text-light font-semibold uppercase text-[0.85rem] tracking-wider sticky top-0 z-10">Category</th>
            <th className="p-4 text-center border-b border-border-solid bg-[#f8fafc] text-text-light font-semibold uppercase text-[0.85rem] tracking-wider sticky top-0 z-10">Action</th>
            <th className="p-4 text-center border-b border-border-solid bg-[#f8fafc] text-text-light font-semibold uppercase text-[0.85rem] tracking-wider sticky top-0 z-10">Balance</th>
          </tr>
        </thead>
        <tbody id="tbody" className="[&>tr:last-child>td]:border-b-0">
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-4 text-center border-b border-border-solid italic text-text-light">
                No transactions match the current filters
              </td>
            </tr>
          ) : (
            filteredTransactions.map((tx, index) => {
              const bgClass =
                autoIncomeIds.has(tx.id) ? 'bg-emerald-500/5 border-l-4 border-l-success hover:bg-emerald-500/10' :
                autoExpenseIds.has(tx.id) ? 'bg-red-500/5 border-l-4 border-l-danger hover:bg-red-500/10' :
                tx.highlighted ? 'bg-amber-500/5 border-l-4 border-l-warning hover:bg-amber-500/10' :
                hasActiveSearch ? 'bg-indigo-500/5 border-l-4 border-l-primary hover:bg-indigo-500/10' :
                '';

              return (
                <tr
                  key={tx.id}
                  className={`transition-all duration-300 hover:bg-[#f8fafc] ${bgClass}`}
                >
                  <td className="p-4 text-center border-b border-border-solid">{index + 1}</td>
                  <td className="p-4 text-center border-b border-border-solid">{tx.date}</td>
                  <td className="p-4 text-center border-b border-border-solid">{tx.amount}</td>
                  <td className="p-4 text-center border-b border-border-solid">
                    {tx.info}
                    {tx.note && String(tx.note).trim() && (
                      <span className="inline-flex items-center justify-center text-[0.8rem] ml-2 py-1 px-2 rounded-full bg-amber-500/10 text-warning font-semibold" title="This transaction has a note">
                        ✏️
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center border-b border-border-solid">{tx.type}</td>
                  <td className="p-4 text-center border-b border-border-solid">{tx.category}</td>
                  <td className="p-4 text-center border-b border-border-solid flex justify-center gap-2">
                    <button
                      type="button"
                      className="bg-red-500/10 text-danger shadow-none px-3 py-1.5 text-[0.85rem] rounded-md transition-all duration-300 hover:bg-danger hover:text-white hover:-translate-y-[1px]"
                      onClick={() => deleteTransaction(tx.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="bg-red-500/10 text-danger shadow-none px-3 py-1.5 text-[0.85rem] rounded-md transition-all duration-300 hover:bg-danger hover:text-white hover:-translate-y-[1px]"
                      onClick={() => setEditingId(tx.id)}
                    >
                      Edit
                    </button>
                    {tx.highlighted && (
                      <button
                        type="button"
                        className="bg-slate-500/10 text-text-light border border-transparent shadow-none px-3 py-1.5 text-[0.85rem] rounded-md transition-all duration-300 hover:bg-slate-500/20 hover:text-text-main"
                        onClick={() => unhighlightTransaction(tx.id)}
                      >
                        Unhighlight
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-center border-b border-border-solid">{tx.balance}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
