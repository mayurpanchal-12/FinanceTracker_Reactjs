import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useTransactions } from '../context/TransactionContext';
import { aggregateMonthlyData } from '../utils/chartData';
import { applyFilters } from '../utils/filterUtils';
import './css/ChartPage.css';
import { SkeletonChart } from '../components/Skeleton';

export default function ChartPage() {
  const [searchParams] = useSearchParams();
  const { mainTransactions ,loading } = useTransactions();
  const lineChartRef    = useRef(null);
  const incomeChartRef  = useRef(null);
  const expenseChartRef = useRef(null);
  const lineInstance    = useRef(null);
  const incomeInstance  = useRef(null);
  const expenseInstance = useRef(null);

  const month    = searchParams.get('month')    || '';
  const type     = searchParams.get('type')     || '';
  const category = searchParams.get('category') || '';
  const filters  = { month, type, category };
  const pieTransactions = applyFilters(mainTransactions, filters);
  const lineData        = aggregateMonthlyData(mainTransactions);

  useEffect(() => {
    if (!lineChartRef.current || !lineData.labels.length) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      if (!lineChartRef.current) return;
      if (lineInstance.current) lineInstance.current.destroy();
      lineInstance.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: lineData.labels,
          datasets: [
            { label: 'Income',  data: lineData.incomeData,  borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.08)',  fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#16a34a' },
            { label: 'Expense', data: lineData.expenseData, borderColor: '#e53e3e', backgroundColor: 'rgba(229,62,62,0.08)',  fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#e53e3e' },
            { label: 'Balance', data: lineData.balanceData, borderColor: '#4f63d2', backgroundColor: 'rgba(79,99,210,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#4f63d2' },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top', labels: { font: { family: 'Outfit', size: 12, weight: '600' }, boxWidth: 12, padding: 16 } },
            tooltip: { callbacks: { label: (c) => ` ₹${Number(c.raw).toLocaleString('en-IN')}` }, bodyFont: { family: 'Outfit' }, titleFont: { family: 'Outfit' } },
          },
          scales: {
            x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Outfit', size: 11 } } },
            y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: (v) => `₹${Number(v).toLocaleString('en-IN')}`, font: { family: 'Outfit', size: 11 } } },
          },
        },
      });
    });
    return () => { if (lineInstance.current) lineInstance.current.destroy(); lineInstance.current = null; };
  }, [mainTransactions]);

  const buildPie = (ref, instanceRef, txType, totalId, colors) => {
    if (!ref.current) return;
    const txs = pieTransactions.filter((t) => t.type === txType);
    const byCat = {}; let total = 0;
    txs.forEach((tx) => { const c = tx.category || 'Other'; byCat[c] = (byCat[c] || 0) + Number(tx.amount); total += Number(tx.amount); });
    const el = document.getElementById(totalId);
    if (el) el.textContent = month
      ? `Total ${txType === 'income' ? 'Income' : 'Expense'} — ${month}: ₹${total.toLocaleString('en-IN')}`
      : `Total ${txType === 'income' ? 'Income' : 'Expense'}: ₹${total.toLocaleString('en-IN')}`;
    if (instanceRef.current) instanceRef.current.destroy(); instanceRef.current = null;
    if (!Object.keys(byCat).length) { ref.current.style.display = 'none'; return; }
    ref.current.style.display = 'block';
    import('chart.js/auto').then(({ default: Chart }) => {
      if (!ref.current) return;
      instanceRef.current = new Chart(ref.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(byCat),
          datasets: [{ data: Object.values(byCat), backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '62%',
          plugins: {
            legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 11, weight: '600' }, boxWidth: 10, padding: 12 } },
            tooltip: { callbacks: { label: (c) => ` ₹${Number(c.raw).toLocaleString('en-IN')}` }, bodyFont: { family: 'Outfit' } },
          },
        },
      });
    });
    return () => { if (instanceRef.current) instanceRef.current.destroy(); instanceRef.current = null; };
  };

  useEffect(() => buildPie(incomeChartRef,  incomeInstance,  'income',  'totalIncome',
    ['#16a34a','#22c55e','#4ade80','#86efac','#bbf7d0','#34d399']), [pieTransactions, month]);
  useEffect(() => buildPie(expenseChartRef, expenseInstance, 'expense', 'totalExpense',
    ['#e53e3e','#f87171','#fca5a5','#dc2626','#ef4444','#fecaca']), [pieTransactions, month]);

  const pieCards = [
    { id: 'totalIncome',  ref: incomeChartRef,  chartId: 'incomeChart',  variant: 'income'  },
    { id: 'totalExpense', ref: expenseChartRef, chartId: 'expenseChart', variant: 'expense' },
  ];

    if (loading) return <div className="p-4 flex flex-col gap-4"><SkeletonChart/>
     <SkeletonChart/>
    </div>;
  return (
    <div className="chart-page animate-fade-in-down">


      {/* Line Chart */}
     
      <section className="card chart-section">
        <h2 className="chart-section__title">Balance Analysis</h2>
        <div className="chart-section__canvas-wrap">
          <canvas ref={lineChartRef} />
        </div>
      </section>

      {/* Pie Charts */}
      <section className="card pie-section">
        <h2 className="pie-section__title">Income & Expense by Category</h2>
        <div className="pie-section__grid">
          {pieCards.map(({ id, ref, chartId, variant }) => (
            <div key={id} className={`pie-card pie-card__hover--${variant}`}>
              <p id={id} className={`pie-card__label pie-card__label--${variant}`}>Loading…</p>
              <div className="pie-card__canvas-wrap">
                <canvas ref={ref} id={chartId} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}