import { CTAButton } from './CTAButton';
import { SectionContainer } from '@/components/layout/SectionContainer';

interface GetQuoteCTAProps {
  productName: string;
}

export function GetQuoteCTA({ productName }: GetQuoteCTAProps) {
  return (
    <section id="get-quote-section" className="w-full bg-navy py-16 lg:py-20">
      <SectionContainer noPadding className="text-center">
        <h2 className="font-heading text-white text-2xl lg:text-3xl font-semibold mb-3">
          Interested in {productName}?
        </h2>
        <p className="font-body text-white/70 text-lg mb-8">
          Get a custom quote tailored to your requirements.
        </p>
        {/* Phase 4 wires this CTA to the lead capture form; visual stub for now */}
        <CTAButton variant="primary" size="lg" type="button">
          Get Quote
        </CTAButton>
      </SectionContainer>
    </section>
  );
}
