interface GradientHeroProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export function GradientHero({ children, className = '', minHeight = 'min-h-[480px]' }: GradientHeroProps) {
  return (
    <section
      className={`relative w-full gradient-premium flex items-center justify-center overflow-hidden ${minHeight} ${className}`}
    >
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
