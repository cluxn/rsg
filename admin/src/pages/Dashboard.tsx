import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Package, FileText, Bell, CalendarClock, Megaphone, Clock, Calendar, Plus, X, TrendingUp, BarChart2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { GlassStatCard } from '@/components/ui/GlassStatCard';
import { api } from '@/lib/api';

interface DashboardSummary {
  stats: {
    total_leads: number;
    new_leads: number;
    blog_posts: number;
    published_events: number;
    media_count: number;
  };
  today_followups: { id: number; name: string; phone: string | null; product_interest: string | null; lead_status: string; follow_up_date: string }[];
  new_leads_today: { id: number; name: string; phone: string | null; product_interest: string | null; source_page: string | null; created_at: string }[];
  upcoming_events: { id: number; slug: string; title: string; event_type: string | null; event_date: string | null; location: string | null }[];
  scheduled_posts: { id: number; slug: string; title: string; scheduled_at: string | null; category: string | null }[];
  recent_leads: { id: number; name: string; phone: string | null; product_interest: string | null; lead_status: string; source_page: string | null; created_at: string }[];
  lead_sources: { source_page: string; count: number }[];
  lead_funnel: { new: number; contacted: number; converted: number };
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  meeting_scheduled: 'bg-purple-100 text-purple-700',
  converted: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
  lost: 'bg-red-100 text-red-500',
  junk: 'bg-gray-100 text-gray-400',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const d = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  return `In ${d} days`;
}

