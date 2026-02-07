import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import { IS_OFFLINE } from '../config';
import { api } from '../api';

export default function Explore() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');

  const limit = 100; // Load 100 jobs by default

  useEffect(() => {
    let cancelled = false;
    async function loadFilters() {
      try {
        setError('');
        const json = await api.exploreFilters();
        if (cancelled) return;
        const data = json?.data || {};
        setCategories(data.categories || []);
        setTags(data.tags || []);
      } catch {
        if (!cancelled) {
          setCategories([]);
          setTags([]);
          setError('Không kết nối được máy chủ. Vui lòng cấu hình API backend.');
        }
      }
    }
    loadFilters();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setJobs([]);
    setPage(0);
  }, [query, category, tag]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      if (tag) params.set('tag', tag);
      params.set('limit', String(limit));
      params.set('offset', String(page * limit));
      try {
        const json = await api.exploreJobs({
          q: query,
          category,
          tag,
          limit,
          offset: page * limit
        });
        if (!cancelled) {
          const items = json?.data || [];
          setTotal(json?.total || 0);
          setJobs((prev) => (page === 0 ? items : [...prev, ...items]));
        }
      } catch {
        if (!cancelled) {
          setError('Không kết nối được máy chủ. Vui lòng cấu hình API backend.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [query, category, tag, page]);

  return (
    <div>
      <div className="mb-4">
        <div className="text-2xl font-semibold">Explore Nghề Nghiệp</div>
        <div className="text-sm text-[#5B5B57]">Khám phá kho dữ liệu nghề nghiệp</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
        <input
          className="rounded-lg border border-[#E2D8C8] bg-white px-3 py-2 text-sm transition focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
          placeholder="Tìm nghề nghiệp..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-lg border border-[#E2D8C8] bg-white px-3 py-2 text-sm transition focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Tất cả nhóm ngành</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-[#E2D8C8] bg-white px-3 py-2 text-sm transition focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="">Tất cả tag</option>
          {tags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex items-center text-xs text-[#5B5B57]">
          {total > 0 ? `${jobs.length}/${total}` : '0'}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {/* Bổ sung hiển thị các nhóm ngành và nghề nghiệp thực tế (trừ giáo dục) */}
        {jobs.length === 0 && (
          <div className="text-sm text-[#5B5B57]">
            Hiện chưa có dữ liệu nghề nghiệp cho nhóm ngành này. Vui lòng chọn nhóm ngành khác để khám phá thêm!
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-sm text-[#B91C1C]">{error}</div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="mt-4 text-sm text-[#5B5B57]">Chưa có dữ liệu nghề nghiệp.</div>
      )}

      <div className="mt-4 flex justify-center">
        {jobs.length < total && (
          <button
            className="rounded-lg border border-[#E2D8C8] px-4 py-2 text-sm hover:border-[var(--c-accent)] transition"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        )}
      </div>
    </div>
  );
}
