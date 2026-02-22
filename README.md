# 💰 Finance Tracker Web App
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)

A full-featured **Finance Tracker** web application that helps users manage income, expenses, future transactions, analytics, and financial news — all in one place.

The app supports **voice-to-text input**, **search functionality** , **advanced filtering**, **interactive charts**, and **CSV/PDF exports** with real-time balance updates.

---

## 🔗 Live Demo

[View the live app on Vercel](https://react-todo-sage-phi.vercel.app/)

---

## 🚀 Features

### 🔹 Transaction Management
- Add **Income / Expense** transactions
- Fields:
  - Amount
  - Description (**Voice-to-text supported 🎤**)
  - Date
  - Type (Income / Expense)
  - Category:
    - Salary
    - Food
    - Transport
    - Shopping
    - Bills
    - Other
  - Highlight important transactions
  - Optional Notes
- Edit / delete transactions
- Highlight or un-highlight any transaction

---

### 🔹 Filters & Search
- Month filter
- Type filter
- Category filter
- Search by description, date , amount, type and category
- All filters work together
- Filters affect:
  - Transaction table
  - Status summary
  - Charts
  - CSV & PDF downloads

---

### 🔹 Status Summary
Displays:
- Total Income
- Total Expense
- Current Balance

> Calculated dynamically based on active filters

---

### 🔹 Transaction Table
Columns:
- Date
- Amount
- Description
- Type
- Category
- Actions:
  - Edit
  - Delete
  - Highlight / Remove Highlight
- note icon if note added

---

### 🔹 Scheduled Transactions
- Set transactions for future dates
- Same input fields as normal transactions
- Automatically appear on selected date

---

### 🔹 Charts & Analytics
- **Overall Balance Analysis**
  - Always shows complete data
- **Income Distribution (Pie Chart)**
- **Expense Distribution (Pie Chart)**
  - Both affected by filters

---

### 🔹 Export Transactions
- Download visible transactions as:
  - CSV
  - PDF
- Exports respect active filters

---

### 🔹 Notes Section
- View all notes added during transactions
- Helps track important remarks

---

### 🔹 Finance News
- Latest finance & stock-related news
- Displays:
  - Stock name
  - Market signal (Bullish / Bearish)
  - Article title
  - Author
  - Published date
- Option to read full article

---

## 🧭 Navigation
- 🏠 Tracker (Home)
- 📅 Set Transactions
- 📊 View Charts
- 📥 Downloads
- 📝 Notes
- 📰 News

---

## 🛠 Tech Stack
- React
- Context API
- Tailwind CSS
- JavaScript (ES6+)
- Browser Speech API
- Chart library
- CSV / PDF export utilities
- Finance News API

---

## 📦 Installation

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
npm install
npm run dev