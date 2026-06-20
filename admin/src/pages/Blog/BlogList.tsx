import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { getBlogPostsAdmin, deleteBlogPost, type BlogPost, type ContentStatus } from '@/lib/api';

const STATUS_COLORS: Record<ContentStatus, string> = {
  published: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  draft: 'bg-yellow-100 text-yellow-700',
};

export function BlogListPage() {
  const qc = useQueryClient();
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog-admin'],
    queryFn: getBlogPostsAdmin,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | ContentStatus>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const categories = useMemo(() => [...new Set(posts.map(p => p.category).filter(Boolean))] as string[], [posts]);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (dateFrom && p.published_at && p.published_at < dateFrom) return false;
      if (dateTo && p.published_at && p.published_at > dateTo + 'T23:59:59') return false;
      return true;
    });
  }, [posts, search, statusFilter, categoryFilter, dateFrom, dateTo]);

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-admin'] }),
  });

  const handleDelete = (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <ContentTabs />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl text-navy">Blog</h1>
          <Link to="/blog/create">
            <Button>New Post</Button>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by title…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-navy/20 rounded-lg px-3 py-2 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-steel min-w-[200px]"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as '' | ContentStatus)}
            className="border border-navy/20 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-steel"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-navy/20 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-steel"
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <span className="text-xs text-navy/50">Published from</span>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="border border-navy/20 rounded-lg px-2 py-2 text-sm text-navy outline-none focus:border-steel"
            />
            <span className="text-xs text-navy/50">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="border border-navy/20 rounded-lg px-2 py-2 text-sm text-navy outline-none focus:border-steel"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-navy/60">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-navy/60">{posts.length === 0 ? 'No posts yet.' : 'No posts match your filters.'}</p>
        ) : (
          <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy/5 text-navy/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Scheduled At</th>
                  <th className="px-4 py-3 font-semibold">Published At</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id} className="border-t border-navy/10 hover:bg-navy/[0.02]">
                    <td className="px-4 py-3 font-medium text-navy">{post.title}</td>
                    <td className="px-4 py-3 text-navy/60 text-xs">{post.category || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[post.status]}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-navy/60 text-xs">
                      {post.scheduled_at ? new Date(post.scheduled_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-navy/60 text-xs">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link to={`/blog/edit/${post.id}`} className="text-steel hover:underline text-xs font-semibold">Edit</Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-red-500 hover:underline text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
