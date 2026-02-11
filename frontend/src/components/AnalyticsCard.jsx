export default function AnalyticsCard({ title, value, subtitle }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-[#5B5B57]">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {subtitle && <div className="text-xs text-[#7A6D5B] mt-1">{subtitle}</div>}
    </div>
  );
}
