import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import './css/TransactionTable.css';
import { useAuth } from '../context/AuthContext';
import { createPortal } from 'react-dom';

const fmt = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TypeBadge = ({ type }) => (
  <span className={`type-badge ${type === 'income' ? 'type-badge--income' : 'type-badge--expense'}`}>
    {type}
  </span>
);

const ActionBtn = ({ label, variant = 'danger', onClick }) => (
  <button type="button" onClick={onClick}
    className={`action-btn ${
      variant === 'edit'    ? 'action-btn--edit bg-primary/8' :
      variant === 'neutral' ? 'action-btn--neutral' :
                              'action-btn--danger'
    }`}>
    {label}
  </button>
);

// ── Receipt Preview Modal ─────────────────────────────────
function ReceiptModal({ url, onClose }) {
  if (!url) return null;
  const isPdf = url.includes('.pdf') || url.includes('application/pdf');

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1f32] rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8">
          <p className="text-sm font-bold text-text-main">Receipt</p>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:opacity-70 px-3 py-1.5 rounded-lg bg-primary/8"
            >
              Open ↗
            </a>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/8 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* content */}
        <div className="p-4 bg-gray-50 dark:bg-black/20 flex items-center justify-center min-h-[200px]">
          {isPdf ? (
            <iframe src={url} title="receipt" className="w-full h-[60vh] rounded-xl border-0" />
          ) : (
            <img
              src={url}
              alt="receipt"
              className="max-w-full max-h-[60vh] rounded-xl object-contain"
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main Component ────────────────────────────────────────
export default function TransactionTable() {
 const { filteredTransactions, filters, deleteTransaction, setEditingId, toggleHighlight, summary } = useTransactions();
  const { role } = useAuth();
  const [receiptUrl, setReceiptUrl] = useState(null); // controls modal

  const hasActiveSearch = filters.search && String(filters.search).trim() !== '';
  const overallBalance = Number(summary?.balance ?? 0);
  const shouldAutoHighlight = filteredTransactions.length >= 10 && overallBalance !== 0;

  const pickTopIds = (type, count) =>
    filteredTransactions.filter((t) => t.type === type).slice()
      .sort((a, b) => {
        const d = Number(b.amount) - Number(a.amount);
        if (d !== 0) return d;
        const dd = String(b.date).localeCompare(String(a.date));
        return dd !== 0 ? dd : Number(b.id) - Number(a.id);
      }).slice(0, count).map((t) => t.id);

  const autoIncomeIds  = shouldAutoHighlight && overallBalance > 0 ? new Set(pickTopIds('income', 2)) : new Set();
  const autoExpenseIds = shouldAutoHighlight && overallBalance < 0 ? new Set(pickTopIds('expense', 2)) : new Set();

  const rowBg = (tx) => {
    if (autoIncomeIds.has(tx.id))  return 'bg-emerald-500/4 border-l-2 border-l-emerald-400';
    if (autoExpenseIds.has(tx.id)) return 'bg-red-500/4 border-l-2 border-l-red-400';
    if (tx.highlighted)            return 'bg-amber-500/4 border-l-2 border-l-amber-400';
    if (hasActiveSearch)           return 'bg-primary/3 border-l-2 border-l-primary/40';
    return '';
  };

  return (
    <section className="tx-table-section">

      {/* receipt modal */}
      <ReceiptModal url={receiptUrl} onClose={() => setReceiptUrl(null)} />

      <div className="tx-table-header">
        <span className="section-label">Transactions</span>
        <span className="tx-table-header__count">
          {filteredTransactions.length} record{filteredTransactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="tx-table-scroll">
        <table className="tx-table">
          <thead>
            <tr>
              {['#', 'Date', 'Amount (₹)', 'Description', 'Type', 'Category', 'Balance (₹)', 'Actions'].map((h) => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="tx-empty">
                    <span className="tx-empty__icon">◎</span>
                    <p className="tx-empty__text">No transactions match the current filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx, index) => (
                <tr key={tx.id || tx.firestoreId || index} className={`tx-row hover:bg-primary/3 ${rowBg(tx)} group`}>
                  <td className="td tx-cell--index text-text-light/60">{index + 1}</td>
                  <td className="td tx-cell--date">{tx.date}</td>
                  <td className={`td ${tx.type === 'income' ? 'tx-cell--amount-income' : 'tx-cell--amount-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{fmt(tx.amount)}
                  </td>
                  <td className="td tx-cell--desc">
                    <span className="tx-cell--desc-text" title={tx.info}>{tx.info}</span>
                    {tx.note && String(tx.note).trim() && (
                      <span title={tx.note} className="tx-cell--note-tag">✎ note</span>
                    )}
                  </td>
                  <td className="td"><TypeBadge type={tx.type} /></td>
                  <td className="td">
                    <span className="category-badge">{tx.category}</span>
                  </td>
                  <td className={`td ${Number(tx.balance) >= 0 ? 'tx-cell--balance-positive' : 'tx-cell--balance-negative'}`}>
                    ₹{fmt(tx.balance)}
                  </td>
                  <td className="td">
                    <div className="tx-actions">

                      {/* 🧾 receipt icon — shows only if tx has receipt */}
                      {tx.receiptUrl && (
                        <button
                          type="button"
                          title="View receipt"
                          onClick={() => setReceiptUrl(tx.receiptUrl)}
                          className="action-btn bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                        >
                          🧾
                        </button>
                      )}

                      {role === 'admin' ? (
                        <>
                          <ActionBtn label="Edit" variant="edit" onClick={() => setEditingId(tx.id)} />
                          <ActionBtn label="Delete" variant="danger" onClick={() => deleteTransaction(tx.id)} />
                         <ActionBtn 
  label={tx.highlighted ? 'Unstar' : 'Star'} 
  variant="neutral" 
  onClick={() => toggleHighlight(tx.id)} 
/>
                        </>
                      ) : (
                        <span className="text-xs text-text-light/50 italic">view only</span>
                      )}

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}