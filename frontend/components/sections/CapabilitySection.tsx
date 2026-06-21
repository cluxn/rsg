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
  'ORDER #RSG-2291 — DISPATCHED TO LUCKNOW',
  'BATCH #114 — CLEARED QC INSPECTION',
  'ORDER #RSG-2287 — LOADED FOR KANPUR ROUTE',
  'ORDER #RSG-2279 — DISPATCHED TO VARANASI',
  'ORDER #RSG-2266 — DELIVERED, AGRA',
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
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6, flex: compact ? 1 : undefined }}>
      {items.map((label, i) => {
        const isDone = i < step % (items.length + 1);
        return (
          <li key={i} className="cap-check-row" style={{
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600,
            color: isDone ? '#07152B' : 'rgba(7,21,43,.4)',
            padding: '8px 10px',
            background: isDone ? 'rgba(240,79,0,.06)' : 'transparent',
            borderLeft: `3px solid ${isDone ? '#F04F00' : 'rgba(7,21,43,.12)'}`,
            transition: 'background .4s ease, color .4s ease, border-color .4s ease',
          }}>
            <span style={{
              width: 16, height: 16, borderRadius: 3, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isDone ? '#F04F00' : 'transparent',
              border: `1.5px solid ${isDone ? '#F04F00' : 'rgba(7,21,43,.25)'}`,
              transition: 'all .35s ease',
            }}>
              {isDone && <CheckIcon />}
            </span>
            <span style={{ fontFamily: 'var(--font-source-sans), sans-serif' }}>{label}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: 'rgba(7,21,43,.3)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
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
          background:#fff; border:1px solid rgba(7,21,43,.12);
          border-radius:3px; padding:26px 26px 22px;
          box-shadow:0 1px 0 rgba(7,21,43,.04), 0 2px 6px -2px rgba(7,21,43,.08);
          display:flex; flex-direction:column;
          position:relative;
        }
        .cap-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#07152B 0%,#07152B 60%,#F04F00 60%,#F04F00 100%);
        }
        .cap-card::after {
          content:''; position:absolute; bottom:10px; right:10px; width:12px; height:12px;
          border-right:1.5px solid rgba(7,21,43,.15); border-bottom:1.5px solid rgba(7,21,43,.15);
        }
        .cap-card-split { flex-direction:row; align-items:center; gap:24px; }
        @media (max-width:760px){ .cap-card-split { flex-direction:column; align-items:stretch; } }

        .cap-icon {
          width:40px; height:40px; border-radius:3px; flex-shrink:0;
          background:rgba(240,79,0,.1); border:1px solid rgba(240,79,0,.2);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:14px; color:#F04F00;
        }
        .cap-icon svg { width:19px; height:19px; }

        .cap-eyebrow {
          font-family: monospace; font-size:10px; font-weight:700; letter-spacing:.12em;
          color: rgba(7,21,43,.4); text-transform:uppercase;
        }

        @keyframes capDash{ to{ stroke-dashoffset:-22; } }
        .cap-net-line { stroke:#0E4FA8; stroke-width:1.4; fill:none; stroke-dasharray:4 5; opacity:.55; animation:capDash 5s linear infinite; }
        @keyframes capTickerIn{ from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:none} }
        .cap-ticker-line { animation:capTickerIn .4s ease both; }
        @keyframes capBlink{ 50%{ opacity:.2; } }
        .cap-live-dot { animation:capBlink 1.4s ease-in-out infinite; }
        @media(prefers-reduced-motion:reduce){ .cap-net-line,.cap-ticker-line,.cap-live-dot { animation:none!important; } }
      `}</style>

      <section className="gradient-mesh-light py-16 md:py-20">
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
              <div className="cap-icon" style={{ marginLeft: 0, marginRight: 'auto' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#F04F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3z" /><polyline points="9 12.5 11 14.5 15 9.5" />
                </svg>
              </div>
              <div style={{ width: 100, height: 100, margin: '0 auto 14px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: '#07152B',
                  clipPath: 'polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)',
                }} />
                <div style={{
                  position: 'absolute', inset: 4,
                  border: '1.5px dashed rgba(240,79,0,.6)',
                  clipPath: 'polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)',
                }} />
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="font-heading font-black text-orange" style={{ fontSize: 27, letterSpacing: '-0.02em', lineHeight: 1 }}>100%</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: '#fff', opacity: .7, marginTop: 3 }}>QC PASS</span>
                </div>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Quality-checked by design</h3>
              <p className="font-body mb-4 text-[12.5px] leading-snug" style={{ color: 'rgba(7,21,43,.6)' }}>Every coil tested &amp; inspected before it leaves the line.</p>
              <ChecklistRows items={INCOMING_CHECKS} step={clStep} />
            </div>

            {/* Card 2 — quality first */}
            <div className="cap-card">
              <div className="cap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F04F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" /><path d="M9 13.5 7 22l5-3 5 3-2-8.5" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Quality first</h3>
              <p className="font-body mb-3 text-[12.5px] leading-snug" style={{ color: 'rgba(7,21,43,.6)' }}>ISI-certified material, batch-logged production.</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                {['ISI', 'BIS', 'IS 14246'].map(b => (
                  <span key={b} style={{ fontFamily: 'monospace', fontSize: 10.5, fontWeight: 700, letterSpacing: '.05em', color: '#07152B', background: '#fff', border: '1px solid rgba(7,21,43,.3)', borderRadius: 2, padding: '4px 8px' }}>{b}</span>
                ))}
              </div>
              <ul ref={featureRef} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                {FEATURES.map((f, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 9, alignItems: 'flex-start',
                    borderTop: i === 0 ? '1px solid rgba(7,21,43,.1)' : 'none',
                    borderBottom: '1px solid rgba(7,21,43,.1)', padding: '9px 2px',
                    opacity: featureIn ? 1 : 0, transform: featureIn ? 'none' : 'translateY(6px)',
                    transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`,
                  }}>
                    <span style={{ width: 15, height: 15, borderRadius: 2, flexShrink: 0, marginTop: 1, background: '#F04F00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckIcon />
                    </span>
                    <div>
                      <b style={{ display: 'block', fontSize: 12.5, color: '#07152B', fontWeight: 700 }}>{f.title}</b>
                      <span style={{ fontSize: 11.5, color: 'rgba(7,21,43,.6)' }}>{f.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3 — Pan-UP delivery stats */}
            <div className="cap-card">
              <div className="cap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F04F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="7" width="13" height="10" /><path d="M14 10h4l3 3v4h-7z" /><circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Pan-UP delivery</h3>
              <p className="font-body mb-3 text-[12.5px] leading-snug" style={{ color: 'rgba(7,21,43,.6)' }}>Order to delivery, tracked across UP.</p>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 12, border: '1px solid rgba(7,21,43,.12)' }}>
                {[['2–3 days', 'Pan-UP delivery'], ['98.6%', 'On-time dispatch'], ['50k+', 'Orders delivered']].map(([b, s], idx) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 13px', borderBottom: idx < 2 ? '1px solid rgba(7,21,43,.1)' : 'none' }}>
                    <span className="cap-eyebrow">{s}</span>
                    <b className="text-orange" style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700 }}>{b}</b>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: '#07152B', padding: '9px 12px', borderRadius: 2 }}>
                <span className="cap-live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#F04F00', flexShrink: 0 }} />
                <span key={tickerIdx} className="cap-ticker-line" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.03em', color: 'rgba(255,255,255,.85)' }}>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="#F04F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Pan-UP network</h3>
                <p className="font-body text-[12.5px] leading-snug" style={{ color: 'rgba(7,21,43,.6)' }}>One Kanpur facility, dispatch routes covering every district across UP.</p>
              </div>
              <div style={{ flex: 1, position: 'relative', minHeight: 140 }}>
                <svg viewBox="0 0 260 140" style={{ width: '100%', height: '100%' }}>
                  <path className="cap-net-line" d="M130,72 L48,32" />
                  <path className="cap-net-line" d="M130,72 L208,32" />
                  <path className="cap-net-line" d="M130,72 L40,110" />
                  <path className="cap-net-line" d="M130,72 L218,110" />
                  {[{ cx: 48, cy: 32, l: 'LKO' }, { cx: 208, cy: 32, l: 'AGR' }, { cx: 40, cy: 110, l: 'VNS' }, { cx: 218, cy: 110, l: 'PRG' }].map(n => (
                    <g key={n.l}>
                      <rect x={n.cx - 16} y={n.cy - 13} width="32" height="26" rx="2" fill="#fff" stroke="#0E4FA8" strokeWidth="1.4" />
                      <text x={n.cx} y={n.cy + 3.5} textAnchor="middle" fill="#07152B" fontSize="8.5" fontWeight="700" fontFamily="monospace">{n.l}</text>
                    </g>
                  ))}
                  <rect x="106" y="58" width="48" height="28" rx="2" fill="#F04F00" />
                  <text x="130" y="75.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800" fontFamily="monospace">KNP</text>
                </svg>
              </div>
            </div>

            {/* Card 5 — quality-governed production (split: text left, checklist right) */}
            <div className="cap-card cap-card-split">
              <div style={{ flex: '0 0 42%' }}>
                <div className="cap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#F04F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v2H9z" /><polyline points="9 13 11 15 15 10.5" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-ink mb-1.5 text-[16px]">Quality-governed production</h3>
                <p className="font-body text-[12.5px] leading-snug" style={{ color: 'rgba(7,21,43,.6)' }}>Every batch clears four checks before it ships.</p>
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
