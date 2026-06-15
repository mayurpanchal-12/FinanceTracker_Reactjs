import { useState } from 'react';
import { useTransactions } from '../../../context/TransactionContext';
import './css/TransactionTable.css';
import { useAuth } from '../../../context/AuthContext';
import ReceiptModal from './receiptModal';
import useRowHighlight from '../utils/rowHighlight';

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



export default function TransactionTable() {
 const { filteredTransactions, filters, deleteTransaction, setEditingId, toggleHighlight, summary } = useTransactions();
  const { role } = useAuth();
  const [receiptUrl, setReceiptUrl] = useState(null); // controls modal
  const rowBg = useRowHighlight(filteredTransactions, summary, filters.search);
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
 
                  {/* // amount with color based on type */}
                  <td className={`td ${tx.type === 'income' ? 'tx-cell--amount-income' : 'tx-cell--amount-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{fmt(tx.amount)}
                  </td>

                  {/* description */}
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
onClick={() => {
  console.log("Transaction:", tx);
  console.log("ID:", tx.id);
  console.log("Firestore ID:", tx.firestoreId);

  toggleHighlight(tx.id);
}}/>

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