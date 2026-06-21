import HomeQuoteForm from '@/app/(site)/HomeQuoteForm';

interface ContactFormSectionProps {
  waNumber?: string;
  sourcePage?: string;
}

export function ContactFormSection({ waNumber = '919918522988', sourcePage = 'contact-section' }: ContactFormSectionProps) {
  return (
    <section className="bg-[#f0ebe0] py-24 md:py-32">
      <div className="mx-auto max-w-container px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

          {/* Left — CTA + map */}
          <div className="flex flex-col gap-6 py-4">
            <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em]">Get A Quote</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy leading-snug">
              Get Premium Roofing &amp; Steel at Factory-Direct Wholesale Prices — Across UP.
            </h2>
            <p className="font-heading text-sm font-bold text-ink/70 tracking-widest uppercase">
              Roofing Sheets &nbsp;|&nbsp; Structural Steel &nbsp;|&nbsp; Accessories
            </p>
            <p className="font-body text-ink/65 text-base leading-relaxed">
              Source ISI-certified roofing sheets, MS pipes, purlins, and structural steel directly from our Kanpur
              manufacturing facility. We supply contractors, builders, and traders across Uttar Pradesh at trade
              pricing — with delivery in 2–3 days.
            </p>
            <div className="rounded-xl overflow-hidden border border-[#ddd4be] shadow-sm flex-1 min-h-[220px]">
              <iframe
                src="https://maps.google.com/maps?q=RSG+Profile+Manufacturing+Pvt+Ltd,+Dada+Nagar+Industrial+Estate,+Kanpur&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                title="RSG Profile Manufacturing — Kanpur facility"
                className="block w-full h-full min-h-[220px]"
              />
            </div>
            <div>
              <a
                href={`https://wa.me/${waNumber}?text=Hi%2C%20I%20would%20like%20to%20get%20a%20bulk%20quote%20for%20roofing%20and%20steel%20materials.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 shadow-md hover:shadow-glow-orange hover:-translate-y-0.5 transition-all duration-200"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right — Quote form card */}
          <div className="bg-white/70 border border-[#ddd4be] rounded-2xl shadow-md p-6 lg:p-8">
            <p className="font-heading text-base font-bold text-ink mb-5">Send an Enquiry</p>
            <HomeQuoteForm sourcePage={sourcePage} />
          </div>

        </div>
      </div>
    </section>
  );
}
