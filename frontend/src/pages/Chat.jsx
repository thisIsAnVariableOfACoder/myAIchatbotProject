import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import ProfileForm from '../components/ProfileForm';
import ResultCard from '../components/ResultCard';
import { useAuth } from '../context/AuthContext';

const API_BASE = '';

function normalizeRecommendations(list) {
  if (!Array.isArray(list)) return [];
  const map = new Map();
  for (const item of list) {
    const name = String(item?.career_name || '').trim();
    if (!name) continue;
    const score = Number(item?.match_score || 0);
    const existing = map.get(name);
    if (!existing || score > existing.match_score) {
      map.set(name, { ...item, career_name: name, match_score: score });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);
}

export default function Chat() {
  const { user, token } = useAuth();
  const userId = user?.user_id || null;
  const [userType, setUserType] = useState('high_school');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [profileInitial, setProfileInitial] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [titleDraft, setTitleDraft] = useState('');
  const [menuId, setMenuId] = useState(null);
  const [helloSent, setHelloSent] = useState(false);

  const bestCareer = recommendations.length > 0
    ? recommendations[0]
    : null;

  const headerSubtitle = useMemo(() => {
    if (userType === 'university') return 'Sinh viên';
    if (userType === 'professional') return 'Chuyển nghề';
    return 'Học sinh';
  }, [userType]);

  const displayName = useMemo(() => {
    if (user?.email) return user.email.split('@')[0];
    return 'bạn';
  }, [user]);

  useEffect(() => {
    if (user?.user_type) setUserType(user.user_type);
  }, [user]);

  useEffect(() => {
    const saidHello = messages.some((m) => m.sender === 'user' && String(m.text || '').trim().toLowerCase() === 'hello');
    setHelloSent(saidHello);
  }, [messages]);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      if (!token || !userId) {
        setProfileInitial(null);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (!cancelled) {
          setProfileInitial(json?.data || null);
        }
      } catch {
        if (!cancelled) setProfileInitial(null);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [userId, token]);

  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      if (!userId || !token) {
        setHistory([]);
        setCompleted(false);
        return;
      }
      try {
        setHistoryError('');
        const res = await fetch(`${API_BASE}/api/chat/history/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (!cancelled && json?.data?.length) {
          setHistory(json.data);
          const firstConv = json.data[0].conversation_id;
          setConversationId(firstConv);
          const msgRes = await fetch(`${API_BASE}/api/chat/messages/${firstConv}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const msgJson = await msgRes.json();
          const rows = msgJson?.data || [];
          setMessages(rows.map((m) => ({
            id: m.id,
            sender: m.sender,
            text: m.message
          })));
          setCurrentNode(null);
          const recRes = await fetch(`${API_BASE}/api/chat/recommendations/${firstConv}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const recJson = await recRes.json();
          const recs = normalizeRecommendations(recJson?.data || []);
          setRecommendations(recs);
          setCompleted(recs.length > 0);
        }
      } catch {
        setHistoryError('Không thể tải lịch sử');
      }
    }
    loadHistory();
    return () => { cancelled = true; };
  }, [userId, token]);

  async function refreshHistory() {
    if (!userId || !token) return;
    const resHistory = await fetch(`${API_BASE}/api/chat/history/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const jsonHistory = await resHistory.json();
    setHistory(jsonHistory?.data || []);
  }

  async function renameConversation(conversationId, title) {
    if (!token || !conversationId) return;
    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) return;
    const res = await fetch(`${API_BASE}/api/chat/conversation/${conversationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: cleanTitle })
    });
    const json = await res.json();
    if (json?.success) {
      setHistory((prev) => prev.map((h) => (
        h.conversation_id === conversationId ? { ...h, title: cleanTitle } : h
      )));
    }
  }

  async function deleteConversation(convId) {
    if (!token || !convId) return;
    await fetch(`${API_BASE}/api/chat/conversation/${convId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (conversationId === convId) {
      setMessages([]);
      setRecommendations([]);
      setCurrentNode(null);
      setConversationId(null);
      setCompleted(false);
    }
    await refreshHistory();
  }

  async function sendMessage(text, options = {}) {
    if (!text) return;
    setMessages(prev => ([
      ...prev,
      { id: `${Date.now()}-u`, sender: 'user', text }
    ]));
    setLoading(true);
    try {
      const normalized = String(text).trim().toLowerCase();
      if (normalized === 'hello') {
        setHelloSent(true);
      }
      const body = {
        user_type: userType,
        conversation_id: conversationId,
        message: text,
        current_node: currentNode,
        request_more: options.requestMore || false
      };
      const res = await fetch(`${API_BASE}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      const data = json?.data || {};

      const botMessage = { id: `${Date.now()}-b`, sender: 'bot', text: data.bot_reply };
      const shouldDelay = Boolean(data.next_node && !data.completed);
      const applyBotMessage = () => {
        setMessages(prev => ([...prev, botMessage]));
        setLoading(false);
      };

      if (data.conversation_id) {
        const prevId = conversationId;
        setConversationId(data.conversation_id);
        if (token && userId && data.conversation_id !== prevId) {
          await refreshHistory();
        }
      }
      setCurrentNode(data.next_node || null);
      if (data.recommendations) {
        const recs = normalizeRecommendations(data.recommendations);
        setRecommendations(recs);
        setCompleted(recs.length > 0 || Boolean(data.completed));
      } else if (data.completed) {
        setCompleted(true);
      } else {
        setCompleted(false);
      }

      if (shouldDelay) {
        setTimeout(applyBotMessage, 2000);
      } else {
        applyBotMessage();
      }
    } catch {
      setLoading(false);
    }
  }

  async function saveProfile(payload) {
    if (!token || !userId) return;
    await fetch(`${API_BASE}/api/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  }

  async function loadConversation(convId) {
    if (!token || !convId) return;
    const res = await fetch(`${API_BASE}/api/chat/messages/${convId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    const rows = json?.data || [];
    setConversationId(convId);
    setMessages(rows.map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.message
    })));
    const recRes = await fetch(`${API_BASE}/api/chat/recommendations/${convId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const recJson = await recRes.json();
    const recs = normalizeRecommendations(recJson?.data || []);
    setRecommendations(recs);
    setCompleted(recs.length > 0);
    setCurrentNode(null);
  }

  async function requestMoreQuestions() {
    setRecommendations([]);
    setCompleted(false);
    await sendMessage('Tôi chưa hài lòng, hãy hỏi thêm.', { requestMore: true });
  }

  function startNewChat() {
    setMessages([
      { id: `${Date.now()}-b`, sender: 'bot', text: `Hello ${displayName}!` }
    ]);
    setRecommendations([]);
    setCurrentNode(null);
    setConversationId(null);
    setHelloSent(false);
    setCompleted(false);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">Chat tư vấn nghề nghiệp</div>
          <div className="text-sm text-[#5B5B57]">{headerSubtitle}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-lg border border-[#E2D8C8] hover:border-[var(--c-primary)] transition"
            onClick={startNewChat}
          >
            Tạo chat mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,3fr)_160px]">
        <section className="order-2 lg:order-1">
          <div className="rounded-2xl border border-[#E8E2D8] bg-white p-4 shadow-sm animate-rise" style={{ animationDelay: '40ms' }}>
            <div className="text-sm font-semibold mb-3">Hồ sơ cá nhân</div>
            <ProfileForm
              onSave={saveProfile}
              onUserTypeChange={setUserType}
              canSave={!!token}
              storageKey={userId ? `profileDraft:${userId}` : 'profileDraft:guest'}
              initialValues={profileInitial}
            />
            {!token && (
              <div className="text-xs text-[#5B5B57] mt-2">
                Đăng nhập để lưu hồ sơ và lịch sử chat.
              </div>
            )}
          </div>
          <div className="mt-4 rounded-2xl border border-[#E8E2D8] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Lịch sử hội đáp</div>
              {token && history.length > 0 && (
                <button
                  className="text-xs text-[#D64545]"
                  onClick={async () => {
                    if (!token || !userId) return;
                    await fetch(`${API_BASE}/api/chat/history/${userId}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setHistory([]);
                    setMessages([]);
                    setRecommendations([]);
                    setConversationId(null);
                    setCurrentNode(null);
                    setCompleted(false);
                  }}
                >
                  Xóa tất cả
                </button>
              )}
            </div>
            <div className="space-y-2 text-xs text-[#5B5B57]">
              {historyError && <div>{historyError}</div>}
              {!token && <div>Đăng nhập để xem lịch sử.</div>}
              {token && history.length === 0 && <div>Chưa có hội đáp.</div>}
              {history.map((h) => (
                <div key={h.conversation_id} className="flex w-full items-center justify-between rounded-md border border-transparent hover:border-[#E2D8C8] px-2 py-1">
                  <div className="flex-1">
                    {editingId === h.conversation_id ? (
                      <input
                        className="w-full rounded-md border border-[#E2D8C8] px-2 py-1 text-xs"
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        placeholder="Nhập tên cuộc trò chuyện"
                      />
                    ) : (
                      <button
                        className="w-full text-left"
                        onClick={async () => {
                          if (!token) return;
                          await loadConversation(h.conversation_id);
                        }}
                      >
                        {h.title || h.conversation_id}
                      </button>
                    )}
                  </div>
                  <div className="ml-2 text-xs">{h.message_count} tin</div>
                  {editingId === h.conversation_id ? (
                    <>
                      <button
                        className="ml-2 text-xs text-[var(--c-primary)]"
                        onClick={async () => {
                          await renameConversation(h.conversation_id, titleDraft);
                          setEditingId(null);
                        }}
                      >
                        Lưu
                      </button>
                      <button
                        className="ml-2 text-xs text-[#5B5B57]"
                        onClick={() => setEditingId(null)}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <div className="relative ml-2">
                      <button
                        className="text-xs text-[#7A6D5B] px-1"
                        onClick={() => setMenuId(menuId === h.conversation_id ? null : h.conversation_id)}
                      >
                        ...
                      </button>
                      {menuId === h.conversation_id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-28 rounded-md border border-[#E2D8C8] bg-white shadow-sm">
                          <button
                            className="block w-full px-3 py-2 text-left text-xs hover:bg-[#F7F5F2]"
                            onClick={() => {
                              setEditingId(h.conversation_id);
                              setTitleDraft(h.title || '');
                              setMenuId(null);
                            }}
                          >
                            Đổi tên
                          </button>
                          <button
                            className="block w-full px-3 py-2 text-left text-xs text-[#D64545] hover:bg-[#F7F5F2]"
                            onClick={async () => {
                              setMenuId(null);
                              await deleteConversation(h.conversation_id);
                            }}
                          >
                            Xóa chat
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="rounded-2xl border border-[#E8E2D8] bg-white shadow-sm overflow-hidden animate-rise" style={{ animationDelay: '80ms' }}>
            <ChatWindow
              messages={messages}
              loading={loading}
              onSend={sendMessage}
              showHelloHint={!helloSent}
              showFollowUp={completed && recommendations.length > 0}
              onFollowUp={requestMoreQuestions}
            />
          </div>
          <div className="mt-4 rounded-2xl border border-[#E8E2D8] bg-white p-4 shadow-sm animate-rise" style={{ animationDelay: '100ms' }}>
            <div className="text-sm font-semibold mb-3">Biểu đồ xác suất nghề nghiệp (Top 10)</div>
            {recommendations.length === 0 && (
              <div className="text-sm text-[#5B5B57]">Chưa có dữ liệu để hiển thị biểu đồ.</div>
            )}
            {recommendations.length > 0 && (
              <div className="space-y-3">
                {recommendations.map((r) => {
                  const percent = Math.min(100, Math.max(0, Number(r.match_score || 0)));
                  return (
                    <div key={r.career_name} className="flex items-center gap-3">
                      <div className="w-32 text-xs font-medium truncate">{r.career_name}</div>
                      <div className="flex-1 h-2 rounded-full bg-[#EFEAE2] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--c-accent)] transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-xs font-semibold">{percent.toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
            )}

            
            {bestCareer && (
              <div className="mb-3 rounded-lg border border-[#E8E2D8] bg-[#FFF8F0] px-3 py-2 text-sm font-semibold">
                Nghề phù hợp nhất: {bestCareer.career_name} ({Number(bestCareer.match_score || 0).toFixed(1)}%)
              </div>
            )}
            <div className="space-y-3">
              {recommendations.length === 0 && (
                <div className="text-sm text-[#5B5B57]">Chưa có gợi ý. Hãy trả lời vài câu hỏi.</div>
              )}
              {recommendations.map((r, idx) => (
                <ResultCard
                  key={`${r.career_name}-${idx}`}
                  career={r.career_name}
                  score={r.match_score}
                  reasons={r.reasons}
                />
              ))}
            </div>
            {recommendations.length > 0 && (
              <div className="text-xs text-[#5B5B57] mt-2">Đang hiển thị {recommendations.length} nghề có xác suất cao nhất.</div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-[#E8E2D8] bg-[#FFF8F0] p-4 animate-rise" style={{ animationDelay: '160ms' }}>
            <div className="text-sm font-semibold mb-2">Admin Editor</div>
            <div className="text-xs text-[#7A6D5B]">Cập nhật kịch bản, nodes, edges</div>
            {user?.user_type === 'admin' ? (
              <Link to="/admin" className="mt-3 inline-block px-3 py-2 rounded-lg bg-[var(--c-accent)] text-white hover:opacity-90 transition">
                Mở Scenario Editor
              </Link>
            ) : (
              <div className="mt-3 text-xs text-[#5B5B57]">Chỉ dành cho tài khoản admin.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
