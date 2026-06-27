import type { Metadata } from 'next';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';

export const metadata: Metadata = {
  title: 'Privacy Policy | RSG Profile Manufacturing',
  description: 'Privacy policy for RSG Profile Manufacturing Pvt Ltd — how we collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SimpleHero minHeight="min-h-[220px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Legal</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-2">Privacy Policy</h1>
          <p className="font-body text-white/60 text-sm">Last updated: June 2026</p>
        </SectionContainer>
      </SimpleHero>

      <div className="gradient-mesh-light">
        <SectionContainer className="py-12">
          <div className="max-w-3xl mx-auto prose prose-neutral prose-headings:font-heading prose-headings:text-navy prose-p:font-body prose-p:text-ink/75 prose-li:font-body prose-li:text-ink/75">

            <h2>1. Information We Collect</h2>
            <p>When you submit a quote request, contact form, or event registration on our website, we collect:</p>
            <ul>
              <li>Full name</li>
              <li>Phone number</li>
              <li>Email address (where provided)</li>
              <li>Company name (where provided)</li>
              <li>Message or enquiry details</li>
            </ul>
            <p>We do not collect payment information through this website.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information you provide solely to:</p>
            <ul>
              <li>Respond to your enquiry or quote request</li>
              <li>Send event registration confirmations</li>
              <li>Contact you regarding products or services you have expressed interest in</li>
            </ul>
            <p>We do not use your information for automated profiling or sell it to third parties.</p>

            <h2>3. WhatsApp Communication</h2>
            <p>If you click a WhatsApp link on our website, you will be redirected to WhatsApp. Any conversation that takes place is subject to WhatsApp's own privacy policy. We will not initiate contact via WhatsApp without your consent.</p>

            <h2>4. Data Storage</h2>
            <p>Form submissions are stored securely in our CMS database hosted on a private server. Access is restricted to authorised RSG staff only. We retain enquiry data for a maximum of 3 years unless you request earlier deletion.</p>

            <h2>5. Cookies</h2>
            <p>Our website uses minimal, essential cookies required for the site to function. We do not use advertising or tracking cookies. No personal data is stored in cookies.</p>

            <h2>6. Third-Party Services</h2>
            <p>Our website may link to third-party platforms (IndiaMART, JustDial, Google). We are not responsible for the privacy practices of those platforms. Please review their respective privacy policies before submitting information.</p>

            <h2>7. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of any personal data we hold about you by contacting us at:</p>
            <p>
              <strong>Email:</strong> shivamgupta@rsgprofilesheets.com<br />
              <strong>Phone:</strong> +91-9918522988
            </p>
            <p>We will respond to all valid requests within 15 business days.</p>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of our website after any change constitutes acceptance of the updated policy.</p>

            <h2>9. Contact</h2>
            <p>RSG Profile Manufacturing Pvt Ltd<br />
            53-A, Industrial Estate, Dada Nagar, Kanpur, UP 208022<br />
            +91-9918522988</p>

          </div>
        </SectionContainer>
      </div>
    </>
  );
}
