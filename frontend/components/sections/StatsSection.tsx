'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: string;
  label: string;
}

function parseValue(raw: string): { num: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: '' };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

function CountUp({ value, label }: Stat) {
  const { num, suffix } = parseValue(value);
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(eased * num));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num]);

  return (
    <div ref={elRef} className="flex flex-col items-center text-center">
      <p className="font-heading text-5xl lg:text-6xl font-bold text-gradient-sunrise tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="font-body text-sm text-ink/60 mt-2">{label}</p>
    </div>
  );
}

const STATS: Stat[] = [
  { value: '20000+', label: 'Sheets Made' },
  { value: '525+',   label: 'Satisfied Clients' },
  { value: '20',     label: 'Experienced Staff' },
  { value: '10',     label: 'Products' },
];

export function StatsSection() {
  return (
    <section className="bg-white text-ink py-10 border-b border-navy/5">
      <div className="mx-auto max-w-container px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative">
              {i > 0 && (
                <div
                  className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-navy/10"
                  aria-hidden="true"
                />
              )}
              <CountUp value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
