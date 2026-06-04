

const shimmer = {
  background: 'linear-gradient(90deg, var(--sk-base) 25%, var(--sk-shine) 50%, var(--sk-base) 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
};

if (typeof document !== 'undefined' && !document.getElementById('sk-style')) {
  const s = document.createElement('style');
  s.id = 'sk-style';
  s.textContent = `
    :root { --sk-base: rgba(99,120,180,0.09); --sk-shine: rgba(99,120,180,0.18); }
    [data-theme="dark"] { --sk-base: rgba(255,255,255,0.05); --sk-shine: rgba(255,255,255,0.11); }
    @keyframes skeleton-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(s);
}

export function Skeleton({ width = '100%', height = '14px', borderRadius = '8px', className = '' }) {
  return (
    <div
      className={className}
      style={{ width, height, borderRadius, ...shimmer }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <Skeleton width="40%" height="12px" />
      <Skeleton height="28px" width="60%" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} width={i % 2 === 0 ? '100%' : '75%'} height="12px" />
      ))}
    </div>
  );
}

export function SkeletonSummary({ count = 3 }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 flex flex-col gap-3">
          <Skeleton width="50%" height="11px" />
          <Skeleton width="70%" height="32px" />
          <Skeleton width="40%" height="11px" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex gap-4 px-4 py-3 border-b border-gray-100 dark:border-white/5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={`${Math.random() * 40 + 50}px`} height="10px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3 border-b border-gray-50 dark:border-white/3">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={`${Math.random() * 50 + 40}px`} height="12px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ height = '260px' }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton width="140px" height="14px" />
        <Skeleton width="60px" height="14px" />
      </div>
      <div style={{ height, ...shimmer, borderRadius: '12px' }} />
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-2 animate-fade-in">
      <Skeleton width="220px" height="20px" />
      <SkeletonSummary count={3} />
      <SkeletonTable rows={6} />
    </div>
  );
}

export default Skeleton;