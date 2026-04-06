import { useNavigate } from 'react-router-dom';

export default function Wildcard() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 py-24 animate-fade-in-down text-center">
      <div className="relative select-none">
        <span className="text-[7rem] font-extrabold text-text-main/[0.07] leading-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-extrabold text-text-main/20 tracking-widest">404</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 max-w-xs">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Page Not Found</h1>
        <p className="text-sm text-text-light leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <button onClick={() => navigate('/')}
        className="btn-primary px-8 py-2.5 text-sm rounded-xl">
        ← Back to Home
      </button>
    </div>
  );
}
