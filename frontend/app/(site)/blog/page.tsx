import { getBlogPosts } from '@/lib/content';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SimpleHero } from '@/components/ui/SimpleHero';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const defaults = {
    title: 'Blog | RSG Profile Manufacturing',
    description: 'Industry insights, roofing guides, and product updates from RSG Profile Manufacturing.',
  };
  try {
    const settings = await getSettings();
    const title = settings['meta_title_/blog'] || defaults.title;
    const description = settings['meta_desc_/blog'] || defaults.description;
    return {
      title,
      description,
      alternates: { canonical: '/blog' },
      openGraph: { title, description, url: '/blog', type: 'website' },
    };
  } catch {
    return {
      ...defaults,
      alternates: { canonical: '/blog' },
      openGraph: { ...defaults, url: '/blog', type: 'website' },
    };
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <SimpleHero minHeight="min-h-[300px]">
        <SectionContainer noPadding>
          <p className="font-body text-sm text-orange font-semibold uppercase tracking-[0.18em] mb-3">RSG BLOG</p>
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
