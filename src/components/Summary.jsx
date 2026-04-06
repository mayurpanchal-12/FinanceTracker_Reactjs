import { useTransactions } from '../context/TransactionContext';

const fmt = (n) =>
  Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function Summary() {
  const { summary } = useTransactions();
  const bal = Number(summary?.balance ?? 0);
  const balColor = bal >= 0 ? 'text-emerald-600' : 'text-red-500';

  return (
    <section className="card px-6 py-5 my-4 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border overflow-hidden">
      <div className="bg-white/80 px-6 py-5 flex flex-col gap-1.5 rounded-l-[17px] sm:rounded-r-none rounded-[17px] sm:rounded-[0]">
        <span className="section-label">Total Income</span>
        <p className="text-2xl font-bold text-emerald-600 tracking-tight">
          ₹{fmt(summary?.income ?? 0)}
        </p>
        <div className="mt-1 h-1 w-12 rounded-full bg-emerald-400/40" />
      </div>

      <div className="bg-white/80 px-6 py-5 flex flex-col gap-1.5 border-x border-border-solid sm:rounded-none rounded-[17px] my-px sm:my-0">
        <span className="section-label">Total Expenses</span>
        <p className="text-2xl font-bold text-red-500 tracking-tight">
          ₹{fmt(summary?.expense ?? 0)}
        </p>
        <div className="mt-1 h-1 w-12 rounded-full bg-red-400/40" />
      </div>

      <div className="bg-white/80 px-6 py-5 flex flex-col gap-1.5 rounded-r-[17px] sm:rounded-l-none rounded-[17px] sm:rounded-[0]">
        <span className="section-label">Current Balance</span>
        <p className={`text-2xl font-extrabold tracking-tight ${balColor}`}>
          ₹{fmt(bal)}
        </p>
        <div className={`mt-1 h-1 w-12 rounded-full ${bal >= 0 ? 'bg-emerald-400/40' : 'bg-red-400/40'}`} />
      </div>
    </section>
  );
}
