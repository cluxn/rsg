interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export function GlassCard({ children, className = '', padding = 'p-6' }: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-xl shadow-lg ${padding} ${className}`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
