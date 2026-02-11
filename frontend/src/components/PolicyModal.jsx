import { useEffect } from 'react';

/**
 * PolicyModal Component
 * Displays privacy policy, terms of service, or cookie policy in a modal overlay
 */
export default function PolicyModal({ isOpen, onClose, title, content }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-[var(--c-bg)] rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--c-border)]">
          <h2 className="text-xl font-bold text-[var(--c-text)]">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface)] hover:bg-[var(--c-hover)] text-[var(--c-text)] transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 prose prose-sm max-w-none text-[var(--c-text)]">
          {content}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--c-border)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[var(--c-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}