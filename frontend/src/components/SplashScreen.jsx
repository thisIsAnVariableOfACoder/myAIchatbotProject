export default function SplashScreen({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--c-bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-24 w-24 rounded-[28px] bg-[var(--c-surface)] border border-[#E8E2D8] grid place-content-center logo-pulse shadow-lg">
          <img src="/icon.svg" alt="Career Guidance" className="h-16 w-16" />
        </div>
        <div className="text-2xl font-semibold">Career Guidance</div>
        <div className="text-sm text-[#5B5B57]">Đang khởi động...</div>
        <button className="mt-2 text-xs text-[#5B5B57] underline" onClick={onClose}>
          Bỏ qua
        </button>
      </div>
    </div>
  );
}
