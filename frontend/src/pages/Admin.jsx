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
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">Truy cập bị giới hạn</div>
        <div className="text-sm text-[#5B5B57] mt-2">Trang này chỉ dành cho tài khoản admin.</div>
      </div>
    );
  }
  if (IS_OFFLINE) {
    return (
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">Chế độ demo offline</div>
        <div className="text-sm text-[#5B5B57] mt-2">Trang Admin cần kết nối backend để hoạt động.</div>
      </div>
    );
  }

  const [apiKey, setApiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');

  useEffect(() => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
  }, [apiKey]);

  return (
    <div className="space-y-6">
      {/* AI Configuration Section */}
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Cấu hình AI thông minh</h2>
        <div className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5B5B57] mb-1">
              Google Gemini API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                className="flex-1 rounded-lg border border-[#E2D8C8] px-4 py-2 focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Nhập API Key từ AI Studio..."
              />
              <button
                onClick={() => alert('Đã lưu API Key!')}
                className="px-4 py-2 bg-[var(--c-primary)] text-white rounded-lg hover:opacity-90 transition"
              >
                Lưu
              </button>
            </div>
            <p className="mt-2 text-xs text-[#7A6D5B]">
              Chatbot sẽ dùng LLM để hiểu ý định người dùng (ví dụ: "cos" thành "có") và tính điểm chính xác hơn.
              Lấy key miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[var(--c-primary)] underline font-medium">Google AI Studio</a>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* Scenario List */}
        <section className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
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
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E2D8C8] hover:bg-[#F7F5F2] transition"
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
        <section className="rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
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
