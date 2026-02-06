// FILE: frontend/src/components/MessageBubble.jsx
export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} bubble-in ${isUser ? 'bubble-in-user' : 'bubble-in-bot'}`}>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm transition-transform',
          isUser ? 'bg-[var(--c-primary)] text-white' : 'bg-white border border-[#E8E2D8] text-[var(--c-text)]'
        ].join(' ')}
        role="article"
        aria-label={isUser ? 'User message' : 'Bot message'}
      >
        {message.text}
      </div>
    </div>
  );
}
