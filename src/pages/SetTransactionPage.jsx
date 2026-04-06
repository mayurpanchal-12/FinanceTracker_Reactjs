import { useEffect } from 'react';

import TransactionForm from '../components/TransactionForm';
import { useTransactions } from '../context/TransactionContext';
import './css/SetTransactionPage.css';
const fmt = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function SetTransactionPage() {
  const { setEditingId, scheduledTransactions, deleteTransaction, updateTransaction, unhighlightTransaction } = useTransactions();

  useEffect(() => { setEditingId(null); }, [setEditingId]);

  const TH = ({ children }) => <th className="th">{children}</th>;
  const TD = ({ children, className = '' }) => <td className={`td ${className}`}>{children}</td>;

  return (
    <>

      <section className="page-section">

        <div className="info-banner bg-primary/6">
          <span className="info-banner__icon">ℹ</span>
          <p>Set transactions for <strong>future dates</strong>. They appear in this table until the intended date; on that day they automatically move to the main Tracker and Charts.</p>
        </div>

        <TransactionForm scheduledPage={true} />

        <div className="scheduled-card card">
          <div className="scheduled-card__header">
            <h2 className="scheduled-card__title">Scheduled Transactions</h2>
            <p className="scheduled-card__subtitle">These will move to the main Tracker on their set date.</p>
          </div>

          <div className="scheduled-card__table-wrapper">
            <table className="scheduled-table">
              <thead>
                <tr>
                  {['#', 'Scheduled Date', 'Amount (₹)', 'Description', 'Type', 'Category', 'Actions'].map((h) => (
                    <TH key={h}>{h}</TH>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduledTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <span className="empty-state__icon">◈</span>
                        <p className="empty-state__text">No scheduled transactions</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  scheduledTransactions
                    .sort((a, b) => (a.scheduledDate || a.date).localeCompare(b.scheduledDate || b.date))
                    .map((tx, index) => (
                      <tr
                        key={tx.id}
                        className={`table-row hover:bg-primary/3 ${tx.highlighted ? 'table-row--highlighted bg-amber-500/4 ' : ''}`}
                      >
                        <TD className="td--index">{index + 1}</TD>
                        <TD className="td--date">{tx.scheduledDate || tx.date}</TD>
                        <TD className={tx.type === 'income' ? 'td--amount-income' : 'td--amount-expense'}>
                          {tx.type === 'income' ? '+' : '-'}₹{fmt(tx.amount)}
                        </TD>
                        <TD className="td--description">
                          <span className="td--description-text" title={tx.info}>{tx.info}</span>
                        </TD>
                        <TD>
                          <span className={`badge-type ${tx.type === 'income' ? 'badge-type--income' : 'badge-type--expense'}`}>
                            {tx.type}
                          </span>
                        </TD>
                        <TD>
                          <span className="badge-category">{tx.category}</span>
                        </TD>
                        <TD>
                          <div className="actions-cell">
                            <button className="btn-edit bg-primary/8 " onClick={() => setEditingId(tx.id)}>
                              Edit
                            </button>
                            <button className="btn-delete" onClick={() => deleteTransaction(tx.id)}>
                              Delete
                            </button>
                            {tx.highlighted && (
                              <button className="btn-unstar" onClick={() => unhighlightTransaction(tx.id)}>
                                Unstar
                              </button>
                            )}
                          </div>
                        </TD>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </>
  );
}