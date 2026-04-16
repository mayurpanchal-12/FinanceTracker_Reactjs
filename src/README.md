# Advanced Finance Tracker — Personal Finance Management App

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-File%20Storage-blue?logo=cloudinary)
![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple?logo=googlechrome)

---

A **production-grade Personal Finance SPA** built with React, Firebase, and Cloudinary. Demonstrates real-world frontend engineering — role-based access, file storage, scheduled transactions, analytics, and interactive charts.

---

## 🔗 Live Demo

[View the live app on Vercel](https://finance-tracker-reactjs-sandy.vercel.app/)

## 🔗 GitHub Repo

[View source code on GitHub](https://github.com/mayurpanchal-12/FinanceTracker_Reactjs.git)

---

## 🚀 Project Overview

Advanced Finance Tracker is a complete personal finance platform where users can:

- Register and login with Email/Password or Google OAuth
- Add, edit, and delete income and expense transactions
- Attach receipts (images or PDFs) directly to transactions
- Schedule future-dated transactions that auto-promote on their due date
- Set and monitor budgets per category with real-time alerts
- Manage a Finance Vault — upload and preview receipts, documents, and images
- Invite viewers to see their data in read-only mode
- Filter and search transactions by month, type, category, and keyword
- Export data as CSV or PDF
- View interactive charts and AI-style smart insights
- Read live finance news via Alpha Vantage API
- Use voice-to-text for faster transaction entry
- Switch between light and Plum & Gold elegant theme
- install as PWA
---

## 🧭 Navigation

### Main (Navbar)
- 📋 Home — transaction tracker + form + filters + summary
- 📊 Charts — line chart + pie charts
- 💡 Insights — smart observations + monthly comparison
- 💰 Budget — category budgets + indicators

### Sidebar
- ➕ Schedule — future-dated transactions (admin only)
- 👥 Viewers — manage viewer access (admin only)
- 📝 Notes — all transactions with notes
- 📰 News — live finance headlines
- 🗄️ Vault — receipts, documents, images
- ℹ️ About — app features and role guide

---

## Application Flow

```
Register / Login (Email or Google)
        ↓
Role assigned — Admin or Viewer
        ↓
Admin → full access — add, edit, delete, upload
Viewer → read only — see admin's data
        ↓
Add Transaction → optional receipt attachment
        ↓
Receipt → uploaded to Cloudinary → URL saved in Firestore
        ↓
Transaction table → 🧾 icon on rows with receipts
        ↓
Click 🧾 → receipt preview modal opens
        ↓
Finance Vault → view all uploaded files
        ↓
Set budget per category → get toast alert at 80% and 100%
        ↓
Schedule future transaction → auto-promotes on due date
        ↓
Filter by Month / Type / Category / Search
        ↓
View Charts → Line + Pie charts
        ↓
View Insights → smart observations + monthly comparison
        ↓
Download → CSV or PDF
        ↓
News route fails → NewsErrorPage shown ✅
Unknown route → 404 Wildcard shown ✅
```

---

## 🛠 Tech Stack

### Core
- React 18 — Hooks, lazy, Suspense, portals
- React Router DOM v6 — createBrowserRouter, loader, errorElement, wildcard
- Context API + useReducer — centralized state, no Redux needed
- TailwindCSS v4 — utility-first + custom CSS variables + @layer
- Vite — fast build tool with import.meta.env for secure key handling

### Backend & Storage
- Firebase Auth — Email/Password + Google OAuth
- Firestore — nested collections, real-time auth state
- Firestore Security Rules — role-based data protection
- Cloudinary — file upload and storage (receipts, documents, images)

### Libraries
- Recharts — line + pie charts for income/expense analysis
- Alpha Vantage API — live finance news via route loader
- Browser Speech API — voice-to-text via useSpeechInput hook
- react-hot-toast — toast notifications
- CSV / PDF export — DownloadDropdown utility
- Outfit (Google Fonts) — primary typeface

---

## ✨ Core Features

### 🔐 Authentication & Roles
- Email/Password and Google OAuth login
- Two roles — Admin (full access) and Viewer (read-only)
- Protected routes — role-checked at route and Firestore level
- Re-authentication required before account deletion
- Viewer access managed and revocable by admin

### 💳 Transaction Management
- Add, edit, delete transactions with running balance column
- Highlight important transactions with star
- Attach receipt image or PDF to any transaction
- View receipt in preview modal directly from transaction table
- Auto-highlight top transactions based on overall balance

### 📅 Scheduled Transactions
- Future-dated entries sit in a separate scheduled table
- Auto-promote to main tracker on their due date
- No manual action required

### 💰 Budget Manager
- Set spending limits per category
- Real-time toast alert at 80% usage
- Error alert when budget exceeded
- Visual indicators per category

### 🗄️ Finance Vault
- Upload receipts, documents, and images via Cloudinary
- Tab filter — All / Receipts / Documents / Images
- Search files by name
- Preview images and PDFs inline
- Admin can upload and delete, viewer can view only
- Receipts from transactions auto-appear in vault

### 📊 Charts & Insights
- Line chart — income vs expense over time
- Pie charts — income and expense breakdown by category
- Smart observation banner — auto-generated financial tips
- Monthly comparison view

### 👥 Viewer System
- Admin can invite viewers by email
- Viewers see admin's transactions, charts, budgets, vault
- Viewer cannot add, edit, delete, or upload anything
- Admin can revoke viewer access anytime
- Firestore rules enforce viewer restrictions at database level

### 📰 Live Finance News
- News route fetches from Alpha Vantage API via React Router loader
- Sentiment labels — Bullish / Bearish / Neutral per article
- Loader failure triggers NewsErrorPage independently of ErrorBoundary

### 🎨 Theme System
- Light mode — Indigo Glass (blue-indigo primary)
- Dark mode — Plum & Gold (lavender-mauve base, amber primary)
- Smooth transition between themes
- Not black — elegant, readable in both modes

---

## 🧠 State Management

- Context API + useReducer — TransactionContext + AuthContext + BudgetContext
- Three reducers — transactions, filters, auth
- Clean dispatch pattern — no Redux needed at this scale
- useMemo — running balance and filtered transactions computed efficiently

---

## ⚙️ Key Engineering Decisions

- React.lazy + Suspense — all pages code-split with PageLoader fallback
- Error Boundary — wraps complex pages, prevents full app crash
- Route-level errorElement — News route handles loader failures independently
- useSpeechInput hook — encapsulates Browser Speech API cleanly
- useFormState hook — all form logic extracted from TransactionForm
- useDebounce hook — search input debounced for performance
- Portals — modals rendered at document.body level
- Firestore Security Rules — data protected at database level, not just UI
- Cloudinary unsigned preset — file upload without backend required
- Role checked at both route level (ProtectedRoute) and context level

---

## 🛡️ Security

- Firebase Auth — industry standard authentication
- Firestore Security Rules — users can only access their own data
- Viewer read-only enforced at Firestore rule level
- Re-authentication before destructive actions (account delete)
- Environment variables — no keys hardcoded in source
- AdminOnly routes protected at both route and UI level

---

## ⚡ Performance

- Code splitting with React.lazy on all pages
- useMemo for running balance and filtered transaction computation
- Debounced search input
- Minimal bundle — Context API over Redux
- Vite fast build

---

## 🛡️ Error Handling

```
User visits /news → newsLoader throws
→ errorElement: <NewsErrorPage /> shown ✅

ChartPage / NotesPage throws JS error
→ ErrorBoundary catches → fallback UI shown ✅

User visits /randompage
→ Wildcard (*) catches → 404 page shown ✅

No transactions with notes
→ Empty state → "No notes yet" shown ✅

Receipt upload fails
→ Transaction saved without receipt + toast error ✅

Vault file load fails
→ Empty state shown, no crash ✅
```

---


---

## ▶️ Getting Started

```bash
git clone https://github.com/mayurpanchal-12/FinanceTracker_Reactjs.git
cd FinanceTracker_Reactjs
npm install
```

Create a `.env` file in root:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_KEY=your_alpha_vantage_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

```bash
npm run dev
```

---

## 👤 Author

Built by Mayur Panchal — React Developer