# Advanced_FinanceTracker — Finance Management React Application
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa)
![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)

---
A production-grade Finance Tracker built with **React and Context API**, applying 
real-world engineering practices: scalable state management, **route-level error handling, lazy loading with code splitting, and Progressive Web App (PWA) support for offline use.**

The app integrates **Firebase Authentication**, Firestore for persistent storage, 
and **Cloudinary for receipt uploads.** Core features include scheduled transactions 
that auto-activate on their due date, per-category budget tracking with threshold 
alerts, interactive charts and smart financial insights, and a Finance Vault for 
document management.

**Access is role-based — admins have full read/write control while viewers get read-only access scoped to a specific admin's data.**

---

## 🔗 Live Demo

[View the live app on Vercel](https://finance-tracker-reactjs-sandy.vercel.app/)

## 🔗 Git Repo

[View source code on GitHub](https://github.com/mayurpanchal-12/FinanceTracker_Reactjs.git)

---

## 🚀 Project Overview

Advanced Finance Tracker is a complete personal finance platform where users can:

- Add, edit, and delete income & expense transactions
- description , attachments , notes , highlight , category , type supports while adding transaction 
- Schedule future-dated transactions that auto-promote on their date
- Filter and search transactions by month, type, and category
- RBAC - admin can manage viewers and viewer can only read entries of admin
- Users can set custom budgets and receive real-time warnings when their expenses exceed the defined budget limits.
- Delivers advanced financial insights such as income analysis, month-over-month comparisons, peak activity dates, savings rate, highest income sources, key observations, and total income tracking.
- Enables seamless data export for backup and further analysis.
- Export data as CSV or PDF
- View interactive charts (line + pie) for income/expense analysis
- Includes Progressive Web App (PWA) functionality, allowing users to install and use the application like a native app.
- Read live finance news via Alpha Vantage API
- Theme Toggler
- Includes a secure vault for uploading and managing receipts and related documents.
- Use voice-to-text input for faster transaction entry
- React Lazy + Suspense 
-  Error Boundary 

The project focuses on **production-level practices**, not just basic CRUD.


---
## Application Flow

```
Open App → Firebase checks auth state
        ↓
Not logged in → LoginPage (Google OAuth or Email/Password)
        ↓
Role check → admin or viewer (from Firestore viewerProfiles)
        ↓
Viewer mode → read-only, sees admin's data ✅
        ↓
View Transaction Tracker (Home)
        ↓
Add / Edit / Delete Transactions  [admin only]
        ↓
Voice input via mic → speech-to-text fills form fields
        ↓
Star / highlight important transactions → auto-highlights top 2 on 10+ rows
        ↓
Set future-dated transaction → Scheduled Transactions table  [admin only]
        ↓
On scheduled date → auto-moves to main Tracker ✅
        ↓
Filter by Month / Type / Category / Search
        ↓
View filtered results in table + Summary
        ↓
Export filtered data → CSV or PDF via DownloadDropdown
        ↓
View Charts → Line chart + Income/Expense pie charts
        ↓
View Insights → Monthly comparison + Smart observations banner
        ↓
View Budget → Set limits per category → over/near 80% alerts  [admin only]
        ↓
View Notes → all transactions with notes listed
        ↓
View Vault → upload receipts / documents / images (Cloudinary)
        ↓
View News → Finance headlines from Alpha Vantage API
        ↓
News loader fails → NewsErrorPage shown ✅
        ↓
Manage Viewers → add/remove viewer accounts  [admin only]
        ↓
Install as PWA → works offline via service worker
        ↓
Delete Account → permanently removes account + all data  [admin only]
        ↓
View About → feature overview page
        ↓
Unknown route → Wildcard 404 page shown ✅
```
--- 


## 🧭 Navigation
 
-  ☰ Sidebar 
- 📋 Tracker (Home)
- 📊 Charts
- 📥 Insights 
- 💰 Budget
- 📥 Export
- 📥 Install (PWA)
- 🛡️ Error Boundary Handling
- ⏳ Skeleton Loading UI
- ⚠️ News Error
- ❓ 404 Wildcard

    ## Sidebar Modules
 - ⏰ Scheduled Transactions
 - 👥 Viewer Management
- 📝 Notes
- 📰 Financial News
- 🔐 Vault (Receipts & Documents)
- ℹ️ About
-  🌗 Theme Toggle 
- 👤 Account Management

---

## 🛠 Tech Stack

### Core

- React 18 (Hooks, Lazy Loading, Suspense )
- React Router DOM v6 (createBrowserRouter, loaders, errorElement, wildcard routes)
- Context API + useReducer (centralized state management, no prop drilling)
- Tailwind CSS v4 (utility-first styling with custom CSS variables and @layer)
- Vite (fast build tool with import.meta.env for environment variables)
- Firebase (authentication and database storage)
- Cloudinary (image and file storage)
- Vercel (deployment and hosting)
- GitHub (version control and code repository)
---

### 📦 Libraries & Tools

- Chart.js — dynamic line + pie charts for income/expense analysis
- Alpha Vantage API — live finance news fetched via route loader
- Browser Speech API — voice-to-text input via `useSpeechInput` hook
- CSV / PDF export utilities — DownloadDropdown for two-format export
- Inter (Google Fonts) — primary typeface across the entire UI

---

## ✨ Core Features

- Transaction Management — add, edit, and delete entries with a real-time running balance
- Advanced Filter & Search — filter by month, type, and category with combined keyword search
- Scheduled Transactions — future-dated entries automatically executed on their due date
- Progressive Web App (PWA) — installable with offline-ready capabilities
- Income Insights — detailed analysis with trends, comparisons, and key observations
- Budget Management — set budgets with real-time expense tracking and overspending alerts
- Secure Vault — store and manage receipts, images, and documents via Cloudinary
- Authentication & Role-Based Access — admin and viewer roles with restricted data visibility (powered by Firebase)
- Theme Toggle —  enhanced user experience
- Data Export — download filtered transactions as CSV or PDF
- Charts & Analytics — line and pie charts for income and expenses using Chart.js
- Live Summary — real-time balance and totals computed efficiently using useMemo
- Notes Module — centralized view for all transaction notes
- Financial News — live headlines integrated via Alpha Vantage API
- Voice Input — speech-to-text transaction entry using a custom useSpeechInput hook
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
### 📊 Insights & Analytics
- Provides detailed income analysis including trends, month-over-month comparisons, savings rate, and key observations
- Highlights most active dates, highest income entries, and total income tracking
- Enables data-driven financial decisions through clear visual summaries
---
### 💰 Budget Management
- Users can set custom budgets for better financial planning
- Real-time expense tracking against defined budgets
- Automatic alerts and warnings when spending exceeds budget limits
---
### 🔐Authentication & Access Control
- Secure user authentication powered by Firebase
- Role-based access with Admin and Viewer modes
- Viewers have restricted, read-only access to admin-specific financial data
---


### 📰 Live Finance News
- News route uses a React Router `loader` to fetch from Alpha Vantage API
- Loader failure triggers `errorElement: <NewsErrorPage />` — separate from ErrorBoundary
- Clean separation between route-level and render-level error handling

---

### 📱 Fully Responsive Design
- consistency on all major screens 
---

### 🌗 Theme Management
- Supports light and dark mode for improved user experience
- Seamless theme switching with persistent user preference
Enhances accessibility and visual comfort across devices
---

## 🧠 State Management

- `Context API + useReducer` — two reducers (transactions + filters) in one provider
- Clean dispatch pattern — no Redux needed for this scale
- Firebase + Cloudinary - authentication , data storage and file , image stoarge 

---

## ⚙️ Key Engineering Decisions

- **React.lazy + Suspense** → all routes are code-split with a PageLoader fallback, ensuring optimal performance by loading components on demand
- **Skeleton Loading UI**  → improves perceived performance by showing placeholder layouts while data/components are loading
- **Error Boundary** → wraps critical UI sections to prevent full app crashes and display graceful fallback UIs
- **Route-level errorElement** → isolates data-fetching failures (e.g., News route via Alpha Vantage) independently from render-level errors
- **Custom Hooks Architecture** → reusable hooks like useSpeechInput encapsulate browser APIs (Speech-to-Text) for clean separation of logic
- **Optimized State Computation** → useMemo ensures efficient recalculation of running balance and summaries on filter updates
- **Context + useReducer Pattern** → centralized transaction and app state management without prop drilling
- **Role-Based Rendering** → conditional UI rendering based on authentication roles (Admin / Viewer via Firebase)
- **Budget & Insights Integration** → memoized calculations power real-time budget tracking, alerts, and financial analytics
- **PWA Optimization** → lazy-loaded assets and caching strategies enable installable, offline-capable experience
- **Cloud Storage Integration** → media handling abstracted via Cloudinary for scalable receipt storage
---

## ⚡ Performance Optimizations

- Code Splitting with React.lazy + Suspense → all pages are loaded on demand with a fallback loader, reducing initial bundle size
- Skeleton Loading UI → displays structured placeholders during data/component loading to improve perceived performance
- Optimized Computation with useMemo → efficiently calculates running balance and filtered transactions only when dependencies change
- Cloud-Based Persistence → real-time data storage and synchronization using Firebase (no data loss on refresh or across devices)
- Media Storage Integration → scalable image and file handling via Cloudinary for receipts and documents
- Vite Build Optimization → ultra-fast development and builds with secure environment handling via import.meta.env
---

## Error Handling Strategy

```
Navigate to /news
        ↓
newsLoader() runs → fetches Alpha Vantage API
        ↓
newsLoader() throws → HTTP error / rate limit / network fail
        ↓
React Router catches loader error
        ↓
errorElement: <NewsErrorPage /> shown ✅


ChartPage / NotesPage / etc renders
        ↓
Unexpected JS error thrown inside component
        ↓
ErrorBoundary catches it → getDerivedStateFromError fires
        ↓
Fallback UI + Try Again button shown ✅


User visits /randompage
        ↓
No matching route found in router
        ↓
Wildcard path: '*' catches it
        ↓
404 Page shown ✅


User opens /notes
        ↓
Transactions filtered for non-empty note field
        ↓
notes.length === 0 check fires
        ↓
"No notes yet. Add one from the Tracker form." shown ✅
```
## ▶️ Getting Started

```bash
git clone https://github.com/mayurpanchal-12/FinanceTracker_Reactjs.git
cd FinanceTracker_Reactjs
npm install
npm run dev
```

