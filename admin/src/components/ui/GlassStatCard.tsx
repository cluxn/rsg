interface GlassStatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

export function GlassStatCard({ label, value, icon }: GlassStatCardProps) {
  return (
    <div
      className="gradient-premium rounded-2xl p-6 glass-panel"
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-white/70">{icon}</div>
      </div>
      <p className="font-heading text-4xl text-white font-bold">{value}</p>
      <p className="font-body text-sm text-white/70 mt-1">{label}</p>
    </div>
  );
}
