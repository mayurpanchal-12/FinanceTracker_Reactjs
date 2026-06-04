const fmt = (n) =>
  Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function SmartObservationBanner({ insights }) {
  const { savingsRate, topCategory, biggestExpense } = insights;

  const borderColor =
    savingsRate >= 20 ? 'border-l-emerald-400'
    : savingsRate >= 0 ? 'border-l-yellow-400'
    : 'border-l-red-400';

  return (
    <div className={`card px-6 py-4 border-l-4 ${borderColor}`}>
      <p className="section-label mb-1">Smart observation</p>
      <p className="text-text-main font-medium text-sm">
        {savingsRate >= 30 && '🎉 You are saving over 30% of your income this month — excellent financial health!'}
        {savingsRate >= 10 && savingsRate < 30 && '👍 You are saving a decent portion of your income. Try to push it above 30% for better financial security.'}
        {savingsRate >= 0 && savingsRate < 10 && `⚠️ Your savings rate is low this month. Your top spending category is ${topCategory?.[0]} — consider reviewing it.`}
        {savingsRate < 0 && `🚨 You are spending more than you earn this month. Your biggest expense is ₹${fmt(biggestExpense?.amount)} in ${biggestExpense?.category}.`}
      </p>
    </div>
  );
}