import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useBudget } from "../features/Budget/context/BudgetContext";
import { applyFilters } from "../features/filters/utils/filterUtils";
import {
  deleteTransaction as deleteTxInDB,
  loadFilters,
  loadTransactions,
  saveFilters,
  saveTransaction,
  updateTransaction as updateTxInDB,
} from "../features/transactions/utils/storage";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext(null);

const CATEGORIES = [
  "Salary",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Other",
];
const DEFAULT_FILTERS = { month: "", type: "", category: "", search: "" };
const todayISO = () => new Date().toISOString().slice(0, 10);

const handlers = {
  SET_TRANSACTIONS: (state, payload) => payload,

  ADD: (state, payload) => [...state, payload],

  DELETE: (state, payload) => state.filter((t) => t.id !== payload),

  UPDATE: (state, payload) =>
    state.map((t) => (t.id === payload.id ? { ...t, ...payload.data } : t)),
};

function transactionsReducer(state, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action.payload) : state;
}

const filterHandlers = {
  SET_MONTH: (state, payload) => ({ ...state, month: payload }),
  SET_TYPE: (state, payload) => ({ ...state, type: payload }),
  SET_CATEGORY: (state, payload) => ({ ...state, category: payload }),
  SET_SEARCH: (state, payload) => ({ ...state, search: payload }),
};
function filtersReducer(state, action) {
  const handler = filterHandlers[action.type];
  return handler ? handler(state, action.payload) : state;
}

