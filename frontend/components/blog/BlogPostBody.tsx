export function BlogPostBody({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-navy/80 prose-a:text-steel prose-strong:text-navy prose-li:text-navy/80"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
