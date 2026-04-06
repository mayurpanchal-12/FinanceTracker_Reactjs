
import { useTransactions } from '../context/TransactionContext';
import './css/Notepage.css';
import { SkeletonCard } from '../components/Skeleton';
const fmt = (n) => Number(n).toLocaleString('en-IN');

export default function NotesPage() {
  const { transactions, loading } = useTransactions();
  if (loading) return <div className="p-4 flex flex-col gap-4">

  <SkeletonCard lines={4} />
  <SkeletonCard lines={4} />
  <SkeletonCard lines={4} />

  </div>;
  const notes = transactions
    .filter((t) => t.note && String(t.note).trim() !== '')
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  return (
    <>

      <section className="card notes-section animate-fade-in">

        
        <div className="notes-header">
          <h2 className="notes-header__title">Transaction Notes</h2>
          <p className="notes-header__subtitle">Notes you added while creating transactions — reminders and extra context.</p>
        </div>

        {notes.length === 0 ? (
          
          <div className="notes-empty">
            <span className="notes-empty__icon">◇</span>
            <p className="notes-empty__text">No notes yet. Add one from the Tracker form.</p>
          </div>
        ) : (
          
          <ul className="notes-grid">
            {notes.map((tx) => (
              <li key={tx.id} className="note-card group">

                
                <div className={`note-card__accent ${tx.type === 'income' ? 'note-card__accent--income' : 'note-card__accent--expense'}`} />

                <div className="note-card__inner">

                  {/* Top Row */}
                  <div className="note-card__top-row">
                    <span className={`note-card__badge ${tx.type === 'income' ? 'note-card__badge--income' : 'note-card__badge--expense'}`}>
                      {tx.type}
                    </span>
                    <span className="note-card__amount">₹{fmt(tx.amount)}</span>
                  </div>

               
                  <div className="note-card__details">
                    {[['Date', tx.date], ['Details', tx.info || '—'], ['Category', tx.category || '—']].map(([k, v]) => (
                      <div key={k} className="note-card__detail-row">
                        <span className="note-card__detail-key">{k}</span>
                        <span className="note-card__detail-value" title={v}>{v}</span>
                      </div>
                    ))}
                  </div>

                
                  <div className="note-card__note-section">
                    <p className="note-card__note-label">Note</p>
                    <p className="note-card__note-text">{tx.note}</p>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        )}

      </section>
    </>
  );
}