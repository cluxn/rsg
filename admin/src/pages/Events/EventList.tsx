import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { getEventsAdmin, deleteEvent, type EventRecord, type ContentStatus } from '@/lib/api';

const STATUS_COLORS: Record<ContentStatus, string> = {
  published: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  draft: 'bg-yellow-100 text-yellow-700',
};

export function EventListPage() {
  const qc = useQueryClient();
  const { data: events = [], isLoading } = useQuery<EventRecord[]>({
    queryKey: ['events-admin'],
    queryFn: getEventsAdmin,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | ContentStatus>('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const eventTypes = useMemo(() => [...new Set(events.map(e => e.event_type).filter(Boolean))] as string[], [events]);

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      if (eventTypeFilter && e.event_type !== eventTypeFilter) return false;
      if (dateFrom && e.published_at && e.published_at < dateFrom) return false;
      if (dateTo && e.published_at && e.published_at > dateTo + 'T23:59:59') return false;
      return true;
    });
  }, [events, search, statusFilter, eventTypeFilter, dateFrom, dateTo]);

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
      <ContentTabs />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl text-navy">Events & News</h1>
          <Link to="/events/create">
            <Button>New Event</Button>
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
            value={eventTypeFilter}
            onChange={e => setEventTypeFilter(e.target.value)}
            className="border border-navy/20 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-steel"
          >
            <option value="">All event types</option>
            {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
          <p className="text-navy/60">{events.length === 0 ? 'No events yet.' : 'No events match your filters.'}</p>
        ) : (
          <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy/5 text-navy/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Event Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Scheduled At</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(event => (
                  <tr key={event.id} className="border-t border-navy/10 hover:bg-navy/[0.02]">
                    <td className="px-4 py-3 font-medium text-navy">{event.title}</td>
                    <td className="px-4 py-3 text-navy/60 text-xs">{event.event_type || '—'}</td>
                    <td className="px-4 py-3 text-navy/60 text-xs">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[event.status]}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-navy/60 text-xs">
                      {event.scheduled_at ? new Date(event.scheduled_at).toLocaleDateString('en-IN') : '—'}
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
