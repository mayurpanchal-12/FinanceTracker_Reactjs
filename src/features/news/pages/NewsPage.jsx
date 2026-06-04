import { useLoaderData, useNavigation } from "react-router-dom";
import { useTransactions } from "../../../context/TransactionContext";
import { SkeletonCard } from "../../../shared/components/ui/Skeleton";
import "../css/NewsPage.css";

const formatAVTime = (s) => {
  if (!s || typeof s !== "string") return "";
  const m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/);
  if (!m) return "";
  const [, y, mo, d, h, mi] = m;
  const dt = new Date(`${y}-${mo}-${d}T${h}:${mi}:00Z`);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const sentimentVariant = (s = "") => {
  const sl = s.toLowerCase();
  if (sl.includes("bullish")) return "bullish";
  if (sl.includes("bearish")) return "bearish";
  return "neutral";
};

export default function NewsPage() {
  // always call all hooks first before any conditional returns
  const { loading } = useTransactions();
  const news = useLoaderData();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  if (loading)
    return (
      <div className="p-4 flex flex-col gap-4">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
      </div>
    );

  return (
    <div className="news-page">
      <section className="news-section">
        <div className="news-header animate-fade-in">
          <h2 className="news-header__title">Finance News</h2>
          <p className="news-header__subtitle">
            Global market headlines powered by Alpha Vantage
          </p>
          <div className="news-header__divider" />
        </div>

        {isLoading ? (
          <div className="news-loading">
            <div className="news-loading__spinner-wrap">
              <div className="news-loading__spinner-track" />
              <div className="news-loading__spinner-head" />
            </div>
            <p className="news-loading__text">Fetching latest headlines…</p>
          </div>
        ) : news && news.length > 0 ? (
          <div className="news-grid">
            {news.map((article, index) => {
              const variant = sentimentVariant(article.overall_sentiment_label);
              return (
                <article
                  key={article.url || index}
                  className="card news-card group"
                >
                  <div className="news-card__top-bar">
                    <span className="news-card__source">
                      {article.source || "Finance News"}
                    </span>
                    {article.overall_sentiment_label && (
                      <span
                        className={`news-card__sentiment sentiment--${variant}`}
                      >
                        <span
                          className={`news-card__sentiment-dot sentiment-dot--${variant}`}
                        />
                        {article.overall_sentiment_label}
                      </span>
                    )}
                  </div>

                  <h3 className="news-card__title">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-card__title-link"
                    >
                      {article.title}
                    </a>
                  </h3>

                  {article.summary && (
                    <p className="news-card__summary">{article.summary}</p>
                  )}

                  <div className="news-card__meta">
                    {article.time_published && (
                      <span className="news-card__meta-tag">
                        {formatAVTime(article.time_published) ||
                          article.time_published}
                      </span>
                    )}
                    {article.authors?.length > 0 && (
                      <span className="news-card__meta-author">
                        {article.authors.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>

                  {article.ticker_sentiment?.length > 0 && (
                    <div className="news-card__tickers">
                      {article.ticker_sentiment.slice(0, 4).map((t, i) => (
                        <span
                          key={i}
                          className="news-card__ticker bg-primary/8"
                        >
                          {t.ticker}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-card__cta"
                  >
                    Read Full Article →
                  </a>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="card news-empty">
            <div className="news-empty__icon">◉</div>
            <p className="news-empty__title">No news available</p>
            <p className="news-empty__subtitle">
              Check back later for the latest market updates.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
