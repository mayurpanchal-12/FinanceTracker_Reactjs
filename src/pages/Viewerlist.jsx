export default function ViewerList({ viewers, onRemove }) {
  return (
    <div className="card px-6 py-6">
      <p className="section-label mb-4">Current viewers ({viewers.length})</p>

      {viewers.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-3xl mb-2">👥</p>
          <p className="text-text-light text-sm">No viewers added yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {viewers.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold flex items-center justify-center">
                  {v.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">{v.name}</p>
                  <p className="text-xs text-text-light">{v.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  Viewer
                </span>
                <button
                  onClick={() => onRemove(v.id, v.name)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}