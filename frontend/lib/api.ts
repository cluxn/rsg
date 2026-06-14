const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function getSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${API_BASE}/api/settings`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`getSettings failed: ${res.status}`);
  return res.json();
}
