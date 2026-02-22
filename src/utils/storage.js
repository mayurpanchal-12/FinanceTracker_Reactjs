const TRANSACTIONS_KEY = 'transactions';
const BALANCE_KEY = 'balance';
const FILTERS_KEY = 'filters';

export function loadTransactions() {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
}

export function loadBalance() {
  try {
    return parseFloat(localStorage.getItem(BALANCE_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveBalance(balance) {
  try {
    localStorage.setItem(BALANCE_KEY, String(balance));
  } catch (error) {
    console.error('Error saving balance to localStorage:', error);
  }
}

export function loadFilters() {
  try {
    const data = localStorage.getItem(FILTERS_KEY);
    const parsed = data ? JSON.parse(data) : {};
    return {
      month: parsed.month || '',
      type: parsed.type || '',
      category: parsed.category || '',
      search: parsed.search || '',
    };
  } catch {
    return { month: '', type: '', category: '', search: '' };
  }
}

export function saveFilters(filters) {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters to localStorage:', error);
  }
}
