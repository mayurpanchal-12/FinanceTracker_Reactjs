# Advanced_FinanceTracker — Finance Management React Application
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)

---

A **production-grade Finance Tracker Single Page Application** built using React and Context API. It demonstrates real-world frontend engineering concepts including **state management, route-level error handling, code splitting, scheduled transactions, and interactive analytics.**

---

## 🔗 Live Demo

[View the live app on Vercel](https://finance-tracker-reactjs-sandy.vercel.app/)

## 🔗 Git Repo

[View source code on GitHub](https://github.com/mayurpanchal-12/FinanceTracker_Reactjs.git)

---

## 🚀 Project Overview

Advanced Finance Tracker is a complete personal finance platform where users can:

- Add, edit, and delete income & expense transactions
- Schedule future-dated transactions that auto-promote on their date
- Filter and search transactions by month, type, and category
- Export data as CSV or PDF
- View interactive charts (line + pie) for income/expense analysis
- Read live finance news via Alpha Vantage API
- Use voice-to-text input for faster transaction entry
- React Lazy + Suspense 
-  Error Boundary 

The project focuses on **production-level practices**, not just basic CRUD.


---

## Application Flow

```
Open App → View Transaction Tracker (Home)
        ↓
Add / Edit / Delete Transactions
        ↓
Set future-dated transaction → Scheduled Transactions table
        ↓
On scheduled date → auto-moves to main Tracker ✅
        ↓
Filter by Month / Type / Category / Search
        ↓
View filtered results in table + Summary
        ↓
Download data → CSV or PDF via DownloadDropdown
        ↓
View Charts → Line chart + Income/Expense pie charts
        ↓
View Notes → all transactions with notes listed
        ↓
View News → Finance headlines from Alpha Vantage API
        ↓
News loader fails → NewsErrorPage shown ✅
```

---

## 🧭 Navigation

- 📋 Tracker (Home)
- ➕ Set Transaction
- 📊 Charts
- 📝 Notes
- 📰 News
- ⚠️ News Error
- ❓ 404 Wildcard

---

## 🛠 Tech Stack

### Core

- React 18 (Hooks, lazy, Suspense)
- React Router DOM v6 (createBrowserRouter, loader, errorElement, wildcard route)
- Context API + useReducer (TransactionContext — centralized state, no prop drilling)
- TailwindCSS v4 (utility-first + custom CSS variables + @layer)
- Vite (fast build tool with import.meta.env for API key)
- localStorage (transactions, filters, and balance persisted across refresh)

---

### 📦 Libraries & Tools

- Chart.js — dynamic line + pie charts for income/expense analysis
- Alpha Vantage API — live finance news fetched via route loader
- Browser Speech API — voice-to-text input via `useSpeechInput` hook
- CSV / PDF export utilities — DownloadDropdown for two-format export
- Inter (Google Fonts) — primary typeface across the entire UI

---

## ✨ Core Features

- Transaction Management — add, edit, delete with running balance column
- Filter & Search — month, type, category, and keyword search (combined logic)
- Scheduled Transactions — future-dated entries auto-promote on their date
- Download CSV & PDF — export filtered transaction data in two formats
- Charts & Analytics — line chart + income/expense pie charts via Chart.js
- Summary — live-computed balance and totals via `useMemo`
- Notes — all transactions with notes listed in one view
- News — live finance headlines from Alpha Vantage API
- Voice Input — `useSpeechInput` hook for voice-to-text in the transaction form

---

## 🔥 Additional Highlights

### 📅 Scheduled Transactions
- Future-dated entries sit in a separate table
- Auto-promote to the main tracker on their scheduled date
- No manual action required from the user

---

### 📊 Running Balance
- Each filtered transaction gets a live-computed balance column
- Calculated via `useMemo` — recalculates only when needed

---

### 📰 Live Finance News
- News route uses a React Router `loader` to fetch from Alpha Vantage API
- Loader failure triggers `errorElement: <NewsErrorPage />` — separate from ErrorBoundary
- Clean separation between route-level and render-level error handling

---

### 📱 Fully Responsive Design
- Mobile-first layout using TailwindCSS
- `max-w-[1200px]` centered root with `flex-col gap` structure
- Consistent on all screen sizes (320px → desktop)

---

## 🧠 State Management

- `Context API + useReducer` — two reducers (transactions + filters) in one provider
- Clean dispatch pattern — no Redux needed for this scale
- `localStorage` sync — state persists across page refresh

---

## ⚙️ Key Engineering Decisions

- **React.lazy + Suspense** → all pages code-split with PageLoader fallback — only loads what's needed
- **Error Boundary** → wraps complex pages — prevents full app crash, shows fallback UI
- **Route-level errorElement** → News route handles loader failures independently of ErrorBoundary
- **useSpeechInput hook** → encapsulates Browser Speech API logic cleanly
- **useMemo for balance** → running balance column computed efficiently on filter change

---

## ⚡ Performance Optimizations

- Code splitting with `React.lazy` on all pages
- `useMemo` for running balance and filtered transaction computation
- localStorage persistence — no re-fetch on refresh
- Vite fast build with `import.meta.env` for secure API key handling
- Minimal bundle — Context API used over Redux for lighter footprint

---

## 🛡️ Error Handling Strategy

```text
User navigates to /news
↓
newsLoader() throws
↓
React Router catches loader error
↓
errorElement: <NewsErrorPage /> shown ✅


ChartPage / NotesPage / etc renders
↓
Unexpected JS error thrown
↓
ErrorBoundary catches it
↓
Fallback UI + Try Again shown ✅


User visits /randompage
↓
No matching route found
↓
Wildcard (*) catches it
↓
404 Page shown ✅


User opens /notes
↓
transactionsWithNotes.length === 0
↓
Empty state check fires
↓
"No notes yet" message shown ✅
```

---

## ▶️ Getting Started

```bash
git clone https://github.com/mayurpanchal-12/FinanceTracker_Reactjs.git
cd FinanceTracker_Reactjs
npm install
npm run dev
```

