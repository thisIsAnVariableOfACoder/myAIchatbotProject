// FILE: frontend/src/components/ChatWindow.jsx
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, onSend, loading, showHelloHint = true, showFollowUp = false, onFollowUp }) {
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(raf);
  }, [messages, loading]);

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const text = input.trim();
    if (!text) return;
    setInput('');
    onSend(text);
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[520px] flex-col lg:h-[70vh]">
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {showHelloHint && (
          <div className="rounded-xl bg-[#F7F5F2] border border-[#E8E2D8] p-3 text-sm text-[#5B5B57]">
            Hãy trả lời từng câu hỏi để nhận gợi ý nghề nghiệp. Nhập "hello" để bắt đầu cuộc trò chuyện.
          </div>
        )}
        {showHelloHint && messages.length === 0 && (
          <div className="text-sm text-[#5B5B57]">Nhập "hello" để bắt đầu cuộc trò chuyện.</div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {showFollowUp && (
          <div className="flex">
            <button
              className="rounded-xl border border-[#E2D8C8] bg-white px-3 py-2 text-xs hover:border-[var(--c-accent)] transition"
              onClick={onFollowUp}
            >
              Chưa hài lòng? Hỏi tiếp
            </button>
          </div>
        )}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#5B5B57]">
            <span>...</span>
            <span className="typing-dots">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-[#E8E2D8] p-3">
        {showHelloHint && (
          <div className="mb-2 text-xs text-[#5B5B57]">Nhập "hello" để bắt đầu cuộc trò chuyện.</div>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <label className="sr-only" htmlFor="chat-input">Nhập tin nhắn</label>
          <div className="flex gap-2">
            <input
              id="chat-input"
              aria-label="Nhập tin nhắn cho chatbot"
              className="flex-1 rounded-xl border border-[#E2D8C8] px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.35)] focus:scale-[1.01]"
              placeholder="Nhập câu trả lời của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={loading}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[var(--c-primary)] text-white hover:opacity-90 transition"
              disabled={loading}
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
