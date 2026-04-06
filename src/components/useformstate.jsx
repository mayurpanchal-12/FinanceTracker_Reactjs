import { useEffect, useRef, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useSpeechInput } from '../hooks/useSpeechInput';
import toast from 'react-hot-toast';

export default function useFormState(scheduledPage = false) {
  const { editingId, setEditingId, transactionToEdit, addTransaction, updateTransaction, categories } = useTransactions();

  const [amount,          setAmount]      = useState('');
  const [info,            setInfo]        = useState('');
  const [date,            setDate]        = useState('');
  const [type,            setType]        = useState('income');
  const [category,        setCategory]    = useState('Salary');
  const [highlightActive, setHighlight]   = useState(false);
  const [note,            setNote]        = useState('');
  const [noteVisible,     setNoteVisible] = useState(false);
  const [isListening,     setIsListening] = useState(false);

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
      setHighlight(!!transactionToEdit.highlighted);
      const n = transactionToEdit.note ? String(transactionToEdit.note) : '';
      setNote(n);
      setNoteVisible(!!n);
    }
  }, [transactionToEdit, editingId]);

  const clearForm = () => {
    setAmount(''); setInfo(''); setDate(''); setType('income');
    setCategory('Salary'); setHighlight(false); setNote(''); setNoteVisible(false); setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    const trimmedInfo = info.trim();
    if (!date || !trimmedInfo || Number.isNaN(amt) || amt <= 0) {
      toast.error('Please enter a positive amount and fill all fields.');
      return;
    }
    if (editingId !== null) {
      const today = new Date().toISOString().slice(0, 10);
      const isScheduled = scheduledPage && date > today;
      const updateData = { date, amount: amt, info: trimmedInfo, type, category, highlighted: highlightActive, note: note.trim() || undefined };
      if (isScheduled) { updateData.isScheduled = true; updateData.scheduledDate = date; }
      else if (transactionToEdit?.isScheduled) { updateData.isScheduled = false; updateData.scheduledDate = undefined; }
      updateTransaction(editingId, updateData);
      clearForm();
    } else {
      addTransaction(
        { date, amount: amt, info: trimmedInfo, type, category, highlighted: highlightActive, note: note.trim() || undefined },
        { scheduledWhenFuture: scheduledPage }
      );
      setAmount(''); setInfo(''); setNote(''); setNoteVisible(false);
    }
  };

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      startListening((t) => setInfo((p) => p.trim() ? `${p.trim()} ${t}` : t), () => setIsListening(false));
    } else {
      stopListening();
      setIsListening(false);
    }
  };

  return {
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
    isEditMode: editingId !== null,
    categories,
    isSupported,
    clearForm,
    handleSubmit,
    handleMicClick,
  };
}