import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({
  messages,
  onSend,
  loading,
  showHelloHint = true,
  showFollowUp = false,
  onFollowUp,
  disabled = false,
  placeholder = "Nhập tin nhắn..."
}) {
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
          <div className="card card-soft p-3 text-sm text-[#5B5B57]">
            Bạn có thể nhập "hello" hoặc bất kỳ tin nhắn nào để bắt đầu. Mình sẽ chủ động hỏi một vài câu ngắn gọn để tư vấn nghề nghiệp phù hợp nhất với bạn.
          </div>
        )}
        {showHelloHint && messages.length === 0 && (
          <div className="text-sm text-[#5B5B57]">Nhập "hello" hoặc gửi tin nhắn đầu tiên để bắt đầu tư vấn.</div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {showFollowUp && (
          <div className="flex">
            <button
              className="btn-outline rounded-xl px-3 py-2 text-xs"
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

      <div className="border-t border-[#E8E2D8] p-3 relative">
        {disabled && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center p-4 text-center backdrop-blur-sm">
            <div className="text-sm font-medium text-[var(--c-primary)] shadow-sm bg-white border border-[#E2D8C8] px-4 py-2 rounded-lg">
              {placeholder}
            </div>
          </div>
        )}

        {showHelloHint && (
          <div className="mb-2 text-xs text-[#5B5B57]">Gợi ý: bắt đầu bằng 1-2 câu về mục tiêu/điểm mạnh của bạn (hoặc chỉ cần nhập "hello").</div>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <label className="sr-only" htmlFor="chat-input">Nhập tin nhắn</label>
          <div className="flex gap-2">
            <input
              id="chat-input"
              aria-label="Nhập tin nhắn cho chatbot"
              className="input-elevated flex-1 px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:scale-[1.01] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af] disabled:cursor-not-allowed"
              placeholder={disabled ? "" : placeholder}
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
              disabled={loading || disabled}
            />
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || disabled}
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
