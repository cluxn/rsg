import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileText, Calendar } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { getBlogPostsAdmin, getEventsAdmin, type BlogPost, type EventRecord } from '@/lib/api';
import { cn } from '@/lib/utils';

type CalendarItem =
  | { type: 'post'; id: number; title: string; status: string; date: string; editPath: string }
  | { type: 'event'; id: number; title: string; status: string; date: string; editPath: string };

const STATUS_DOT: Record<string, string> = {
  published: 'bg-green-500',
  scheduled: 'bg-blue-500',
  draft: 'bg-yellow-400',
};

const STATUS_ROW: Record<string, string> = {
  published: 'text-green-700 bg-green-50',
  scheduled: 'text-blue-700 bg-blue-50',
  draft: 'text-yellow-700 bg-yellow-50',
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function ContentCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ['blog-admin'],
    queryFn: getBlogPostsAdmin,
  });

  const { data: events = [] } = useQuery<EventRecord[]>({
    queryKey: ['events-admin'],
    queryFn: getEventsAdmin,
  });

  const itemsByDay = useMemo(() => {
    const map = new Map<number, CalendarItem[]>();

    for (const p of posts) {
      const dateStr = p.scheduled_at || p.published_at || p.created_at;
      if (!dateStr) continue;
      const d = new Date(dateStr);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      const day = d.getDate();
      const list = map.get(day) ?? [];
      list.push({ type: 'post', id: p.id, title: p.title, status: p.status, date: dateStr, editPath: `/blog/edit/${p.id}` });
      map.set(day, list);
    }

    for (const e of events) {
      const dateStr = e.event_date || e.scheduled_at || e.created_at;
      if (!dateStr) continue;
      const d = new Date(dateStr);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      const day = d.getDate();
      const list = map.get(day) ?? [];
      list.push({ type: 'event', id: e.id, title: e.title, status: e.status, date: dateStr, editPath: `/events/edit/${e.id}` });
      map.set(day, list);
    }

    return map;
  }, [posts, events, year, month]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;

  const allItems = useMemo(() => {
    const all: CalendarItem[] = [];
    for (const items of itemsByDay.values()) all.push(...items);
    return all.sort((a, b) => a.date.localeCompare(b.date));
  }, [itemsByDay]);

  return (
    <AdminLayout>
      <ContentTabs />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="font-heading text-2xl text-navy font-bold">Content Calendar</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-body text-navy/60">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Published
              </div>
              <div className="flex items-center gap-1 text-xs font-body text-navy/60">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Scheduled
              </div>
              <div className="flex items-center gap-1 text-xs font-body text-navy/60">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Draft
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-navy/5 text-navy/60 hover:text-navy transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-heading text-base font-semibold text-navy min-w-[140px] text-center">
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-navy/5 text-navy/60 hover:text-navy transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden mb-8">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-navy/10">
            {DAYS.map(d => (
              <div key={d} className="px-3 py-2 font-body text-xs font-semibold text-navy/50 text-center">{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-navy/5">
            {Array.from({ length: totalCells }, (_, i) => {
              const dayNum = i - firstDow + 1;
              const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
              const isToday = isCurrentMonth && dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const items = isCurrentMonth ? (itemsByDay.get(dayNum) ?? []) : [];

              return (
                <div
                  key={i}
                  className={cn(
                    'min-h-[100px] p-2 relative',
                    !isCurrentMonth && 'bg-navy/[0.02]',
                    isToday && 'bg-steel/[0.04]'
                  )}
                >
                  {isCurrentMonth && (
                    <>
                      <span className={cn(
                        'inline-flex w-6 h-6 items-center justify-center rounded-full font-body text-xs mb-1',
                        isToday ? 'bg-steel text-white font-semibold' : 'text-navy/60'
                      )}>
                        {dayNum}
                      </span>
                      <div className="space-y-0.5">
                        {items.slice(0, 3).map((item, j) => (
                          <Link
                            key={j}
                            to={item.editPath}
                            className={cn(
                              'flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-body leading-tight truncate hover:opacity-80 transition-opacity',
                              STATUS_ROW[item.status] ?? 'text-navy/60 bg-navy/5'
                            )}
                            title={item.title}
                          >
                            {item.type === 'post'
                              ? <FileText className="w-2.5 h-2.5 shrink-0" />
                              : <Calendar className="w-2.5 h-2.5 shrink-0" />
                            }
                            <span className="truncate">{item.title}</span>
                          </Link>
                        ))}
                        {items.length > 3 && (
                          <span className="font-body text-[10px] text-navy/40 pl-1">+{items.length - 3} more</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* List view — all items this month */}
        {allItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-navy/8">
              <h2 className="font-heading text-sm font-bold text-navy">This month ({allItems.length})</h2>
            </div>
            <div className="divide-y divide-navy/5">
              {allItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.editPath}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-navy/[0.02] transition-colors group"
                >
                  <div className={cn('w-2 h-2 rounded-full shrink-0 mt-0.5', STATUS_DOT[item.status] ?? 'bg-gray-300')} />
                  <div className="flex-shrink-0">
                    {item.type === 'post'
                      ? <FileText className="w-4 h-4 text-navy/40" />
                      : <Calendar className="w-4 h-4 text-purple-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-navy truncate group-hover:text-steel">{item.title}</p>
                    <p className="font-body text-xs text-navy/40 capitalize">{item.type === 'post' ? 'Blog post' : 'Event'}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={cn('text-xs rounded-full px-2 py-0.5 font-body font-semibold', STATUS_ROW[item.status] ?? '')}>
                      {item.status}
                    </span>
                    <p className="font-body text-[10px] text-navy/30 mt-0.5">
                      {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {allItems.length === 0 && (
          <div className="text-center py-16 text-navy/30 font-body text-sm">
            No posts or events in {MONTHS[month]} {year}.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
