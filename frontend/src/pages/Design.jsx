import ThemeEditor from '../components/ThemeEditor';
import { useAuth } from '../context/AuthContext';

export default function Design() {
  const { user } = useAuth();
  if (!user || user.user_type !== 'admin') {
    return (
      <div className="card card-elevated p-6">
        <div className="text-lg font-semibold">Truy cập bị giới hạn</div>
        <div className="text-sm text-[#5B5B57] mt-2">Chỉ admin mới chỉnh theme.</div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-2xl font-semibold mb-4">UI Theme Editor</div>
      <ThemeEditor />
    </div>
  );
}
