interface SimpleHeroProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export function SimpleHero({ children, className = '', minHeight = 'min-h-[360px]' }: SimpleHeroProps) {
  return (
    <section className={`bg-navy w-full flex items-center justify-center ${minHeight} ${className}`}>
      <div className="w-full py-16 text-center">
        {children}
      </div>
    </section>
  );
}
