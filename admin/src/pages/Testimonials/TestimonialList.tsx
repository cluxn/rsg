import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { getTestimonialsAdmin, deleteTestimonial, type Testimonial } from '@/lib/api';

export function TestimonialListPage() {
  const qc = useQueryClient();
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['testimonials-admin'],
    queryFn: getTestimonialsAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials-admin'] }),
  });

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl text-navy">Testimonials</h1>
          <Link to="/testimonials/create">
            <Button>Add Testimonial</Button>
          </Link>
        </div>
        {isLoading ? (
          <p className="text-navy/60">Loading…</p>
        ) : testimonials.length === 0 ? (
          <p className="text-navy/60">No testimonials yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy/5 text-navy/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Text</th>
                  <th className="px-4 py-3 font-semibold">Author</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Active</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map(t => (
                  <tr key={t.id} className="border-t border-navy/10">
                    <td className="px-4 py-3 text-navy max-w-xs">
                      <span className="line-clamp-2">{t.text.length > 60 ? t.text.slice(0, 60) + '…' : t.text}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">{t.author_name}</td>
                    <td className="px-4 py-3 text-navy/60 text-xs">{t.author_city ?? '—'}</td>
                    <td className="px-4 py-3 text-navy/60 text-xs">{t.rating ? `${t.rating}★` : '—'}</td>
                    <td className="px-4 py-3 text-navy/60 text-xs capitalize">{t.source}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${t.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {t.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link to={`/testimonials/edit/${t.id}`} className="text-steel hover:underline text-xs font-semibold">Edit</Link>
                      <button
                        onClick={() => handleDelete(t.id, t.author_name)}
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
