import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import DeleteAccount from "../../../../features/auth/components/DeleteAccount";

function getInitials(email) {
  if (!email) return "?";
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={pillRef} className="relative w-full">
      {/* ── Trigger row ───────────────────────────────── */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2.5 cursor-pointer select-none group"
      >
        {/* avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
          {getInitials(user?.email)}
        </div>

        {/* email + role */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-bold text-text-main truncate">
            {user?.email}
          </p>
          <p
            className={`text-[10px] font-semibold capitalize ${
              role === "admin" ? "text-primary" : "text-blue-500"
            }`}
          >
            {role}
          </p>
        </div>

        {/* chevron */}
        <svg
          className={`w-3.5 h-3.5 text-text-light shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* ── Dropdown ──────────────────────────────────── */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#1a1f32] border border-gray-100 dark:border-white/8 rounded-2xl shadow-xl overflow-hidden animate-slide-down z-50">
          {/* user info header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                {getInitials(user?.email)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-main truncate">
                  {user?.email}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    role === "admin"
                      ? "bg-primary/10 text-primary"
                      : "bg-blue-50 dark:bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {role === "admin" ? "👑 Admin" : "👁 Viewer"}
                </span>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="p-1.5 flex flex-col gap-0.5">
            {/* logout */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-text-light hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-main transition-all duration-150 text-left"
            >
              <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/8 flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>
              </span>
              Logout
            </button>

            {/* delete account — admin only */}
            {role === "admin" && (
              <>
                <div className="h-px bg-gray-100 dark:bg-white/6 mx-2 my-0.5" />
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/8 transition-all duration-150 group/del"
                >
                  <span className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </span>
                  <DeleteAccount />
                </div>
              </>
            )}

            {/* viewer info — cannot delete own account */}
            {role === "viewer" && (
              <>
                <div className="h-px bg-gray-100 dark:bg-white/6 mx-2 my-0.5" />
                <div className="px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-text-light/60 leading-relaxed">
                    Account managed by your admin. Contact them to remove your
                    access.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
