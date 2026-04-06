import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import './css/Filters.css';

const Ico = ({ d, viewBox = '0 0 24 24', ...p }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" {...p}>{d}</svg>
);
const SearchIco   = () => <Ico className="ico-sm" d={<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>}/>;
const ClearIco    = () => <Ico className="ico-xs" d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>;
const ChevronIco  = () => <Ico className="ico-xs" d={<polyline points="6 9 12 15 18 9"/>}/>;
const CalendarIco = () => <Ico className="ico-sm" d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}/>;
const TypeIco     = () => <Ico className="ico-sm" d={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}/>;
const TagIco      = () => <Ico className="ico-sm" d={<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>}/>;

function FilterLabel({ icon, label, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="filter-label text-text-light/70">
      <span className="text-primary/60">{icon}</span>
      {label}
    </label>
  );
}

function SelectWrap({ children }) {
  return (
    <div className="select-wrap">
      {children}
      <span className="select-wrap__chevron text-text-light/50">
        <ChevronIco />
      </span>
    </div>
  );
}

function ActivePill({ label, onRemove }) {
  return (
    <span className="active-pill bg-primary/10 border border-primary/20">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`}
        className="active-pill__remove-btn hover:bg-primary/20">
        <ClearIco />
      </button>
    </span>
  );
}

export default function Filters() {
  const { filters, setFilterMonth, setFilterType, setFilterCategory, setFilterSearch, categories } = useTransactions();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (filters.search !== searchInput) setSearchInput(filters.search || '');
  }, [filters.search]);

  const applySearch = () => setFilterSearch(searchInput.trim());
  const clearSearch = () => { setSearchInput(''); setFilterSearch(''); };
  const clearAll    = () => { setFilterMonth(''); setFilterType(''); setFilterCategory(''); clearSearch(); };

  const onKeyDown   = (e) => { if (e.key === 'Enter') { e.preventDefault(); applySearch(); } };
  const isSearchOn  = filters.search && filters.search.trim() !== '';
  const activeCount = [filters.month, filters.type, filters.category, filters.search].filter(Boolean).length;

  return (
    <section className="card filters-section" aria-label="Transaction filters">

      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-[18px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" aria-hidden />

      <div className="filters-header">
        <div className="filters-header__left">
          <span className="section-label">Filters</span>
          {activeCount > 0 && (
            <span className="filters-header__count-badge">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll}
            className="filters-header__clear-btn text-text-light/60">
            <ClearIco /> Clear all
          </button>
        )}
      </div>

      <div className="filters-fields">

        <div className="filters-field-col--month">
          <FilterLabel icon={<CalendarIco />} label="Month" htmlFor="monthFilter" />
          <input type="month" id="monthFilter" className="field" aria-label="Filter by month"
            value={filters.month} onChange={(e) => setFilterMonth(e.target.value)} />
        </div>
        
        <div className="filters-field-col--type">
          <FilterLabel icon={<TypeIco />} label="Type" htmlFor="typeFilter" />
          <SelectWrap>
            <select id="typeFilter" className="field pr-9 appearance-none cursor-pointer"
              aria-label="Filter by type"
              value={filters.type} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </SelectWrap>
        </div>

        <div className="filters-field-col--category">
          <FilterLabel icon={<TagIco />} label="Category" htmlFor="categoryFilter" />
          <SelectWrap>
            <select id="categoryFilter" className="field pr-9 appearance-none cursor-pointer"
              aria-label="Filter by category"
              value={filters.category} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </SelectWrap>
        </div>

        <div className="filters-field-col--search">
          <FilterLabel icon={<SearchIco />} label="Search" htmlFor="searchFilter" />
          <div className={`search-box ${
            focused
              ? 'search-box--focused shadow-[0_0_0_3px_rgba(79,99,210,0.13)]'
              : 'search-box--idle hover:border-primary/35'
          }`}>
            <input
              type="text" id="searchFilter" aria-label="Search transactions"
              placeholder="Description, amount, date, category…"
              className="search-box__input placeholder-text-light/40"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {isSearchOn && (
              <button type="button" onClick={clearSearch} aria-label="Clear search"
                className="search-box__clear-btn text-text-light/50">
                <ClearIco />
              </button>
            )}
            <button type="button" onClick={applySearch} aria-label="Search"
              className="search-box__submit-btn">
              <SearchIco />
              <span className="search-box__submit-label">Search</span>
            </button>
          </div>
        </div>

      </div>

      {activeCount > 0 && (
        <div className="filters-pills" aria-live="polite">
          {filters.month    && <ActivePill label={`Month: ${filters.month}`}    onRemove={() => setFilterMonth('')} />}
          {filters.type     && <ActivePill label={`Type: ${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}`} onRemove={() => setFilterType('')} />}
          {filters.category && <ActivePill label={`Category: ${filters.category}`} onRemove={() => setFilterCategory('')} />}
          {filters.search   && <ActivePill label={`"${filters.search}"`} onRemove={clearSearch} />}
        </div>
      )}

    </section>
  );
}