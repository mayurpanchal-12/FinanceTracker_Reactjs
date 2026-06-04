export default function AddViewerForm({ name, setName, email, setEmail, password, setPassword, loading, onSubmit }) {
  return (
    <div className="card px-6 py-6">
      <p className="section-label mb-5">Add a viewer</p>

      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-light">Name</label>
          <input
            type="text"
            placeholder="e.g. Son, Wife, Friend"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-light">Email</label>
          <input
            type="text"
            placeholder="their@email.com"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-light">Password</label>
          <input
            type="password"
            placeholder="min 6 characters"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            {loading ? 'Adding...' : '+ Add Viewer'}
          </button>
        </div>
      </form>
    </div>
  );
}