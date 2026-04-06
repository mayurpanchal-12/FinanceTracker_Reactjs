import { useTransactions } from '../context/TransactionContext';
import './css/TransactionTable.css';
import { useAuth } from '../context/AuthContext';

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
  console.log("table rendered");
  
  const { filteredTransactions, filters, deleteTransaction, setEditingId, unhighlightTransaction, summary } = useTransactions();
  const { role } = useAuth(); 

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
                    {role === 'admin' ? (
                      <div className="tx-actions">
                        <ActionBtn label="Edit" variant="edit" onClick={() =>{ setEditingId(tx.id);
                          console.log("edit clicked for transaction id:", tx.id);
                        }  
                        } />
                        <ActionBtn label="Delete" variant="danger" onClick={() => {deleteTransaction(tx.id)
                          console.log("clicked delete");
                          
                        }} />
                        {tx.highlighted && (
                          <ActionBtn label="Unstar" variant="neutral" onClick={() => {unhighlightTransaction(tx.id);
                            console.log("clicked unstar");
                            
                          } }/>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-text-light/50 italic">view only</span>
                    )}
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