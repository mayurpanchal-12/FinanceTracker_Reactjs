
import {Square ,Mic , NotebookText , CircleChevronDown } from 'lucide-react'
import useFormState from "./useformstate";
import "./css/TransactionForm.css";

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
    amount,
    setAmount,
    info,
    setInfo,
    date,
    setDate,
    type,
    setType,
    category,
    setCategory,
    note,
    setNote,
    noteVisible,
    setNoteVisible,
    isListening,
    infoRef,
    isEditMode,
    categories,
    isSupported,
    clearForm,
    handleSubmit,
    handleMicClick,
    // receipt
    receiptFile,
    receiptPreview,
    uploadingReceipt,
    receiptInputRef,
    handleReceiptChange,
    removeReceipt,
  } = useFormState(scheduledPage);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="card form-card">
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-[18px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none"
        aria-hidden
      />

{/* form header section */}
      <div className="form-header">
        <div>
          <h2 className="form-header__title">
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <p className="form-header__subtitle">
            {isEditMode
              ? "Update the details below"
              : "Record a new income or expense"}
          </p>
        </div>
        {isEditMode && (
          <button
            type="button"
            onClick={clearForm}
            className="form-header__cancel text-text-light/60"
          >
            ✕ Cancel
          </button>
        )}
      </div>



      <form onSubmit={handleSubmit} className="form-grid">
        <FieldWrap label="Amount (₹)">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
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
              <button
                type="button"
                onClick={handleMicClick}
                title={isListening ? "Stop" : "Voice input"}
                className={`desc-field-mic ${isListening ? "desc-field-mic--listening" : "desc-field-mic--idle hover:bg-primary/8"}`}
              >
                {isListening ? <Square className ="w-[17px] h-[17px]" /> : 
                                 <Mic className= " w-[18px] h-[18px]" />}
              </button>
            )}
          </div>
        </FieldWrap>

        {/* <FieldWrap label="Date">
          <input
            type="date"
            className="field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FieldWrap> */}
<FieldWrap label="Date">
          <input
            type="date"
            className="field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={!scheduledPage ? today : undefined}
            min={scheduledPage ? today : undefined}
          />
        </FieldWrap>


        <FieldWrap label="Type">
          <div className="select-wrap">
            <select
              className="field pr-9 appearance-none cursor-pointer"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <span className="select-wrap__chevron text-text-light/50">
              <CircleChevronDown className = "w-3.5 h-3.5 pointer-events-none" />
            </span>
          </div>
        </FieldWrap>

        <FieldWrap label="Category">
          <div className="category-row">
            <div className="category-row__select-wrap">
              <select
                className="field pr-9 appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="select-wrap__chevron text-text-light/50">
                <CircleChevronDown className = "w-3.5 h-3.5 pointer-events-none" />
              </span>
            </div>
          </div>
        </FieldWrap>

        {/* ── Receipt upload — only on add mode ── */}
        {!isEditMode && (
          <div className="flex flex-col gap-2">
            {/* hidden file input */}
            <input
              ref={receiptInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleReceiptChange}
            />

            {/* show preview if file selected */}
            {receiptPreview ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-primary/30 bg-primary/5">
                {receiptFile?.type?.startsWith("image/") ? (
                  <img
                    src={receiptPreview}
                    alt="receipt"
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <span className="text-2xl">📄</span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-main truncate">
                    {receiptFile?.name}
                  </p>
                  <p className="text-[10px] text-text-light">
                    {receiptFile
                      ? `${(receiptFile.size / 1024).toFixed(1)} KB`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeReceipt}
                  className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ) : (
              /* attach button */
              <button
                type="button"
                onClick={() => receiptInputRef.current?.click()}
                className="btn-ghost flex items-center gap-2 text-xs font-semibold w-fit px-4 py-2"
              >
                <span>📎</span>
                Attach Receipt
              </button>
            )}
          </div>
        )}

        <div className="form-actions">
          <div className="form-actions__row">
            <button
              type="button"
              onClick={() => setNoteVisible((v) => !v)}
              className="btn-ghost form-actions__note-btn"
            >
              <NotebookText  className=" w-4 h-4"/>
              {noteVisible ? "Hide note" : "Add note"}
            </button>
            <button
              type="submit"
              disabled={uploadingReceipt}
              className="btn-primary form-actions__submit-btn disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploadingReceipt
                ? "⏳ Uploading..."
                : isEditMode
                  ? "✓ Update"
                  : "+ Add"}
            </button>
          </div>
          {noteVisible && (
            <input
              type="text"
              placeholder="Short note or reminder…"
              className="field"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          )}
        </div>
      </form>
    </section>
  );
}
