import Link from 'next/link';
import type { BlogListItem } from '@/lib/content';

export function BlogCard({ post }: { post: BlogListItem }) {
  const date = new Date(post.published_at ?? post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 border border-steel/10">
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs font-semibold text-steel uppercase tracking-widest mb-2">Industry Insights</p>
        <h2 className="font-heading text-xl font-semibold text-navy leading-snug mb-3 line-clamp-2">{post.title}</h2>
        {post.meta_description && (
          <p className="text-base text-navy/70 mb-4 flex-1 line-clamp-3">{post.meta_description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-steel/10">
          <span className="text-sm text-navy/50">{date}</span>
          <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-steel hover:text-cyan transition-colors">
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
