import type { Metadata } from "next";
import { Sora, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import { getSettings } from "@/lib/api";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-sans",
});

const SITE_URL = 'https://rsgprofilesheets.com';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'RSG Profile Manufacturing Pvt. Ltd.',
  url: SITE_URL,
  logo: `${SITE_URL}/rsg-logo.png`,
  image: `${SITE_URL}/images/hero/industrial-bg.webp`,
  description: 'Premium quality roofing sheets, structural steel, and building materials manufacturer based in Kanpur, Uttar Pradesh.',
  telephone: '+91-9918522988',
  email: 'info@rsgprofilesheets.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dada Nagar Industrial Estate',
    addressLocality: 'Kanpur',
    addressRegion: 'Uttar Pradesh',
    postalCode: '208022',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '26.4499',
    longitude: '80.3319',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00',
    closes: '18:00',
  },
  sameAs: [
    'https://www.google.com/maps/search/RSG+Profile+Manufacturing+Pvt+Ltd,+Dada+Nagar+Industrial+Estate,+Kanpur',
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'RSG Profile Manufacturing',
      template: '%s | RSG Profile Manufacturing',
    },
    description: 'Premium quality roofing sheets, structural steel, and building materials manufacturer.',
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: 'RSG Profile Manufacturing',
      locale: 'en_IN',
      images: [{ url: '/images/hero/industrial-bg.webp', width: 1920, height: 1080, alt: 'RSG Profile Manufacturing' }],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let headScripts = '';
  try {
    const settings = await getSettings();
    headScripts = settings.seo_head_scripts ?? '';
  } catch {
    // backend unreachable — no scripts injected, page still renders
  }

  const scriptContent = headScripts
    ? headScripts.replace(/^\s*<script[^>]*>/i, '').replace(/<\/script>\s*$/i, '')
    : '';

  return (
    <html lang="en" className={`${sora.variable} ${sourceSans.variable}`}>
      <body className="font-body antialiased bg-off-white text-ink min-h-screen" suppressHydrationWarning>
        {/* dangerouslySetInnerHTML used intentionally — only auth-gated admin can write seo_head_scripts */}
        {scriptContent && (
          <Script
            id="seo-head-scripts"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: scriptContent }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
        {children}
      </body>
    </html>
  );
}
