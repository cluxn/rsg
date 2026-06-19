'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Animated count-up ── */
function parseValue(raw: string): { num: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: raw };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

function CountUp({ value }: { value: string }) {
  const { num, suffix } = parseValue(value);
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1800;
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

  return <span ref={elRef}>{count.toLocaleString()}{suffix}</span>;
}

/* ── 3-D style SVG icons ── */

const CartCheckIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    {/* cart body shadow/depth */}
    <path d="M10 16h4l5 18h22l4-14H17" stroke="#c2410c" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    {/* cart body */}
    <path d="M8 14h5l5.5 20H40l4.5-15H18" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* wheels */}
    <circle cx="22" cy="38" r="3" stroke="#ea580c" strokeWidth="2" fill="#fed7aa" />
    <circle cx="38" cy="38" r="3" stroke="#ea580c" strokeWidth="2" fill="#fed7aa" />
    {/* handle */}
    <path d="M8 14H5" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" />
    {/* checkmark badge */}
    <circle cx="42" cy="16" r="8" fill="#f97316" />
    <circle cx="42" cy="16" r="8" fill="url(#cg)" />
    <path d="M38.5 16l2.5 2.5 4-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* 3d shelf lines on cart */}
    <path d="M20 25h18M21 29h16" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    <defs>
      <linearGradient id="cg" x1="34" y1="8" x2="50" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb923c" />
        <stop offset="1" stopColor="#c2410c" />
      </linearGradient>
    </defs>
  </svg>
);

const StarReviewIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    {/* back bubble (depth) */}
    <rect x="18" y="10" width="26" height="18" rx="5" fill="#fed7aa" opacity="0.5" />
    {/* main chat bubble */}
    <rect x="8" y="8" width="34" height="22" rx="6" fill="url(#bg1)" stroke="#ea580c" strokeWidth="1.5" />
    {/* bubble tail */}
    <path d="M14 30l-4 6 8-3" fill="#ea580c" opacity="0.8" />
    {/* dots */}
    <circle cx="19" cy="19" r="2.5" fill="#ea580c" />
    <circle cx="28" cy="19" r="2.5" fill="#ea580c" />
    <circle cx="37" cy="19" r="2.5" fill="#ea580c" />
    {/* stars row */}
    {[10, 18, 26, 34, 42].map((x, i) => (
      <path key={i} d={`M${x} 41 l1.5-3 1.5 3h3.2l-2.6 2 1 3.2-3.1-2-3.1 2 1-3.2-2.6-2z`}
        fill={i < 4 ? '#f97316' : '#fed7aa'} stroke="#ea580c" strokeWidth="0.4" />
    ))}
    <defs>
      <linearGradient id="bg1" x1="8" y1="8" x2="42" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff7ed" />
        <stop offset="1" stopColor="#fed7aa" />
      </linearGradient>
    </defs>
  </svg>
);

const PanUpShippingIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    {/* globe shadow */}
    <circle cx="24" cy="24" r="15" fill="#fed7aa" opacity="0.4" />
    {/* globe */}
    <circle cx="24" cy="24" r="14" stroke="#ea580c" strokeWidth="2" fill="url(#gg)" />
    {/* latitude lines */}
    <ellipse cx="24" cy="24" rx="7" ry="14" stroke="#ea580c" strokeWidth="1.5" opacity="0.6" />
    <path d="M10 24h28M12 17h24M12 31h24" stroke="#ea580c" strokeWidth="1.2" opacity="0.5" />
    {/* location pin */}
    <circle cx="38" cy="14" r="5" fill="url(#pg)" stroke="#c2410c" strokeWidth="1" />
    <path d="M38 19v4" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="38" cy="14" r="2" fill="white" opacity="0.8" />
    {/* package bottom-right */}
    <rect x="34" y="36" width="14" height="12" rx="2" fill="url(#bx)" stroke="#ea580c" strokeWidth="1.5" />
    <path d="M34 40h14M41 36v12" stroke="#ea580c" strokeWidth="1.2" />
    <defs>
      <linearGradient id="gg" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff7ed" />
        <stop offset="1" stopColor="#fed7aa" />
      </linearGradient>
      <linearGradient id="pg" x1="33" y1="9" x2="43" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb923c" />
        <stop offset="1" stopColor="#c2410c" />
      </linearGradient>
      <linearGradient id="bx" x1="34" y1="36" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff7ed" />
        <stop offset="1" stopColor="#fdba74" />
      </linearGradient>
    </defs>
  </svg>
);

const HeadsetSupportIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    {/* person head */}
    <circle cx="28" cy="14" r="8" fill="url(#hg)" stroke="#ea580c" strokeWidth="1.5" />
    {/* shoulders */}
    <path d="M14 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
    {/* headset arc */}
    <path d="M16 26a12 12 0 0124 0" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* left ear cup */}
    <rect x="12" y="26" width="6" height="10" rx="3" fill="url(#eg)" stroke="#c2410c" strokeWidth="1.2" />
    {/* right ear cup */}
    <rect x="38" y="26" width="6" height="10" rx="3" fill="url(#eg)" stroke="#c2410c" strokeWidth="1.2" />
    {/* mic arm */}
    <path d="M44 34 q4 2 2 8" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="46" cy="42" r="2" fill="#f97316" />
    <defs>
      <linearGradient id="hg" x1="20" y1="6" x2="36" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff7ed" />
        <stop offset="1" stopColor="#fdba74" />
      </linearGradient>
      <linearGradient id="eg" x1="12" y1="26" x2="18" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb923c" />
        <stop offset="1" stopColor="#c2410c" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Stat card ── */
interface StatCardProps {
  icon: React.ReactNode;
  topLine: React.ReactNode;
  bottomLine: React.ReactNode;
  animate?: string;
}

function StatCard({ icon, topLine, bottomLine }: StatCardProps) {
  return (
    <div className="flex items-center gap-5">
      {/* cream circle icon badge */}
      <div className="w-20 h-20 rounded-full bg-[#fef3e2] border-2 border-orange-200/60 flex items-center justify-center flex-shrink-0 shadow-lg">
        {icon}
      </div>
      {/* text block */}
      <div className="min-w-0">
        <p className="font-heading text-lg font-bold text-white leading-snug">{topLine}</p>
        <hr className="border-white/20 my-2" />
        <p className="font-heading text-base font-bold text-white/85 leading-snug">{bottomLine}</p>
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="gradient-power py-10 border-b border-white/5">
      <div className="mx-auto max-w-container px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">

          {/* 1 — Orders */}
          <div className="flex justify-center lg:px-6">
            <StatCard
              icon={<CartCheckIcon />}
              topLine={<CountUp value="50000+" />}
              bottomLine="Orders Delivered"
            />
          </div>

          {/* 2 — Clients */}
          <div className="flex justify-center lg:px-6">
            <StatCard
              icon={<StarReviewIcon />}
              topLine={<><CountUp value="525+" /> Clients</>}
              bottomLine={<>Avg. Rating 4.9+&nbsp;⭐</>}
            />
          </div>

          {/* 3 — PAN UP Shipping */}
          <div className="flex justify-center lg:px-6">
            <StatCard
              icon={<PanUpShippingIcon />}
              topLine="PAN UP Shipping"
              bottomLine="Wholesale Price"
            />
          </div>

          {/* 4 — Support */}
          <div className="flex justify-center lg:px-6">
            <StatCard
              icon={<HeadsetSupportIcon />}
              topLine="Need Help?"
              bottomLine="Call +91-9918522988"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
