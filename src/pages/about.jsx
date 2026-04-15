export default function About() {
  const features = [
    {
      icon: '📊',
      title: 'Transaction Tracker',
      desc: 'Add, edit and delete income and expense transactions. Filter by month, type, category or search by description.',
    },
    {
      icon: '⭐',
      title: 'Highlight Transactions',
      desc: 'Star important transactions to make them stand out. Top transactions are auto-highlighted based on your balance.',
    },
    {
      icon: '📅',
      title: 'Scheduled Transactions',
      desc: 'Schedule future transactions in advance. They automatically become active on their due date.',
    },
    {
      icon: '📈',
      title: 'Charts & Insights',
      desc: 'Visualise your income vs expenses with charts. Get smart observations and monthly comparisons.',
    },
    {
      icon: '💰',
      title: 'Budget Manager',
      desc: 'Set spending limits per category. Get notified when you hit 80% or exceed your budget.',
    },
    {
      icon: '🗄️',
      title: 'Finance Vault',
      desc: 'Upload and store receipts, documents and images. Attach receipts directly to transactions for easy reference.',
    },
    {
      icon: '🧾',
      title: 'Receipt Attachments',
      desc: 'Attach receipt images or PDFs while adding a transaction. View them anytime directly from the transaction table.',
    },
    {
      icon: '✎',
      title: 'Transaction Notes',
      desc: 'Add short notes or reminders to any transaction. View all notes in one place from the Notes page.',
    },
    {
      icon: '👁',
      title: 'Viewer Access',
      desc: 'Invite viewers to see your financial data in read-only mode. Manage and revoke access anytime.',
    },
    {
      icon: '📰',
      title: 'Finance News',
      desc: 'Stay updated with latest global finance and market news powered by Alpha Vantage.',
    },
    {
      icon: '🌙',
      title: 'Dark Mode',
      desc: 'Switch between light and dark theme anytime from the sidebar.',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      desc: 'Your data is protected with Firebase Auth and Firestore security rules. Only you can access your data.',
    },
  ];

  const stack = [
    { label: 'Frontend', value: 'React + Vite' },
    { label: 'Styling', value: 'Tailwind CSS' },
    { label: 'Auth', value: 'Firebase Auth' },
    { label: 'Database', value: 'Firestore' },
    { label: 'File Storage', value: 'Cloudinary' },
    { label: 'Charts', value: 'Recharts' },
    { label: 'News API', value: 'Alpha Vantage' },
    { label: 'Routing', value: 'React Router v6' },
  ];

  return (
    <div className="flex flex-col gap-4 animate-fade-in">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="card px-6 py-8 text-center animate-fade-in-down">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 mx-auto mb-4">
          <span className="text-white text-2xl font-bold">₹</span>
        </div>
        <h1 className="text-2xl font-extrabold text-text-main tracking-tight">
          Finance <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tracker</span>
        </h1>
        <p className="text-sm text-text-light mt-2 max-w-md mx-auto leading-relaxed">
          A personal finance management app to track income, expenses, budgets and documents — all in one place.
        </p>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="card px-6 py-5">
        <h2 className="text-sm font-extrabold text-text-main mb-1">Features</h2>
        <p className="text-xs text-text-light mb-4">Everything this app can do</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/6 hover:border-primary/30 hover:bg-primary/3 transition-all duration-200"
            >
              <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <p className="text-xs font-bold text-text-main">{f.title}</p>
                <p className="text-[11px] text-text-light mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────── */}
      <section className="card px-6 py-5">
        <h2 className="text-sm font-extrabold text-text-main mb-1">Tech Stack</h2>
        <p className="text-xs text-text-light mb-4">Built with modern tools</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stack.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/6 text-center"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-light/60">{s.label}</p>
              <p className="text-xs font-bold text-primary">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role Guide ───────────────────────────────────── */}
      <section className="card px-6 py-5">
        <h2 className="text-sm font-extrabold text-text-main mb-1">User Roles</h2>
        <p className="text-xs text-text-light mb-4">What each role can do</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* admin */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">👑</span>
              <p className="text-sm font-extrabold text-primary">Admin</p>
            </div>
            {[
              'Add, edit, delete transactions',
              'Schedule future transactions',
              'Set and manage budgets',
              'Upload files to vault',
              'Attach receipts to transactions',
              'Invite and remove viewers',
              'Full access to all pages',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 mb-1.5">
                <span className="text-green-500 text-xs mt-0.5">✓</span>
                <p className="text-[11px] text-text-light">{item}</p>
              </div>
            ))}
          </div>

          {/* viewer */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">👁</span>
              <p className="text-sm font-extrabold text-text-main">Viewer</p>
            </div>
            {[
              'View admin\'s transactions',
              'View charts and insights',
              'View budget progress',
              'View vault files',
              'View finance news',
              'Cannot add or edit anything',
              'Access revoked anytime by admin',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 mb-1.5">
                <span className="text-blue-400 text-xs mt-0.5">→</span>
                <p className="text-[11px] text-text-light">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <section className="card px-6 py-4 text-center">
        <p className="text-xs text-text-light">
          Built with ❤️ using React + Firebase + Cloudinary
        </p>
        <p className="text-[10px] text-text-light/50 mt-1">
          Income · Expenses · Balance — beautifully organised
        </p>
      </section>

    </div>
  );
}