# Finance Tracker — Finance Dashboard UI

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-Live-black?logo=vercel)

---

> A personal finance dashboard built with React 18, Firebase Auth, Firestore, and TailwindCSS v4. Real authentication, real-time cloud storage, role-based access control, and a clean responsive UI — all with zero backend code.

---

## 🔗 Links

| | |
|---|---|
| **Live Demo** | [finance-tracker-reactjs-sandy.vercel.app](https://finance-tracker-reactjs-sandy.vercel.app/) |
| **Repository** | [github.com/mayurpanchal-12/FinanceTracker_Reactjs](https://github.com/mayurpanchal-12/FinanceTracker_Reactjs) |

---

## 📋 Assignment Requirements — Coverage Map

| Requirement | Implementation |
|---|---|
| Dashboard with summary cards | ✅ Total Balance, Income, Expenses — live-computed via `useMemo` |
| Time-based visualization | ✅ Line chart — running balance trend over months (Chart.js) |
| Categorical visualization | ✅ Doughnut charts — income & expense split by category |
| Transactions list with date, amount, category, type | ✅ Full sortable table with running balance column |
| Filtering + search | ✅ Month, type, category, keyword — all combined simultaneously |
| Role-based UI (Admin / Viewer) | ✅ Real Firebase Auth roles — not just a toggle |
| Insights section | ✅ Top category, savings rate, monthly comparison, smart banner |
| State management | ✅ Context API + `useReducer` — two reducers, one provider each |
| Responsive design | ✅ Mobile-first Tailwind, tested from 320px to 1440px |
| Empty / no-data states | ✅ Every page handles zero-data gracefully |
| Data persistence | ✅ Firestore — data survives across devices and sessions |
| Export | ✅ CSV and PDF export of current filtered view |
| Dark mode | ✅ Theme toggle with `data-theme` CSS variables, persisted to localStorage |
| Animations | ✅ Skeleton loaders, fade-in transitions, button micro-interactions |
| Scheduled transactions | ✅ Future-dated entries auto-promote on their due date |
| Error handling | ✅ ErrorBoundary + route-level `errorElement` + 404 wildcard |

---

## 🚀 Getting Started

```bash
git clone https://github.com/mayurpanchal-12/FinanceTracker_Reactjs.git
cd FinanceTracker_Reactjs
npm install
```

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_KEY=your_alpha_vantage_key   # optional — only needed for News page
```

```bash
npm run dev
```

> Open [http://localhost:5173](http://localhost:5173)

The app works fully without the Alpha Vantage key. The News page will show a handled error page if the key is missing.

---

## 🧭 Navigation

| Route | Page | Access |
|---|---|---|
| `/login` | Login / Register | Public |
| `/` | Tracker (Home) | All roles |
| `/charts` | Charts & Analytics | All roles |
| `/insights` | Insights | All roles |
| `/budget` | Budget Tracker | All roles |
| `/notes` | Transaction Notes | All roles |
| `/news` | Finance News | All roles |
| `/set-transaction` | Add / Schedule Transactions | Admin only |
| `/manage-viewers` | Manage Viewer Accounts | Admin only |
| `/*` | 404 | — |

---

## 🔐 Role-Based Access Control

RBAC is implemented using real Firebase Auth — not a frontend toggle.

**Admin**
- Full access to all pages
- Can add, edit, and delete transactions
- Can schedule future transactions
- Can add and remove viewer accounts
- Can set per-category monthly budgets
- Can delete their account (with re-authentication)

**Viewer**
- Read-only access to the admin's data
- All edit, delete, and add controls are hidden
- Cannot access `/set-transaction` or `/manage-viewers`
- Automatically logged out if the admin removes them

**How it works:** On login, `AuthContext` checks `viewerProfiles/{uid}` in Firestore. If the document exists, the user is a viewer linked to an admin's data. If not, they're treated as an admin. `ProtectedRoute` enforces this at the router level — viewers who try to visit admin-only URLs are redirected to home.

**To test viewer mode:** Log in as admin → go to Manage Viewers → create a viewer account with any email and password → log into that account in another browser or incognito window.

---

## 🧩 Feature Breakdown

### Dashboard (Home)
The main page pulls everything together: a transaction form (admin only), active filter pills, summary cards, and the full transaction table. A viewer banner shows whose data is being viewed when logged in as a viewer.

### Transactions
Full table with Date, Description, Category, Type (income/expense), Amount, and a live running balance column. Filters for month, type, category, and keyword all apply at the same time. Edit and delete are admin-only. Each row can be starred for quick reference.

### Scheduled Transactions
Set any transaction with a future date on the `/set-transaction` page. It sits in a separate table until that date arrives, then automatically moves to the main tracker. The promotion is written back to Firestore on the next load so it only happens once.

### Charts
Three Chart.js charts: a line chart showing income, expense, and running balance trends month by month; and two doughnut charts breaking down income and expenses by category. Charts respond to the same month/type/category filters as the main table.

### Insights
Five data cards computed from live transaction data: highest spending category, this month's savings rate with a color-coded progress bar, most active day of the week, biggest single expense and income, and an all-time summary. A monthly comparison panel shows income vs expenses side by side with percentage change indicators. A smart observation banner gives a contextual message based on the savings rate.

### Budget Tracker
Set monthly spending limits per category. Progress bars show actual vs budgeted spend. The app raises toast warnings when a new expense pushes a category to 80% or past 100% of its budget. Budgets are stored in Firestore and shared with linked viewers (read-only for them).

### Finance News
Live market headlines fetched from Alpha Vantage API via a React Router route loader. Each card shows the article title, source, publish date, authors, sentiment label, and linked tickers. If the loader fails (API rate limit or missing key), a dedicated `<NewsErrorPage />` is shown — completely separate from the main ErrorBoundary.

### Export
The Export button in the navigation bar downloads the currently filtered transaction set as either a CSV file or a formatted PDF report. Both include the running balance per row and a filtered total at the bottom.

---

## 🗄️ Firestore Data Structure

```
users/{uid}/
  transactions/{txId}    — transaction documents
  viewers/{viewerUid}    — viewer records (admin's subcollection)
  meta/filters           — saved filter state
  meta/budgets           — per-category budget limits

viewerProfiles/{viewerUid}
  linkedAdminUid         — which admin this viewer is connected to
  adminEmail             — shown in the viewer banner on the home page
  role, name, email, createdAt
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 — Hooks, `lazy`, `Suspense` |
| Routing | React Router DOM v6 — `createBrowserRouter`, `loader`, `errorElement` |
| Auth + Database | Firebase Auth (Email/Password + Google) + Firestore |
| State | Context API + `useReducer` — no Redux |
| Styling | TailwindCSS v4 + custom CSS variables + `@layer` |
| Charts | Chart.js (dynamic import per chart) |
| Build | Vite + `import.meta.env` for all secrets |
| Voice input | Browser Speech API — `useSpeechInput` hook |
| Export | Custom CSV builder + jsPDF (CDN import) |
| News | Alpha Vantage REST API |

---

## ⚙️ Key Engineering Decisions

**Firebase Auth + Firestore over localStorage** — data persists across devices, works on mobile, and the viewer sharing feature is only possible with a real backend. The trade-off is needing a `.env` file to run locally.

**`withEB` wrapper** — a single helper in `App.jsx` wraps every route in both `ErrorBoundary` and `Suspense`, keeping the router config clean and consistent.

**Secondary Firebase app for viewer creation** — creating a new Firebase Auth user normally signs out the current user. To avoid this, a temporary secondary Firebase app instance is spun up just for the `createUserWithEmailAndPassword` call, then immediately deleted in a `finally` block so it never leaks.

**Running balance sort order** — Firestore returns transactions newest-first. The balance column is computed by sorting chronologically (oldest first), accumulating the balance, then reversing back so the newest transaction appears at the top of the table with the correct final balance.

**`useMemo` everywhere derived** — filtered transactions, running balance, summary totals, chart datasets, budget rows, and insights are all memoized so they only recalculate when their actual inputs change, not on every render.

**Route-level error handling vs ErrorBoundary** — the news route uses a React Router `loader`, so its failures are caught by `errorElement: <NewsErrorPage />`. All other pages are wrapped in a class-based `ErrorBoundary` that catches render-time JS errors and shows a Try Again fallback.

---

## 🛡️ Error Handling

```
/news route      → loader() throws     → errorElement: <NewsErrorPage />   ✅
Any page         → JS error in render  → ErrorBoundary → fallback UI        ✅
/unknown-path    → no route match      → wildcard (*)  → 404 page           ✅
Viewer removed   → focus event fires   → auto sign-out                      ✅
Empty states     → no transactions     → handled on every page              ✅
```

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI pieces
│   ├── TransactionForm.jsx
│   ├── TransactionTable.jsx
│   ├── Filters.jsx
│   ├── Summary.jsx
│   ├── DownloadDropdown.jsx
│   ├── ErrorBoundry.jsx      # class-based, wraps all pages
│   ├── ProtectedRoute.jsx    # redirects based on auth + role
│   ├── ThemeToggle.jsx
│   ├── Skeleton.jsx
│   └── userPill.jsx          # expandable user avatar with logout
├── context/
│   ├── AuthContext.jsx       # Firebase Auth + role resolution
│   ├── TransactionContext.jsx
│   └── BudgetContext.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── SetTransactionPage.jsx
│   ├── ChartPage.jsx
│   ├── InsightsPage.jsx
│   ├── BudgetPage.jsx
│   ├── NotesPage.jsx
│   ├── NewsPage.jsx
│   ├── NewsErrorPage.jsx
│   ├── LoginPage.jsx
│   ├── ManageViewersPage.jsx
│   └── wildcard.jsx
├── hooks/
│   ├── useSpeechInput.js     # Browser Speech API wrapper
│   └── useDebounce.js
├── utils/
│   ├── storage.js            # all Firestore read/write helpers
│   ├── filterUtils.js
│   ├── chartData.js
│   ├── csv.js
│   ├── pdf.js
│   └── newsLoader.js         # React Router loader for /news
└── firebase.js               # Firebase app init (env-var keys only)
```

---

## ✨ Optional Enhancements Implemented

- ✅ **Dark mode** — full `data-theme` CSS variable system, persisted
- ✅ **Export** — CSV and PDF of the current filtered view
- ✅ **Mock API / live API** — Alpha Vantage news with route-level error handling
- ✅ **Animations** — skeleton loaders, fade-in pages, micro-interactions
- ✅ **Voice input** — `useSpeechInput` hook using the Browser Speech API
- ✅ **Advanced filtering** — four combined filters with active pill indicators
- ✅ **Scheduled transactions** — auto-promote with Firestore write-back

---

## 🙋 Notes for Evaluators

- **To test Admin vs Viewer RBAC:** Register an account (Admin) → go to Manage Viewers in the sidebar → add a viewer with any email/password → open an incognito window and log in as that viewer. You'll see read-only mode with the admin's data.
- **To test scheduled transactions:** Add a transaction with tomorrow's date on the Set Transaction page. Come back the next day (or temporarily change your system date) — it will have moved to the main tracker.
- **To test the news error page:** Remove `VITE_API_KEY` from your `.env` and visit `/news` — the error page appears cleanly.
- **To test export:** Filter transactions by month, then click Export → CSV or PDF.
- **Firestore security rules** should be set to require `request.auth.uid == userId` for production use. The live demo has rules configured for evaluation access.
