import { useTransactions } from '../context/TransactionContext';
import { SkeletonSummary, SkeletonChart } from '../components/Skeleton';
import useInsights from './Useinsights';
import MonthlyComparison from './Monthlycomparison';
import SmartObservationBanner from './SmartObservationBanner';

const fmt = (n) =>
  Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function InsightsPage() {
  const { mainTransactions, loading } = useTransactions();

  // always call hooks before any conditional returns (Rules of Hooks)
  const insights = useInsights(mainTransactions);

  const thisMonthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const lastMonthLabel = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) return (
    <div className="p-4 flex flex-col gap-4">
      <SkeletonSummary count={3} />
      <SkeletonChart />
    </div>
  );

  if (!mainTransactions.length || !insights) {
    return (
      <div className="card px-8 py-16 text-center my-4">
        <p className="text-5xl mb-4">📊</p>
        <p className="text-text-main font-semibold text-lg">No data yet</p>
        <p className="text-text-light text-sm mt-1">Add some transactions to see insights</p>
      </div>
    );
  }

  return (
    <div className="my-4 space-y-4 animate-[fadeIn_0.4s_ease-out]">

      <div className="px-2">
        <h2 className="text-2xl font-bold text-text-main">Insights</h2>
        <p className="text-text-light text-sm mt-0.5">Smart observations about your finances</p>
      </div>

      <MonthlyComparison
        insights={insights}
        thisMonthLabel={thisMonthLabel}
        lastMonthLabel={lastMonthLabel}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {insights.topCategory && (
          <div className="card px-6 py-5">
            <p className="section-label mb-2">Highest spending category</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-lg font-bold text-text-main">{insights.topCategory[0]}</p>
                <p className="text-red-500 font-semibold text-sm">₹{fmt(insights.topCategory[1])} total</p>
              </div>
            </div>
          </div>
        )}

        <div className="card px-6 py-5">
          <p className="section-label mb-2">Savings rate this month</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-3xl">💰</span>
            <div>
              <p className={`text-3xl font-extrabold ${insights.savingsRate >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {insights.savingsRate}%
              </p>
              <p className="text-text-light text-xs mt-0.5">
                {insights.savingsRate >= 30
                  ? 'Excellent saving habit!'
                  : insights.savingsRate >= 10
                  ? 'Good, keep it up'
                  : insights.savingsRate >= 0
                  ? 'Try to save more'
                  : 'Spending exceeds income'}
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${insights.savingsRate >= 30 ? 'bg-emerald-400' : insights.savingsRate >= 10 ? 'bg-yellow-400' : 'bg-red-400'}`}
              style={{ width: `${Math.max(0, Math.min(100, insights.savingsRate))}%` }}
            />
          </div>
        </div>

        {insights.mostActiveDay && (
          <div className="card px-6 py-5">
            <p className="section-label mb-2">Most active day</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl">📅</span>
              <div>
                <p className="text-lg font-bold text-text-main">{insights.mostActiveDay[0]}</p>
                <p className="text-text-light text-sm">{insights.mostActiveDay[1]} transactions</p>
              </div>
            </div>
          </div>
        )}

        {insights.biggestExpense && (
          <div className="card px-6 py-5">
            <p className="section-label mb-2">Biggest single expense</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl">💸</span>
              <div>
                <p className="text-lg font-bold text-red-500">₹{fmt(insights.biggestExpense.amount)}</p>
                <p className="text-text-light text-sm">{insights.biggestExpense.category} · {insights.biggestExpense.date}</p>
                {insights.biggestExpense.info && (
                  <p className="text-text-light text-xs mt-0.5 truncate">{insights.biggestExpense.info}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {insights.biggestIncome && (
          <div className="card px-6 py-5">
            <p className="section-label mb-2">Biggest single income</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl">🤑</span>
              <div>
                <p className="text-lg font-bold text-emerald-600">₹{fmt(insights.biggestIncome.amount)}</p>
                <p className="text-text-light text-sm">{insights.biggestIncome.category} · {insights.biggestIncome.date}</p>
                {insights.biggestIncome.info && (
                  <p className="text-text-light text-xs mt-0.5 truncate">{insights.biggestIncome.info}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="card px-6 py-5">
          <p className="section-label mb-2">All time</p>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between">
              <span className="text-text-light text-sm">Total earned</span>
              <span className="font-bold text-emerald-600">₹{fmt(insights.totalIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-light text-sm">Total spent</span>
              <span className="font-bold text-red-500">₹{fmt(insights.totalExpense)}</span>
            </div>
            <div className="h-px bg-border-solid" />
            <div className="flex justify-between">
              <span className="text-text-light text-sm">Net worth</span>
              <span className={`font-extrabold ${insights.totalIncome - insights.totalExpense >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                ₹{fmt(insights.totalIncome - insights.totalExpense)}
              </span>
            </div>
          </div>
        </div>

      </div>

      <SmartObservationBanner insights={insights} />

    </div>
  );
}
