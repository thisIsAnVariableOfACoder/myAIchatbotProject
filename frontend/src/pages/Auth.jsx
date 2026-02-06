import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IS_OFFLINE } from '../config';
import { api } from '../api';

export default function Auth() {
  const { login, user } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('high_school');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const body = mode === 'login'
      ? { email, password }
      : { email, password, user_type: userType };
    const json = mode === 'login'
      ? await api.login(body)
      : await api.register(body);
    if (!json?.success) {
      setError(json?.error || 'Đăng nhập thất bại');
      return;
    }
    login(json.data);
  }

  if (user) {
    return (
      <div className="max-w-md mx-auto rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">Bạn đã đăng nhập</div>
        <div className="text-sm text-[#5B5B57] mt-2">{user.email}</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto rounded-2xl border border-[#E8E2D8] bg-white p-6 shadow-sm">
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-2 rounded-lg text-sm ${mode === 'login' ? 'bg-[var(--c-primary)] text-white' : 'border'}`} onClick={() => setMode('login')}>Đăng nhập</button>
        <button className={`px-3 py-2 rounded-lg text-sm ${mode === 'register' ? 'bg-[var(--c-primary)] text-white' : 'border'}`} onClick={() => setMode('register')}>Tạo tài khoản</button>
      </div>
      {IS_OFFLINE && (
        <div className="mb-3 text-xs text-[#B91C1C]">
          Đang chạy chế độ demo offline. Tài khoản được lưu cục bộ trên trình duyệt.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-[#5B5B57]" htmlFor="email">Email</label>
          <input id="email" className="mt-1 w-full rounded-lg border border-[#E2D8C8] px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[#5B5B57]" htmlFor="password">Mật khẩu</label>
          <input id="password" type="password" className="mt-1 w-full rounded-lg border border-[#E2D8C8] px-3 py-2 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {mode === 'register' && (
          <div>
            <label className="text-xs text-[#5B5B57]" htmlFor="userType">Loại tài khoản</label>
            <select id="userType" className="mt-1 w-full rounded-lg border border-[#E2D8C8] px-3 py-2 text-sm" value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="high_school">Học sinh</option>
              <option value="university">Sinh viên</option>
              <option value="professional">Người đi làm</option>
            </select>
            <div className="mt-2 text-[11px] text-[#5B5B57]">Tài khoản admin là cố định.</div>
          </div>
        )}
        <button className="w-full rounded-lg bg-[var(--c-primary)] py-2 text-white hover:opacity-90 transition" type="submit">
          {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
        </button>
      </form>
      {error && <div className="mt-3 text-xs text-[#D64545]">{error}</div>}
    </div>
  );
}
