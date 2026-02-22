import { useEffect } from 'react';
import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import { useTransactions } from '../context/TransactionContext';

export default function SetTransactionPage() {
  const {
    setEditingId,
    scheduledTransactions,
    deleteTransaction,
    updateTransaction,
    unhighlightTransaction,
  } = useTransactions();

  useEffect(() => {
    setEditingId(null);
  }, [setEditingId]);

  return (
    <>
      <Header />
      <section className="animate-[fadeIn_0.4s_ease-out]">
        <p className="bg-indigo-500/10 border-l-4 border-l-primary py-4 px-5 rounded-md text-text-main mb-6 text-base leading-relaxed">
          Set transactions for <strong>future dates</strong>. They appear in this table until the
          intended date; on that day they automatically move to the main Tracker and Charts.
        </p>
        <TransactionForm scheduledPage={true} />

        <div className="bg-surface backdrop-blur-md border border-border rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:bg-surface-hover">
          <h2 className="text-2xl font-bold mb-2 text-text-main">📅 Scheduled transactions</h2>
          <p className="text-text-light mb-4">
            These will move to the main Tracker on their set date.
          </p>
          <div className="overflow-x-auto rounded-2xl shadow-md bg-surface-solid mt-2.5">
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
                </tr>
              </thead>
              <tbody className="[&>tr:last-child>td]:border-b-0">
                {scheduledTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center border-b border-border-solid italic text-text-light">
                      No scheduled transactions
                    </td>
                  </tr>
                ) : (
                  scheduledTransactions
                    .sort((a, b) => (a.scheduledDate || a.date).localeCompare(b.scheduledDate || b.date))
                    .map((tx, index) => (
                      <tr
                        key={tx.id}
                        className={`transition-all duration-300 hover:bg-[#f8fafc] ${tx.highlighted ? 'bg-amber-500/5 border-l-4 border-l-warning hover:bg-amber-500/10' : ''}`}
                      >
                        <td className="p-4 text-center border-b border-border-solid">{index + 1}</td>
                        <td className="p-4 text-center border-b border-border-solid">{tx.scheduledDate || tx.date}</td>
                        <td className="p-4 text-center border-b border-border-solid">{tx.amount}</td>
                        <td className="p-4 text-center border-b border-border-solid">{tx.info}</td>
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
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
