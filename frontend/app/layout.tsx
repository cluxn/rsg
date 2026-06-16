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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RSG Profile Manufacturing",
    description: "Premium quality roofing sheets, structural steel, and building materials manufacturer.",
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
        {children}
      </body>
    </html>
  );
}
