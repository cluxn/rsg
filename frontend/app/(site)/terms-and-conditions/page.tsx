import type { Metadata } from 'next';
import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionContainer } from '@/components/layout/SectionContainer';

export const metadata: Metadata = {
  title: 'Terms & Conditions | RSG Profile Manufacturing',
  description: 'Terms and conditions governing the use of the RSG Profile Manufacturing website and purchase of our products.',
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <SimpleHero minHeight="min-h-[220px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">Legal</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-2">Terms &amp; Conditions</h1>
          <p className="font-body text-white/60 text-sm">Last updated: June 2026</p>
        </SectionContainer>
      </SimpleHero>

      <div className="gradient-mesh-light">
        <SectionContainer className="py-12">
          <div className="max-w-3xl mx-auto prose prose-neutral prose-headings:font-heading prose-headings:text-navy prose-p:font-body prose-p:text-ink/75 prose-li:font-body prose-li:text-ink/75">

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the RSG Profile Manufacturing website (rsgprofilesheets.com), you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of the site immediately.</p>

            <h2>2. About Us</h2>
            <p>RSG Profile Manufacturing Pvt Ltd is a manufacturer and supplier of ISI-certified roofing sheets and structural steel products, headquartered in Kanpur, Uttar Pradesh, India.</p>

            <h2>3. Use of the Website</h2>
            <p>You may use this website for lawful purposes only. You agree not to:</p>
            <ul>
              <li>Submit false or misleading information through any form</li>
              <li>Attempt to gain unauthorised access to any part of the site or its backend systems</li>
              <li>Use the site to distribute spam, malware, or unsolicited communications</li>
              <li>Reproduce, duplicate, or copy any content from this site without prior written permission</li>
            </ul>

            <h2>4. Product Information</h2>
            <p>Product specifications, pricing, and availability displayed on this website are indicative only and subject to change without notice. Final pricing is confirmed at the time of order placement. All products are subject to stock availability.</p>

            <h2>5. Enquiries and Quote Requests</h2>
            <p>Submitting an enquiry or quote request through our website does not constitute a binding order or contract. An order is only confirmed upon written confirmation from RSG Profile Manufacturing and receipt of applicable advance payment.</p>

            <h2>6. Intellectual Property</h2>
            <p>All content on this website — including text, images, logos, and graphics — is the property of RSG Profile Manufacturing Pvt Ltd or its content suppliers and is protected under applicable intellectual property laws. Unauthorised use is strictly prohibited.</p>

            <h2>7. Limitation of Liability</h2>
            <p>RSG Profile Manufacturing Pvt Ltd shall not be liable for any indirect, incidental, or consequential damages arising from the use of, or inability to use, this website or its content. The website is provided on an "as is" basis without warranties of any kind.</p>

            <h2>8. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites (e.g. IndiaMART, JustDial). We are not responsible for the content, accuracy, or practices of those external sites. Links are provided for convenience only and do not imply endorsement.</p>

            <h2>9. Governing Law</h2>
            <p>These Terms and Conditions are governed by the laws of India. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Kanpur, Uttar Pradesh.</p>

            <h2>10. Changes to These Terms</h2>
            <p>We reserve the right to update these Terms and Conditions at any time. The date at the top of this page indicates the most recent revision. Continued use of the website after any modification constitutes your acceptance of the revised terms.</p>

            <h2>11. Contact</h2>
            <p>For any questions regarding these terms, please contact us at:</p>
            <p>
              RSG Profile Manufacturing Pvt Ltd<br />
              53-A, Industrial Estate, Dada Nagar, Kanpur, UP 208022<br />
              Email: shivamgupta@rsgprofilesheets.com<br />
              Phone: +91-9918522988
            </p>

          </div>
        </SectionContainer>
      </div>
    </>
  );
}
