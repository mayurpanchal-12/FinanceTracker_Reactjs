import { NavLink, useRouteError } from 'react-router-dom';
import Header from '../components/Header';

export default function NewsErrorPage() {
  const err = useRouteError();
  const message =
    (err && (err.statusText || err.message)) ||
    'Something went wrong while loading news. Please try again.';

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center mb-10 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 mb-4 tracking-tight drop-shadow-sm">
            ⚠️ News Unavailable
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Could not fetch global market headlines
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100 p-8 md:p-12 text-center animate-[fadeIn_0.6s_ease-out]">
          <div className="text-6xl mb-6">📡</div>
          <p className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Couldn't load news right now.</p>
          <div className="bg-rose-50 text-rose-800 px-4 py-3 rounded-xl mb-6 border border-rose-100 font-medium inline-block w-full">
            {message}
          </div>
          <p className="text-slate-500 mb-8 leading-relaxed max-w-lg mx-auto">
            Alpha Vantage free tier is rate-limited (e.g. 5 requests/min). If you refreshed a few
            times, wait ~1 minute and try again.
          </p>
          <NavLink 
            to="/news" 
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-xl hover:from-rose-600 hover:to-red-700 shadow-lg shadow-rose-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200"
          >
            <span className="mr-2">🔄</span> Retry
          </NavLink>
        </div>
      </section>
    </div>
  );
}

