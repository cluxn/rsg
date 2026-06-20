import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { AnimationObserver } from '@/components/ui/AnimationObserver';
import { getSettings } from '@/lib/api';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let settings: Record<string, string> = {};
  try {
    settings = await getSettings();
  } catch {
    // backend unreachable — WhatsApp button hidden, other layout elements still render
  }
  return (
    <>
      <SiteHeader whatsappNumber={settings.whatsapp_number} />
      <AnimationObserver />
      <main className="pt-16 overflow-x-hidden">{children}</main>
      <SiteFooter
        address={settings.business_address}
        phone={settings.business_phone}
        email={settings.business_email}
        hours={settings.business_hours}
      />
      <WhatsAppFloat number={settings.whatsapp_number ?? ''} />
    </>
  );
}
