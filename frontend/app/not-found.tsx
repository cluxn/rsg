import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { NotFoundLogger } from '@/components/ui/NotFoundLogger';
import { getSettings } from '@/lib/api';

export default async function NotFound() {
  let settings: Record<string, string> = {};
  try {
    settings = await getSettings();
  } catch {
    // backend unreachable — header/footer still render with defaults
  }

  return (
    <>
      <NotFoundLogger />
      <SiteHeader whatsappNumber={settings.whatsapp_number} />
      <main className="pt-16">
        <div className="min-h-[460px] flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-heading text-navy text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="font-body text-navy/60 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link href="/" className="font-body text-steel underline">
            Back to Home
          </Link>
        </div>
      </main>
      <SiteFooter
        address={settings.business_address}
        phone={settings.business_phone}
        email={settings.business_email}
      />
    </>
  );
}
