import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { getEventsAdmin, deleteEvent, type EventRecord } from '@/lib/api';

export function EventListPage() {
  const qc = useQueryClient();
  const { data: events = [], isLoading } = useQuery<EventRecord[]>({
    queryKey: ['events-admin'],
    queryFn: getEventsAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events-admin'] }),
  });

  const handleDelete = (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl text-navy">Events & News</h1>
          <Link to="/events/create">
            <Button>New Event</Button>
          </Link>
        </div>
        {isLoading ? (
          <p className="text-navy/60">Loading…</p>
        ) : events.length === 0 ? (
          <p className="text-navy/60">No events yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy/5 text-navy/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Event Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} className="border-t border-navy/10">
                    <td className="px-4 py-3 font-medium text-navy">{event.title}</td>
                    <td className="px-4 py-3 text-navy/60 text-xs">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${event.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {event.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link to={`/events/edit/${event.id}`} className="text-steel hover:underline text-xs font-semibold">Edit</Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
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
