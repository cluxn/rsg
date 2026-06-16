import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { getBlogPostsAdmin, deleteBlogPost, type BlogPost } from '@/lib/api';

export function BlogListPage() {
  const qc = useQueryClient();
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog-admin'],
    queryFn: getBlogPostsAdmin,
  });

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
        {isLoading ? (
          <p className="text-navy/60">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-navy/60">No posts yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy/5 text-navy/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Published At</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-t border-navy/10 hover:bg-navy/2">
                    <td className="px-4 py-3 font-medium text-navy">{post.title}</td>
                    <td className="px-4 py-3 text-navy/60 font-mono text-xs">{post.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
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
