import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { useTransactions } from "../../../context/TransactionContext";
import { useSpeechInput } from "../hook/useSpeechInput";
import {uploadReceipt} from "../../vault/utils/vault";
export default function useFormState(scheduledPage = false) {
  const {
    editingId,
    setEditingId,
    transactionToEdit,
    addTransaction,
    updateTransaction,
    categories,
  } = useTransactions();
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [info, setInfo] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Salary");
  const [highlightActive, setHighlight] = useState(false);
  const [note, setNote] = useState("");
  const [noteVisible, setNoteVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // ── receipt state ─────────────────────────────────────
  const [receiptFile, setReceiptFile] = useState(null); // raw File object
  const [receiptPreview, setReceiptPreview] = useState(null); // local blob URL for preview
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const receiptInputRef = useRef(null);
  // ─────────────────────────────────────────────────────

  const infoRef = useRef(null);
  const { isSupported, startListening, stopListening } = useSpeechInput();

  useEffect(() => {
    if (!transactionToEdit && !editingId) return;
    if (transactionToEdit) {
      setAmount(String(transactionToEdit.amount));
      setInfo(transactionToEdit.info || "");
      setDate(transactionToEdit.scheduledDate || transactionToEdit.date);
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category || "Salary");
      setHighlight(!!transactionToEdit.highlighted);
      const n = transactionToEdit.note ? String(transactionToEdit.note) : "";
      setNote(n);
      setNoteVisible(!!n);
      // clear receipt on edit — editing receipt not supported yet
      setReceiptFile(null);
      setReceiptPreview(null);
    }
  }, [transactionToEdit, editingId]);

  // handle receipt file pick
  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Receipt too large — max 10MB");
      return;
    }
    setReceiptFile(file);
    // show local preview immediately
    setReceiptPreview(URL.createObjectURL(file));
  };

  // remove selected receipt
  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (receiptInputRef.current) receiptInputRef.current.value = "";
  };

  const clearForm = () => {
    setAmount("");
    setInfo("");
    setDate("");
    setType("income");
    setCategory("Salary");
    setHighlight(false);
    setNote("");
    setNoteVisible(false);
    setEditingId(null);
    setReceiptFile(null);
    setReceiptPreview(null);
    if (receiptInputRef.current) receiptInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = Number(amount);
    const trimmedInfo = info.trim();
    if (!date || !trimmedInfo || Number.isNaN(amt) || amt <= 0) {
      toast.error("Please enter a positive amount and fill all fields.");
      return;
    }

    if (editingId !== null) {
      // ── edit mode ──────────────────────────────────────
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
      // ── add mode ───────────────────────────────────────
      // 1. upload receipt first if selected
      let receiptUrl = undefined;
      if (receiptFile && user) {
        setUploadingReceipt(true);
        try {
          // pass null as txId — we don't have it yet, vault saves it anyway
          const saved = await uploadReceipt(user.uid, receiptFile, null);
          receiptUrl = saved.url;
        } catch {
          toast.error(
            "Receipt upload failed — transaction saved without receipt.",
          );
        } finally {
          setUploadingReceipt(false);
        }
      }

      // 2. add transaction with receiptUrl if available
      addTransaction(
        {
          date,
          amount: amt,
          info: trimmedInfo,
          type,
          category,
          highlighted: highlightActive,
          note: note.trim() || undefined,
          ...(receiptUrl && { receiptUrl }), // only add if receipt uploaded
        },
        { scheduledWhenFuture: scheduledPage },
      );

      // 3. reset form
      setAmount("");
      setInfo("");
      setNote("");
      setNoteVisible(false);
      setReceiptFile(null);
      setReceiptPreview(null);
      if (receiptInputRef.current) receiptInputRef.current.value = "";
    }
  };

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      startListening(
        (t) => setInfo((p) => (p.trim() ? `${p.trim()} ${t}` : t)),
        () => setIsListening(false),
      );
    } else {
      stopListening();
      setIsListening(false);
    }
  };

  return {
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
    highlightActive,
    setHighlight,
    note,
    setNote,
    noteVisible,
    setNoteVisible,
    isListening,
    infoRef,
    isEditMode: editingId !== null,
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
  };
}
