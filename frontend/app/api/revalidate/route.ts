import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { secret, path, tag } = await req.json() as { secret?: string; path?: string; tag?: string };
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (path) revalidatePath(path, 'page');
  if (tag) revalidateTag(tag as string);
  return Response.json({ revalidated: true, timestamp: Date.now() });
}
