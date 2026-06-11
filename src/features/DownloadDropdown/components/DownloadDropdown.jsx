import { useEffect, useRef, useState } from "react";
import { useTransactions } from "../../../context/TransactionContext";
import { downloadCSV } from "../utils/csv";
import { downloadPDF } from "../utils/pdf";
import { Download, ChevronDown } from "lucide-react";

export default function DownloadDropdown() {
  const [open, setOpen] = useState(false);
  const { filteredTransactions, filters } = useTransactions();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleCSV = (e) => {
    e.stopPropagation();
    if (!filteredTransactions.length) {
      alert("No visible data to download");
      return;
    }
    downloadCSV(filteredTransactions, filters);
    setOpen(false);
  };
  const handlePDF = async (e) => {
    e.stopPropagation();
    if (!filteredTransactions.length) {
      alert("No visible data to download");
      return;
    }
    const ok = await downloadPDF(filteredTransactions, filters);
    if (!ok) alert("PDF download failed. Check the console for details.");
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        id="downloadBtn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
      >
      <Download size={16} />
        Export
        <span
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
<ChevronDown size={14} />

        </span>
      </button>
      {open && (
        <div
          id="downloadDropdown"
          role="menu"
          className="absolute top-[calc(100%+6px)] right-0 w-36 bg-white border border-border-solid rounded-xl shadow-lg z-50 overflow-hidden animate-slide-down"
        >
          {[
            { label: "CSV file", handler: handleCSV },
            { label: "PDF file", handler: handlePDF },
          ].map(({ label, handler }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={handler}
              className="w-full px-4 py-3 text-sm font-semibold text-left text-text-main hover:bg-primary/6 hover:text-primary transition-colors border-b last:border-0 border-border-solid"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
