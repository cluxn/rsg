import { getBlogPost, getBlogPosts } from '@/lib/content';
import { BlogPostBody } from '@/components/blog/BlogPostBody';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.meta_title ?? `${post.title} | RSG Profile Manufacturing`,
    description: post.meta_description ?? undefined,
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const date = new Date(post.published_at ?? post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  return (
    <>
      <div className="bg-gradient-to-br from-navy via-steel to-cyan py-16 px-4">
        <SectionContainer noPadding>
          <Link href="/blog" className="text-cyan/80 hover:text-cyan text-sm mb-4 inline-block">← Back to Blog</Link>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-3">{post.title}</h1>
          <p className="text-white/60 text-sm">{date}</p>
        </SectionContainer>
      </div>
      <SectionContainer className="py-16">
        <div className="max-w-3xl mx-auto">
          <BlogPostBody html={post.body} />
        </div>
      </SectionContainer>
    </>
  );
}
