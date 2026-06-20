'use client';

import { useEffect, useRef, useState } from 'react';

const INCOMING_CHECKS = [
  'Raw material verified',
  'Thickness & coating checked',
  'Salt-spray tested',
  'Packed for dispatch',
];

const PRODUCTION_STAGES = [
  'Raw material check',
  'Rolling & forming',
  'Coating inspection',
  'Dispatch cleared',
];

const FEATURES = [
  { title: 'Material traceability',  desc: 'Every coil logged batch to batch'    },
  { title: 'Thickness verification', desc: 'Micrometer-checked, every sheet'     },
  { title: 'Salt-spray tested',      desc: '1,000+ hr corrosion resistance'      },
];

const DISPATCH_TICKER = [
  'Order #RSG-2291 dispatched to Lucknow',
  'Batch #114 cleared QC inspection',
  'Order #RSG-2287 loaded for Kanpur route',
  'Order #RSG-2279 dispatched to Varanasi',
  'Order #RSG-2266 delivered, Agra',
];

const CheckIcon = ({ color = '#fff' }: { color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 9, height: 9 }}>
    <polyline points="4 12 9 17 20 6" />
  </svg>
);

function useCycler(length: number, intervalMs: number, initial = 0) {
  const [step, setStep] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % length), intervalMs);
    return () => clearInterval(t);
  }, [length, intervalMs]);
  return step;
}

