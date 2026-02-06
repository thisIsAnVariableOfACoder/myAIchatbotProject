import { useEffect, useState } from 'react';
import AdminScenarioEditor from '../components/AdminScenarioEditor';
import { useAuth } from '../context/AuthContext';

const API_BASE = '';

export default function Admin() {
  const { user, token } = useAuth();
  const [scenarios, setScenarios] = useState([]);
  const [selected, setSelected] = useState(null);

  async function loadScenarios() {
    const res = await fetch(`${API_BASE}/api/admin/scenarios`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    setScenarios(json?.data || []);
  }

  useEffect(() => {
    if (user?.user_type === 'admin') loadScenarios();
  }, [user]);

  async function handleDelete(id) {
    await fetch(`${API_BASE}/api/admin/scenario/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    await loadScenarios();
    setSelected(null);
  }

  if (!user || user.user_type !== 'admin') {
    return (
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">Truy cập bị giới hạn</div>
        <div className="text-sm text-[#5B5B57] mt-2">Trang này chỉ dành cho tài khoản admin.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-[#E8E2D8] bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold mb-3">Danh sách kịch bản</div>
        <div className="space-y-2">
          {scenarios.length === 0 && <div className="text-sm text-[#5B5B57]">Chưa có kịch bản.</div>}
          {scenarios.map((s) => (
            <div key={s.id} className="rounded-xl border border-[#E8E2D8] p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-[#5B5B57]">{s.target_user_type || 'all'}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-xs rounded border" onClick={() => setSelected(s)}>Sửa</button>
                <button className="px-2 py-1 text-xs rounded border border-[#D64545] text-[#D64545]" onClick={() => handleDelete(s.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E8E2D8] bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold mb-3">{selected ? 'Sửa kịch bản' : 'Tạo kịch bản mới'}</div>
        <AdminScenarioEditor
          selected={selected}
          onSaved={async () => {
            await loadScenarios();
            setSelected(null);
          }}
        />
      </section>
    </div>
  );
}
