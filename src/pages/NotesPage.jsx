import Header from '../components/Header';
import { useTransactions } from '../context/TransactionContext';

export default function NotesPage() {
  const { transactions } = useTransactions();

  const transactionsWithNotes = transactions
    .filter((t) => t.note && String(t.note).trim() !== '')
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  return (
    <>
      <Header />
      <section className="animate-[fadeIn_0.4s_ease-out] bg-surface backdrop-blur-md border border-border rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:bg-surface-hover">
        <h2 className="text-3xl font-extrabold text-text-main mb-2">📝 Transaction Notes</h2>
        <p className="text-text-light mb-6 text-lg">
          Optional notes you added while creating transactions. Use them as reminders or extra
          context for important entries.
        </p>

        {transactionsWithNotes.length === 0 ? (
          <p className="text-center p-10 text-text-light italic bg-surface-solid rounded-xl border border-dashed border-border-solid">No notes yet. Add one from the Tracker form using the Note button.</p>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 list-none">
            {transactionsWithNotes.map((tx) => (
              <li key={tx.id} className="bg-surface-solid rounded-2xl p-5 border border-border-solid shadow-sm transition-all duration-300 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-primary before:rounded-l hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-[0.9rem] items-center mb-2">
                    <span className="bg-[#e0e7ff] text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{tx.type === 'income' ? 'Income' : 'Expense'}</span>
                    <span className="text-xl font-extrabold text-text-main">₹{tx.amount}</span>
                  </div>
                  <div className="flex justify-between text-[0.9rem]">
                    <span className="text-text-light font-medium">Date:</span>
                    <span className="font-semibold text-text-main">{tx.date}</span>
                  </div>
                  <div className="flex justify-between text-[0.9rem]">
                    <span className="text-text-light font-medium">Type:</span>
                    <span className="font-semibold text-text-main">
                      {tx.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[0.9rem]">
                    <span className="text-text-light font-medium">Details:</span>
                    <span className="font-semibold text-text-main">{tx.info || '-'}</span>
                  </div>
                  <div className="flex justify-between text-[0.9rem]">
                    <span className="text-text-light font-medium">Category:</span>
                    <span className="font-semibold text-text-main">{tx.category || '-'}</span>
                  </div>
                  <div className="flex justify-between text-[0.9rem] mt-2 pt-3 border-t border-dashed border-border-solid">
                    <span className="text-text-light font-medium">Note:</span>
                    <span className="text-text-main leading-relaxed italic">{tx.note}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

