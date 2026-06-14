import Image from 'next/image';

interface GradientHeroProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  bgImage?: string;
}

export function GradientHero({ children, className = '', minHeight = 'min-h-[480px]', bgImage }: GradientHeroProps) {
  return (
    <section
      className={`relative w-full gradient-premium flex items-center justify-center overflow-hidden ${minHeight} ${className}`}
    >
      {bgImage && (
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover z-0"
          priority
        />
      )}
      <div
        className={`absolute inset-0 ${bgImage ? 'bg-navy/60 opacity-80' : 'bg-black/10'}`}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
