import Link from 'next/link';
import Image from 'next/image';
import type { BlogListItem } from '@/lib/content';
import { BLOG_COVER_PLACEHOLDER } from '@/lib/content';

export function BlogCard({ post }: { post: BlogListItem }) {
  const date = new Date(post.published_at ?? post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  return (
    <article className="glow-card rounded-xl overflow-hidden group flex flex-col">
      <Link href={`/blog/${post.slug}`} className="relative h-48 overflow-hidden block">
        <Image
          src={post.featured_image || BLOG_COVER_PLACEHOLDER}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {post.category && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-navy/90 text-white font-body text-xs font-semibold uppercase tracking-wide px-3 py-1">
            {post.category}
          </span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-heading text-lg font-bold text-navy leading-snug mb-2 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-orange transition-colors">
            {post.title}
          </Link>
        </h2>
        {(post.excerpt || post.meta_description) && (
          <p className="font-body text-sm text-navy/60 mb-4 flex-1 line-clamp-3">
            {post.excerpt ?? post.meta_description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-navy/8">
          <div className="flex flex-col">
            {post.author_name && (
              <span className="font-body text-xs font-semibold text-navy/70">{post.author_name}</span>
            )}
            <span className="font-body text-xs text-navy/45">{date}</span>
          </div>
          <Link href={`/blog/${post.slug}`} className="font-body text-sm font-semibold text-orange hover:text-navy transition-colors shrink-0">
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
