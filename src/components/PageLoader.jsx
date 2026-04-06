export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#f0f2f7]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
      </div>
      <p className="text-sm font-semibold text-text-light tracking-wide">Loading…</p>
    </div>
  );
}
