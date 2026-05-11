interface StatsCardProps {
  label: string;
  value: string;
  subLabel?: string;
}

export default function StatsCard({ label, value, subLabel }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-brand-primary">{value}</p>
      {subLabel && <p className="text-xs text-gray-400 mt-1">{subLabel}</p>}
    </div>
  );
}
