'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

interface Scenario {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  bgImage: string;
  fgImage: string;
  fgAlt: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'dream-home',
    number: '01',
    eyebrow: 'Manufacturer & Wholesaler · Roofing Sheets',
    title: "Build the Home You've Always Imagined",
    body: 'ISI-certified colour-coated roofing sheets supplied wholesale direct from our Kanpur factory — trade pricing for contractors, builders and bulk buyers across UP.',
    bgImage: '/images/hero/dream-home-bg.webp',
    fgImage: '/images/hero/dream-home-fg.webp',
    fgAlt: 'Couple admiring their newly built home',
  },
  {
    id: 'protection',
    number: '02',
    eyebrow: 'Bulk Trader · Roofing Accessories',
    title: 'Built to Shelter What Matters Most',
    body: 'Monsoon-grade, corrosion-resistant roofing and accessories — available in bulk for distributors, project contractors and wholesale traders at competitive factory rates.',
    bgImage: '/images/hero/protection-bg.webp',
    fgImage: '/images/hero/protection-fg.webp',
    fgAlt: 'Happy family feeling safe at home',
  },
  {
    id: 'industrial',
    number: '03',
    eyebrow: 'Industrial Supply · Structural Steel',
    title: "Powering India's Industrial Backbone",
    body: 'Purlins, MS pipes, decking sheets and structural steel — wholesale supply for industrial contractors and large-scale commercial builders running projects across Uttar Pradesh.',
    bgImage: '/images/hero/industrial-bg.webp',
    fgImage: '/images/hero/industrial-fg.webp',
    fgAlt: 'Confident business owner in front of a warehouse',
  },
];

const PANEL_BG_OVERLAY =
  'radial-gradient(ellipse 70% 65% at 50% 42%, rgba(8,20,38,0.8) 0%, rgba(8,20,38,0.4) 55%, rgba(8,20,38,0.12) 100%), ' +
  'linear-gradient(to top, rgba(8,20,38,0.85) 0%, rgba(8,20,38,0) 40%), ' +
  'linear-gradient(to bottom, rgba(8,20,38,0.5) 0%, rgba(8,20,38,0) 25%)';

const AUTOPLAY_DELAY = 6000;

