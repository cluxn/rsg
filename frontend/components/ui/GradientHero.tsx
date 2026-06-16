'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface GradientHeroProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  bgImage?: string;
}

export function GradientHero({
  children,
  className = '',
  minHeight = 'min-h-[480px]',
  bgImage,
}: GradientHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;
    const rect = section.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glow.style.background = `radial-gradient(700px circle at ${x}% ${y}%, rgba(255,85,0,0.18) 0%, rgba(255,179,65,0.06) 45%, transparent 70%)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (glowRef.current) {
      glowRef.current.style.background =
        'radial-gradient(700px circle at 50% 50%, rgba(255,85,0,0.08) 0%, transparent 70%)';
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full gradient-premium flex items-center justify-center overflow-hidden ${minHeight} ${className}`}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(126,200,227,0.12) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(126,200,227,0.12) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '52px 52px',
        }}
        aria-hidden="true"
      />

      {/* Ambient gradient orbs — always visible, no interaction needed */}
      <div
        className="absolute -top-24 right-1/4 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,85,0,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 left-1/4 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,144,201,0.18) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Corner bracket marks — industrial / blueprint aesthetic */}
      <span className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-orange/25 pointer-events-none" aria-hidden="true" />
      <span className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-orange/25 pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-orange/25 pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-orange/25 pointer-events-none" aria-hidden="true" />

      {/* Optional background image */}
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill className="object-cover z-0" priority />
          <div className="absolute inset-0 bg-navy/65" aria-hidden="true" />
        </>
      )}

      {/* Cursor-follow spotlight */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(700px circle at 50% 50%, rgba(255,85,0,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Content — always centered */}
      <div className="relative z-10 w-full py-16 text-center">
        {children}
      </div>
    </section>
  );
}
