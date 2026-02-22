
import { useEffect, useRef, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useSpeechInput } from '../hooks/useSpeechInput';

const MIC_ICON = (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
  </svg>
);

const STOP_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
  </svg>
);

export default function TransactionForm({ scheduledPage = false }) {
  const {
    editingId,
    setEditingId,
    transactionToEdit,
    addTransaction,
    updateTransaction,
    categories,
  } = useTransactions();

  const [amount, setAmount] = useState('');
  const [info, setInfo] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('Salary');
  const [highlightActive, setHighlightActive] = useState(false);
  const [note, setNote] = useState('');
  const [noteVisible, setNoteVisible] = useState(false);

  /* 🎤 MIC — ONLY ADDITION */
  const [isListening, setIsListening] = useState(false);
  /* 🎤 END */

  const infoRef = useRef(null);
  const { isSupported, startListening, stopListening } = useSpeechInput();

  useEffect(() => {
    if (!transactionToEdit && !editingId) return;

    if (transactionToEdit) {
      setAmount(String(transactionToEdit.amount));
      setInfo(transactionToEdit.info || '');
      setDate(transactionToEdit.scheduledDate || transactionToEdit.date);
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category || 'Salary');
      setHighlightActive(!!transactionToEdit.highlighted);

      const existingNote = transactionToEdit.note
        ? String(transactionToEdit.note)
        : '';
      setNote(existingNote);
      setNoteVisible(!!existingNote);
    }
  }, [transactionToEdit, editingId]);

  const clearForm = () => {
    setAmount('');
    setInfo('');
    setDate('');
    setType('income');
    setCategory('Salary');
    setHighlightActive(false);
    setNote('');
    setNoteVisible(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amt = Number(amount);
    const trimmedInfo = info.trim();

    if (!date || !trimmedInfo || Number.isNaN(amt) || amt <= 0) {
      alert('Please enter a positive amount and fill all fields.');
      return;
    }

    if (editingId !== null) {
      const today = new Date().toISOString().slice(0, 10);
      const isScheduled = scheduledPage && date > today;

      const updateData = {
        date,
        amount: amt,
        info: trimmedInfo,
        type,
        category,
        highlighted: highlightActive,
        note: note.trim() || undefined,
      };

      if (isScheduled) {
        updateData.isScheduled = true;
        updateData.scheduledDate = date;
      } else if (transactionToEdit?.isScheduled) {
        updateData.isScheduled = false;
        updateData.scheduledDate = undefined;
      }

      updateTransaction(editingId, updateData);
      clearForm();
    } else {
      addTransaction(
        {
          date,
          amount: amt,
          info: trimmedInfo,
          type,
          category,
          highlighted: highlightActive,
          note: note.trim() || undefined,
        },
        { scheduledWhenFuture: scheduledPage }
      );

      setAmount('');
      setInfo('');
      setNote('');
      setNoteVisible(false);
    }
  };

  /* 🎤 MIC — UPDATED HANDLER ONLY */
  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      startListening(
        (transcript) => {
          setInfo((prev) =>
            prev.trim() ? `${prev.trim()} ${transcript}` : transcript
          );
        },
        () => setIsListening(false)
      );
    } else {
      stopListening();
      setIsListening(false);
    }
  };
  /* 🎤 END */

  const isEditMode = editingId !== null;

  return (
    <section className="bg-surface backdrop-blur-md border border-border rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:bg-surface-hover mb-5">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 items-start"
      >
        {/* Amount */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[0.9rem] text-text-main ml-1">
            Amount (₹)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter amount"
            className="w-full py-3 px-4 rounded-xl border border-border-solid bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Description + Mic */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[0.9rem] text-text-main ml-1">
            Description
          </label>

          <div className="relative flex items-stretch w-full">
            <input
              ref={infoRef}
              type="text"
              placeholder="Transaction details"
              className="w-[220px] sm:w-[180px] py-3 px-4 rounded-l-xl border border-border-solid border-r-0 bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />

            <button
              type="button"
              onClick={handleMicClick}
              disabled={!isSupported}
              title={isListening ? 'Stop listening' : 'Start voice input'}
              className={`px-2 rounded-r-xl border border-border-solid border-l-0 flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                  : 'bg-surface-solid text-primary hover:bg-[#e0e7ff] hover:text-primary-hover'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? STOP_ICON : MIC_ICON}
            </button>
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[0.9rem] text-text-main ml-1">
            Date
          </label>
          <input
            type="date"
            className="w-full py-3 px-4 rounded-xl border border-border-solid bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[0.9rem] text-text-main ml-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full py-3 px-4 rounded-xl border border-border-solid bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category + Highlight */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[0.9rem] text-text-main ml-1">
            Category
          </label>
          <div className="flex gap-2.5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border border-border-solid bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setHighlightActive((a) => !a)}
              className={`py-2 px-3 rounded-md font-semibold transition-all duration-300 ${
                highlightActive
                  ? 'bg-warning text-white shadow-[0_4px_10px_rgba(245,158,11,0.3)]'
                  : 'bg-surface-solid text-text-light border border-border-solid shadow-sm hover:bg-warning hover:text-white'
              }`}
            >
              Highlight
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 justify-end">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setNoteVisible((v) => !v)}
              className="flex-1 py-3 px-5 rounded-md bg-surface-solid border border-border-solid font-semibold hover:bg-[#f3e8ff]"
            >
              {noteVisible ? 'Hide note' : '📝 Note'}
            </button>

            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-md bg-gradient-to-br from-primary to-accent text-white font-semibold shadow hover:-translate-y-0.5"
            >
              {isEditMode ? '✏️ Update Transaction' : '➕ Add Transaction'}
            </button>
          </div>

          {noteVisible && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Short note"
                className="w-full py-3 px-4 rounded-xl border border-border-solid bg-surface-solid"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}
        </div>
      </form>
    </section>
  );
}