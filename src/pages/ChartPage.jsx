
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useTransactions } from '../context/TransactionContext';
import { aggregateMonthlyData } from '../utils/chartData';
import { applyFilters } from '../utils/filterUtils';

export default function ChartPage() {
  const [searchParams] = useSearchParams();
  const { mainTransactions } = useTransactions();
  const lineChartRef = useRef(null);
  const incomeChartRef = useRef(null);
  const expenseChartRef = useRef(null);
  const lineInstance = useRef(null);
  const incomeInstance = useRef(null);
  const expenseInstance = useRef(null);

  const month = searchParams.get('month') || '';
  const type = searchParams.get('type') || '';
  const category = searchParams.get('category') || '';
  const filters = { month, type, category };
  const pieTransactions = applyFilters(mainTransactions, filters);
  const lineData = aggregateMonthlyData(mainTransactions);

  useEffect(() => {
    if (!lineChartRef.current || !lineData.labels.length) return;
    let chartInstance = null;
    import('chart.js/auto').then(({ default: Chart }) => {
      if (!lineChartRef.current) return;
      if (lineInstance.current) lineInstance.current.destroy();
      chartInstance = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: lineData.labels,
          datasets: [
            { label: 'Income', data: lineData.incomeData, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,52,0.1)', fill: true, tension: 0.3 },
            { label: 'Expense', data: lineData.expenseData, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.1)', fill: true, tension: 0.3 },
            { label: 'Overall Balance', data: lineData.balanceData, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.3 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true }, tooltip: { callbacks: { label: (ctx) => `₹${ctx.raw}` } } },
          scales: { y: { ticks: { callback: (v) => `₹${v}` } } },
        },
      });
      lineInstance.current = chartInstance;
    });
    return () => { if (lineInstance.current) lineInstance.current.destroy(); lineInstance.current = null; };
  }, [mainTransactions]);

  useEffect(() => {
    if (!incomeChartRef.current) return;
    const incomeData = pieTransactions.filter((t) => t.type === 'income');
    const dataByCat = {};
    let total = 0;
    incomeData.forEach((tx) => {
      const cat = tx.category || 'Other';
      dataByCat[cat] = (dataByCat[cat] || 0) + Number(tx.amount);
      total += Number(tx.amount);
    });
    const totalEl = document.getElementById('totalIncome');
    if (totalEl) totalEl.textContent = month ? `Total Income for ${month}: ₹${total}` : `Total Income: ₹${total}`;
    if (incomeInstance.current) incomeInstance.current.destroy();
    incomeInstance.current = null;
    if (Object.keys(dataByCat).length === 0) {
      incomeChartRef.current.style.display = 'none';
      return;
    }
    incomeChartRef.current.style.display = 'block';
    import('chart.js/auto').then(({ default: Chart }) => {
      if (!incomeChartRef.current) return;
      incomeInstance.current = new Chart(incomeChartRef.current, {
        type: 'pie',
        data: {
          labels: Object.keys(dataByCat),
          datasets: [{ data: Object.values(dataByCat), backgroundColor: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#d1fae5'] }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
      });
    });
    return () => { if (incomeInstance.current) incomeInstance.current.destroy(); incomeInstance.current = null; };
  }, [pieTransactions, month]);

  useEffect(() => {
    if (!expenseChartRef.current) return;
    const expenseData = pieTransactions.filter((t) => t.type === 'expense');
    const dataByCat = {};
    let total = 0;
    expenseData.forEach((tx) => {
      const cat = tx.category || 'Other';
      dataByCat[cat] = (dataByCat[cat] || 0) + Number(tx.amount);
      total += Number(tx.amount);
    });
    const totalEl = document.getElementById('totalExpense');
    if (totalEl) totalEl.textContent = month ? `Total Expense for ${month}: ₹${total}` : `Total Expense: ₹${total}`;
    if (expenseInstance.current) expenseInstance.current.destroy();
    expenseInstance.current = null;
    if (Object.keys(dataByCat).length === 0) {
      expenseChartRef.current.style.display = 'none';
      return;
    }
    expenseChartRef.current.style.display = 'block';
    import('chart.js/auto').then(({ default: Chart }) => {
      if (!expenseChartRef.current) return;
      expenseInstance.current = new Chart(expenseChartRef.current, {
        type: 'pie',
        data: {
          labels: Object.keys(dataByCat),
          datasets: [{ data: Object.values(dataByCat), backgroundColor: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fee2e2'] }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
      });
    });
    return () => { if (expenseInstance.current) expenseInstance.current.destroy(); expenseInstance.current = null; };
  }, [pieTransactions, month]);

  return (
    <div className="flex flex-col gap-8 animate-[fadeInDown_0.4s_ease-out] pb-10">
      <Header />
      
      <section className="bg-surface backdrop-blur-md border border-border rounded-2xl shadow-md p-6 sm:p-8 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-[1.2rem] font-bold text-text-main mb-6 flex items-center gap-2">
          📈 Overall Balance Analysis
        </h2>
        <div className="relative w-full h-[320px] flex justify-center items-center bg-surface-solid border border-border-solid rounded-xl p-4 shadow-sm">
          <canvas ref={lineChartRef} id="balanceChart" />
        </div>
      </section>

      <section className="bg-surface backdrop-blur-md border border-border rounded-2xl shadow-md p-6 sm:p-8 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-[1.2rem] font-bold text-text-main mb-8 flex items-center gap-2">
          📊 Income & Expense by Category
        </h2>
        <div className="flex flex-wrap md:flex-nowrap gap-8 justify-center items-stretch">
          
          {/* Income Pie Chart Container */}
          <div className="flex-1 min-w-[280px] max-w-[500px] flex flex-col items-center gap-5 bg-surface-solid border border-border-solid rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-md">
            <p id="totalIncome" className="text-[1.05rem] font-semibold text-green-700 bg-green-500/10 px-4 py-2.5 rounded-lg w-full text-center shadow-[inset_0_1px_4px_rgba(34,197,94,0.1)]">
              Total Income: ₹0
            </p>
            <div className="relative w-full h-[250px] flex justify-center items-center">
              <canvas ref={incomeChartRef} id="incomeChart" />
            </div>
          </div>

          {/* Expense Pie Chart Container */}
          <div className="flex-1 min-w-[280px] max-w-[500px] flex flex-col items-center gap-5 bg-surface-solid border border-border-solid rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-red-300 hover:shadow-md">
            <p id="totalExpense" className="text-[1.05rem] font-semibold text-red-700 bg-red-500/10 px-4 py-2.5 rounded-lg w-full text-center shadow-[inset_0_1px_4px_rgba(239,68,68,0.1)]">
              Total Expense: ₹0
            </p>
            <div className="relative w-full h-[250px] flex justify-center items-center">
              <canvas ref={expenseChartRef} id="expenseChart" />
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}



