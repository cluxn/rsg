import Image from 'next/image';

interface AccessoryItem {
  name: string;
  image: string;
  description: string;
  specs: string[];
}

const ACCESSORIES: AccessoryItem[] = [
  {
    name: 'Corner Accessories',
    image: '/images/products/accessories/corner-accessory.png',
    description: 'Seals and protects external and internal roof or wall corners where two sheets meet at an angle, giving a leak-proof, finished edge.',
    specs: ['GI / Aluminium / Colour-coated steel', '0.40mm – 0.80mm thickness', '10 ft standard length', '90° bend, PPGI/PPGL coated'],
  },
  {
    name: 'Turbo Air Ventilator',
    image: '/images/products/accessories/turbo-fan.png',
    description: 'Wind-driven roof ventilator that continuously extracts hot air, smoke, dust, and humidity from industrial sheds — no electricity required.',
    specs: ['450mm / 600mm / 750mm sizes', 'Aluminium / GI blades', 'Power-free, wind-driven operation'],
  },
  {
    name: 'Self-Drilling Screws',
    image: '/images/products/accessories/self-drilling-screws.png',
    description: 'Corrosion-resistant fixing screws for attaching roofing sheets to steel or wooden purlins — fast installation with a tight, permanent grip.',
    specs: ['5.5mm x 25mm – 6.3mm x 100mm', 'Zinc plated / Ruspert coated', 'Bonded EPDM sealing washer'],
  },
  {
    name: 'AZ-70 Coated Plain Ridge Cover',
    image: '/images/products/accessories/ridge-cover.png',
    description: 'Fits over the roof apex where two sheets meet, creating a watertight seal that keeps out rain, dust, and wind at the ridge line.',
    specs: ['AZ-70 Aluminium-Zinc coated steel', 'V-profile ridge seal', 'Custom lengths on order'],
  },
  {
    name: 'Metal Roof Flashing',
    image: '/images/products/accessories/metal-roof-flashing.png',
    description: 'Installed at joints, edges, and roof transitions — around vents, skylights, and wall intersections — to direct water away and prevent leaks.',
    specs: ['GI / Aluminium / Colour-coated steel', 'Custom-formed for site profile', 'Watertight joint sealing'],
  },
  {
    name: 'D-Style Gutter Box',
    image: '/images/products/accessories/d-style-gutter-box.png',
    description: 'A D-profile rainwater gutter built for efficient water flow, combining a flat box back with a smooth curved front for clean drainage.',
    specs: ['GI / Aluminium / Colour-coated steel', 'Corrosion-resistant finish', 'Custom lengths on order'],
  },
];

export function AccessoryShowcase() {
  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      {ACCESSORIES.map((item, i) => (
        <div
          key={item.name}
          className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
        >
          <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden border border-navy/8 bg-white shadow-sm shrink-0">
            <Image src={item.image} alt={item.name} fill className="object-contain p-6" />
          </div>
          <div className="w-full lg:w-1/2">
            <h3 className="font-heading text-navy text-xl lg:text-2xl font-bold mb-3">{item.name}</h3>
            <p className="font-body text-navy/70 text-base leading-relaxed mb-5">{item.description}</p>
            <ul className="flex flex-col gap-2 mb-6">
              {item.specs.map((s) => (
                <li key={s} className="flex items-start gap-2.5 font-body text-navy/70 text-sm">
                  <svg className="w-4 h-4 text-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
