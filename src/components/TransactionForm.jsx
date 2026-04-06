import useFormState from './useformstate';
import { MicIco, StopIco, NoteIco, StarIco, ChevronIco } from './formicons';
import './css/TransactionForm.css';

function FieldWrap({ label, children }) {
  return (
    <div className="field-wrap">
      <span className="field-wrap__label text-text-light/70">{label}</span>
      {children}
    </div>
  );
}

export default function TransactionForm({ scheduledPage = false }) {
  const {
    amount, setAmount,
    info, setInfo,
    date, setDate,
    type, setType,
    category, setCategory,
    highlightActive, setHighlight,
    note, setNote,
    noteVisible, setNoteVisible,
    isListening,
    infoRef,
    isEditMode,
    categories,
    isSupported,
    clearForm,
    handleSubmit,
    handleMicClick,
  } = useFormState(scheduledPage);

  return (
    <section className="card form-card">

      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-[18px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" aria-hidden />

      <div className="form-header">
        <div>
          <h2 className="form-header__title">
            {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <p className="form-header__subtitle">
            {isEditMode ? 'Update the details below' : 'Record a new income or expense'}
          </p>
        </div>
        {isEditMode && (
          <button type="button" onClick={clearForm} className="form-header__cancel text-text-light/60">
            ✕ Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="form-grid">

        <FieldWrap label="Amount (₹)">
          <input type="number" min="0" step="0.01" placeholder="0.00" className="field"
            value={amount} onChange={(e) => setAmount(e.target.value)} />
        </FieldWrap>

        <FieldWrap label="Description">
          <div className="desc-field-wrap hover:border-primary/35 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(79,99,210,0.13)]">
            <input
              ref={infoRef}
              type="text"
              placeholder="Transaction details"
              className="desc-field-input placeholder-text-light/40"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
            {isSupported && (
              <button type="button" onClick={handleMicClick}
                title={isListening ? 'Stop' : 'Voice input'}
                className={`desc-field-mic ${isListening ? 'desc-field-mic--listening' : 'desc-field-mic--idle hover:bg-primary/8'}`}>
                {isListening ? <StopIco /> : <MicIco />}
              </button>
            )}
          </div>
        </FieldWrap>

        <FieldWrap label="Date">
          <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
        </FieldWrap>

        <FieldWrap label="Type">
          <div className="select-wrap">
            <select className="field pr-9 appearance-none cursor-pointer" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <span className="select-wrap__chevron text-text-light/50"><ChevronIco /></span>
          </div>
        </FieldWrap>

        <FieldWrap label="Category">
          <div className="category-row">
            <div className="category-row__select-wrap">
              <select className="field pr-9 appearance-none cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="select-wrap__chevron text-text-light/50"><ChevronIco /></span>
            </div>
            <button type="button" onClick={() =>{ setHighlight((a) => !a)
              console.log("highlight");
              
            }}
              title={highlightActive ? 'Remove highlight' : 'Highlight transaction'}
              className={`highlight-btn ${highlightActive ? 'highlight-btn--active shadow-amber-500/25' : 'highlight-btn--idle'}`}>
              <StarIco filled={highlightActive} />
            </button>
          </div>
        </FieldWrap>

        <div className="form-actions">
          <div className="form-actions__row">
            <button type="button" onClick={() => setNoteVisible((v) => !v)}
              className="btn-ghost form-actions__note-btn">
              <NoteIco />
              {noteVisible ? 'Hide note' : 'Add note'}
            </button>
            <button type="submit" className="btn-primary form-actions__submit-btn">
              {isEditMode ? '✓ Update' : '+ Add'}
            </button>
          </div>
          {noteVisible && (
            <input type="text" placeholder="Short note or reminder…" className="field"
              value={note} onChange={(e) => setNote(e.target.value)} />
          )}
        </div>

      </form>
    </section>
  );
}