import Link from 'next/link';
import Image from 'next/image';

interface BrandLink {
  name: string;
  slug: string;
}

interface CcrsBrandExplorerProps {
  ppglBrands: BrandLink[];
  ppgiBrands: BrandLink[];
}

const tagStyle: Record<string, string> = {
  PPGL: 'text-orange border-orange/30 bg-orange/5',
  PPGI: 'text-steel border-steel/30 bg-steel/5',
  Accessory: 'text-graphite border-graphite/30 bg-graphite/5',
};

const BRAND_IMAGE: Record<string, string> = {
  'jsw-colouron':   '/images/products/brands/jsw-colouron.jpg',
  'jsw-silveron':   '/images/products/brands/jsw-silveron.jpg',
  'jsw-pragati':    '/images/products/brands/jsw-pragati.jpg',
  'jsw-endura':     '/images/products/brands/jsw-endura.jpg',
  'tata-durashine': '/images/products/brands/tata-durashine.jpg',
  'jindal-sabrang': '/images/products/brands/jindal-sabrang.jpg',
  'dura-glow':      '/images/products/brands/dura-glow.png',
  'am-ns':          '/images/products/brands/am-ns.jpg',
  'accessories':    '/images/products/accessories/accessories-overview.jpg',
};

function BrandTile({ name, slug, tag }: BrandLink & { tag: string }) {
  return (
    <Link
      href={`/products/${slug}`}
      className="flex flex-col bg-white border border-navy/10 rounded-lg overflow-hidden hover:border-orange/40 hover:shadow-md transition-all group"
    >
      <div className="relative w-full aspect-[16/10] bg-steel/5 overflow-hidden">
        <Image
          src={BRAND_IMAGE[slug]}
          alt={name}
          fill
          className={tag === 'Accessory' ? 'object-contain p-6' : 'object-cover'}
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="flex flex-col gap-1.5 min-w-0">
          <span className={`self-start font-body text-[10px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-sm border ${tagStyle[tag]}`}>
            {tag}
          </span>
          <span className="font-heading text-sm font-bold text-navy group-hover:text-orange transition-colors truncate">{name}</span>
        </span>
        <svg className="w-4 h-4 text-navy/25 group-hover:text-orange group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export function CcrsBrandExplorer({ ppglBrands, ppgiBrands }: CcrsBrandExplorerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {ppglBrands.map((b) => (
        <BrandTile key={b.slug} {...b} tag="PPGL" />
      ))}
      {ppgiBrands.map((b) => (
        <BrandTile key={b.slug} {...b} tag="PPGI" />
      ))}
      <BrandTile name="Roofing Accessories" slug="accessories" tag="Accessory" />
    </div>
  );
}
