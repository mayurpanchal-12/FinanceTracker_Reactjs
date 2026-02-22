import { NavLink } from 'react-router-dom';
import DownloadDropdown from './DownloadDropdown';

export default function Header() {
  return (
    <header className="text-center py-8 px-5 mb-2.5 animate-[fadeInDown_0.6s_ease-out]">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 tracking-tight">₹ Finance Tracker</h1>
      <p className="text-text-light text-lg font-medium">Track your income, expenses & balance effortlessly</p>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <nav className="flex flex-wrap justify-center gap-3 bg-[rgba(255,255,255,0.5)] p-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `inline-block py-2.5 px-6 rounded-full no-underline font-semibold text-[0.95rem] transition-all duration-300 hover:bg-[rgba(255,255,255,0.8)] hover:text-primary ${isActive ? 'bg-surface-solid text-primary shadow-sm' : 'text-text-light'}`}
            end
          >
            📋 Tracker
          </NavLink>
          <NavLink
            to="/set-transaction"
            className={({ isActive }) => `inline-block py-2.5 px-6 rounded-full no-underline font-semibold text-[0.95rem] transition-all duration-300 hover:bg-[rgba(255,255,255,0.8)] hover:text-primary ${isActive ? 'bg-surface-solid text-primary shadow-sm' : 'text-text-light'}`}
          >
            ➕ Set Transaction
          </NavLink>
          <NavLink
            to="/charts"
            className={({ isActive }) => `inline-block py-2.5 px-6 rounded-full no-underline font-semibold text-[0.95rem] transition-all duration-300 hover:bg-[rgba(255,255,255,0.8)] hover:text-primary ${isActive ? 'bg-surface-solid text-primary shadow-sm' : 'text-text-light'}`}
          >
            📊 View Charts
          </NavLink>
        </nav>
        <div className="flex items-center">
          <DownloadDropdown />
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `inline-block py-3 px-6 rounded-full border border-primary/20 bg-surface-solid text-primary font-semibold no-underline transition-all duration-300 shadow-sm hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(99,102,241,0.2)] ml-2 ${isActive ? '!bg-primary !text-white' : ''}`
            }
          >
            📝 Notes
          </NavLink>
           <NavLink
            to="/news"
            className={({ isActive }) =>
              `inline-block py-3 px-6 rounded-full border border-primary/20 bg-surface-solid text-primary font-semibold no-underline transition-all duration-300 shadow-sm hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(99,102,241,0.2)] ml-2 ${isActive ? '!bg-primary !text-white' : ''}`
            }
          >
              📰 News
          </NavLink>
        </div>
      </div>
    </header>
  );
}
