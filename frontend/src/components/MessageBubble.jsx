// FILE: frontend/src/components/MessageBubble.jsx
import { renderChatHtml } from '../sanitizeHtml';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  const rawText = message?.text ?? '';
  const displayText = typeof rawText === 'string' ? rawText : String(rawText ?? '');
  const sanitizedHtml = isUser ? '' : renderChatHtml(rawText);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} bubble-in ${isUser ? 'bubble-in-user' : 'bubble-in-bot'}`}>
      <div
        className={[
          'chat-bubble max-w-[80%] text-sm transition-transform',
          isUser ? 'chat-bubble-user' : 'chat-bubble-bot'
        ].join(' ')}
        role="article"
        aria-label={isUser ? 'User message' : 'Bot message'}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{displayText}</span>
        ) : (
          <div className="chat-rich" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        )}
      </div>
    </div>
  );
}
