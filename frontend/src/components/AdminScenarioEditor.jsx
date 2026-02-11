import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function AdminScenarioEditor({ selected, onSaved }) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [targetUserType, setTargetUserType] = useState('high_school');
  const [nodesJson, setNodesJson] = useState('[]');
  const [edgesJson, setEdgesJson] = useState('[]');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selected) {
      setName(selected.name || '');
      setTargetUserType(selected.target_user_type || 'high_school');
      setNodesJson(selected.nodes || '[]');
      setEdgesJson(selected.edges || '[]');
      setIsActive(Boolean(selected.is_active));
    }
  }, [selected]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    let nodes;
    let edges;
    try {
      nodes = JSON.parse(nodesJson || '[]');
      edges = JSON.parse(edgesJson || '[]');
    } catch {
      setError('Invalid JSON for nodes or edges');
      return;
    }
    const payload = {
      name,
      target_user_type: targetUserType,
      nodes,
      edges,
      is_active: isActive ? 1 : 0
    };
    await api.saveScenario(payload, token, selected?.id);
    if (onSaved) onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-[#5B5B57]" htmlFor="sc-name">Tên kịch bản</label>
        <input
          id="sc-name"
          className="input-elevated mt-1 w-full px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="High School Career Discovery"
        />
      </div>
      <div>
        <label className="text-xs text-[#5B5B57]" htmlFor="sc-target">Nhóm người dùng</label>
        <select
          id="sc-target"
          className="input-elevated mt-1 w-full px-3 py-2 text-sm"
          value={targetUserType}
          onChange={(e) => setTargetUserType(e.target.value)}
        >
          <option value="high_school">high_school</option>
          <option value="university">university</option>
          <option value="professional">professional</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-[#5B5B57]" htmlFor="sc-nodes">Nodes (JSON)</label>
        <textarea
          id="sc-nodes"
          className="input-elevated mt-1 w-full px-3 py-2 text-xs font-mono"
          rows={6}
          value={nodesJson}
          onChange={(e) => setNodesJson(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-[#5B5B57]" htmlFor="sc-edges">Edges (JSON)</label>
        <textarea
          id="sc-edges"
          className="input-elevated mt-1 w-full px-3 py-2 text-xs font-mono"
          rows={5}
          value={edgesJson}
          onChange={(e) => setEdgesJson(e.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-[#5B5B57]">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Kích hoạt
      </label>
      <button className="btn-primary w-full rounded-lg py-2" type="submit">
        {selected ? 'Cập nhật kịch bản' : 'Tạo kịch bản'}
      </button>
      {error && <div className="text-xs text-[#D64545]">{error}</div>}
    </form>
  );
}
