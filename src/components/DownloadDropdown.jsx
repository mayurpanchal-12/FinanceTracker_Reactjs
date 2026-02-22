import { useEffect, useRef, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { downloadCSV } from '../utils/csv';
import { downloadPDF } from '../utils/pdf';

export default function DownloadDropdown() {
  const [open, setOpen] = useState(false);
  const { filteredTransactions, filters } = useTransactions();
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCSV = (e) => {
    e.stopPropagation();
    if (filteredTransactions.length === 0) {
      alert('No visible data to download');
      return;
    }
    downloadCSV(filteredTransactions, filters);
    setOpen(false);
  };

  const handlePDF = async (e) => {
    e.stopPropagation();
    if (filteredTransactions.length === 0) {
      alert('No visible data to download');
      return;
    }
    const ok = await downloadPDF(filteredTransactions, filters);
    if (!ok) alert('PDF download failed. Check the console for details.');
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        id="downloadBtn"
        className="inline-flex items-center justify-center font-semibold text-[0.95rem] py-2.5 px-5 border-none rounded-xl cursor-pointer transition-all duration-300 outline-none bg-gradient-to-br from-primary to-accent text-white shadow-[0_4px_10px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] active:translate-y-0"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        ⬇ Download
      </button>
      <div
        id="downloadDropdown"
        className={`absolute top-[calc(100%+8px)] left-0 right-0 bg-surface-solid border border-border-solid rounded-xl shadow-lg z-[100] flex-col overflow-hidden animate-[slideDown_0.2s_ease-out] ${open ? 'flex' : 'hidden'}`}
        aria-hidden={!open}
      >
        <button type="button" className="w-full px-4 py-3 rounded-none bg-transparent text-text-main text-left flex justify-start shadow-none hover:bg-[#f3e8ff] hover:text-primary transition-colors cursor-pointer" onClick={handleCSV}>CSV</button>
        <button type="button" className="w-full px-4 py-3 rounded-none bg-transparent text-text-main text-left flex justify-start shadow-none hover:bg-[#f3e8ff] hover:text-primary transition-colors cursor-pointer" onClick={handlePDF}>PDF</button>
      </div>
    </div>
  );
}
