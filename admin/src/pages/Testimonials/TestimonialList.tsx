import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
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
      <ContentTabs />
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
                  <th className="px-4 py-3 font-semibold">Author</th>
                  <th className="px-4 py-3 font-semibold">Company / Designation</th>
                  <th className="px-4 py-3 font-semibold">Product Bought</th>
                  <th className="px-4 py-3 font-semibold">Review</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Shown On</th>
                  <th className="px-4 py-3 font-semibold">Active</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map(t => (
                  <tr key={t.id} className="border-t border-navy/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {t.author_image
                          ? <img src={t.author_image} alt={t.author_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          : <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy/40 text-xs font-bold shrink-0">{t.author_name[0]}</div>
                        }
                        <div>
                          <p className="font-medium text-navy text-sm">{t.author_name}</p>
                          {t.author_city && <p className="text-xs text-navy/50">{t.author_city}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy/60 text-xs">
                      {t.company && <p className="font-medium text-navy/80">{t.company}</p>}
                      {t.designation && <p>{t.designation}</p>}
                      {!t.company && !t.designation && '—'}
                    </td>
                    <td className="px-4 py-3 text-navy/60 text-xs">{t.product_bought ?? '—'}</td>
                    <td className="px-4 py-3 text-navy max-w-xs">
                      <span className="line-clamp-2 text-sm">{t.text.length > 60 ? t.text.slice(0, 60) + '…' : t.text}</span>
                    </td>
                    <td className="px-4 py-3 text-navy/60 text-xs">{t.rating ? `${t.rating}★` : '—'}</td>
                    <td className="px-4 py-3 text-navy/60 text-xs capitalize">{t.source}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.active && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-steel/10 text-steel" title="Shown on the Testimonials page because it's active">
                            Testimonials
                          </span>
                        )}
                        {t.show_on_home && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-orange/10 text-orange">Home</span>
                        )}
                        {t.show_on_about && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-navy/10 text-navy/70">About</span>
                        )}
                        {!t.active && !t.show_on_home && !t.show_on_about && (
                          <span className="text-navy/30 text-xs">Not shown</span>
                        )}
                      </div>
                    </td>
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
