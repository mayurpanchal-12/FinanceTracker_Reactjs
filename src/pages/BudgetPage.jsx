import { useState } from 'react';

import { useTransactions } from '../context/TransactionContext';
import { useBudget } from '../context/BudgetContext';
import './css/BudgetPage.css';
import { SkeletonCard } from '../components/Skeleton';
import useBudgetRows from './Usebudgetrows';
import BudgetSummaryStrip from './Budgetsummarystrip'
import BudgetCategoryList from './Budgetcategorylist';

export default function BudgetPage() {
  const { mainTransactions, categories, loading: txLoading } = useTransactions();
  const { budgets, setBudgetForCategory, removeBudgetForCategory, loading: budgetLoading } = useBudget();

  const [editingCat, setEditingCat] = useState(null);
  const [inputVal, setInputVal] = useState('');

  const monthLabel = new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  const { rows, expenseCategories, totalBudgeted, totalSpent, overCount, nearCount } =
    useBudgetRows(mainTransactions, categories, budgets);

  const startEdit = (cat, currentLimit) => {
    setEditingCat(cat);
    setInputVal(currentLimit ? String(currentLimit) : '');
  };

  const saveEdit = async () => {
    const val = parseFloat(inputVal);
    if (!isNaN(val) && val > 0) {
      await setBudgetForCategory(editingCat, val);
    }
    setEditingCat(null);
    setInputVal('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') { setEditingCat(null); setInputVal(''); }
  };

  if (txLoading || budgetLoading) return (
    <div className="p-4 flex flex-col gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );

  return (
    <>
      <BudgetSummaryStrip
        monthLabel={monthLabel}
        totalBudgeted={totalBudgeted}
        totalSpent={totalSpent}
        overCount={overCount}
        nearCount={nearCount}
      />

      <div className="card px-5 py-3 my-2 flex items-center gap-2 border-l-4 border-l-primary/50">
        <span className="text-primary text-sm">💡</span>
        <p className="text-xs text-text-light font-medium">
          Budgets are <strong className="text-text-main">monthly</strong> — they reset automatically each month. Set a limit per category and we'll warn you when you're close or over.
        </p>
      </div>

      <BudgetCategoryList
        rows={rows}
        expenseCategories={expenseCategories}
        monthLabel={monthLabel}
        editingCat={editingCat}
        inputVal={inputVal}
        onInputChange={setInputVal}
        onKeyDown={handleKey}
        onSave={saveEdit}
        onCancelEdit={() => { setEditingCat(null); setInputVal(''); }}
        onStartEdit={startEdit}
        onRemove={removeBudgetForCategory}
      />
    </>
  );
}