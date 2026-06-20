export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seen: Record<string, number> = {};

  const processedHtml = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (_match, tag: string, attrs: string, inner: string) => {
    const level = parseInt(tag[1]) as 2 | 3;
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'section';

    seen[base] = (seen[base] ?? 0) + 1;
    const id = seen[base] === 1 ? base : `${base}-${seen[base]}`;

    toc.push({ id, text, level });
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  return { html: processedHtml, toc };
}
