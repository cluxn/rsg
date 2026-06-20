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

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 9, height: 9 }}>
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

function ChecklistRows({ items, step, compact = false }: { items: string[]; step: number; compact?: boolean }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7, flex: compact ? 1 : undefined }}>
      {items.map((label, i) => {
        const isDone = i < step % (items.length + 1);
        return (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, fontWeight: 600, color: isDone ? '#0f1f3d' : '#9aa0b4', padding: '8px 10px', borderRadius: 9, background: isDone ? '#fff1e6' : '#f6f7f9', transition: 'background .4s ease, color .4s ease' }}>
            <span style={{
              width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
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
        .cap-row1 { display:grid; grid-template-columns:1fr 1fr 1.15fr; gap:20px; }
        .cap-row2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px; }
        @media (max-width:1100px){ .cap-row1 { grid-template-columns:1fr 1fr; } .cap-row2 { grid-template-columns:1fr; } }
        @media (max-width:640px){ .cap-row1 { grid-template-columns:1fr; } }
        .cap-card {
          background:#fff; border:1px solid rgba(15,31,61,.07);
          border-radius:22px; padding:26px;
          box-shadow:0 1px 2px rgba(15,31,61,.03),0 14px 30px -16px rgba(15,31,61,.14);
          display:flex; flex-direction:column;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .cap-card:hover { transform:translateY(-4px); box-shadow:0 4px 10px rgba(15,31,61,.05),0 20px 36px -16px rgba(15,31,61,.2); }
        .cap-card-split { flex-direction:row; align-items:center; gap:24px; }
        @media (max-width:760px){ .cap-card-split { flex-direction:column; align-items:stretch; } }
        .cap-icon {
          width:44px; height:44px; border-radius:13px; flex-shrink:0;
          background:linear-gradient(135deg,#fb923c,#ea580c);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:14px; color:#fff;
          box-shadow:0 6px 14px -4px rgba(234,88,12,.4);
        }
        .cap-icon svg { width:21px; height:21px; }
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

          {/* Row 1 — 3 cards */}
          <div className="cap-row1">

            {/* Card 1 — incoming QC checklist */}
            <div className="cap-card text-center">
              <div style={{ width: 140, height: 86, margin: '0 auto 16px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 140 86" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <ellipse cx="70" cy="43" rx="66" ry="35" fill="none" stroke="#ffd9b8" strokeWidth="2" />
                </svg>
                <span className="font-heading font-black text-orange" style={{ fontSize: 32, letterSpacing: '-0.02em', position: 'relative' }}>100%</span>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Quality-checked by design</h3>
              <p className="font-body text-ink/55 mb-4 text-[12.5px] leading-snug">Every coil tested &amp; inspected before it leaves the line.</p>
              <ChecklistRows items={INCOMING_CHECKS} step={clStep} />
            </div>

            {/* Card 2 — quality first */}
            <div className="cap-card">
              <div className="cap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" /><path d="M9 13.5 7 22l5-3 5 3-2-8.5" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Quality first</h3>
              <p className="font-body text-ink/55 mb-3 text-[12.5px] leading-snug">ISI-certified material, batch-logged production.</p>
              <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
                {['ISI', 'BIS', 'IS 14246'].map(b => (
                  <span key={b} style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.03em', color: '#ea580c', background: '#fff1e6', border: '1px solid #ffd9b8', padding: '5px 10px', borderRadius: 999 }}>{b}</span>
                ))}
              </div>
              <ul ref={featureRef} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                {FEATURES.map((f, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 9, alignItems: 'flex-start',
                    background: '#f6f7f9', borderRadius: 9, padding: '8px 10px',
                    opacity: featureIn ? 1 : 0, transform: featureIn ? 'none' : 'translateY(8px)',
                    transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`,
                  }}>
                    <span style={{ width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: 'linear-gradient(135deg,#fb923c,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckIcon />
                    </span>
                    <div>
                      <b style={{ display: 'block', fontSize: 12.5, color: '#0f1f3d', fontWeight: 700 }}>{f.title}</b>
                      <span style={{ fontSize: 11.5, color: '#4a5670' }}>{f.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3 — Pan-UP delivery stats */}
            <div className="cap-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <div className="cap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="7" width="13" height="10" /><path d="M14 10h4l3 3v4h-7z" /><circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
                  </svg>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 800, color: '#067a55', background: '#e3faf0', border: '1px solid #b9f0d8', padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap', marginTop: 2 }}>
                  <i className="cap-dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />LIVE
                </span>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Pan-UP delivery</h3>
              <p className="font-body text-ink/55 mb-3 text-[12.5px] leading-snug">Order to delivery, tracked across UP.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {[['2–3 days', 'Pan-UP delivery'], ['98.6%', 'On-time dispatch'], ['50k+', 'Orders delivered']].map(([b, s]) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', background: '#f6f7f9', borderRadius: 9, padding: '9px 11px' }}>
                    <span style={{ fontSize: 10.5, color: '#4a5670', letterSpacing: '.03em', textTransform: 'uppercase' }}>{s}</span>
                    <b className="font-heading text-orange" style={{ fontSize: 16, fontWeight: 800 }}>{b}</b>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: '#4a5670', borderTop: '1px solid #eef0f3', paddingTop: 10 }}>
                <span key={tickerIdx} className="cap-ticker-line" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {DISPATCH_TICKER[tickerIdx]}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2 — 2 wide split cards */}
          <div className="cap-row2">

            {/* Card 4 — distribution network (split: text left, diagram right) */}
            <div className="cap-card cap-card-split">
              <div style={{ flex: '0 0 42%' }}>
                <div className="cap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Pan-UP network</h3>
                <p className="font-body text-ink/55 text-[12.5px] leading-snug">One Kanpur facility, dispatch routes covering every district across UP.</p>
              </div>
              <div style={{ flex: 1, position: 'relative', minHeight: 140 }}>
                <svg viewBox="0 0 260 140" style={{ width: '100%', height: '100%' }}>
                  <path className="cap-net-line" d="M130,72 L48,32" />
                  <path className="cap-net-line" d="M130,72 L208,32" />
                  <path className="cap-net-line" d="M130,72 L40,110" />
                  <path className="cap-net-line" d="M130,72 L218,110" />
                  {[{ cx: 48, cy: 32, l: 'LKO' }, { cx: 208, cy: 32, l: 'AGR' }, { cx: 40, cy: 110, l: 'VNS' }, { cx: 218, cy: 110, l: 'PRG' }].map(n => (
                    <g key={n.l}>
                      <circle cx={n.cx} cy={n.cy} r="15" fill="#fff1e6" stroke="#ea580c" strokeWidth="1.6" />
                      <text x={n.cx} y={n.cy + 3} textAnchor="middle" fill="#0f1f3d" fontSize="8.5" fontWeight="700">{n.l}</text>
                    </g>
                  ))}
                  <circle cx="130" cy="72" r="19" fill="#ea580c" />
                  <text x="130" y="75" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="800">KNP</text>
                </svg>
              </div>
            </div>

            {/* Card 5 — quality-governed production (split: text left, checklist right) */}
            <div className="cap-card cap-card-split">
              <div style={{ flex: '0 0 42%' }}>
                <div className="cap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v2H9z" /><polyline points="9 13 11 15 15 10.5" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Quality-governed production</h3>
                <p className="font-body text-ink/55 text-[12.5px] leading-snug">Every batch clears four checks before it ships.</p>
              </div>
              <div style={{ flex: 1 }}>
                <ChecklistRows items={PRODUCTION_STAGES} step={plStep} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
