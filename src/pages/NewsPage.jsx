import { useLoaderData, useNavigation } from 'react-router-dom';
import Header from '../components/Header';

export default function NewsPage() {
  const news = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const formatAVTime = (s) => {
    // Alpha Vantage format: YYYYMMDDTHHMMSS (e.g., 20240218T013000)
    if (!s || typeof s !== 'string') return '';
    const m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/);
    if (!m) return '';
    const [, y, mo, d, h, mi, se] = m;
    const dt = new Date(`${y}-${mo}-${d}T${h}:${mi}:${se}Z`);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getSentimentStyle = (sentiment) => {
    const s = sentiment?.toLowerCase() || '';
    if (s.includes('bullish')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s.includes('bearish')) return 'bg-rose-100 text-rose-800 border-rose-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center mb-16 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-4 tracking-tight drop-shadow-sm">
             Finance News
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Global market headlines powered by Alpha Vantage
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6 drop-shadow-md"></div>
            <p className="text-indigo-600/80 font-bold text-lg animate-pulse">Broadcasting latest news...</p>
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <article 
                key={article.url || index} 
                className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-slate-100 flex flex-col group hover:-translate-y-1"
              >
                <div className="px-6 pt-6 pb-4 flex flex-wrap justify-between items-center border-b border-slate-50 gap-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-full ring-1 ring-slate-200">
                    <span>📌</span>
                    <span className="truncate max-w-[120px]">
                      {article.source || 'Finance News'}
                    </span>
                  </div>
                  <div>
                    {article.overall_sentiment_label && (
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getSentimentStyle(article.overall_sentiment_label)} shadow-sm`}>
                        {article.overall_sentiment_label}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="px-6 pt-5 pb-3 text-xl font-bold leading-tight text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {article.title}
                  </a>
                </h3>
                
                {article.summary && (
                  <p className="px-6 text-slate-500 text-sm flex-grow line-clamp-3 mb-5 leading-relaxed">
                    {article.summary}
                  </p>
                )}
                
                <div className="px-6 pb-6 mt-auto">
                  <div className="flex flex-wrap items-center text-xs text-slate-500 mb-4 gap-2">
                    {article.time_published && (
                      <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        📅 {formatAVTime(article.time_published) || article.time_published}
                      </span>
                    )}
                    {article.authors && article.authors.length > 0 && (
                      <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 truncate max-w-[150px]">
                        ✍️ {article.authors.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                  {article.ticker_sentiment && article.ticker_sentiment.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-5">
                      {article.ticker_sentiment.slice(0, 3).map((ticker, idx) => (
                        <span key={idx} className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded w-fit border border-indigo-100">
                          {ticker.ticker}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-slate-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold py-4 transition-all duration-300 text-sm tracking-wide uppercase"
                >
                  Read Full Article →
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-xl font-bold text-slate-800 mb-2">No news available</p>
            <p className="text-slate-500">Please check back later for the latest market updates.</p>
          </div>
        )}
      </section>
    </div>
  );
}
