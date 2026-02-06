export default function JobCard({ job }) {
  const imageUrl = job.image_url || '/career-icons/default.svg';
  return (
    <div className="rounded-2xl border border-[#E8E2D8] bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <img
          src={imageUrl}
          alt={job.title}
          className="h-12 w-12 rounded-xl border border-[#E2D8C8] bg-[var(--c-surface)] object-contain p-2"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{job.title}</div>
          <div className="text-xs text-[#5B5B57]">{job.category || 'Khác'}</div>
        </div>
      </div>
      {Array.isArray(job.tags) && job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags.slice(0, 5).map((tag) => (
            <span
              key={`${job.id}-${tag}`}
              className="rounded-full border border-[#E2D8C8] px-2 py-1 text-[11px] text-[#5B5B57]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