function ChecklistCard({ icon, title, sub, items, step }: { icon: React.ReactNode; title: string; sub: string; items: string[]; step: number }) {
  return (
    <div className="cap-card">
      <div className="cap-accent" />
      <div className="cap-icon">{icon}</div>
      <h3 className="font-heading font-bold text-ink mb-1.5 text-[15px]">{title}</h3>
      <p className="font-body text-ink/55 mb-3 text-[12px] leading-snug">{sub}</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((label, i) => {
          const isDone = i < step % (items.length + 1);
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: isDone ? '#0f1f3d' : '#8088a0', padding: '6px 8px', borderRadius: 8, background: isDone ? '#fff1e6' : '#f6f7f9', transition: 'background .4s ease, color .4s ease' }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                background: isDone ? 'linear-gradient(135deg,#fb923c,#ea580c)' : 'transparent',
                border: `2px solid ${isDone ? '#ea580c' : '#d7dbe2'}`,
                transition: 'all .35s ease',
              }}>
                {isDone && <CheckIcon />}
              </span>
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CapabilitySection() {
  const clStep    = useCycler(INCOMING_CHECKS.length + 1, 1700, 2);
  const plStep    = useCycler(PRODUCTION_STAGES.length + 1, 1900, 3);
  const tickerIdx = useCycler(DISPATCH_TICKER.length, 2800);
  const [featureIn, setFeatureIn] = useState(false);
  const featureRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = featureRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setFeatureIn(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .cap-grid {
          display:grid; grid-template-columns:repeat(5,1fr); gap:18px;
        }
        @media (max-width:1100px){ .cap-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:560px){ .cap-grid { grid-template-columns:1fr; } }
        .cap-card {
          background:#fff; border:1px solid rgba(15,31,61,.08);
          border-radius:16px; padding:20px 18px 18px;
          box-shadow:0 1px 2px rgba(15,31,61,.04),0 10px 24px -14px rgba(15,31,61,.18);
          display:flex; flex-direction:column; position:relative;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .cap-card:hover { transform:translateY(-5px); box-shadow:0 4px 10px rgba(15,31,61,.06),0 22px 36px -16px rgba(15,31,61,.24); }
        .cap-accent {
          position:absolute; top:0; left:18px; right:18px; height:3px; border-radius:0 0 3px 3px;
          background:linear-gradient(90deg,#fb923c,#ea580c);
        }
        .cap-card-dark .cap-accent { background:linear-gradient(90deg,#ff9d54,#fb923c); }
        .cap-icon {
          width:38px; height:38px; border-radius:11px;
          background:linear-gradient(135deg,#fb923c,#ea580c);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:12px; color:#fff;
          box-shadow:0 6px 14px -4px rgba(234,88,12,.45);
        }
        .cap-icon svg { width:19px; height:19px; }
        .cap-card-dark { background:#0f1f3d; border-color:rgba(255,255,255,.08); }
        .cap-card-dark .cap-icon { background:linear-gradient(135deg,#ff9d54,#fb923c); box-shadow:0 6px 14px -4px rgba(251,146,60,.4); }
        @keyframes capDash{ to{ stroke-dashoffset:-22; } }
        .cap-net-line { stroke:#f0b489; stroke-width:1.6; fill:none; stroke-dasharray:5 6; animation:capDash 2.6s linear infinite; }
        @keyframes capTickerIn{ from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
        .cap-ticker-line { animation:capTickerIn .4s ease both; }
        @keyframes capDotPulse{ 0%,100%{opacity:1} 50%{opacity:.35} }
        .cap-dot-pulse { animation:capDotPulse 1.6s ease-in-out infinite; }
        @media(prefers-reduced-motion:reduce){ .cap-net-line,.cap-ticker-line,.cap-dot-pulse { animation:none!important; } .cap-card:hover{ transform:none; } }
      `}</style>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">

          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">How We Operate</p>
            <h2 className="font-heading text-3xl font-bold text-ink mb-3">Built for Bulk. Backed by Process.</h2>
            <p className="font-body text-ink/60 max-w-xl mx-auto">
              From raw coil to dispatched truck — every batch is checked, logged, and delivered Pan-UP from our Kanpur facility.
            </p>
          </div>

          <div className="cap-grid">

            {/* Card 1 — incoming QC checklist */}
            <ChecklistCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-3.5-7-9V5l7-3 7 3v7c0 5.5-7 9-7 9z" /><polyline points="9 12 11 14 15 9.5" />
                </svg>
              }
              title="Quality-checked by design"
              sub="Every coil tested & inspected before it leaves the line."
              items={INCOMING_CHECKS}
              step={clStep}
            />

            {/* Card 2 — quality first */}
            <div className="cap-card">
              <div className="cap-accent" />
              <div className="cap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" /><path d="M9 13.5 7 22l5-3 5 3-2-8.5" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[15px]">Quality first</h3>
              <p className="font-body text-ink/55 mb-3 text-[12px] leading-snug">ISI-certified material, batch-logged production.</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {['ISI', 'BIS', 'IS 14246'].map(b => (
                  <span key={b} style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.03em', color: '#ea580c', background: '#fff1e6', border: '1px solid #ffd9b8', padding: '4px 9px', borderRadius: 999 }}>{b}</span>
                ))}
              </div>
              <ul ref={featureRef} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {FEATURES.map((f, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 8, alignItems: 'flex-start',
                    background: '#f6f7f9', borderRadius: 8, padding: '7px 9px',
                    opacity: featureIn ? 1 : 0, transform: featureIn ? 'none' : 'translateY(8px)',
                    transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`,
                  }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: 'linear-gradient(135deg,#fb923c,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckIcon />
                    </span>
                    <div>
                      <b style={{ display: 'block', fontSize: 12, color: '#0f1f3d', fontWeight: 700 }}>{f.title}</b>
                      <span style={{ fontSize: 11, color: '#4a5670' }}>{f.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3 — Pan-UP delivery stats (hero card — dark, high-contrast) */}
            <div className="cap-card cap-card-dark">
              <div className="cap-accent" />
              <div className="cap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="7" width="13" height="10" /><path d="M14 10h4l3 3v4h-7z" /><circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
                </svg>
              </div>
              <h3 className="font-heading font-bold mb-1.5 text-[15px]" style={{ color: '#fff' }}>Pan-UP delivery</h3>
              <p className="font-body mb-3 text-[12px] leading-snug" style={{ color: 'rgba(255,255,255,.6)' }}>Order to delivery, tracked across UP.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {[['2–3 days', 'Pan-UP delivery'], ['98.6%', 'On-time dispatch'], ['50k+', 'Orders delivered']].map(([b, s]) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', background: 'rgba(255,255,255,.07)', borderRadius: 8, padding: '8px 10px' }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', letterSpacing: '.03em', textTransform: 'uppercase' }}>{s}</span>
                    <b className="font-heading" style={{ fontSize: 15, color: '#fff', fontWeight: 800 }}>{b}</b>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'rgba(255,255,255,.6)', borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 10 }}>
                <span className="cap-dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#fb923c', flexShrink: 0 }} />
                <span key={tickerIdx} className="cap-ticker-line" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {DISPATCH_TICKER[tickerIdx]}
                </span>
              </div>
            </div>

            {/* Card 4 — distribution network */}
            <div className="cap-card">
              <div className="cap-accent" />
              <div className="cap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[15px]">Pan-UP network</h3>
              <p className="font-body text-ink/55 mb-2 text-[12px] leading-snug">One Kanpur facility, routes to every district.</p>
              <div style={{ position: 'relative', flex: 1, minHeight: 110 }}>
                <svg viewBox="0 0 260 130" style={{ width: '100%', height: '100%' }}>
                  <path className="cap-net-line" d="M130,68 L48,30" />
                  <path className="cap-net-line" d="M130,68 L208,30" />
                  <path className="cap-net-line" d="M130,68 L40,102" />
                  <path className="cap-net-line" d="M130,68 L218,102" />
                  {[{ cx: 48, cy: 30, l: 'LKO' }, { cx: 208, cy: 30, l: 'AGR' }, { cx: 40, cy: 102, l: 'VNS' }, { cx: 218, cy: 102, l: 'PRG' }].map(n => (
                    <g key={n.l}>
                      <circle cx={n.cx} cy={n.cy} r="14" fill="#fff1e6" stroke="#ea580c" strokeWidth="1.6" />
                      <text x={n.cx} y={n.cy + 3} textAnchor="middle" fill="#0f1f3d" fontSize="8" fontWeight="700">{n.l}</text>
                    </g>
                  ))}
                  <circle cx="130" cy="68" r="18" fill="#ea580c" />
                  <text x="130" y="71" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">KNP</text>
                </svg>
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#4a5670', borderTop: '1px solid #eef0f3', paddingTop: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                Same-day loading &middot; 2–3 day delivery across UP
              </div>
            </div>

            {/* Card 5 — production pipeline (checklist style) */}
            <ChecklistCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v2H9z" /><polyline points="9 13 11 15 15 10.5" />
                </svg>
              }
              title="Quality-governed production"
              sub="Every batch clears four checks before it ships."
              items={PRODUCTION_STAGES}
              step={plStep}
            />

          </div>
        </div>
      </section>
    </>
  );
}
