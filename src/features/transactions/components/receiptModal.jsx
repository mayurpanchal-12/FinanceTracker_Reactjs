import { createPortal } from 'react-dom';


export default function ReceiptModal({ url, onClose }) {
  if (!url) return null;
  const isPdf = url.includes('.pdf') || url.includes('application/pdf');

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
 >
      <div
        className="bg-white dark:bg-[#1a1f32] rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8">
          <p className="text-sm font-bold text-text-main">Receipt</p>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:opacity-70 px-3 py-1.5 rounded-lg bg-primary/8"
            >
              Open ↗
            </a>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/8 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* content */}
        <div className="p-4 bg-gray-50 dark:bg-black/20 flex items-center justify-center min-h-[200px]">
          {isPdf ? (
            <iframe src={url} title="receipt" className="w-full h-[60vh] rounded-xl border-0" />
          ) : (
            <img
              src={url}
              alt="receipt"
              className="max-w-full max-h-[60vh] rounded-xl object-contain"
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
