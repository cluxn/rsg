'use client';

import { useMemo, useState } from 'react';
import type { BlogListItem } from '@/lib/content';
import { BlogCard } from './BlogCard';

export function BlogGrid({ posts }: { posts: BlogListItem[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [posts]);

  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? posts : posts.filter(p => p.category === active);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActive('All')}
          className={`font-body text-sm font-semibold rounded-full px-4 py-2 transition-colors ${
            active === 'All' ? 'bg-orange text-white' : 'text-navy/60 hover:text-navy'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`font-body text-sm font-semibold rounded-full px-4 py-2 transition-colors ${
              active === cat ? 'bg-orange text-white' : 'text-navy/60 hover:text-navy'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category dropdown (mobile-friendly alternative to pills) */}
      <div className="flex items-center gap-3 mb-10">
        <span className="font-body text-sm font-semibold text-navy/70 shrink-0">Filter By:</span>
        <select
          value={active}
          onChange={e => setActive(e.target.value)}
          className="font-body text-sm text-navy border border-navy/15 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-steel/40 max-w-xs"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-navy/50 py-16 text-lg">No posts in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
