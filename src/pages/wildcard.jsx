import { useNavigate } from 'react-router-dom';

export default function Wildcard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 animate-[fadeInDown_0.6s_ease-out]">
      
      <p className="text-8xl font-800 text-text-main opacity-10 select-none leading-none">
        404
      </p>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold text-text-main tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm font-300 text-text-main opacity-50 text-center max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-2 px-6 py-2.5 text-sm font-500 rounded-lg bg-text-main text-white opacity-80 hover:opacity-100 transition-opacity duration-200"
      >
        Back to Home
      </button>

    </div>
  );
}