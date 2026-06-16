import { SimpleHero } from './SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';

interface ProductHeroProps {
  productName: string;
  tagline?: string;
}

export function ProductHero({ productName, tagline = 'RSG Profile Manufacturing' }: ProductHeroProps) {
  return (
    <SimpleHero minHeight="min-h-[300px]">
      <SectionContainer noPadding>
        <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">{tagline}</p>
        <h1 className="font-heading text-4xl md:text-5xl text-white">{productName}</h1>
      </SectionContainer>
    </SimpleHero>
  );
}
