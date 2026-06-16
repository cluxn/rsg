import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProduct, getProducts } from '@/lib/api';
import { ProductHero } from '@/components/ui/ProductHero';
import { SpecsTable } from '@/components/ui/SpecsTable';
import { GetQuoteCTA } from '@/components/ui/GetQuoteCTA';
import { SectionContainer } from '@/components/layout/SectionContainer';

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | RSG Profile Manufacturing`,
    description: product.description?.slice(0, 155) ?? `${product.name} - RSG Profile Manufacturing Pvt. Ltd.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const primaryMedia = product.media[0] ?? null;
  const additionalMedia = product.media.slice(1);

  return (
    <>
      <ProductHero productName={product.name} />

      {/* Two-column section */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: images */}
          <div>
            {primaryMedia ? (
              <div className="max-w-[500px]">
                <Image
                  src={primaryMedia.url}
                  alt={primaryMedia.alt_text}
                  width={500}
                  height={400}
                  className="rounded-xl shadow-md w-full h-auto object-cover"
                />
              </div>
            ) : (
              <div className="max-w-[500px] rounded-xl bg-steel/10 aspect-[5/4] flex items-center justify-center">
                <span className="font-body text-navy/30 text-sm">No image yet</span>
              </div>
            )}
            {additionalMedia.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {additionalMedia.map((m) => (
                  <Image
                    key={m.id}
                    src={m.url}
                    alt={m.alt_text}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover border border-navy/10 hidden lg:block"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: content + sticky CTA */}
          <div className="lg:relative">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-heading text-navy text-2xl lg:text-3xl font-bold mb-4">
                {product.name}
              </h2>
              {product.description && (
                <p className="font-body text-navy/80 text-base lg:text-[17px] leading-relaxed mb-6">
                  {product.description}
                </p>
              )}
              {product.specs && product.specs.length > 0 && (
                <dl className="space-y-2 mb-8">
                  {product.specs.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <dt className="font-heading text-navy font-semibold min-w-[140px]">{s.label}:</dt>
                      <dd className="font-body text-navy/70">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <a
                href="#get-quote-section"
                className="inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange bg-orange text-white hover:bg-orange/90 border border-orange w-full lg:w-auto px-8 py-3 text-base"
              >
                Get Quote
              </a>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SpecsTable specs={product.specs} />

      <GetQuoteCTA productName={product.name} slug={product.slug} />
    </>
  );
}