export function ScrollHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bgRefs = useRef<Array<HTMLDivElement | null>>([]);
  const fgRefs = useRef<Array<HTMLDivElement | null>>([]);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const goToRef = useRef<(next: number, dir: 1 | -1) => void>(() => {});
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const indexRef = { current: 0 };
    const animatingRef = { current: false };
    const idleTweens: Array<gsap.core.Tween | undefined> = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.set(panelRefs.current, { opacity: 0, zIndex: 0, pointerEvents: 'none' });
    gsap.set(panelRefs.current[0], { opacity: 1, zIndex: 20, pointerEvents: 'auto' });

    function startIdle(i: number) {
      const fg = fgRefs.current[i];
      if (reduceMotion) return;
      if (fg) idleTweens[i] = gsap.to(fg, { y: '+=16', duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    function stopIdle(i: number) {
      idleTweens[i]?.kill();
    }

    function goTo(next: number, dir: 1 | -1) {
      if (animatingRef.current || next === indexRef.current || next < 0 || next > SCENARIOS.length - 1) return;
      const from = indexRef.current;
      animatingRef.current = true;
      indexRef.current = next;
      setActiveIndex(next);
      stopIdle(from);
      stopIdle(next);
      scheduleAutoplay();

      const fromPanel = panelRefs.current[from];
      const fromBg = bgRefs.current[from];
      const fromFg = fgRefs.current[from];
      const fromContent = contentRefs.current[from];
      const toPanel = panelRefs.current[next];
      const toBg = bgRefs.current[next];
      const toFg = fgRefs.current[next];
      const toContent = contentRefs.current[next];

      if (reduceMotion) {
        gsap.set(fromPanel, { opacity: 0, zIndex: 0, pointerEvents: 'none' });
        gsap.set(toPanel, { opacity: 1, zIndex: 20, pointerEvents: 'auto' });
        animatingRef.current = false;
        return;
      }

      gsap.set(toPanel, { opacity: 1, zIndex: 20, pointerEvents: 'auto' });
      gsap.set(toBg, { opacity: 0 });
      gsap.set(toFg, { xPercent: -dir * 18, rotateY: -dir * 20, z: -200, scale: 0.82, opacity: 0 });
      gsap.set(Array.from(toContent?.children ?? []), { y: 36, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          gsap.set(fromPanel, { opacity: 0, zIndex: 0, pointerEvents: 'none' });
          startIdle(next);
          animatingRef.current = false;
        },
      });

      tl.to(fromBg, { opacity: 0, duration: 1 }, 0);
      tl.to(fromFg, { xPercent: dir * 18, rotateY: dir * 20, z: -200, scale: 0.82, opacity: 0, duration: 0.9 }, 0);
      tl.to(Array.from(fromContent?.children ?? []), { y: -36, opacity: 0, duration: 0.45, stagger: 0.04 }, 0);

      tl.to(toBg, { opacity: 1, duration: 1.15 }, 0.05);
      tl.to(toFg, { xPercent: 0, rotateY: 0, z: 0, scale: 1, opacity: 1, duration: 1, ease: 'power4.out' }, 0.1);
      tl.to(Array.from(toContent?.children ?? []), { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.35);
    }

    goToRef.current = goTo;
    startIdle(0);

    let autoplayTimer: ReturnType<typeof setTimeout> | undefined;
    function scheduleAutoplay() {
      if (reduceMotion) return;
      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(() => {
        const next = (indexRef.current + 1) % SCENARIOS.length;
        goTo(next, 1);
        scheduleAutoplay();
      }, AUTOPLAY_DELAY);
    }
    scheduleAutoplay();

    function isPinned() {
      return window.scrollY <= 0;
    }

    function onWheel(e: WheelEvent) {
      if (!isPinned()) return;
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const next = indexRef.current + dir;
      if (next < 0 || next > SCENARIOS.length - 1) return;
      e.preventDefault();
      goTo(next, dir);
    }

    function onKeydown(e: KeyboardEvent) {
      if (!isPinned()) return;
      let dir: 1 | -1;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') dir = 1;
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') dir = -1;
      else return;
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }
      const next = indexRef.current + dir;
      if (next < 0 || next > SCENARIOS.length - 1) return;
      e.preventDefault();
      goTo(next, dir);
    }

    let touchStartY: number | null = null;

    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      if (!isPinned() || touchStartY === null) return;
      const delta = touchStartY - e.touches[0].clientY;
      if (Math.abs(delta) < 40) return;
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      const next = indexRef.current + dir;
      if (next < 0 || next > SCENARIOS.length - 1) {
        touchStartY = null;
        return;
      }
      e.preventDefault();
      touchStartY = null;
      goTo(next, dir);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      clearTimeout(autoplayTimer);
      idleTweens.forEach(t => t?.kill());
    };
  }, []);

  function handleDotClick(i: number) {
    if (i === activeIndex) return;
    goToRef.current(i, i > activeIndex ? 1 : -1);
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-navy"
      style={{ perspective: '1800px' }}
      aria-roledescription="carousel"
      aria-label="Featured product scenarios"
    >
      {SCENARIOS.map((s, i) => (
        <div
          key={s.id}
          ref={el => { panelRefs.current[i] = el; }}
          className="absolute inset-0"
          aria-hidden={activeIndex !== i}
        >
          {/* Background layer */}
          <div ref={el => { bgRefs.current[i] = el; }} className="absolute inset-0 will-change-transform">
            <Image
              src={s.bgImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
            <div className="absolute inset-0" style={{ background: PANEL_BG_OVERLAY }} aria-hidden="true" />
          </div>

          {/* Foreground cutout layer — bottom-left corner, as if looking at the scenario */}
          <div
            ref={el => { fgRefs.current[i] = el; }}
            className="absolute bottom-0 left-0 w-[64%] sm:w-[48%] lg:w-[40%] h-[58%] sm:h-[64%] opacity-50 sm:opacity-100 will-change-transform"
          >
            <Image
              src={s.fgImage}
              alt={s.fgAlt}
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              sizes="(min-width: 1024px) 40vw, 64vw"
              priority={i === 0}
            />
          </div>

          {/* Content */}
          <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6">
          <div
            ref={el => { contentRefs.current[i] = el; }}
            className="glass-panel rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center px-6 sm:px-10 lg:px-14 py-10 w-full max-w-2xl h-[600px] sm:h-[580px] lg:h-[600px] xl:h-[680px]"
          >
            <div className="flex items-center justify-center gap-3 mb-4 lg:mb-6">
              <span className="font-heading text-orange text-sm font-bold tracking-[0.2em]">{s.number}</span>
              <span className="h-px w-10 bg-orange/60" aria-hidden="true" />
              <span className="font-body text-white/70 text-xs sm:text-sm uppercase tracking-[0.2em]">{s.eyebrow}</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-[1.05]">
              {s.title}
            </h1>
            <p className="font-body text-white/80 text-base sm:text-lg max-w-md mt-4 lg:mt-6">
              {s.body}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6 lg:mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange gradient-sunrise text-white shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 border border-transparent px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg"
              >
                Get Free Quote
              </Link>
            </div>
            {/* Trust pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-5 lg:mt-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 font-body text-white/85 text-xs sm:text-sm backdrop-blur-sm">
                <svg className="w-3.5 h-3.5 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Kanpur Manufacturer · Est. 2019
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 font-body text-white/85 text-xs sm:text-sm backdrop-blur-sm">
                <svg className="w-3.5 h-3.5 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                ISI Certified · Wholesale &amp; Bulk Supply
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 font-body text-white/85 text-xs sm:text-sm backdrop-blur-sm">
                <svg className="w-3.5 h-3.5 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Pan-UP Delivery · Trade &amp; Project Orders
              </span>
            </div>
          </div>
          </div>
        </div>
      ))}

      {/* Progress dots */}
      <div className="absolute right-3 sm:right-5 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 sm:gap-4">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleDotClick(i)}
            aria-label={`Show scenario ${s.number}: ${s.eyebrow}`}
            aria-current={activeIndex === i}
            className="group flex items-center justify-end gap-2 py-1 focus-visible:outline-none"
          >
            <span
              className={`font-heading text-xs tracking-widest transition-colors ${
                activeIndex === i ? 'text-orange' : 'text-white/40 group-hover:text-white/70'
              }`}
            >
              {s.number}
            </span>
            <span
              className={`block h-px transition-all duration-300 ${
                activeIndex === i ? 'w-8 bg-orange' : 'w-4 bg-white/40 group-hover:bg-white/70'
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <div
        className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 bottom-10 z-40 flex-col items-center gap-2 transition-opacity duration-500 ${
          activeIndex === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      >
        <span className="font-body text-white/60 text-xs uppercase tracking-[0.2em]">Scroll</span>
        <svg className="w-4 h-4 text-white/60 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
