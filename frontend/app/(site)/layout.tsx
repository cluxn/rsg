import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
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
      <SiteHeader />
      <main className="pt-16">{children}</main>
      <SiteFooter />
      <WhatsAppFloat number={settings.whatsapp_number ?? ''} />
    </>
  );
}
