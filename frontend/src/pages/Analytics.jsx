import { useEffect, useState } from 'react';
import AnalyticsCard from '../components/AnalyticsCard';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

export default function Analytics() {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function load() {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/analytics/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setSummary(json?.data || null);
    }
    if (user?.user_type === 'admin') load();
  }, [user, token]);

  if (!user || user.user_type !== 'admin') {
    return (
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">Truy cập bị giới hạn</div>
        <div className="text-sm text-[#5B5B57] mt-2">Chỉ admin mới xem được thống kê.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-2xl font-semibold mb-4">Thống kê</div>
      {!summary && <div className="text-sm text-[#5B5B57]">Đang tải...</div>}
      {summary && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <AnalyticsCard title="Tổng người dùng" value={summary.total_users} />
          <AnalyticsCard title="Tổng hội thoại" value={summary.total_conversations} />
          <AnalyticsCard
            title="Top nghề"
            value={(summary.top_careers || []).length}
            subtitle={(summary.top_careers || []).map(c => `${c.career_name} (${c.count})`).join(', ')}
          />
        </div>
      )}
    </div>
  );
}
