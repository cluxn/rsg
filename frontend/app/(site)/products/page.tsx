import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/api';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { CcrsBrandExplorer } from '@/components/ui/CcrsBrandExplorer';
import { PPGL_BRANDS, PPGI_BRANDS } from '@/components/layout/SiteHeader';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: settings['meta_title_/products'] || 'Our Products | RSG Profile Manufacturing',
      description: settings['meta_desc_/products'] || 'Roofing sheets, structural steel, and accessories — factory-direct wholesale supply from RSG Profile Manufacturing, Kanpur.',
    };
  } catch {
    return {
      title: 'Our Products | RSG Profile Manufacturing',
      description: 'Roofing sheets, structural steel, and accessories — factory-direct wholesale supply from RSG Profile Manufacturing, Kanpur.',
    };
  }
}

const CATEGORIES = [
  {
    name: 'Colour Coated Roofing Sheet',
    slug: 'colour-coated-roofing-sheet',
    desc: 'ISI-certified PPGL & PPGI roofing in premium brand finishes from JSW, Tata BlueScope, and Jindal.',
    image: '/images/products/colour-coated-roofing-sheet-new.png',
  },
  {
    name: 'Decking Sheet',
    slug: 'decking-sheet',
    desc: 'Composite floor decking engineered for multi-storey commercial and industrial construction.',
    image: '/images/products/decking-sheet.png',
  },
  {
    name: 'Galvanized Plain Sheets',
    slug: 'galvanized-plain-sheets',
    desc: 'High-quality GI plain sheets for versatile structural, fabrication, and general applications.',
    image: '/images/products/galvanized-plain-sheets.png',
  },
  {
    name: 'C and Z Purlins',
    slug: 'purlins',
    desc: 'Precision-rolled Z & C purlins for industrial roofing systems — lightweight yet exceptionally strong.',
    image: '/images/products/purlins.png',
  },
  {
    name: 'Crimping Sheet',
    slug: 'crimping-sheet',
    desc: 'Precision-crimped sheets for versatile industrial and commercial roofing applications.',
    image: '/images/products/crimping-sheet-new.png',
  },
  {
    name: 'MS Plate / Channel / Angle',
    slug: 'ms-plate-channel-angle',
    desc: 'Structural MS plates, channels and angles for heavy-duty fabrication and construction projects.',
    image: '/images/products/ms-plate-channel-angle.png',
  },
  {
    name: 'Polycarbonate Sheet',
    slug: 'polycarbonate-sheet',
    desc: 'UV-resistant transparent roofing panels that bring natural daylight into any structure.',
    image: '/images/products/polycarbonate-sheet.png',
  },
  {
    name: 'Mild Steel Pipes',
    slug: 'ms-pipe',
    desc: 'Structural MS pipes from APL Apollo, Tata & JSW — trusted for heavy-duty construction needs.',
    image: '/images/products/ms-pipe.png',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    desc: 'Corner trims, ridge covers, flashing, gutter boxes, turbo ventilators, and fixing screws to finish the job.',
    image: '/images/products/accessories/corner-accessory.png',
  },
];

export default function ProductsPage() {
  return (
    <>
      <SimpleHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Our Catalogue</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Products</h1>
          <p className="font-body text-xl text-white/80 max-w-2xl mx-auto">
            Roofing sheets, structural steel, and accessories — factory-direct wholesale supply from our Kanpur facility.
          </p>
        </SectionContainer>
      </SimpleHero>

      <SectionContainer className="py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="glow-card rounded-xl overflow-hidden group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-heading text-navy text-lg font-bold mb-2 group-hover:text-orange transition-colors">{p.name}</h2>
                <p className="font-body text-navy/60 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="bg-steel/5 border-y border-navy/8">
        <div className="text-center mb-10">
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">
            Explore Our Range
          </p>
          <h2 className="font-heading text-navy text-2xl sm:text-3xl font-bold leading-tight mb-3">
            Colour Coated Roofing Sheet Brands &amp; Variants
          </h2>
          <p className="font-body text-navy/60 text-base max-w-xl mx-auto">
            We stock colour coated roofing sheets across leading brands in both PPGL and PPGI categories, plus matching accessories.
          </p>
        </div>
        <CcrsBrandExplorer ppglBrands={PPGL_BRANDS} ppgiBrands={PPGI_BRANDS} />
      </SectionContainer>
    </>
  );
}
