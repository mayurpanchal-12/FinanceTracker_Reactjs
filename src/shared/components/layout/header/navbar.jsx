import { NavLink } from "react-router-dom";
import DownloadDropdown from "../../../../features/DownloadDropdown/components/DownloadDropdown";
import PWA from "../../../../features/pwa/components/pwa";

const MAIN_LINKS = [
  { to: "/", label: "Tracker", icon: "◈", end: true },
  { to: "/charts", label: "Charts", icon: "◎" },
  { to: "/insights", label: "Insights", icon: "◑" },
  { to: "/budget", label: "Budget", icon: "◭" },
];

export default function NavBar() {
  console.log("navbar render");

  return (
    <nav
      className="flex flex-wrap justify-center gap-1 p-1.5 rounded-2xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-md"
      aria-label="Main navigation"
    >
      {MAIN_LINKS.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-1.5 py-2 px-4 rounded-xl text-sm font-semibold no-underline transition-all duration-200 select-none ${
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-text-light hover:bg-primary/8 hover:text-primary"
            }`
          }
        >
          <span className="text-xs opacity-75">{icon}</span>
          {label}
        </NavLink>
      ))}
      <div className="hidden sm:block border-l border-gray-300 ml-1 mr-1 my-auto h-6 opacity-30" />
      <DownloadDropdown />
      <PWA />
    </nav>
  );
}
