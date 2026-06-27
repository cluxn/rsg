import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface ActiveRedirect {
  from_path: string;
  to_path: string;
  status_code: number;
}

let cachedRedirects: ActiveRedirect[] | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

async function getActiveRedirects(): Promise<ActiveRedirect[]> {
  const now = Date.now();
  if (cachedRedirects && now < cacheExpiry) return cachedRedirects;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/redirects/active`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return cachedRedirects ?? [];
    const data = (await res.json()) as ActiveRedirect[];
    cachedRedirects = data;
    cacheExpiry = now + CACHE_TTL_MS;
    return data;
  } catch {
    return cachedRedirects ?? [];
  }
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only match non-API, non-asset, non-Next-internal paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/uploads/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const redirects = await getActiveRedirects();
  const match = redirects.find(r => r.from_path === pathname);
  if (match) {
    const url = req.nextUrl.clone();
    url.pathname = match.to_path;
    return NextResponse.redirect(url, { status: match.status_code });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
