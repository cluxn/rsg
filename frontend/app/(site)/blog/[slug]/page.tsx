import { getBlogPost, getBlogPosts, BLOG_COVER_PLACEHOLDER } from '@/lib/content';
import { extractToc } from '@/lib/toc';
import { BlogPostBody } from '@/components/blog/BlogPostBody';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { BlogLeadForm } from '@/components/blog/BlogLeadForm';
import { BlogCard } from '@/components/blog/BlogCard';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ContactFormSection } from '@/components/sections/ContactFormSection';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rsgprofilesheets.com';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };
  const title = post.meta_title ?? `${post.title} | RSG Profile Manufacturing`;
  const description = post.meta_description ?? post.excerpt ?? undefined;
  return {
    title,
    description,
    alternates: { canonical: post.canonical_url ?? `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      type: 'article',
      ...(post.og_image ? { images: [post.og_image] } : {}),
    },
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map(p => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPost(slug), getBlogPosts()]);
  if (!post) notFound();

  const { html: bodyWithIds, toc } = extractToc(post.body ?? '');

  const date = new Date(post.published_at ?? post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const recommended = allPosts.filter(p => p.slug !== slug).slice(0, 3);
  const postUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <>
      {/* Hero — consistent with blog list page: gradient-power, centered, padded */}
      <section className="gradient-power w-full flex items-center justify-center min-h-[300px]">
        <div className="w-full py-16 text-center">
          <SectionContainer noPadding>
            {(post.category || post.service) && (
              <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">
                {post.service || post.category}
              </p>
            )}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-3 max-w-3xl mx-auto">{post.title}</h1>
            <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
              {post.author_name && <span>{post.author_name}</span>}
              <span>{date}</span>
            </div>
          </SectionContainer>
        </div>
      </section>

      {/* Cover image + article body */}
      <div className="gradient-mesh-light">
        {/* Cover image — contained, not full-bleed */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-2">
          <div className="relative w-full h-56 md:h-80 overflow-hidden rounded-2xl shadow-md">
            <Image
              src={post.featured_image || BLOG_COVER_PLACEHOLDER}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* 3-column content */}
        <SectionContainer className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-8 items-start">

            {/* Left: TOC + Share */}
            <aside className="lg:sticky lg:top-24 self-start space-y-8">
              <TableOfContents items={toc} />
              <ShareButtons url={postUrl} title={post.title} />
            </aside>

            {/* Center: article body */}
            <article className="min-w-0">
              <BlogPostBody html={bodyWithIds} />
            </article>

            {/* Right: lead form */}
            <aside className="lg:sticky lg:top-24 self-start">
              <BlogLeadForm sourcePage={`blog/${slug}`} />
            </aside>
          </div>
        </SectionContainer>
      </div>

      {/* Recommended posts */}
      {recommended.length > 0 && (
        <div className="border-t border-navy/10 bg-navy/[0.02]">
          <SectionContainer className="py-12">
            <h2 className="font-heading text-2xl text-navy font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommended.map(p => <BlogCard key={p.slug} post={p} />)}
            </div>
          </SectionContainer>
        </div>
      )}

      {/* Contact form section — exact homepage section */}
      <ContactFormSection sourcePage={`blog/${slug}`} />
    </>
  );
}
