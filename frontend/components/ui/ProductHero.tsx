import { GradientHero } from './GradientHero';
import { SectionContainer } from '@/components/layout/SectionContainer';

interface ProductHeroProps {
  productName: string;
  heroImage: string;
  tagline?: string;
}

export function ProductHero({ productName, heroImage, tagline = 'RSG Profile Manufacturing' }: ProductHeroProps) {
  return (
    <GradientHero minHeight="min-h-[400px] lg:min-h-[480px]" bgImage={heroImage}>
      <SectionContainer noPadding>
        <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">{tagline}</p>
        <h1 className="font-heading text-4xl md:text-5xl text-white">{productName}</h1>
      </SectionContainer>
    </GradientHero>
  );
}
