import { getBlogPosts } from '@/lib/content';
import { BlogCard } from '@/components/blog/BlogCard';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { GradientHero } from '@/components/ui/GradientHero';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | RSG Profile Manufacturing',
  description: 'Industry insights, roofing guides, and product updates from RSG Profile Manufacturing.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <GradientHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">RSG BLOG</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Industry Insights</h1>
          <p className="font-body text-xl text-white/80 max-w-2xl mx-auto">
            Roofing guides, product updates, and news from RSG Profile Manufacturing
          </p>
        </SectionContainer>
      </GradientHero>
      <SectionContainer className="py-16">
        {posts.length === 0 ? (
          <p className="text-center text-navy/50 py-16 text-lg">No posts yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
        )}
      </SectionContainer>
    </>
  );
}
