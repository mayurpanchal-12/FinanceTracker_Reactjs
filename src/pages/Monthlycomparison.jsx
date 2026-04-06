const fmt = (n) =>
  Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function MonthlyComparison({ insights, thisMonthLabel, lastMonthLabel }) {
  return (
    <div className="card px-6 py-5">
      <p className="section-label mb-4">Monthly comparison</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="rounded-2xl bg-primary/5 border border-primary/10 px-5 py-4">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{thisMonthLabel}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-text-light text-sm">Income</span>
              <span className="font-bold text-emerald-600">₹{fmt(insights.thisIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-light text-sm">Expenses</span>
              <span className="font-bold text-red-500">₹{fmt(insights.thisExpense)}</span>
            </div>
            <div className="h-px bg-border-solid my-1" />
            <div className="flex justify-between items-center">
              <span className="text-text-light text-sm">Net</span>
              <span className={`font-extrabold ${insights.thisIncome - insights.thisExpense >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                ₹{fmt(insights.thisIncome - insights.thisExpense)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 border border-gray-100 px-5 py-4">
          <p className="text-xs font-bold text-text-light uppercase tracking-widest mb-3">{lastMonthLabel}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-text-light text-sm">Income</span>
              <span className="font-bold text-emerald-600">₹{fmt(insights.lastIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-light text-sm">Expenses</span>
              <span className="font-bold text-red-500">₹{fmt(insights.lastExpense)}</span>
            </div>
            <div className="h-px bg-border-solid my-1" />
            <div className="flex justify-between items-center">
              <span className="text-text-light text-sm">Net</span>
              <span className={`font-extrabold ${insights.lastIncome - insights.lastExpense >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                ₹{fmt(insights.lastIncome - insights.lastExpense)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {(insights.incomeChange !== null || insights.expenseChange !== null) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {insights.incomeChange !== null && (
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${insights.incomeChange >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              Income {insights.incomeChange >= 0 ? '▲' : '▼'} {Math.abs(insights.incomeChange)}% vs last month
            </span>
          )}
          {insights.expenseChange !== null && (
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${insights.expenseChange <= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              Expenses {insights.expenseChange >= 0 ? '▲' : '▼'} {Math.abs(insights.expenseChange)}% vs last month
            </span>
          )}
        </div>
      )}
    </div>
  );
}