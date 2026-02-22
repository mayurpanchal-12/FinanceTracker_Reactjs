import { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { loadTransactions, saveTransactions, saveBalance, loadFilters, saveFilters } from '../utils/storage';
import { applyFilters } from '../utils/filterUtils';

const TransactionContext = createContext(null);

const CATEGORIES = ['Salary', 'Food', 'Transport', 'Shopping', 'Bills', 'Other'];

const todayISO = () => new Date().toISOString().slice(0, 10);

function transactionsReducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return action.payload;
    case 'ADD': {
      const payload = action.payload;
      return [...state, { id: Date.now(), ...payload, balance: 0 }];
    }
    case 'UPDATE': {
      const { id, data } = action.payload;
      const index = state.findIndex((t) => t.id === id);
      if (index === -1) return state;
      const next = [...state];
      next[index] = { ...next[index], ...data };
      return next;
    }
    case 'DELETE': {
      const id = action.payload;
      return state.filter((t) => t.id !== id);
    }
    case 'UNHIGHLIGHT': {
      const id = action.payload;
      return state.map((t) => (t.id === id ? { ...t, highlighted: false } : t));
    }
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

// Initialize transactions from localStorage
const initializeTransactions = () => {
  const loaded = loadTransactions();
  const today = todayISO();
  return loaded.map((tx) => {
    if (tx.isScheduled && tx.scheduledDate && tx.scheduledDate <= today) {
      return { ...tx, isScheduled: false, scheduledDate: undefined };
    }
    return tx;
  });
};

export function TransactionProvider({ children }) {
  const [transactions, dispatchTx] = useReducer(transactionsReducer, initializeTransactions());
  const [filters, dispatchFilter] = useReducer(filtersReducer, loadFilters());
  const [editingId, setEditingId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Save transactions to localStorage whenever they change (after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    saveTransactions(transactions);
  }, [transactions, isInitialized]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    saveFilters(filters);
  }, [filters, isInitialized]);

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
    let runningBalance = 0;
    return list.map((tx) => {
      runningBalance += tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount);
      return { ...tx, balance: runningBalance };
    });
  }, [mainTransactions, filters]);

  const summaryFromFiltered = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + Number(t.amount), 0);
    const expense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0);
    const balance = filteredTransactions.reduce(
      (s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
    );
    return { income, expense, balance };
  }, [filteredTransactions]);

  useEffect(() => {
    const overall = mainTransactions.reduce(
      (s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
    );
    saveBalance(overall);
  }, [mainTransactions]);

  const addTransaction = (tx, opts = {}) => {
    const today = todayISO();
    const asScheduled =
      opts.scheduledWhenFuture === true && tx.date && tx.date > today;
    const payload = asScheduled
      ? { ...tx, isScheduled: true, scheduledDate: tx.date }
      : { ...tx };
    dispatchTx({ type: 'ADD', payload: { id: Date.now(), ...payload } });
  };

  const updateTransaction = (id, data) => {
    dispatchTx({ type: 'UPDATE', payload: { id, data } });
  };

  const deleteTransaction = (id) => {
    dispatchTx({ type: 'DELETE', payload: id });
  };

  const unhighlightTransaction = (id) => {
    dispatchTx({ type: 'UNHIGHLIGHT', payload: id });
  };

  const setFilterMonth = (v) => dispatchFilter({ type: 'SET_MONTH', payload: v || '' });
  const setFilterType = (v) => dispatchFilter({ type: 'SET_TYPE', payload: v || '' });
  const setFilterCategory = (v) => dispatchFilter({ type: 'SET_CATEGORY', payload: v || '' });
  const setFilterSearch = (v) => dispatchFilter({ type: 'SET_SEARCH', payload: v || '' });

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
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}