export function TransactionProvider({ children }) {
  const { user, role, linkedAdminUid } = useAuth();
  const { budgets } = useBudget();
  const [transactions, dispatchTx] = useReducer(transactionsReducer, []);
  const [filters, dispatchFilter] = useReducer(filtersReducer, DEFAULT_FILTERS);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // load transactions + filters from Firestore when user logs in

  useEffect(() => {
    if (user === undefined) return;
    if (user === null || role == null) {
      dispatchTx({ type: "SET_TRANSACTIONS", payload: [] });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const today = todayISO();
        const targetUid =
          role === "admin"
            ? user.uid
            : role === "viewer"
              ? linkedAdminUid
              : user.uid;

        const loaded = await loadTransactions(targetUid);
        const toPromote = loaded
          .filter(
            (tx) =>
              tx.isScheduled && tx.scheduledDate && tx.scheduledDate <= today,
          )
          .map((tx) => tx.firestoreId);
        const processed = loaded.map((tx) =>
          toPromote.includes(tx.firestoreId)
            ? { ...tx, isScheduled: false, scheduledDate: undefined }
            : tx,
        );

        if (toPromote.length > 0) {
          await Promise.all(
            toPromote.map((fid) =>
              updateTxInDB(user.uid, fid, {
                isScheduled: false,
                scheduledDate: null,
              }),
            ),
          );
        }

        dispatchTx({ type: "SET_TRANSACTIONS", payload: processed });

        const savedFilters = await loadFilters(user.uid);
        dispatchFilter({ type: "SET_MONTH", payload: savedFilters.month });
        dispatchFilter({ type: "SET_TYPE", payload: savedFilters.type });
        dispatchFilter({
          type: "SET_CATEGORY",
          payload: savedFilters.category,
        });
        dispatchFilter({ type: "SET_SEARCH", payload: savedFilters.search });
      } catch {
        toast.error("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, role, linkedAdminUid]);

  // persist filters to Firestore when they change
  useEffect(() => {
    if (!user || loading) return;
    saveFilters(user.uid, filters);
  }, [filters, user, loading]);

  const mainTransactions = useMemo(
    () => transactions.filter((tx) => !tx.isScheduled),
    [transactions],
  );

  const scheduledTransactions = useMemo(
    () => transactions.filter((tx) => tx.isScheduled === true),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    const list = applyFilters(mainTransactions, filters);

    // Firestore returns newest-first, so sort chronologically before computing
    // running balance (oldest → newest), then reverse back for display
    const chronological = [...list].sort((a, b) =>
      String(a.date).localeCompare(String(b.date)),
    );
    let runningBalance = 0;
    const withBalance = chronological.map((tx) => {
      runningBalance +=
        tx.type === "income" ? Number(tx.amount) : -Number(tx.amount);
      return { ...tx, balance: runningBalance };
    });
    // flip back so newest appears at the top of the table
    return withBalance.reverse();
  }, [mainTransactions, filters]);

  const summaryFromFiltered = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "income") income += Number(transaction.amount);
      if (transaction.type === "expense") expense += Number(transaction.amount);
    });

    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  // add transaction — save to Firestore + update local state
  const addTransaction = async (tx, opts = {}) => {
    if (!user || role !== "admin") return;
    const today = todayISO();
    const asScheduled =
      opts.scheduledWhenFuture === true && tx.date && tx.date > today;
    const payload = asScheduled
      ? { ...tx, isScheduled: true, scheduledDate: tx.date }
      : { ...tx };

    try {
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined),
      );
      const firestoreId = await saveTransaction(user.uid, {
        ...cleanPayload,
        highlighted: false,
      });
      dispatchTx({
        type: "ADD",
        payload: {
          ...payload,
          id: firestoreId,
          firestoreId,
          balance: 0,
          highlighted: false,
        },
      });
      toast.success("Transaction added!");

      if (
        !asScheduled &&
        tx.type === "expense" &&
        tx.category &&
        budgets[tx.category]
      ) {
        const thisMonth = todayISO().slice(0, 7);

        const allTx = [...transactions, { ...payload, id: firestoreId }];

        const categorySpent = allTx
          .filter(
            (t) =>
              !t.isScheduled &&
              t.type === "expense" &&
              t.category === tx.category &&
              t.date?.startsWith(thisMonth),
          )
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const limit = Number(budgets[tx.category]);
        const pct = Math.round((categorySpent / limit) * 100);
        if (pct >= 100) {
          toast.error(
            `⚠️ ${tx.category} budget exceeded! ₹${categorySpent.toLocaleString("en-IN")} of ₹${limit.toLocaleString("en-IN")}`,
            { duration: 5000 },
          );
        } else if (pct >= 80) {
          toast(
            `🟡 ${tx.category} budget at ${pct}% — ₹${(limit - categorySpent).toLocaleString("en-IN")} left`,
            { duration: 4000 },
          );
        }
      }
    } catch (error) {
      toast.error("Failed to add transaction.");
    }
  };

  // update transaction — update in Firestore + local state
  const updateTransaction = async (id, data) => {
    if (!user || role !== "admin") return;

    const tx = transactions.find((t) => t.id === id);
    if (!tx?.firestoreId) return;

    try {
      await updateTxInDB(user.uid, tx.firestoreId, data);
      dispatchTx({ type: "UPDATE", payload: { id, data } });
    } catch (error) {
      toast.error("Failed to update transaction.");
    }
  };

  // delete transaction — delete from Firestore + local state
  const deleteTransaction = async (id) => {
    if (!user || role !== "admin") return;

    const tx = transactions.find((t) => t.id === id);
    if (!tx?.firestoreId) return;

    try {
      await deleteTxInDB(user.uid, tx.firestoreId);
      dispatchTx({ type: "DELETE", payload: id });
    } catch (error) {
      toast.error("Failed to delete transaction.");
    }
  };

  const toggleHighlight = async (id) => {
    if (!user || role !== "admin") return;
    const tx = transactions.find((t) => t.id === id);
    if (!tx?.firestoreId) return;

    const newValue = !tx.highlighted;
    try {
      await updateTxInDB(user.uid, tx.firestoreId, { highlighted: newValue });
      dispatchTx({
        type: "UPDATE",
        payload: { id, data: { highlighted: newValue } },
      });
    } catch {
      toast.error("Failed to update highlight.");
    }
  };

  const setFilterMonth = (v) =>
    dispatchFilter({ type: "SET_MONTH", payload: v || "" });
  const setFilterType = (v) =>
    dispatchFilter({ type: "SET_TYPE", payload: v || "" });
  const setFilterCategory = (v) =>
    dispatchFilter({ type: "SET_CATEGORY", payload: v || "" });
  const setFilterSearch = (v) =>
    dispatchFilter({ type: "SET_SEARCH", payload: v || "" });

  const transactionToEdit = useMemo(
    () => (editingId ? transactions.find((t) => t.id === editingId) : null),
    [transactions, editingId],
  );

  const value = useMemo(
    () => ({
      transactions,
      mainTransactions,
      scheduledTransactions,
      filteredTransactions,
      filters,
      summary: summaryFromFiltered,
      editingId,
      setEditingId,
      transactionToEdit,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      toggleHighlight,
      setFilterMonth,
      setFilterType,
      setFilterCategory,
      setFilterSearch,
      categories: CATEGORIES,
      loading,
    }),
    [
      transactions,
      mainTransactions,
      scheduledTransactions,
      filteredTransactions,
      filters,
      summaryFromFiltered,
      editingId,
      transactionToEdit,
      toggleHighlight,
      loading,
      deleteTransaction,
    ],
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
}
