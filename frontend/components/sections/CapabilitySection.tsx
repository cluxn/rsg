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
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, fontWeight: 600, color: isDone ? '#3a2a1a' : '#9aa0b4', padding: '8px 10px', borderRadius: 8, background: isDone ? '#f0e8df' : '#eeebe7', transition: 'background .4s ease, color .4s ease' }}>
            <span style={{
              width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isDone ? '#b05828' : 'transparent',
              border: `2px solid ${isDone ? '#b05828' : '#c5c0b8'}`,
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
          background:#faf8f5; border:1px solid rgba(15,31,61,.08);
          border-radius:16px; padding:26px;
          box-shadow:0 1px 3px rgba(15,31,61,.04),0 8px 20px -12px rgba(15,31,61,.1);
          display:flex; flex-direction:column;
        }
        .cap-card-split { flex-direction:row; align-items:center; gap:24px; }
        @media (max-width:760px){ .cap-card-split { flex-direction:column; align-items:stretch; } }
        .cap-icon {
          width:42px; height:42px; border-radius:10px; flex-shrink:0;
          background:#f0e8df;
          display:flex; align-items:center; justify-content:center;
          margin-bottom:14px; color:#b05828;
        }
        .cap-icon svg { width:20px; height:20px; }
        @keyframes capDash{ to{ stroke-dashoffset:-22; } }
        .cap-net-line { stroke:#d9c3ae; stroke-width:1.6; fill:none; stroke-dasharray:5 6; animation:capDash 3.5s linear infinite; }
        @keyframes capTickerIn{ from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:none} }
        .cap-ticker-line { animation:capTickerIn .4s ease both; }
        @media(prefers-reduced-motion:reduce){ .cap-net-line,.cap-ticker-line { animation:none!important; } }
      `}</style>

      <section className="py-16 md:py-20" style={{ background: '#f9f6f2' }}>
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
                  <ellipse cx="70" cy="43" rx="66" ry="35" fill="none" stroke="#d9c3ae" strokeWidth="1.5" />
                </svg>
                <span className="font-heading font-black" style={{ fontSize: 32, letterSpacing: '-0.02em', position: 'relative', color: '#b05828' }}>100%</span>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Quality-checked by design</h3>
              <p className="font-body mb-4 text-[12.5px] leading-snug" style={{ color: '#6b5a4e' }}>Every coil tested &amp; inspected before it leaves the line.</p>
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
              <p className="font-body mb-3 text-[12.5px] leading-snug" style={{ color: '#6b5a4e' }}>ISI-certified material, batch-logged production.</p>
              <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
                {['ISI', 'BIS', 'IS 14246'].map(b => (
                  <span key={b} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.03em', color: '#7a4020', background: '#f0e8df', border: '1px solid #d9c3ae', padding: '5px 10px', borderRadius: 6 }}>{b}</span>
                ))}
              </div>
              <ul ref={featureRef} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                {FEATURES.map((f, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 9, alignItems: 'flex-start',
                    background: '#eeebe7', borderRadius: 8, padding: '8px 10px',
                    opacity: featureIn ? 1 : 0, transform: featureIn ? 'none' : 'translateY(6px)',
                    transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`,
                  }}>
                    <span style={{ width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: '#b05828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckIcon />
                    </span>
                    <div>
                      <b style={{ display: 'block', fontSize: 12.5, color: '#2d1e12', fontWeight: 700 }}>{f.title}</b>
                      <span style={{ fontSize: 11.5, color: '#6b5a4e' }}>{f.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3 — Pan-UP delivery stats */}
            <div className="cap-card">
              <div className="cap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="7" width="13" height="10" /><path d="M14 10h4l3 3v4h-7z" /><circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Pan-UP delivery</h3>
              <p className="font-body mb-3 text-[12.5px] leading-snug" style={{ color: '#6b5a4e' }}>Order to delivery, tracked across UP.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid #e0d8cf' }}>
                {[['2–3 days', 'Pan-UP delivery'], ['98.6%', 'On-time dispatch'], ['50k+', 'Orders delivered']].map(([b, s], idx) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: idx % 2 === 0 ? '#faf8f5' : '#f5f0ea', padding: '10px 13px', borderBottom: idx < 2 ? '1px solid #e8e0d6' : 'none' }}>
                    <span style={{ fontSize: 11.5, color: '#6b5a4e', fontWeight: 500 }}>{s}</span>
                    <b className="font-heading" style={{ fontSize: 15, fontWeight: 700, color: '#8a3e18' }}>{b}</b>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: '#6b5a4e', borderTop: '1px solid #e0d8cf', paddingTop: 10 }}>
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
                <p className="font-body text-[12.5px] leading-snug" style={{ color: '#6b5a4e' }}>One Kanpur facility, dispatch routes covering every district across UP.</p>
              </div>
              <div style={{ flex: 1, position: 'relative', minHeight: 140 }}>
                <svg viewBox="0 0 260 140" style={{ width: '100%', height: '100%' }}>
                  <path className="cap-net-line" d="M130,72 L48,32" />
                  <path className="cap-net-line" d="M130,72 L208,32" />
                  <path className="cap-net-line" d="M130,72 L40,110" />
                  <path className="cap-net-line" d="M130,72 L218,110" />
                  {[{ cx: 48, cy: 32, l: 'LKO' }, { cx: 208, cy: 32, l: 'AGR' }, { cx: 40, cy: 110, l: 'VNS' }, { cx: 218, cy: 110, l: 'PRG' }].map(n => (
                    <g key={n.l}>
                      <circle cx={n.cx} cy={n.cy} r="15" fill="#f0e8df" stroke="#b8a090" strokeWidth="1.4" />
                      <text x={n.cx} y={n.cy + 3} textAnchor="middle" fill="#3a2a1a" fontSize="8.5" fontWeight="700">{n.l}</text>
                    </g>
                  ))}
                  <circle cx="130" cy="72" r="19" fill="#8a3e18" />
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
                <p className="font-body text-[12.5px] leading-snug" style={{ color: '#6b5a4e' }}>Every batch clears four checks before it ships.</p>
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
