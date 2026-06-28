import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, X, ChevronDown, FileSpreadsheet, FileText, Phone, MessageCircle } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

type LeadStatus = 'new' | 'contacted' | 'meeting_scheduled' | 'converted' | 'closed' | 'lost' | 'junk';
type LeadPriority = 'none' | 'cold' | 'warm' | 'hot';

interface Lead {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  product_interest: string | null;
  message: string | null;
  source_page: string | null;
  city: string | null;
  state: string | null;
  lead_status: LeadStatus;
  priority: LeadPriority;
  follow_up_date: string | null;
  notes: string | null;
  last_contact_date: string | null;
  webhook_sent: boolean;
  created_at: string;
}

interface LeadsResponse { leads: Lead[]; total: number; page: number; limit: number; }

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  subscribed_at: string;
  active: number;
}

interface SubscribersResponse { subscribers: Subscriber[]; total: number; }

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'bg-purple-100 text-purple-700' },
  { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' },
  { value: 'closed', label: 'Closed', color: 'bg-navy/10 text-navy/60' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-500' },
  { value: 'junk', label: 'Junk', color: 'bg-gray-100 text-gray-500' },
];

const PRIORITY_OPTIONS: { value: LeadPriority; label: string; color: string; dot: string }[] = [
  { value: 'none', label: '—', color: 'text-navy/30', dot: 'bg-navy/20' },
  { value: 'cold', label: 'Cold', color: 'text-blue-500', dot: 'bg-blue-400' },
  { value: 'warm', label: 'Warm', color: 'text-amber-500', dot: 'bg-amber-400' },
  { value: 'hot', label: 'Hot', color: 'text-red-500', dot: 'bg-red-500' },
];

const SOURCE_PAGES = [
  { label: 'Homepage', value: 'home' },
  { label: 'Contact Page', value: 'contact' },
  { label: 'Blog', value: 'blog' },
  { label: 'Events', value: 'events' },
  { label: 'WhatsApp Nudge / Popup', value: 'nudge' },
  { label: 'Product — Colour Coated Sheet', value: 'product/colour-coated-roofing-sheet' },
  { label: 'Product — Decking Sheet', value: 'product/decking-sheet' },
  { label: 'Product — Galvanized Plain Sheets', value: 'product/galvanized-plain-sheets' },
  { label: 'Product — Purlins', value: 'product/purlins' },
  { label: 'Product — MS Pipe', value: 'product/ms-pipe' },
  { label: 'Product — MS Plate/Channel/Angle', value: 'product/ms-plate-channel-angle' },
  { label: 'Product — Polycarbonate Sheet', value: 'product/polycarbonate-sheet' },
  { label: 'Product — Crimping Sheet', value: 'product/crimping-sheet' },
  { label: 'Product — Accessories', value: 'product/accessories' },
  { label: 'Manual Entry (Admin)', value: 'admin' },
  { label: 'Import', value: 'import' },
];

const PRODUCT_OPTIONS = [
  'Colour Coated Sheets', 'Galvanized Sheets', 'MS Angles', 'MS Channels',
  'MS Pipe', 'MS Plate', 'Chequered Plate', 'Purlins / Zed Sections',
];

const EMPTY_FORM = { name: '', phone: '', email: '', product_interest: '', message: '', source_page: 'admin' };

function statusColor(s: LeadStatus) {
  return STATUS_OPTIONS.find(o => o.value === s)?.color ?? 'bg-navy/10 text-navy/60';
}
function statusLabel(s: LeadStatus) {
  return STATUS_OPTIONS.find(o => o.value === s)?.label ?? s;
}
function priorityOpt(p: LeadPriority) {
  return PRIORITY_OPTIONS.find(o => o.value === p) ?? PRIORITY_OPTIONS[0];
}

export function LeadsPage() {
  const [tab, setTab] = useState<'leads' | 'newsletter'>('leads');

  return (
    <AdminLayout>
      <div className="border-b border-navy/10 px-8 pt-8 flex gap-6">
        <button
          onClick={() => setTab('leads')}
          className={`pb-3 font-heading text-sm font-semibold border-b-2 transition-colors ${tab === 'leads' ? 'border-steel text-steel' : 'border-transparent text-navy/50 hover:text-navy'}`}
        >
          Leads
        </button>
        <button
          onClick={() => setTab('newsletter')}
          className={`pb-3 font-heading text-sm font-semibold border-b-2 transition-colors ${tab === 'newsletter' ? 'border-steel text-steel' : 'border-transparent text-navy/50 hover:text-navy'}`}
        >
          Newsletter
        </button>
      </div>

      {tab === 'leads' ? <LeadsTab /> : <NewsletterTab />}
    </AdminLayout>
  );
}

function LeadsTab() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const LIMIT = 25;

  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [applied, setApplied] = useState<{ search: string; source_page: string; date_from: string; date_to: string }>({ search: '', source_page: '', date_from: '', date_to: '' });

  const { data, isLoading, isError } = useQuery<LeadsResponse>({
    queryKey: ['leads', page, applied],
    queryFn: () => api.get('/leads', { params: { page, limit: LIMIT, ...applied } }).then(r => r.data),
  });

  const [notesOpen, setNotesOpen] = useState<number | null>(null);
  const [notesText, setNotesText] = useState('');

  // Bulk selection
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<LeadStatus | ''>('');

  // Side drawer
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => api.put(`/leads/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/leads/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });

  const bulkMut = useMutation({
    mutationFn: (body: { action: string; ids: number[]; lead_status?: string }) => api.post('/leads/bulk', body).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); setSelected(new Set()); setBulkStatus(''); },
  });

  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ ...EMPTY_FORM });
  const [addError, setAddError] = useState('');
  const [dupWarning, setDupWarning] = useState<{ name: string; id: number } | null>(null);
  const phoneCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addMutation = useMutation({
    mutationFn: (d: typeof EMPTY_FORM) => api.post('/leads/admin', d).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); setShowAddModal(false); setAddForm({ ...EMPTY_FORM }); setAddError(''); setDupWarning(null); },
    onError: () => setAddError('Failed to add lead. Check fields and try again.'),
  });

  function applyFilters() { setPage(1); setApplied({ search, source_page: sourceFilter, date_from: dateFrom, date_to: dateTo }); }
  function clearFilters() { setSearch(''); setSourceFilter(''); setDateFrom(''); setDateTo(''); setPage(1); setApplied({ search: '', source_page: '', date_from: '', date_to: '' }); }

  function handlePhoneChange(phone: string) {
    setAddForm(f => ({ ...f, phone }));
    setDupWarning(null);
    if (phoneCheckTimer.current) clearTimeout(phoneCheckTimer.current);
    if (phone.trim().length > 7) {
      phoneCheckTimer.current = setTimeout(async () => {
        try {
          const { data } = await api.get('/leads/check-phone', { params: { phone: phone.trim() } });
          if (data.exists) setDupWarning({ name: data.name, id: data.lead_id });
        } catch { /* ignore */ }
      }, 600);
    }
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    if (!addForm.name.trim()) { setAddError('Name is required.'); return; }
    if (!addForm.phone.trim() && !addForm.email.trim()) { setAddError('Either phone or email is required.'); return; }
    addMutation.mutate(addForm);
  }

  function toggleSelect(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (!data) return;
    const allIds = data.leads.map(l => l.id);
    if (allIds.every(id => selected.has(id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  }

  const allSelected = data ? data.leads.length > 0 && data.leads.every(l => selected.has(l.id)) : false;

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;
  const start = data ? (data.page - 1) * LIMIT + 1 : 0;
  const end = data ? Math.min(data.page * LIMIT, data.total) : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-heading text-2xl text-navy">Leads</h1>
          <p className="font-body text-navy/60 text-sm mt-0.5">{data ? `${data.total} total submissions` : 'All enquiries'}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowAddModal(true)}>+ Add Lead</Button>
          <ExportDropdown />
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-navy/10 rounded-xl px-4 py-3 flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-xs text-navy/50 mb-1">Search</label>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            placeholder="Name, phone or email…"
            className="border border-navy/20 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-steel w-52"
          />
        </div>
        <div>
          <label className="block text-xs text-navy/50 mb-1">Source</label>
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-steel">
            <option value="">All Sources</option>
            {SOURCE_PAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-navy/50 mb-1">From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-steel" />
        </div>
        <div>
          <label className="block text-xs text-navy/50 mb-1">To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-steel" />
        </div>
        <Button onClick={applyFilters}>Apply filters</Button>
        <Button variant="outline" onClick={clearFilters}>Clear</Button>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-steel/10 border border-steel/20 rounded-xl px-4 py-2.5 mb-4">
          <span className="font-body text-sm text-steel font-semibold">{selected.size} selected</span>
          <div className="flex items-center gap-2 ml-2">
            <select
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value as LeadStatus | '')}
              className="border border-navy/20 rounded-lg px-2 py-1.5 text-sm text-navy outline-none focus:border-steel"
            >
              <option value="">Change status…</option>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <Button
              size="sm"
              disabled={!bulkStatus || bulkMut.isPending}
              onClick={() => bulkMut.mutate({ action: 'status', ids: [...selected], lead_status: bulkStatus })}
            >
              Apply
            </Button>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-red-300 text-red-500 hover:bg-red-50 ml-2"
            disabled={bulkMut.isPending}
            onClick={() => { if (window.confirm(`Delete ${selected.size} lead(s)?`)) bulkMut.mutate({ action: 'delete', ids: [...selected] }); }}
          >
            Delete selected
          </Button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-navy/40 hover:text-navy"><X className="w-4 h-4" /></button>
        </div>
      )}

      {isLoading && <p className="text-navy/60 p-8">Loading…</p>}
      {isError && <p className="text-red-600 p-8">Failed to load leads.</p>}

      {!isLoading && !isError && data && data.leads.length === 0 && (
        <p className="text-navy/60 p-8">
          {(applied.search || applied.source_page || applied.date_from || applied.date_to)
            ? 'No leads match your filters.'
            : 'No leads yet.'}
        </p>
      )}

      {!isLoading && !isError && data && data.leads.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-navy/5 border-b border-navy/10">
                  <th className="px-3 py-3">
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="rounded border-navy/30" />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Contact</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Product</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Source</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Priority</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Follow-up</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Notes</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy/50 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map(lead => {
                  const pOpt = priorityOpt(lead.priority ?? 'none');
                  return (
                    <>
                      <tr
                        key={lead.id}
                        className={`border-t border-navy/8 hover:bg-navy/[0.02] cursor-pointer ${selected.has(lead.id) ? 'bg-steel/5' : ''}`}
                        onClick={e => {
                          // Don't open drawer when clicking interactive elements
                          const target = e.target as HTMLElement;
                          if (target.closest('button,input,select,a,td:last-child,td:first-child')) return;
                          setDrawerLead(lead);
                        }}
                      >
                        <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(lead.id)}
                            onChange={() => toggleSelect(lead.id)}
                            className="rounded border-navy/30"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-navy whitespace-nowrap">{lead.name}</td>
                        <td className="px-4 py-3 text-navy/60 text-xs" onClick={e => e.stopPropagation()}>
                          {lead.phone && (
                            <div className="flex items-center gap-1">
                              <span>{lead.phone}</span>
                              <a href={`tel:${lead.phone}`} title="Call" className="text-navy/40 hover:text-steel" onClick={e => e.stopPropagation()}>
                                <Phone className="w-3 h-3" />
                              </a>
                              <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-green-500 hover:text-green-600" onClick={e => e.stopPropagation()}>
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                          {lead.email && <div>{lead.email}</div>}
                          {(lead.city || lead.state) && (
                            <div className="text-navy/40 mt-0.5">{[lead.city, lead.state].filter(Boolean).join(', ')}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-navy/60 text-xs">{lead.product_interest ?? '—'}</td>
                        <td className="px-4 py-3 text-navy/60 text-xs">{lead.source_page ?? '—'}</td>

                        {/* Priority */}
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <select
                            value={lead.priority ?? 'none'}
                            onChange={e => updateMut.mutate({ id: lead.id, data: { priority: e.target.value } })}
                            className={`text-xs font-semibold border-0 bg-transparent outline-none cursor-pointer ${pOpt.color}`}
                          >
                            {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="relative">
                            <select
                              value={lead.lead_status}
                              onChange={e => updateMut.mutate({ id: lead.id, data: { lead_status: e.target.value } })}
                              className={`appearance-none pr-6 pl-2 py-0.5 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${statusColor(lead.lead_status)}`}
                            >
                              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-1 top-1 w-3 h-3 pointer-events-none opacity-50" />
                          </div>
                        </td>

                        <td className="px-4 py-3 text-xs text-navy/60" onClick={e => e.stopPropagation()}>
                          <input
                            type="date"
                            defaultValue={lead.follow_up_date ?? ''}
                            onBlur={e => updateMut.mutate({ id: lead.id, data: { follow_up_date: e.target.value || null } })}
                            className="border border-navy/15 rounded px-2 py-0.5 text-xs outline-none focus:border-steel w-32"
                          />
                        </td>

                        <td className="px-4 py-3 text-xs" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              if (notesOpen === lead.id) { setNotesOpen(null); }
                              else { setNotesOpen(lead.id); setNotesText(lead.notes ?? ''); }
                            }}
                            className="text-steel hover:text-steel/70 font-semibold"
                          >
                            {lead.notes ? 'Edit note' : '+ Note'}
                          </button>
                        </td>

                        <td className="px-4 py-3 text-xs text-navy/50 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setDeleteTarget(lead)}
                            className="px-2 py-1 rounded border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {notesOpen === lead.id && (
                        <tr key={`notes-${lead.id}`} className="bg-navy/[0.02] border-t border-navy/8">
                          <td colSpan={11} className="px-4 py-3">
                            <div className="flex gap-2 items-start">
                              <textarea
                                value={notesText}
                                onChange={e => setNotesText(e.target.value)}
                                rows={2}
                                placeholder="Add a note about this lead…"
                                className="flex-1 border border-navy/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-steel resize-none"
                              />
                              <Button size="sm" onClick={() => { updateMut.mutate({ id: lead.id, data: { notes: notesText } }); setNotesOpen(null); }}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setNotesOpen(null)}>Cancel</Button>
                            </div>
                            {lead.notes && <p className="text-xs text-navy/40 mt-1">Current: {lead.notes}</p>}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-navy/60">Showing {start}–{end} of {data.total}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
            </div>
          </div>
        </>
      )}

      {/* Lead Detail Side Drawer */}
      {drawerLead && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setDrawerLead(null)}>
          <div className="flex-1" />
          <div
            className="w-full max-w-md bg-white shadow-2xl border-l border-navy/10 h-full overflow-y-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10">
              <div>
                <h2 className="font-heading text-navy text-lg font-semibold">{drawerLead.name}</h2>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(drawerLead.lead_status)}`}>
                  {statusLabel(drawerLead.lead_status)}
                </span>
              </div>
              <button onClick={() => setDrawerLead(null)} className="text-navy/40 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 flex-1">
              <Section label="Contact">
                {drawerLead.phone && (
                  <div className="flex items-center gap-2 text-sm text-navy">
                    <Phone className="w-4 h-4 text-navy/40" />
                    <span>{drawerLead.phone}</span>
                    <a href={`tel:${drawerLead.phone}`} className="text-steel hover:underline text-xs">Call</a>
                    <a href={`https://wa.me/${drawerLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs">WhatsApp</a>
                  </div>
                )}
                {drawerLead.email && <p className="text-sm text-navy/70">{drawerLead.email}</p>}
                {(drawerLead.city || drawerLead.state) && (
                  <p className="text-xs text-navy/50">{[drawerLead.city, drawerLead.state].filter(Boolean).join(', ')}</p>
                )}
              </Section>

              {drawerLead.product_interest && (
                <Section label="Product Interest">
                  <p className="text-sm text-navy">{drawerLead.product_interest}</p>
                </Section>
              )}

              {drawerLead.message && (
                <Section label="Message">
                  <p className="text-sm text-navy/80 whitespace-pre-wrap">{drawerLead.message}</p>
                </Section>
              )}

              <Section label="Source">
                <p className="text-sm text-navy/70">{drawerLead.source_page ?? '—'}</p>
              </Section>

              <Section label="Priority">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${priorityOpt(drawerLead.priority ?? 'none').dot}`} />
                  <span className={`text-sm font-semibold ${priorityOpt(drawerLead.priority ?? 'none').color}`}>
                    {priorityOpt(drawerLead.priority ?? 'none').label}
                  </span>
                </div>
              </Section>

              {drawerLead.notes && (
                <Section label="Notes">
                  <p className="text-sm text-navy/80 whitespace-pre-wrap">{drawerLead.notes}</p>
                </Section>
              )}

              <Section label="Dates">
                <p className="text-xs text-navy/60">Submitted: {new Date(drawerLead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                {drawerLead.follow_up_date && (
                  <p className="text-xs text-navy/60">Follow-up: {new Date(drawerLead.follow_up_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                )}
              </Section>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading text-lg text-navy mb-2">Delete Lead</h2>
            <p className="font-body text-sm text-navy/70 mb-5">Permanently delete lead from <span className="font-semibold">{deleteTarget.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button disabled={deleteMut.isPending} onClick={() => { deleteMut.mutate(deleteTarget.id); setDeleteTarget(null); }} className="bg-red-500 text-white hover:bg-red-600">
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10">
              <h2 className="font-heading text-navy text-lg font-semibold">Add Lead Manually</h2>
              <button onClick={() => { setShowAddModal(false); setAddForm({ ...EMPTY_FORM }); setAddError(''); setDupWarning(null); }} className="text-navy/40 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-navy/60 mb-1">Full Name *</label>
                  <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ramesh Kumar" className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/60 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={e => handlePhoneChange(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel ${dupWarning ? 'border-amber-400' : 'border-navy/20'}`}
                  />
                  {dupWarning && (
                    <p className="text-xs text-amber-600 mt-1">⚠ Phone already exists for <span className="font-semibold">{dupWarning.name}</span> (Lead #{dupWarning.id})</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/60 mb-1">Email</label>
                  <input type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} placeholder="client@company.com" className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/60 mb-1">Product Interest</label>
                  <select value={addForm.product_interest} onChange={e => setAddForm(f => ({ ...f, product_interest: e.target.value }))} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel">
                    <option value="">— Select product —</option>
                    {PRODUCT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/60 mb-1">Source / Form</label>
                  <select value={addForm.source_page} onChange={e => setAddForm(f => ({ ...f, source_page: e.target.value }))} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel">
                    {SOURCE_PAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-navy/60 mb-1">Message / Notes</label>
                  <textarea value={addForm.message} onChange={e => setAddForm(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Quantity, delivery location, requirements…" className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel resize-none" />
                </div>
              </div>
              {addError && <p className="text-red-500 text-xs">{addError}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={addMutation.isPending}>{addMutation.isPending ? 'Saving…' : 'Add Lead'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setAddForm({ ...EMPTY_FORM }); setAddError(''); setDupWarning(null); }}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide mb-1">{label}</p>
      {children}
    </div>
  );
}

function NewsletterTab() {
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-heading text-2xl text-navy">Newsletter Subscribers</h1>
          <p className="font-body text-navy/60 text-sm mt-0.5">
            {data ? `${data.total} subscriber${data.total !== 1 ? 's' : ''}` : 'All subscribers'}
          </p>
        </div>
        <NewsletterExportDropdown />
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
  );
}

function ExportDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" size="sm" onClick={() => setOpen(o => !o)} className="flex items-center gap-1">
        <Download className="w-4 h-4 mr-1" />
        Export
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-navy/10 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
          <button
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-navy hover:bg-navy/5 transition-colors"
            onClick={() => { window.open('/api/leads/export?format=csv', '_blank'); setOpen(false); }}
          >
            <FileText className="w-4 h-4 text-navy/50" />
            Export as CSV
          </button>
          <button
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-navy hover:bg-navy/5 transition-colors"
            onClick={() => { window.open('/api/leads/export?format=xlsx', '_blank'); setOpen(false); }}
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Export as Excel
          </button>
        </div>
      )}
    </div>
  );
}

function NewsletterExportDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" size="sm" onClick={() => setOpen(o => !o)} className="flex items-center gap-1">
        <Download className="w-4 h-4 mr-1" />
        Export
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-navy/10 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
          <button
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-navy hover:bg-navy/5 transition-colors"
            onClick={() => { window.open('/api/newsletter/export', '_blank'); setOpen(false); }}
          >
            <FileText className="w-4 h-4 text-navy/50" />
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
}
