import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  loadTransactions,
  saveTransaction,
  updateTransaction as updateTxInDB,
  deleteTransaction as deleteTxInDB,
  loadFilters,
  saveFilters,
} from '../utils/storage';
import { applyFilters } from '../utils/filterUtils';
import { useAuth } from './AuthContext';
import { useBudget } from './BudgetContext';
import toast from 'react-hot-toast';

const TransactionContext = createContext(null);

const CATEGORIES = ['Salary', 'Food', 'Transport', 'Shopping', 'Bills', 'Other'];

const todayISO = () => new Date().toISOString().slice(0, 10);

function transactionsReducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return action.payload;
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE': {
      const { id, data } = action.payload;
      const index = state.findIndex((t) => t.id === id);
      if (index === -1) return state;
      const next = [...state];
      next[index] = { ...next[index], ...data };
      return next;
    }
    case 'DELETE':
      return state.filter((t) => t.id !== action.payload);
    case 'UNHIGHLIGHT':
      return state.map((t) =>
        t.id === action.payload ? { ...t, highlighted: false } : t
      );
    default:
      return state;
  }
}

function filtersReducer(state, action) {
  switch (action.type) {
    case 'SET_MONTH':
      return { ...state, month: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    default:
      return state;
  }
}

const DEFAULT_FILTERS = { month: '', type: '', category: '', search: '' };

export function TransactionProvider({ children }) {
  const { user, role, linkedAdminUid } = useAuth();
  const { budgets } = useBudget();
  const [transactions, dispatchTx] = useReducer(transactionsReducer, []);
  const [filters, dispatchFilter] = useReducer(filtersReducer, DEFAULT_FILTERS);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // load transactions + filters from Firestore when user logs in
  useEffect(() => {
    // user === undefined means Firebase is still rehydrating — wait
    if (user === undefined) return;

    // user === null means logged out — clear everything
    if (user === null || role === null) {
      dispatchTx({ type: 'SET_TRANSACTIONS', payload: [] });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const today = todayISO();
        const targetUid = role === 'viewer' ? linkedAdminUid : user.uid;

        const loaded = await loadTransactions(targetUid);

        // collect any scheduled transactions that are due today or earlier
        const toPromote = [];
        const processed = loaded.map((tx) => {
          if (tx.isScheduled && tx.scheduledDate && tx.scheduledDate <= today) {
            toPromote.push(tx.firestoreId);
            return { ...tx, isScheduled: false, scheduledDate: undefined };
          }
          return tx;
        });

        // write promotions back to Firestore so they don't re-appear next refresh
        if (toPromote.length > 0) {
          await Promise.all(
            toPromote.map((fid) =>
              updateTxInDB(user.uid, fid, { isScheduled: false, scheduledDate: null })
            )
          );
        }

        dispatchTx({ type: 'SET_TRANSACTIONS', payload: processed });

        const savedFilters = await loadFilters(user.uid);
        dispatchFilter({ type: 'SET_MONTH', payload: savedFilters.month });
        dispatchFilter({ type: 'SET_TYPE', payload: savedFilters.type });
        dispatchFilter({ type: 'SET_CATEGORY', payload: savedFilters.category });
        dispatchFilter({ type: 'SET_SEARCH', payload: savedFilters.search });
      } catch (error) {
        toast.error('Failed to load transactions.');
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
    [transactions]
  );

  const scheduledTransactions = useMemo(
    () => transactions.filter((tx) => tx.isScheduled === true),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const list = applyFilters(mainTransactions, filters);

    // Firestore returns newest-first, so sort chronologically before computing
    // running balance (oldest → newest), then reverse back for display
    const chronological = [...list].sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    );
    let runningBalance = 0;
    const withBalance = chronological.map((tx) => {
      runningBalance +=
        tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount);
      return { ...tx, balance: runningBalance };
    });
    // flip back so newest appears at the top of the table
    return withBalance.reverse();
  }, [mainTransactions, filters]);

  const summaryFromFiltered = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + Number(t.amount), 0);
    const expense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0);
    const balance = filteredTransactions.reduce(
      (s, t) =>
        s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
    );
    return { income, expense, balance };
  }, [filteredTransactions]);

  // add transaction — save to Firestore + update local state
  const addTransaction = async (tx, opts = {}) => {
    if (!user || role !== 'admin') return;
    const today = todayISO();
    const asScheduled =
      opts.scheduledWhenFuture === true && tx.date && tx.date > today;
    const payload = asScheduled
      ? { ...tx, isScheduled: true, scheduledDate: tx.date }
      : { ...tx };

    try {
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined)
      );
      const firestoreId = await saveTransaction(user.uid, cleanPayload);
      dispatchTx({
        type: 'ADD',
        payload: { ...payload, id: firestoreId, firestoreId, balance: 0 },
      });
      toast.success('Transaction added!');

      // budget warning — use current transactions + new one for accurate spend
      if (!asScheduled && tx.type === 'expense' && tx.category && budgets[tx.category]) {
        const thisMonth = todayISO().slice(0, 7);
        const allTx = [...transactions, { ...payload, id: firestoreId }];
        const categorySpent = allTx
          .filter(
            (t) =>
              !t.isScheduled &&
              t.type === 'expense' &&
              t.category === tx.category &&
              t.date?.startsWith(thisMonth)
          )
          .reduce((s, t) => s + Number(t.amount), 0);
        const limit = Number(budgets[tx.category]);
        const pct = Math.round((categorySpent / limit) * 100);
        if (pct >= 100) {
          toast.error(
            `⚠️ ${tx.category} budget exceeded! ₹${categorySpent.toLocaleString('en-IN')} of ₹${limit.toLocaleString('en-IN')}`,
            { duration: 5000 }
          );
        } else if (pct >= 80) {
          toast(
            `🟡 ${tx.category} budget at ${pct}% — ₹${(limit - categorySpent).toLocaleString('en-IN')} left`,
            { duration: 4000 }
          );
        }
      }
    } catch (error) {
      toast.error('Failed to add transaction.');
    }
  };

  // update transaction — update in Firestore + local state
  const updateTransaction = async (id, data) => {
    if (!user || role !== 'admin') return;

    const tx = transactions.find((t) => t.id === id);
    if (!tx?.firestoreId) return;

    try {
      await updateTxInDB(user.uid, tx.firestoreId, data);
      dispatchTx({ type: 'UPDATE', payload: { id, data } });
    } catch (error) {
      toast.error('Failed to update transaction.');
    }
  };

  // delete transaction — delete from Firestore + local state
  const deleteTransaction = async (id) => {
    if (!user || role !== 'admin') return;

    const tx = transactions.find((t) => t.id === id);
    if (!tx?.firestoreId) return;

    try {
      await deleteTxInDB(user.uid, tx.firestoreId);
      dispatchTx({ type: 'DELETE', payload: id });
    } catch (error) {
      toast.error('Failed to delete transaction.');
    }
  };

  const unhighlightTransaction = (id) => {
    dispatchTx({ type: 'UNHIGHLIGHT', payload: id });
  };

  const setFilterMonth = (v) =>
    dispatchFilter({ type: 'SET_MONTH', payload: v || '' });
  const setFilterType = (v) =>
    dispatchFilter({ type: 'SET_TYPE', payload: v || '' });
  const setFilterCategory = (v) =>
    dispatchFilter({ type: 'SET_CATEGORY', payload: v || '' });
  const setFilterSearch = (v) =>
    dispatchFilter({ type: 'SET_SEARCH', payload: v || '' });

  const transactionToEdit = useMemo(
    () => (editingId ? transactions.find((t) => t.id === editingId) : null),
    [transactions, editingId]
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
      unhighlightTransaction,
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
      loading,
    ]
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
    throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}
