import { NavLink, useRouteError } from 'react-router-dom';


export default function NewsErrorPage() {
  const err = useRouteError();
  const message = (err && (err.statusText || err.message)) || 'Something went wrong while loading news.';

  return (
    <div className="pb-12">

      <section className="mt-2 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-main tracking-tight mb-1">News Unavailable</h2>
          <p className="text-text-light text-sm">Could not fetch global market headlines</p>
          <div className="mt-4 h-px bg-gradient-to-r from-red-300/40 via-transparent to-transparent" />
        </div>

        <div className="card max-w-xl mx-auto p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6 text-2xl">
            📡
          </div>
          <h3 className="text-xl font-bold text-text-main mb-3">Couldn't load news right now</h3>

          <div className="bg-red-50 border border-red-100 text-red-700 text-sm font-medium px-4 py-3 rounded-xl mb-5 text-left">
            {message}
          </div>

          <p className="text-text-light text-sm leading-relaxed mb-7 max-w-sm mx-auto">
            Alpha Vantage's free tier is rate-limited (5 requests/min). If you refreshed a few times,
            wait ~1 minute and try again.
          </p>

          <NavLink to="/news"
            className="btn-primary inline-flex items-center gap-2 text-sm px-7 py-3 rounded-xl no-underline">
            ↺ Retry
          </NavLink>
        </div>
      </section>
    </div>
  );
}
