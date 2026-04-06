import { useEffect, useRef, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { downloadCSV } from '../utils/csv';
import { downloadPDF } from '../utils/pdf';

const DownloadIco = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const ChevronIco = () => (
  <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export default function DownloadDropdown() {
  const [open, setOpen] = useState(false);
  const { filteredTransactions, filters } = useTransactions();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleCSV = (e) => {
    e.stopPropagation();
    if (!filteredTransactions.length) { alert('No visible data to download'); return; }
    downloadCSV(filteredTransactions, filters); setOpen(false);
  };
  const handlePDF = async (e) => {
    e.stopPropagation();
    if (!filteredTransactions.length) { alert('No visible data to download'); return; }
    const ok = await downloadPDF(filteredTransactions, filters);
    if (!ok) alert('PDF download failed. Check the console for details.');
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button type="button" id="downloadBtn"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
        <DownloadIco />
        Export
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><ChevronIco /></span>
      </button>
      {open && (
        <div id="downloadDropdown" role="menu"
          className="absolute top-[calc(100%+6px)] right-0 w-36 bg-white border border-border-solid rounded-xl shadow-lg z-50 overflow-hidden animate-slide-down">
          {[
            { label: 'CSV file', handler: handleCSV },
            { label: 'PDF file', handler: handlePDF },
          ].map(({ label, handler }) => (
            <button key={label} type="button" role="menuitem" onClick={handler}
              className="w-full px-4 py-3 text-sm font-semibold text-left text-text-main hover:bg-primary/6 hover:text-primary transition-colors border-b last:border-0 border-border-solid">
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
