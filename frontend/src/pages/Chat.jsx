import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import ProfileForm from '../components/ProfileForm';
import ResultCard from '../components/ResultCard';
import { useAuth } from '../context/AuthContext';
import { IS_OFFLINE } from '../config';
import { api } from '../api';

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

function resolveRecommendationPercent(item) {
  const rawScore = Number(item?.match_score);
  if (Number.isFinite(rawScore)) {
    return Math.min(100, Math.max(0, rawScore));
  }

  const rawProbability = Number(item?.probability);
  if (Number.isFinite(rawProbability)) {
    return Math.min(100, Math.max(0, rawProbability * 100));
  }

  return 0;
}

function hasProfileField(value) {
  if (value === null || value === undefined) return false;
  return String(value).trim() !== '';
}

function isProfileComplete(profile) {
  const level = String(profile?.education_level || '').trim();
  if (!level) return false;

  if (level === 'professional') {
    return hasProfileField(profile?.work_experience_years);
  }

  if (level === 'high_school' || level === 'university') {
    return hasProfileField(profile?.current_grade);
  }

  return false;
}

export default function Chat() {
  const { user, token } = useAuth();
  const userId = user?.user_id || null;
  const isLoggedIn = Boolean(token && userId);
  const [userType, setUserType] = useState('high_school');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [apiError, setApiError] = useState('');
  const [profileInitial, setProfileInitial] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [titleDraft, setTitleDraft] = useState('');
  const [menuId, setMenuId] = useState(null);
  const [helloSent, setHelloSent] = useState(false);
  const [chatLocked, setChatLocked] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [suggestionType, setSuggestionType] = useState('question');
  const lastProfileTypeRef = useRef(null);

  const bestCareer = recommendations.length > 0
    ? recommendations[0]
    : null;

  const headerSubtitle = useMemo(() => {
    if (userType === 'university') return 'Sinh viên';
    if (userType === 'professional') return 'Chuyển nghề';
    return 'Học sinh';
  }, [userType]);

  const displayName = useMemo(() => {
    if (user?.username) return String(user.username).trim();
    if (user?.email) return user.email.split('@')[0];
    return 'bạn';
  }, [user]);

  const profileComplete = useMemo(() => isProfileComplete(profileInitial), [profileInitial]);

  useEffect(() => {
    if (user?.user_type) setUserType(user.user_type);
  }, [user]);

  useEffect(() => {
    const hasUserMessage = messages.some((m) => m.sender === 'user' && String(m.text || '').trim());
    setHelloSent(hasUserMessage);
  }, [messages]);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      if (!IS_OFFLINE && (!token || !userId)) {
        setProfileInitial(null);
        return;
      }
      try {
        const profileId = userId || 'guest';
        const json = await api.getProfile(profileId, token);
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
    if (profileComplete && chatLocked) {
      setChatLocked(false);
    }
  }, [profileComplete, chatLocked]);

  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      if (!IS_OFFLINE && (!userId || !token)) {
        setHistory([]);
        setCompleted(false);
        return;
      }
      try {
        setHistoryError('');
        const json = await api.getHistory(userId, token);
        if (!cancelled && json?.data?.length) {
          setHistory(json.data);
          const firstConv = json.data[0].conversation_id;
          setConversationId(firstConv);
          const msgJson = await api.getMessages(firstConv, token);
          const rows = msgJson?.data || [];
          setMessages(rows.map((m) => ({
            id: m.id,
            sender: m.sender,
            text: m.message
          })));
          setCurrentNode(null);
          setSuggestionType('question');
          const recJson = await api.getRecommendations(firstConv, token);
          const recs = normalizeRecommendations(recJson?.data || []);
          setRecommendations(recs);
          setCompleted(recs.length > 0);
        }
      } catch {
        setHistoryError('Không thể tải lịch sử');
        setApiError('Không kết nối được máy chủ. Vui lòng cấu hình API backend.');
      }
    }
    loadHistory();
    return () => { cancelled = true; };
  }, [userId, token]);

  async function refreshHistory() {
    console.log('[FRONTEND DEBUG] refreshHistory called - userId:', userId, 'token:', !!token);
    if (!IS_OFFLINE && (!userId || !token)) {
      console.log('[FRONTEND DEBUG] refreshHistory skipped - no userId or token');
      return;
    }
    const jsonHistory = await api.getHistory(userId, token);
    console.log('[FRONTEND DEBUG] refreshHistory response:', jsonHistory);
    setHistory(jsonHistory?.data || []);
  }

  async function renameConversation(conversationId, title) {
    if (!conversationId) return;
    if (!IS_OFFLINE && !token) return;
    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) return;
    const json = await api.renameConversation(conversationId, cleanTitle, token);
    if (json?.success) {
      setHistory((prev) => prev.map((h) => (
        h.conversation_id === conversationId ? { ...h, title: cleanTitle } : h
      )));
    }
  }

  async function deleteConversation(convId) {
    if (!convId) return;
    if (!IS_OFFLINE && !token) return;
    await api.deleteConversation(convId, token);
    if (conversationId === convId) {
      setMessages([]);
      setRecommendations([]);
      setCurrentNode(null);
      setConversationId(null);
      setCompleted(false);
      setChatLocked(false); // Reset chat lock when deleting conversation
    }
    await refreshHistory();
  }

  async function sendMessage(text, options = {}) {
    if (!text) return;

    if (!IS_OFFLINE && !isLoggedIn) {
      setApiError('Bạn cần đăng nhập để bắt đầu chat và lưu lịch sử/hồ sơ.');
      return;
    }

    setApiError('');
    setMessages(prev => ([
      ...prev,
      { id: `${Date.now()}-u`, sender: 'user', text }
    ]));
    setLoading(true);
    try {
      const body = {
        user_type: userType,
        conversation_id: conversationId,
        message: text,
        current_node: currentNode,
        profile: options.profile || null,
        request_more: options.requestMore || false,
        user_id: userId || null
      };
      console.log('[FRONTEND DEBUG] sendMessage - userType:', userType, 'userId:', userId, 'conversationId:', conversationId);
      const json = await api.sendMessage(body, token);
      if (!json?.success) {
        throw new Error(json?.error || 'Chat request failed');
      }
      const data = json?.data || {};
      console.log('[FRONTEND DEBUG] sendMessage - response data:', data);

      if (data?.user_type && typeof data.user_type === 'string') {
        setUserType(data.user_type);
      }

      const nextSuggestedQuestions = Array.isArray(data.suggested_questions)
        ? data.suggested_questions
        : Array.isArray(data.options)
          ? data.options
          : [];
      setSuggestedQuestions(nextSuggestedQuestions);

      const backendSuggestionType = String(data.suggestion_type || '').toLowerCase();
      const resolvedSuggestionType = backendSuggestionType === 'answer' || backendSuggestionType === 'question'
        ? backendSuggestionType
        : (data.next_node === 'ai_chat' ? 'answer' : 'question');
      setSuggestionType(resolvedSuggestionType);

      const botMessage = { id: `${Date.now()}-b`, sender: 'bot', text: data.bot_reply };
      const applyBotMessage = () => {
        setMessages(prev => ([...prev, botMessage]));
        setLoading(false);
      };

      if (data.conversation_id) {
        const prevId = conversationId;
        setConversationId(data.conversation_id);
        // Always refresh history after every message for logged-in users
        if (token && userId) {
          console.log('[FRONTEND DEBUG] About to refreshHistory after message');
          await refreshHistory();
          console.log('[FRONTEND DEBUG] refreshHistory completed');
        }
      }
      setCurrentNode(data.next_node || null);
      if (data.recommendations) {
        const recs = normalizeRecommendations(data.recommendations);
        setRecommendations(recs);
        // Keep chat usable when profile is already complete.
        setChatLocked(recs.length > 0 && !profileComplete);
      }
      setCompleted(Boolean(data.completed));

      // Bỏ delay 2s để phản hồi nhanh hơn
      applyBotMessage();
    } catch (error) {
      setLoading(false);
      setSuggestedQuestions([]);
      setSuggestionType('question');
      const msg = String(error?.message || '').trim();
      if (msg) {
        setApiError(msg);
      } else {
        setApiError('Không kết nối được máy chủ. Vui lòng cấu hình API backend.');
      }
    }
  }

  async function saveProfile(payload) {
    console.log("Saving profile with payload:", payload);
    if (!IS_OFFLINE && !isLoggedIn) {
      setApiError('Bạn cần đăng nhập để lưu hồ sơ.');
      return;
    }
    const profileId = userId || 'guest';
    try {
      const json = await api.updateProfile(profileId, token, payload);
      if (!json?.success) {
        throw new Error(json?.error || 'Không thể lưu hồ sơ.');
      }
      console.log("Profile updated successfully in API");

      if (payload?.education_level) {
        setUserType(payload.education_level);

        const prevType = lastProfileTypeRef.current;
        const changedType = prevType && prevType !== payload.education_level;

        if (changedType) {
          // Reset conversation context when profile type changed to avoid stale question flow.
          setConversationId(null);
          setMessages([]);
          setCurrentNode(null);
          setRecommendations([]);
          setCompleted(false);
          setSuggestedQuestions([]);
          setSuggestionType('question');
          setChatLocked(false);
        }

        lastProfileTypeRef.current = payload.education_level;
      }

      // Reactively update local state
      const nextProfile = {
        ...payload,
        current_grade: payload?.current_grade ?? null,
        work_experience_years: payload?.work_experience_years ?? null
      };
      setProfileInitial(nextProfile);
      console.log("profileInitial state updated to:", nextProfile);

      if (isProfileComplete(nextProfile)) {
        setChatLocked(false);
      }

      // If clearing profile (education_level is empty), lock chat and clear messages
      if (!payload.education_level) {
        console.log("Clearing chat session due to profile removal");
        setMessages([]);
        setRecommendations([]);
        setCurrentNode(null);
        setCompleted(false);
        setConversationId(null);
      }
    } catch (err) {
      console.error("Error in saveProfile:", err);
      setApiError(String(err?.message || 'Không thể lưu hồ sơ.'));
    }
  }

  async function loadConversation(convId) {
    if (!convId) return;
    if (!IS_OFFLINE && !token) return;
    const json = await api.getMessages(convId, token);
    const rows = json?.data || [];
    setConversationId(convId);
    setMessages(rows.map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.message
    })));
    setSuggestedQuestions([]);
    setSuggestionType('question');
    const recJson = await api.getRecommendations(convId, token);
    const recs = normalizeRecommendations(recJson?.data || []);
    setRecommendations(recs);
    setCompleted(recs.length > 0);
    setChatLocked(recs.length > 0 && !profileComplete);
    setCurrentNode(null);
  }

  async function requestMoreQuestions() {
    setRecommendations([]);
    setCompleted(false);
    setChatLocked(false); // Unlock chat when user wants more questions
    await sendMessage('Mình chưa hài lòng, hãy tiếp tục hỏi thêm nhiều câu để tăng độ chính xác.', { requestMore: true });
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
    setSuggestedQuestions([]);
    setSuggestionType('question');
    setChatLocked(false); // Reset chat lock for new chat
  }

  useEffect(() => {
    const level = String(profileInitial?.education_level || '').trim();
    if (level) {
      lastProfileTypeRef.current = level;
    }
  }, [profileInitial?.education_level]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">Chat tư vấn nghề nghiệp</div>
          <div className="text-sm text-[#5B5B57]">{headerSubtitle}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-outline px-3 py-2 rounded-lg"
            onClick={startNewChat}
          >
            Tạo chat mới
          </button>
        </div>
      </div>
      {apiError && (
        <div className="mb-3 rounded-lg border border-[#F2C5C5] bg-[#FFF5F5] px-3 py-2 text-sm text-[#B91C1C]">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <section className="order-2 lg:order-1">
          <div className="card card-elevated p-4 animate-rise" style={{ animationDelay: '40ms' }}>
            <div className="text-sm font-semibold mb-3">Hồ sơ cá nhân</div>
            <ProfileForm
              key={profileInitial ? 'loaded' : 'empty'}
              onSave={saveProfile}
              onUserTypeChange={setUserType}
              canSave={isLoggedIn || IS_OFFLINE}
              storageKey={userId ? `profileDraft:${userId}` : 'profileDraft:guest'}
              initialValues={profileInitial}
            />
            {!isLoggedIn && !IS_OFFLINE && (
              <div className="text-xs text-[#5B5B57] mt-2">
                Bạn cần đăng nhập để lưu hồ sơ, bắt đầu chat và lưu lịch sử hội thoại.
              </div>
            )}
          </div>
          <div className="mt-4 card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Lịch sử hội đáp</div>
              {(token || (IS_OFFLINE && userId)) && history.length > 0 && (
                <button
                  className="text-xs text-[#D64545]"
                  onClick={async () => {
                    if (!IS_OFFLINE && (!token || !userId)) return;
                    await api.deleteHistory(userId, token);
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

              {/* Login Prompt for Guest Users */}
              {(!token && !userId && IS_OFFLINE) || (!token && !IS_OFFLINE) ? (
                <div className="text-center py-4 bg-[#F7F5F2] rounded-lg">
                  <div className="mb-2">Đăng ký/đăng nhập để bắt đầu chat và lưu lịch sử</div>
                  <Link to="/auth" className="btn-primary inline-block px-3 py-1 rounded">
                    Đăng nhập ngay
                  </Link>
                </div>
              ) : (
                <>
                  {history.length === 0 && <div>Chưa có hội đáp.</div>}
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
                </>
              )}
            </div>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="card card-elevated overflow-hidden animate-rise" style={{ animationDelay: '80ms' }}>
            <ChatWindow
              messages={messages}
              loading={loading}
              onSend={(text) => sendMessage(text, { profile: profileInitial })}
              suggestedQuestions={suggestedQuestions}
              suggestionType={suggestionType}
              showHelloHint={!helloSent}
              showFollowUp={completed && recommendations.length > 0}
              onFollowUp={requestMoreQuestions}
              disabled={!isLoggedIn || !profileComplete || chatLocked}
              placeholder={
                !isLoggedIn
                  ? "Vui lòng đăng nhập để bắt đầu chat..."
                  : !profileComplete
                    ? "Vui lòng điền hồ sơ bên trái để bắt đầu..."
                    : chatLocked
                      ? "Chat đã khóa. Nhấn 'Chưa hài lòng? Hỏi tiếp' để mở lại."
                      : "Nhập tin nhắn..."
              }
            />
          </div>
          <div className="mt-4 card p-4 animate-rise" style={{ animationDelay: '100ms' }}>
            <div className="text-sm font-semibold mb-3">Biểu đồ xác suất nghề nghiệp (Top 10)</div>
            {recommendations.length === 0 && (
              <div className="text-sm text-[#5B5B57]">Chưa có dữ liệu để hiển thị biểu đồ.</div>
            )}
            {recommendations.length > 0 && (
              <div className="space-y-3">
                {recommendations.map((r) => {
                  const percent = resolveRecommendationPercent(r);
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
                {(() => {
                  const percent = resolveRecommendationPercent(bestCareer);
                  return (
                    <>Nghề phù hợp nhất: {bestCareer.career_name} ({percent.toFixed(1)}%)</>
                  );
                })()}
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
                  score={resolveRecommendationPercent(r)}
                  reasons={r.reasons}
                />
              ))}
            </div>
            {recommendations.length > 0 && (
              <div className="text-xs text-[#5B5B57] mt-2">Đang hiển thị {recommendations.length} nghề có xác suất cao nhất.</div>
            )}
          </div>

          <div className="mt-4 card card-soft p-4 animate-rise" style={{ animationDelay: '160ms' }}>
            <div className="text-sm font-semibold mb-2">Admin Editor</div>
            <div className="text-xs text-[#7A6D5B]">Cập nhật kịch bản, nodes, edges</div>
            {user?.user_type === 'admin' ? (
              <Link to="/admin" className="btn-primary mt-3 inline-block px-3 py-2 rounded-lg">
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
