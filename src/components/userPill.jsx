import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DeleteAccount from './DeleteAccount';

function getInitials(email) {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
}

export default function UserPill() {
  const { user, logout, role } = useAuth();
  const [open, setOpen] = useState(false);
  const pillRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={pillRef}
      onClick={() => setOpen((p) => !p)}
      className="flex items-center rounded-full bg-white/70 border border-white/80 shadow-md backdrop-blur-md cursor-pointer select-none"
      style={{
        maxWidth: open ? '360px' : '36px',
        width: open ? '360px' : '36px',
        padding: open ? '4px 10px 4px 4px' : '0',
        transition: 'max-width 0.3s ease, width 0.3s ease, padding 0.3s ease',
        overflow: 'hidden',
      }}
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
        {getInitials(user?.email)}
      </div>

      <div
        className="flex items-center gap-2"
        style={{
          opacity: open ? 1 : 0,
          transition: 'opacity 0.2s ease',
          marginLeft: open ? '8px' : '0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
          role === 'admin'
            ? 'bg-primary/10 text-primary'
            : 'bg-blue-50 text-blue-500'
        }`}>
          {role}
        </span>

        <span className="text-xs font-semibold text-text-main max-w-[110px] truncate">
          {user?.email}
        </span>

        <div className="w-px h-4 bg-gray-200 shrink-0" />

        <button
          onClick={(e) => { e.stopPropagation(); logout(); }}
          className="flex items-center gap-1 text-xs font-semibold text-text-light hover:text-primary transition-colors duration-150 shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>

        {role === 'admin' && (
          <>
            <div className="w-px h-4 bg-gray-200 shrink-0" />
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteAccount />
            </div>
          </>
        )}
      </div>
    </div>
  );
}