export function DashboardPage() {
  const [fabOpen, setFabOpen] = useState(false);
  const { data, isLoading } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: () => api.get('/dashboard/summary').then(r => r.data),
    refetchInterval: 60_000,
  });

  const urgentCount = (data?.today_followups.length ?? 0) + (data?.new_leads_today.length ?? 0);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-7xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl text-navy font-bold">Dashboard</h1>
            <p className="font-body text-navy/50 text-sm mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              <Bell className="w-4 h-4 text-red-500" />
              <span className="font-body text-red-600 text-sm font-semibold">{urgentCount} urgent item{urgentCount > 1 ? 's' : ''} today</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <GlassStatCard label="Total Leads" value={isLoading ? '—' : data?.stats.total_leads ?? 0} icon={<Users className="w-5 h-5" />} />
          <GlassStatCard label="New Leads" value={isLoading ? '—' : data?.stats.new_leads ?? 0} icon={<Bell className="w-5 h-5" />} />
          <GlassStatCard label="Blog Posts" value={isLoading ? '—' : data?.stats.blog_posts ?? 0} icon={<FileText className="w-5 h-5" />} />
          <GlassStatCard label="Events" value={isLoading ? '—' : data?.stats.published_events ?? 0} icon={<Calendar className="w-5 h-5" />} />
          <GlassStatCard label="Products" value={10} icon={<Package className="w-5 h-5" />} />
        </div>

        {/* Priority Alerts */}
        {(!!data?.today_followups.length || !!data?.new_leads_today.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

            {/* Today's Follow-ups */}
            {!!data?.today_followups.length && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarClock className="w-4 h-4 text-orange-500" />
                  <h2 className="font-heading text-sm font-bold text-orange-700 uppercase tracking-wide">
                    Follow-ups Due Today ({data.today_followups.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {data.today_followups.map(lead => (
                    <Link
                      key={lead.id}
                      to="/leads"
                      className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="min-w-0">
                        <p className="font-body text-sm font-semibold text-navy truncate group-hover:text-steel">{lead.name}</p>
                        {lead.product_interest && (
                          <p className="font-body text-xs text-navy/50 truncate">{lead.product_interest}</p>
                        )}
                      </div>
                      <span className={`ml-3 flex-shrink-0 text-xs rounded-full px-2 py-0.5 font-body font-semibold ${STATUS_COLORS[lead.lead_status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {lead.lead_status.replace('_', ' ')}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* New Leads Today */}
            {!!data?.new_leads_today.length && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone className="w-4 h-4 text-blue-500" />
                  <h2 className="font-heading text-sm font-bold text-blue-700 uppercase tracking-wide">
                    New Leads Today ({data.new_leads_today.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {data.new_leads_today.map(lead => (
                    <Link
                      key={lead.id}
                      to="/leads"
                      className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="min-w-0">
                        <p className="font-body text-sm font-semibold text-navy truncate group-hover:text-steel">{lead.name}</p>
                        {lead.product_interest && (
                          <p className="font-body text-xs text-navy/50 truncate">{lead.product_interest}</p>
                        )}
                      </div>
                      <span className="ml-3 flex-shrink-0 font-body text-xs text-navy/40">{timeAgo(lead.created_at)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lead Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Lead Source Breakdown */}
          <div className="bg-white rounded-2xl border border-navy/10 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-navy/8">
              <BarChart2 className="w-4 h-4 text-navy/50" />
              <h2 className="font-heading text-sm font-bold text-navy">Lead Sources</h2>
            </div>
            {isLoading || !data?.lead_sources?.length ? (
              <div className="p-5 text-navy/30 font-body text-sm">{isLoading ? 'Loading…' : 'No data yet.'}</div>
            ) : (() => {
              const max = Math.max(...data.lead_sources.map(s => s.count));
              return (
                <div className="p-4 space-y-2">
                  {data.lead_sources.slice(0, 6).map(s => (
                    <div key={s.source_page} className="flex items-center gap-3">
                      <span className="font-body text-xs text-navy/60 w-32 truncate flex-shrink-0">{s.source_page}</span>
                      <div className="flex-1 bg-navy/5 rounded-full h-2">
                        <div className="bg-steel rounded-full h-2 transition-all" style={{ width: `${(s.count / max) * 100}%` }} />
                      </div>
                      <span className="font-body text-xs font-semibold text-navy w-6 text-right">{s.count}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-2xl border border-navy/10 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-navy/8">
              <TrendingUp className="w-4 h-4 text-navy/50" />
              <h2 className="font-heading text-sm font-bold text-navy">Conversion Funnel</h2>
            </div>
            {isLoading ? (
              <div className="p-5 text-navy/30 font-body text-sm">Loading…</div>
            ) : (
              <div className="p-5 space-y-3">
                {[
                  { label: 'New', count: data?.lead_funnel?.new ?? 0, color: 'bg-blue-400' },
                  { label: 'Contacted', count: data?.lead_funnel?.contacted ?? 0, color: 'bg-yellow-400' },
                  { label: 'Converted', count: data?.lead_funnel?.converted ?? 0, color: 'bg-green-500' },
                ].map((stage, i, arr) => {
                  const pct = arr[0].count > 0 ? Math.round((stage.count / arr[0].count) * 100) : 0;
                  return (
                    <div key={stage.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-sm font-semibold text-navy">{stage.label}</span>
                        <span className="font-body text-sm text-navy/60">{stage.count} {i > 0 ? `(${pct}%)` : ''}</span>
                      </div>
                      <div className="bg-navy/5 rounded-full h-3">
                        <div className={`${stage.color} rounded-full h-3 transition-all`} style={{ width: `${pct || (i === 0 ? 100 : 0)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed: 2-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Leads */}
          <div className="bg-white rounded-2xl border border-navy/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-navy/8">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-navy/50" />
                <h2 className="font-heading text-sm font-bold text-navy">Recent Leads</h2>
              </div>
              <Link to="/leads" className="font-body text-xs text-steel hover:text-navy">View all →</Link>
            </div>
            {isLoading ? (
              <div className="p-5 text-navy/30 font-body text-sm">Loading…</div>
            ) : !data?.recent_leads.length ? (
              <div className="p-5 text-navy/30 font-body text-sm">No leads yet.</div>
            ) : (
              <div className="divide-y divide-navy/5">
                {data.recent_leads.map(lead => (
                  <Link key={lead.id} to="/leads" className="flex items-center gap-3 px-5 py-3 hover:bg-navy/[0.02] transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-steel/15 flex items-center justify-center flex-shrink-0">
                      <span className="font-body text-xs font-bold text-steel">{lead.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-navy truncate group-hover:text-steel">{lead.name}</p>
                      <p className="font-body text-xs text-navy/45 truncate">{lead.product_interest ?? lead.source_page ?? 'General enquiry'}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-body font-semibold ${STATUS_COLORS[lead.lead_status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {lead.lead_status.replace('_', ' ')}
                      </span>
                      <span className="font-body text-[10px] text-navy/30">{timeAgo(lead.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events + Scheduled Posts */}
          <div className="flex flex-col gap-6">

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-navy/10 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-navy/8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-navy/50" />
                  <h2 className="font-heading text-sm font-bold text-navy">Upcoming Events</h2>
                </div>
                <Link to="/events" className="font-body text-xs text-steel hover:text-navy">View all →</Link>
              </div>
              {isLoading ? (
                <div className="p-5 text-navy/30 font-body text-sm">Loading…</div>
              ) : !data?.upcoming_events.length ? (
                <div className="p-5 text-navy/30 font-body text-sm">No upcoming events in next 30 days.</div>
              ) : (
                <div className="divide-y divide-navy/5">
                  {data.upcoming_events.map(event => (
                    <div key={event.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-navy truncate">{event.title}</p>
                        <p className="font-body text-xs text-navy/45">{event.location ?? event.event_type ?? ''}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-body text-xs font-semibold text-purple-600">{daysUntil(event.event_date)}</p>
                        <p className="font-body text-[10px] text-navy/30">{formatDate(event.event_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scheduled Blog Posts */}
            <div className="bg-white rounded-2xl border border-navy/10 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-navy/8">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-navy/50" />
                  <h2 className="font-heading text-sm font-bold text-navy">Scheduled Posts</h2>
                </div>
                <Link to="/blog" className="font-body text-xs text-steel hover:text-navy">View all →</Link>
              </div>
              {isLoading ? (
                <div className="p-5 text-navy/30 font-body text-sm">Loading…</div>
              ) : !data?.scheduled_posts.length ? (
                <div className="p-5 text-navy/30 font-body text-sm">No scheduled posts.</div>
              ) : (
                <div className="divide-y divide-navy/5">
                  {data.scheduled_posts.map(post => (
                    <div key={post.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-navy truncate">{post.title}</p>
                        {post.category && <p className="font-body text-xs text-navy/45">{post.category}</p>}
                      </div>
                      <p className="flex-shrink-0 font-body text-xs text-amber-600 font-semibold">{formatDateTime(post.scheduled_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Quick-add FAB */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-2">
        {fabOpen && (
          <div className="flex flex-col items-end gap-2 mb-1">
            <Link to="/leads" onClick={() => setFabOpen(false)} className="flex items-center gap-2 bg-white border border-navy/10 rounded-xl px-4 py-2.5 shadow-lg text-sm font-body font-semibold text-navy hover:bg-navy/5 transition-colors">
              <Users className="w-4 h-4 text-steel" /> Add Lead
            </Link>
            <Link to="/blog/create" onClick={() => setFabOpen(false)} className="flex items-center gap-2 bg-white border border-navy/10 rounded-xl px-4 py-2.5 shadow-lg text-sm font-body font-semibold text-navy hover:bg-navy/5 transition-colors">
              <FileText className="w-4 h-4 text-steel" /> New Blog Post
            </Link>
            <Link to="/events/create" onClick={() => setFabOpen(false)} className="flex items-center gap-2 bg-white border border-navy/10 rounded-xl px-4 py-2.5 shadow-lg text-sm font-body font-semibold text-navy hover:bg-navy/5 transition-colors">
              <Calendar className="w-4 h-4 text-steel" /> New Event
            </Link>
          </div>
        )}
        <button
          onClick={() => setFabOpen(o => !o)}
          className="w-12 h-12 bg-steel text-white rounded-full shadow-xl flex items-center justify-center hover:bg-steel/90 transition-all"
        >
          {fabOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>
    </AdminLayout>
  );
}
