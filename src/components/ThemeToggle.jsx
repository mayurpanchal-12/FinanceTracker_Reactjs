import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setDark(true);
    }
  }, []);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="relative flex items-center w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #4f63d2, #6c82e8)'
          : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
        boxShadow: dark
          ? '0 2px 8px rgba(79,99,210,0.35), inset 0 1px 2px rgba(0,0,0,0.15)'
          : '0 1px 4px rgba(0,0,0,0.12), inset 0 1px 2px rgba(0,0,0,0.06)',
      }}
    >
      <span className="absolute left-1 text-[9px] select-none" style={{ opacity: dark ? 1 : 0, transition: 'opacity 0.2s' }}>🌙</span>
      <span className="absolute right-1 text-[9px] select-none" style={{ opacity: dark ? 0 : 1, transition: 'opacity 0.2s' }}>☀️</span>

      <span
        className="absolute w-4.5 h-[18px] rounded-full bg-white shadow-md"
        style={{
          width: '18px',
          height: '18px',
          top: '3px',
          left: dark ? 'calc(100% - 21px)' : '3px',
          transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}