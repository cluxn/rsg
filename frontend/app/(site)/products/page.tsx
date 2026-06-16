import Link from 'next/link';
import { getProducts, type ProductSummary } from '@/lib/api';
import { GradientHero } from '@/components/ui/GradientHero';
import { SectionContainer } from '@/components/layout/SectionContainer';

export const revalidate = 3600;

export const metadata = {
  title: 'Our Products | RSG Profile Manufacturing',
  description: 'Browse RSG Profile Manufacturing’s complete range of colour coated roofing sheets, structural steel, decking, purlins, polycarbonate sheets, and accessories.',
};

// Mirrors the public-site hierarchy in components/layout/SiteHeader.tsx
const CCRS_SLUG = 'colour-coated-roofing-sheet';
const ACCESSORIES_SLUG = 'accessories';
const PPGL_VARIANT_SLUGS = ['jsw-colouron', 'jsw-silveron', 'jsw-pragati', 'jsw-endura', 'tata-durashine', 'jindal-sabrang'];
const PPGI_VARIANT_SLUGS = ['dura-glow', 'am-ns'];

const byOrder = (a: ProductSummary, b: ProductSummary) => a.display_order - b.display_order;

function ProductCard({ p }: { p: ProductSummary }) {
  return (
    <Link
      href={`/products/${p.slug}`}
      className="glow-card rounded-xl p-6 flex items-center justify-between gap-4"
    >
      <span className="font-heading text-lg text-navy font-semibold">{p.name}</span>
      <svg className="w-5 h-5 text-steel shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default async function ProductsPage() {
  const products = await getProducts();

  const mainProduct = products.find(p => p.slug === CCRS_SLUG);
  const accessories = products.find(p => p.slug === ACCESSORIES_SLUG);
  const ppglVariants = products.filter(p => PPGL_VARIANT_SLUGS.includes(p.slug)).sort(byOrder);
  const ppgiVariants = products.filter(p => PPGI_VARIANT_SLUGS.includes(p.slug)).sort(byOrder);
  const ccrsGroup = [mainProduct, ...ppglVariants, ...ppgiVariants, accessories].filter((p): p is ProductSummary => !!p);

  const ccrsGroupSlugs = new Set([CCRS_SLUG, ACCESSORIES_SLUG, ...PPGL_VARIANT_SLUGS, ...PPGI_VARIANT_SLUGS]);
  const otherCategories = products.filter(p => !ccrsGroupSlugs.has(p.slug)).sort(byOrder);

  return (
    <>
      <GradientHero minHeight="min-h-[360px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">Our Products</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Complete Range, One Supplier</h1>
          <p className="font-body text-xl text-white/80 max-w-2xl">
            From colour coated roofing sheets to structural steel — explore RSG&apos;s full catalog of premium building materials.
          </p>
        </SectionContainer>
      </GradientHero>

      <SectionContainer>
        <h2 className="font-heading text-3xl text-navy mb-2">Colour Coated Roofing Sheet</h2>
        <p className="font-body text-navy/60 max-w-2xl mb-10">
          Available in multiple premium brand finishes from JSW, Tata BlueScope, Jindal, and more — plus matching accessories.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ccrsGroup.map(p => <ProductCard key={p.slug} p={p} />)}
        </div>
      </SectionContainer>

      <SectionContainer className="gradient-mesh-light">
        <h2 className="font-heading text-3xl text-navy mb-10">Other Product Categories</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherCategories.map(p => <ProductCard key={p.slug} p={p} />)}
        </div>
      </SectionContainer>
    </>
  );
}
