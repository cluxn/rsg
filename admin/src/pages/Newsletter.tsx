import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  subscribed_at: string;
  active: number;
}

interface SubscribersResponse { subscribers: Subscriber[]; total: number; }

export function NewsletterPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery<SubscribersResponse>({
    queryKey: ['newsletter'],
    queryFn: () => api.get('/newsletter').then(r => r.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/newsletter/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['newsletter'] }),
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-heading text-2xl text-navy">Newsletter Subscribers</h1>
            <p className="font-body text-navy/60 text-sm mt-0.5">
              {data ? `${data.total} subscriber${data.total !== 1 ? 's' : ''}` : 'All subscribers'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/api/newsletter/export', '_blank')}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        </div>

        {isLoading && <p className="text-navy/60 p-8">Loading…</p>}
        {isError && <p className="text-red-600 p-8">Failed to load subscribers.</p>}

        {!isLoading && !isError && data && data.subscribers.length === 0 && (
          <p className="text-navy/60 p-8">No subscribers yet.</p>
        )}

        {!isLoading && !isError && data && data.subscribers.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-navy/5 border-b border-navy/10">
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Subscribed</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.subscribers.map(sub => (
                  <tr key={sub.id} className="border-t border-navy/8 hover:bg-navy/[0.02]">
                    <td className="px-4 py-3 font-medium text-navy">{sub.email}</td>
                    <td className="px-4 py-3 text-navy/60">{sub.name ?? '—'}</td>
                    <td className="px-4 py-3 text-navy/50 text-xs whitespace-nowrap">
                      {new Date(sub.subscribed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteMut.mutate(sub.id)}
                        disabled={deleteMut.isPending}
                        className="px-2 py-1 rounded border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        Remove
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
