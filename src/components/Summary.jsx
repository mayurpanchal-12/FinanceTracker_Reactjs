import { useTransactions } from '../context/TransactionContext';

export default function Summary() {
  const { summary } = useTransactions();
  return (
    <section className="bg-surface backdrop-blur-md border border-border rounded-2xl shadow-md px-6 py-5 transition-all duration-300 hover:shadow-lg hover:bg-surface-hover flex flex-wrap justify-between items-center">
      <p className="text-[1.2rem] font-bold text-primary">
        Total Income: ₹{summary.income} | Total Expense: ₹{summary.expense}
      </p>
      <p className="text-[1.8rem] font-extrabold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
        Current Balance: ₹{summary.balance}
      </p>
    </section>
  );
}
