interface GlassStatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

export function GlassStatCard({ label, value, icon }: GlassStatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-navy/50">{icon}</div>
      </div>
      <p className="font-heading text-4xl text-navy font-bold">{value}</p>
      <p className="font-body text-sm text-navy/50 mt-1">{label}</p>
    </div>
  );
}
