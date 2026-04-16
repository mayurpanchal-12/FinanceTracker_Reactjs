import NavBar from './navbar';

export default function Header({ onOpenSidebar }) {
  return (
    <header className="py-8 px-2 mb-1 animate-[fadeInDown_0.6s_ease-out] relative">

      <div className="flex flex-col items-center gap-1 mb-8 mt-2 sm:mt-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl font-bold text-primary opacity-60 select-none">₹</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-main">
            Finance{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tracker
            </span>
          </h1>
        </div>
        <p className="text-text-light text-sm font-medium tracking-wide">
          Income · Expenses · Balance — beautifully organised
        </p>
      </div>

      
      <div className="flex items-center justify-center gap-2 relative z-10">
      
        <button
          onClick={onOpenSidebar}
          className="flex items-center justify-center p-2 sm:p-2.5 rounded-xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-md hover:bg-white/90 dark:bg-gray-800/60 dark:border-gray-700/80 dark:hover:bg-gray-700/80 text-primary transition-all duration-200 shrink-0 self-stretch"
          title="Open Tools Sidebar"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <NavBar />

      </div>
      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </header>
  );
}