import { useEffect, useState } from 'react';
import AdminScenarioEditor from '../components/AdminScenarioEditor';
import { useAuth } from '../context/AuthContext';
import { IS_OFFLINE } from '../config';
import { api } from '../api';

export default function Admin() {
  const { user, token } = useAuth();
  const [scenarios, setScenarios] = useState([]);
  const [selected, setSelected] = useState(null);

  async function loadScenarios() {
    const json = await api.getScenarios(token);
    setScenarios(json?.data || []);
  }

  useEffect(() => {
    if (user?.user_type === 'admin') loadScenarios();
  }, [user]);

  async function handleDelete(id) {
    await api.deleteScenario(id, token);
    await loadScenarios();
    setSelected(null);
  }

  if (!user || user.user_type !== 'admin') {
      return (
        <div className="card card-elevated p-6">
          <div className="text-lg font-semibold">Truy cập bị giới hạn</div>
          <div className="text-sm text-[#5B5B57] mt-2">Trang này chỉ dành cho tài khoản admin.</div>
        </div>
      );
    }
    if (IS_OFFLINE) {
      return (
        <div className="card card-elevated p-6">
          <div className="text-lg font-semibold">Chế độ demo offline</div>
          <div className="text-sm text-[#5B5B57] mt-2">Trang Admin cần kết nối backend để hoạt động.</div>
        </div>
      );
    }

  return (
    <div className="space-y-6">
      <div className="card card-elevated p-6">
        <h2 className="text-xl font-semibold mb-2">Quản trị hệ thống</h2>
        <p className="text-sm text-[#5B5B57]">
          LLM đã được chuyển hoàn toàn sang backend. Frontend không còn lưu hoặc gọi API key AI trực tiếp.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* Scenario List */}
      <section className="card p-6">
        <div className="text-lg font-semibold mb-4">Danh sách kịch bản hội thoại</div>
        <div className="space-y-3">
          {scenarios.length === 0 && (
            <div className="text-center py-8 text-sm text-[#5B5B57] bg-[#F7F5F2] rounded-xl border border-dashed">
              Chưa có kịch bản nào được tạo.
            </div>
          )}
          {scenarios.map((s) => (
            <div key={s.id} className="rounded-xl border border-[#E8E2D8] p-4 flex items-center justify-between hover:border-[var(--c-accent)] transition">
              <div>
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-[#7A6D5B] mt-1 capitalize">Đối tượng: {s.target_user_type || 'Tất cả'}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-outline px-3 py-1.5 text-xs font-medium rounded-lg"
                  onClick={() => setSelected(s)}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#F2C5C5] text-[#D64545] hover:bg-[#FFF5F5] transition"
                  onClick={() => handleDelete(s.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

        {/* Scenario Editor */}
      <section className="card p-6">
        <div className="text-lg font-semibold mb-4">
          {selected ? `Đang sửa: ${selected.name}` : 'Tạo kịch bản mới'}
        </div>
          <AdminScenarioEditor
            selected={selected}
            onSaved={async () => {
              await loadScenarios();
              setSelected(null);
            }}
          />
        </section>
      </div>
    </div>
  );
}
