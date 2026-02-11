export default function ResultCard({ career, score, reasons }) {
  const percent = Math.min(100, Math.max(0, Number(score || 0)));
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--c-accent-soft)] flex items-center justify-center text-[var(--c-primary)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7 6V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1h3a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2h3zm2 0h6V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1z"
              />
            </svg>
          </div>
          <div>
            <div className="font-semibold">{career}</div>
            <div className="text-[11px] text-[#5B5B57]">Xác suất phù hợp</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-14 w-14 rounded-full border border-[#EFEAE2] bg-[#EFEAE2]"
            style={{ background: `conic-gradient(var(--c-accent) ${percent}%, #EFEAE2 0)` }}
            aria-label={`Biểu đồ tròn ${percent}%`}
          />
          <div className="text-sm font-semibold">{percent.toFixed(1)}%</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-[#5B5B57]">{(reasons || []).join(' - ')}</div>
    </div>
  );
}
