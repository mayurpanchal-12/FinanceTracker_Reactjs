import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';

const SEARCH_ICON = (
  <svg
    className="search-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const CLEAR_ICON = (
  <svg
    className="search-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="9" y1="9" x2="15" y2="15" />
    <line x1="15" y1="9" x2="9" y2="15" />
  </svg>
);

export default function Filters() {
  const {
    filters,
    setFilterMonth,
    setFilterType,
    setFilterCategory,
    setFilterSearch,
    categories,
  } = useTransactions();

  // Local state for search input (not applied until button click)
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Sync local state with filters when filters change externally (e.g., clear filters)
  useEffect(() => {
    if (filters.search !== searchInput) {
      setSearchInput(filters.search || '');
    }
  }, [filters.search]);

  // Handle search button click - apply the search
  const handleSearchClick = () => {
    setFilterSearch(searchInput.trim());
  };

  // Handle Enter key in search input - apply the search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchClick();
    }
  };

  // Handle clear search - restore main transaction table
  const handleClearSearch = () => {
    setSearchInput('');
    setFilterSearch('');
  };

  return (
    <section className="bg-surface backdrop-blur-md border border-border rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:bg-surface-hover flex flex-wrap items-center gap-4 my-2.5">
      <label htmlFor="monthFilter" className="font-semibold text-text-light">Month</label>
      <input
        type="month"
        id="monthFilter"
        aria-label="Filter by month"
        className="w-auto min-w-[160px] py-3 px-4 rounded-xl border border-border-solid bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
        value={filters.month}
        onChange={(e) => setFilterMonth(e.target.value)}
      />
      <label htmlFor="typeFilter" className="font-semibold text-text-light">Type</label>
      <select
        id="typeFilter"
        aria-label="Filter by type"
        className="w-auto min-w-[160px] py-3 px-4 rounded-xl border border-border-solid bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
        value={filters.type}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <label htmlFor="categoryFilter" className="font-semibold text-text-light">Category</label>
      <select
        id="categoryFilter"
        aria-label="Filter by category"
        className="w-auto min-w-[160px] py-3 px-4 rounded-xl border border-border-solid bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
        value={filters.category}
        onChange={(e) => setFilterCategory(e.target.value)}
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <label htmlFor="searchFilter" className="sr-only">
        Search
      </label>
      <div className="flex items-stretch w-full sm:w-auto flex-1 min-w-[200px]">
        <input
          type="text"
          id="searchFilter"
          className="flex-1 py-3 px-4 rounded-l-xl border border-border-solid border-r-0 bg-surface-solid text-[0.95rem] text-text-main transition-all duration-300 shadow-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 placeholder-gray-400"
          placeholder="Search description, amount, date, type, category"
          aria-label="Search transactions"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        {filters.search && filters.search.trim() !== '' && (
          <button
            type="button"
            className="px-4 bg-surface-solid border border-border-solid border-l-0 border-r-0 text-primary flex items-center justify-center transition-all duration-300 hover:bg-[#e0e7ff] hover:text-primary-hover"
            aria-label="Clear search and show all transactions"
            onClick={handleClearSearch}
            title="Clear search"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>
          </button>
        )}
        <button
          type="button"
          className="px-4 rounded-r-xl bg-surface-solid border border-border-solid border-l-0 text-primary flex items-center justify-center transition-all duration-300 hover:bg-[#e0e7ff] hover:text-primary-hover"
          aria-label="Search transactions"
          onClick={handleSearchClick}
          title="Search now"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        </button>
      </div>
    </section>
  );
}
