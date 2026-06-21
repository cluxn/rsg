import { getBlogPosts } from '@/lib/content';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SimpleHero } from '@/components/ui/SimpleHero';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: settings['meta_title_/blog'] || 'Blog | RSG Profile Manufacturing',
      description: settings['meta_desc_/blog'] || 'Industry insights, roofing guides, and product updates from RSG Profile Manufacturing.',
    };
  } catch {
    return {
      title: 'Blog | RSG Profile Manufacturing',
      description: 'Industry insights, roofing guides, and product updates from RSG Profile Manufacturing.',
    };
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <SimpleHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-cyan/80 tracking-widest uppercase mb-3">RSG BLOG</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Industry Insights</h1>
          <p className="font-body text-xl text-white/80 max-w-2xl mx-auto">
            Roofing guides, product updates, and news from RSG Profile Manufacturing
          </p>
        </SectionContainer>
      </SimpleHero>
      <SectionContainer className="py-16">
        {posts.length === 0 ? (
          <p className="text-center text-navy/50 py-16 text-lg">No posts yet — check back soon.</p>
        ) : (
          <BlogGrid posts={posts} />
        )}
      </SectionContainer>
    </>
  );
}
