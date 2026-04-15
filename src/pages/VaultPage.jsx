import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadVaultFile, loadVaultFiles, deleteVaultFile } from '../utils/storage';
import { SkeletonCard } from '../components/Skeleton';
import toast from 'react-hot-toast';

const TABS = ['all', 'receipt', 'document', 'image'];

const FileIcon = ({ fileType }) => {
  if (fileType?.startsWith('image/')) return <span className="text-2xl">🖼️</span>;
  if (fileType === 'application/pdf') return <span className="text-2xl">📄</span>;
  return <span className="text-2xl">📁</span>;
};

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (ts) => {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ── Preview Modal ─────────────────────────────────────────
function PreviewModal({ file, onClose }) {
  if (!file) return null;
  const isImage = file.fileType?.startsWith('image/');
  const isPdf = file.fileType === 'application/pdf';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1f32] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8">
          <div>
            <p className="text-sm font-bold text-text-main truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-text-light mt-0.5">{formatSize(file.size)} · {formatDate(file.uploadedAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg bg-primary/8"
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
        <div className="p-4 max-h-[70vh] overflow-auto flex items-center justify-center bg-gray-50 dark:bg-black/20">
          {isImage && (
            <img src={file.url} alt={file.name} className="max-w-full max-h-[60vh] rounded-xl object-contain" />
          )}
          {isPdf && (
            <iframe src={file.url} title={file.name} className="w-full h-[60vh] rounded-xl border-0" />
          )}
          {!isImage && !isPdf && (
            <div className="text-center py-10">
              <span className="text-5xl">📁</span>
              <p className="text-sm text-text-light mt-3">Preview not available</p>
              <a href={file.url} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-block text-xs font-semibold text-primary hover:opacity-70">
                Download file ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Upload Area ───────────────────────────────────────────
function UploadArea({ onUpload, uploading }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadType, setUploadType] = useState('document');
  const inputRef = useRef();

  const handleFiles = (files) => {
    if (!files?.length) return;
    onUpload(files[0], uploadType);
  };

  return (
    <div className="card px-6 py-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text-main">Upload File</h3>
          <p className="text-xs text-text-light mt-0.5">Images, PDFs, documents — max 10MB</p>
        </div>
        {/* type selector */}
        <div className="flex gap-1.5">
          {['document', 'image', 'receipt'].map((t) => (
            <button
              key={t}
              onClick={() => setUploadType(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all capitalize ${
                uploadType === t
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/8 text-text-light hover:text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/3'
        }`}
      >
        <span className="text-3xl mb-2">{uploading ? '⏳' : '☁️'}</span>
        <p className="text-sm font-semibold text-text-main">
          {uploading ? 'Uploading...' : 'Drop file here or click to browse'}
        </p>
        <p className="text-xs text-text-light mt-1">JPG, PNG, PDF, DOCX supported</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xlsx,.csv"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </div>
    </div>
  );
}

// ── File Card ─────────────────────────────────────────────
function FileCard({ file, onPreview, onDelete, canDelete }) {
  return (
    <div className="card p-4 flex flex-col gap-3 animate-fade-in group cursor-pointer hover:shadow-lg transition-all"
      onClick={() => onPreview(file)}
    >
      {/* top */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center">
          <FileIcon fileType={file.fileType} />
        </div>
        {canDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file); }}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-600 transition-all text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* name */}
      <div>
        <p className="text-xs font-bold text-text-main truncate" title={file.name}>{file.name}</p>
        <p className="text-[10px] text-text-light mt-0.5">{formatSize(file.size)}</p>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-white/5">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
          file.type === 'receipt'
            ? 'bg-green-50 text-green-600 dark:bg-green-500/10'
            : file.type === 'image'
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10'
            : 'bg-violet-50 text-violet-600 dark:bg-violet-500/10'
        }`}>
          {file.type}
        </span>
        <span className="text-[10px] text-text-light">{formatDate(file.uploadedAt)}</span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function VaultPage() {
  const { user, role } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState('');

  // load vault files
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const data = await loadVaultFiles(user.uid);
      setFiles(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  // upload handler
  const handleUpload = async (file, type) => {
    if (!user || role !== 'admin') return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large — max 10MB');
      return;
    }
    setUploading(true);
    try {
      const saved = await uploadVaultFile(user.uid, file, type);
      setFiles((prev) => [saved, ...prev]);
      toast.success(`${file.name} uploaded!`);
    } catch {
      toast.error('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  // delete handler
  const handleDelete = async (file) => {
    if (!user || role !== 'admin') return;
    try {
      await deleteVaultFile(user.uid, file.id, file.storagePath);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      toast.success('File deleted');
    } catch {
      toast.error('Delete failed. Try again.');
    }
  };

  // filter files
  const filtered = files.filter((f) => {
    const matchTab = activeTab === 'all' || f.type === activeTab;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (loading) return (
    <div className="p-4 flex flex-col gap-4">
      <SkeletonCard lines={2} />
      <SkeletonCard lines={2} />
    </div>
  );

  return (
    <>
      <PreviewModal file={preview} onClose={() => setPreview(null)} />

      {/* header */}
      <section className="card px-6 py-5 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🗄️</span>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-text-main">Finance Vault</h2>
            <p className="text-xs text-text-light">Receipts, documents and images — all in one place</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs font-bold text-text-light bg-gray-100 dark:bg-white/8 px-3 py-1.5 rounded-lg">
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* upload — admin only */}
      {role === 'admin' && (
        <UploadArea onUpload={handleUpload} uploading={uploading} />
      )}

      {/* tabs + search */}
      <section className="card px-5 py-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* tabs */}
          <div className="flex gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-white/8 text-text-light hover:text-primary'
                }`}
              >
                {tab}
                <span className="ml-1.5 opacity-60">
                  {tab === 'all' ? files.length : files.filter(f => f.type === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* search */}
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field max-w-[200px] py-2 text-xs"
          />
        </div>
      </section>

      {/* grid */}
      {filtered.length === 0 ? (
        <section className="card px-6 py-12 flex flex-col items-center gap-3 animate-fade-in">
          <span className="text-4xl">🗂️</span>
          <p className="text-sm font-bold text-text-main">No files yet</p>
          <p className="text-xs text-text-light">
            {role === 'admin' ? 'Upload your first file above.' : 'No files uploaded yet.'}
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-fade-in">
          {filtered.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onPreview={setPreview}
              onDelete={handleDelete}
              canDelete={role === 'admin'}
            />
          ))}
        </section>
      )}
    </>
  );
}