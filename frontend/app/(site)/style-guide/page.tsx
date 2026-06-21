import { notFound } from 'next/navigation';
import { GradientHero } from '@/components/ui/GradientHero';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { SectionContainer } from '@/components/layout/SectionContainer';

export default function StyleGuidePage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <main>
      {/* 1. Hero demo */}
      <GradientHero minHeight="min-h-[320px]">
        <SectionContainer noPadding>
          <h1 className="font-heading text-4xl text-white mb-4">RSG Design System</h1>
          <p className="font-body text-white/80 text-lg">Premium Industrial — style guide reference</p>
          <div className="mt-6 flex gap-4">
            <CTAButton variant="primary">Get Quote</CTAButton>
            <CTAButton variant="ghost" className="text-white border-white hover:bg-white/10">Learn More</CTAButton>
          </div>
        </SectionContainer>
      </GradientHero>

      {/* 2. Color palette */}
      <SectionContainer>
        <h2 className="font-heading text-2xl text-navy mb-6">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Navy', hex: '#07152B', cls: 'bg-navy' },
            { name: 'Steel', hex: '#0E4FA8', cls: 'bg-steel' },
            { name: 'Cyan', hex: '#00B4DB', cls: 'bg-cyan' },
            { name: 'Orange', hex: '#F04F00', cls: 'bg-orange' },
            { name: 'Gold', hex: '#FFA820', cls: 'bg-gold' },
            { name: 'Off-white', hex: '#EDF1F7', cls: 'bg-off-white border border-gray-200' },
          ].map(c => (
            <div key={c.name} className="text-center">
              <div className={`h-20 rounded-lg mb-2 ${c.cls}`} />
              <p className="font-body text-sm font-semibold text-navy">{c.name}</p>
              <p className="font-body text-xs text-navy/60">{c.hex}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* 3. Typography */}
      <SectionContainer className="bg-white/50">
        <h2 className="font-heading text-2xl text-navy mb-6">Typography</h2>
        <div className="space-y-4">
          <p className="font-heading text-5xl text-navy">Heading XL — Sora 700</p>
          <p className="font-heading text-3xl text-navy">Heading L — Sora 600</p>
          <p className="font-heading text-xl text-navy">Heading M — Sora 600</p>
          <p className="font-body text-lg text-navy">Body Large — Source Sans 3, 18px</p>
          <p className="font-body text-base text-navy">Body Base — Source Sans 3, 16px, line-height 1.7 — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
          <p className="font-body text-sm text-navy/70">Label / Spec text — Source Sans 3, 15px minimum</p>
        </div>
      </SectionContainer>

      {/* 4. Glassmorphism demo */}
      <GradientHero minHeight="min-h-[320px]">
        <SectionContainer noPadding>
          <h2 className="font-heading text-2xl text-white mb-6">Glassmorphism Panel</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['Leads', 'Products', 'Media'].map(label => (
              <GlassCard key={label}>
                <p className="font-body text-white/70 text-sm mb-1">{label}</p>
                <p className="font-heading text-3xl text-white font-bold">0</p>
                <p className="font-body text-white/50 text-xs mt-1">Phase 1 — placeholder</p>
              </GlassCard>
            ))}
          </div>
        </SectionContainer>
      </GradientHero>

      {/* 5. Spacing / grid demo */}
      <SectionContainer>
        <h2 className="font-heading text-2xl text-navy mb-6">Layout Grid</h2>
        <p className="font-body text-navy/70 mb-4">Container: max-width 1280px, centered, px-6 mobile / px-20 desktop</p>
        <div className="h-4 bg-steel/20 rounded" />
        <p className="font-body text-xs text-navy/50 mt-2">Full container width above (bounded by max-w-container)</p>
      </SectionContainer>

      {/* 6. CTA Buttons */}
      <SectionContainer className="bg-white/50">
        <h2 className="font-heading text-2xl text-navy mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <CTAButton variant="primary" size="lg">Get Quote (Large)</CTAButton>
          <CTAButton variant="primary" size="md">Get Quote</CTAButton>
          <CTAButton variant="primary" size="sm">Get Quote (Small)</CTAButton>
          <CTAButton variant="ghost" size="md">Learn More</CTAButton>
        </div>
      </SectionContainer>
    </main>
  );
}
