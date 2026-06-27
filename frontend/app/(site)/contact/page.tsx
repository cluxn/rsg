import type { Metadata } from 'next';
import { getSettings } from '@/lib/api';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ContactForm } from './ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const defaults = {
    title: 'Contact Us | RSG Profile Manufacturing',
    description: 'Get in touch with RSG Profile Manufacturing. Address: Dada Nagar Industrial Estate, Kanpur. Mon-Sat 10 AM - 6 PM.',
  };
  try {
    const settings = await getSettings();
    const title = settings['meta_title_/contact'] || defaults.title;
    const description = settings['meta_desc_/contact'] || defaults.description;
    return {
      title,
      description,
      alternates: { canonical: '/contact' },
      openGraph: { title, description, url: '/contact', type: 'website' },
    };
  } catch {
    return {
      ...defaults,
      alternates: { canonical: '/contact' },
      openGraph: { ...defaults, url: '/contact', type: 'website' },
    };
  }
}

export default async function ContactPage() {
  let settings: Record<string, string> = {};
  try { settings = await getSettings(); } catch {}

  const address = settings.business_address ?? '';
  const phone   = settings.business_phone   ?? '9918522988';
  const email   = settings.business_email   ?? 'shivamgupta@rsgprofilesheets.com';

  return (
    <>
      <SimpleHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">CONTACT</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Get In Touch</h1>
          <p className="font-body text-lg text-white/80 max-w-xl mx-auto">Reach us for quotes, product questions, or visit our facility in Kanpur.</p>
        </SectionContainer>
      </SimpleHero>

      <SectionContainer className="gradient-mesh-light">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <div className="flex flex-col h-full">
            <h2 className="font-heading text-2xl text-navy mb-6">Our Office</h2>
            <dl className="space-y-4 font-body text-navy/80">
              <div>
                <dt className="font-semibold text-navy">Email</dt>
                <dd><a href={`mailto:${email}`} className="text-steel hover:text-navy">{email}</a></dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">Phone</dt>
                <dd><a href={`tel:${phone}`} className="text-steel hover:text-navy">{phone}</a></dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">Address</dt>
                <dd>{address}</dd>
              </div>
            </dl>

            <div className="mt-8 flex-1 min-h-[280px] rounded-xl overflow-hidden border border-navy/10 shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=RSG+Profile+Manufacturing+Pvt+Ltd,+Dada+Nagar+Industrial+Estate,+Kanpur&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                title="RSG Profile Manufacturing location"
                className="block w-full h-full"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </SectionContainer>
    </>
  );
}
