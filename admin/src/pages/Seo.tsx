import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Redirect, NotFoundLog } from '@/lib/api';

type SeoTab = 'meta' | 'sitemap' | 'robots' | 'scripts' | 'redirects' | '404';

const SEO_TABS: { label: string; key: SeoTab }[] = [
  { label: 'Meta & OG', key: 'meta' },
  { label: 'Sitemap', key: 'sitemap' },
  { label: 'Robots.txt', key: 'robots' },
  { label: 'Scripts', key: 'scripts' },
  { label: 'Redirects', key: 'redirects' },
  { label: '404 Log', key: '404' },
];

const PAGES = [
  { path: '/',         label: 'Homepage' },
  { path: '/about',   label: 'About' },
  { path: '/contact', label: 'Contact' },
  { path: '/products', label: 'Products' },
  { path: '/blog',    label: 'Blog' },
  { path: '/events',  label: 'Events' },
] as const;


export function SeoPage() {
  const [activeTab, setActiveTab] = useState<SeoTab>('meta');
  const [prefilledFrom, setPrefilledFrom] = useState('');

  function handleRedirectFrom(url: string) {
    setPrefilledFrom(url);
    setActiveTab('redirects');
  }

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get<Record<string, string>>('/settings');
      return res.data;
    },
  });

  return (
    <AdminLayout>
      {/* Tab bar */}
      <div className="border-b border-navy/10 bg-white">
        <div className="flex px-6">
          {SEO_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-3 font-body text-sm border-b-2 transition-colors -mb-px whitespace-nowrap',
                activeTab === tab.key
                  ? 'border-steel text-steel font-semibold'
                  : 'border-transparent text-navy/60 hover:text-navy hover:border-navy/30'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'redirects' ? (
          <RedirectsTab prefilledFrom={prefilledFrom} onPrefilledUsed={() => setPrefilledFrom('')} />
        ) : activeTab === '404' ? (
          <NotFoundLogTab onCreateRedirect={handleRedirectFrom} />
        ) : activeTab === 'sitemap' ? (
          <SitemapTab settings={settings ?? {}} />
        ) : isLoading || !settings ? (
          <p className="font-body text-navy/50">Loading…</p>
        ) : (
          <>
            {activeTab === 'meta' && <MetaOGTab settings={settings} />}
            {activeTab === 'scripts' && <ScriptsTab settings={settings} />}
            {activeTab === 'robots' && <RobotsTab settings={settings} />}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

// ─── Meta & OG ────────────────────────────────────────────────────────────────

function MetaOGTab({ settings }: { settings: Record<string, string> }) {
  const qc = useQueryClient();
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (updates: Record<string, string>) => {
      await api.put('/settings', updates);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setEditingPath(null);
    },
  });

  function startEdit(path: string) {
    setEditValues({
      [`meta_title_${path}`]: settings[`meta_title_${path}`] ?? '',
      [`meta_desc_${path}`]: settings[`meta_desc_${path}`] ?? '',
    });
    setEditingPath(path);
  }

  function saveEdit() {
    if (!editingPath) return;
    mutation.mutate(editValues);
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-navy mb-6">Meta & OG</h1>
      <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5 text-navy/60 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Page</th>
              <th className="px-4 py-3 font-semibold">Path</th>
              <th className="px-4 py-3 font-semibold">Meta Title</th>
              <th className="px-4 py-3 font-semibold">Meta Description</th>
              <th className="px-4 py-3 font-semibold">Canonical</th>
              <th className="px-4 py-3 font-semibold">Edit</th>
            </tr>
          </thead>
          <tbody>
            {PAGES.map(page => {
              const isEditing = editingPath === page.path;
              const title = settings[`meta_title_${page.path}`] || '';
              const desc = settings[`meta_desc_${page.path}`] || '';

              return (
                <tr key={page.path} className="border-t border-navy/10">
                  <td className="px-4 py-3 font-medium text-navy">{page.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-navy/50">{page.path}</td>
                  <td className="px-4 py-3 text-navy/70 text-xs max-w-[180px]">
                    {isEditing ? (
                      <Input
                        value={editValues[`meta_title_${page.path}`]}
                        onChange={e => setEditValues(v => ({ ...v, [`meta_title_${page.path}`]: e.target.value }))}
                        className="h-7 text-xs"
                        placeholder="Meta title"
                      />
                    ) : (
                      <span className="truncate block">{title || '—'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-navy/70 text-xs max-w-[220px]">
                    {isEditing ? (
                      <Input
                        value={editValues[`meta_desc_${page.path}`]}
                        onChange={e => setEditValues(v => ({ ...v, [`meta_desc_${page.path}`]: e.target.value }))}
                        className="h-7 text-xs"
                        placeholder="Meta description"
                      />
                    ) : (
                      <span className="truncate block">{desc || '—'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-navy/40 text-xs">Auto</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 text-xs px-3" onClick={saveEdit} disabled={mutation.isPending}>
                          {mutation.isPending ? 'Saving…' : 'Save'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => setEditingPath(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(page.path)}
                        className="text-xs text-steel hover:underline font-semibold border border-navy/20 rounded px-2 py-1"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────

function SitemapTab({ settings }: { settings: Record<string, string> }) {
  const siteUrl = settings['site_url'] || 'https://rsgprofilesheets.com';
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl text-navy mb-2">Sitemap</h1>
      <p className="font-body text-sm text-navy/60 mb-6">
        Your sitemap is auto-generated by the frontend. Submit it to search engines to help them crawl your site.
      </p>

      <div className="bg-white rounded-xl border border-navy/10 p-5 mb-6">
        <Label className="font-body text-xs text-navy/60 mb-1 block">Sitemap URL</Label>
        <div className="flex items-center gap-3">
          <code className="font-mono text-sm text-navy bg-navy/5 rounded px-3 py-2 flex-1 truncate">{sitemapUrl}</code>
          <a href={sitemapUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="shrink-0">View</Button>
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy/10 p-5">
        <h2 className="font-heading text-base text-navy mb-3">Submit to Search Engines</h2>
        <div className="flex flex-col gap-2">
          <a
            href={`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="w-full justify-start font-body text-sm">
              Ping Google
            </Button>
          </a>
          <a
            href={`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="w-full justify-start font-body text-sm">
              Ping Bing
            </Button>
          </a>
        </div>
        <p className="font-body text-xs text-navy/40 mt-3">
          Also submit via Google Search Console and Bing Webmaster Tools for better indexing control.
        </p>
      </div>
    </div>
  );
}

// ─── Robots.txt ───────────────────────────────────────────────────────────────

function RobotsTab({ settings }: { settings: Record<string, string> }) {
  const qc = useQueryClient();
  const [value, setValue] = useState(
    settings['robots_txt'] ??
    'User-agent: *\nAllow: /\n\nSitemap: https://rsgprofilesheets.com/sitemap.xml'
  );
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.put('/settings', { robots_txt: value });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl text-navy mb-2">Robots.txt</h1>
      <p className="font-body text-sm text-navy/60 mb-6">
        Controls which pages search engines can crawl. The frontend serves this content at <code>/robots.txt</code>.
      </p>
      <Label htmlFor="robots" className="font-body text-xs text-navy/60 mb-1 block">robots.txt content</Label>
      <textarea
        id="robots"
        value={value}
        onChange={e => { setValue(e.target.value); setSaved(false); }}
        rows={12}
        className="w-full font-mono text-sm border border-navy/20 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-steel/30 resize-y"
        placeholder="User-agent: *&#10;Allow: /"
      />
      <div className="flex items-center gap-4 mt-4">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-orange text-white hover:bg-orange/90">
          {mutation.isPending ? 'Saving…' : 'Save'}
        </Button>
        {saved && <span className="font-body text-sm text-green-600">Saved.</span>}
        {mutation.isError && <span className="font-body text-sm text-red-600">Save failed.</span>}
      </div>
    </div>
  );
}

// ─── Scripts ──────────────────────────────────────────────────────────────────

function ScriptsTab({ settings }: { settings: Record<string, string> }) {
  const qc = useQueryClient();
  const [value, setValue] = useState(settings['seo_head_scripts'] ?? '');
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.put('/settings', { seo_head_scripts: value });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl text-navy mb-2">Scripts</h1>
      <p className="font-body text-sm text-navy/60 mb-6">
        Paste full <code>&lt;script&gt;</code> tag(s) from GA, GTM, FB Pixel, etc. Injected into every public page.
      </p>
      <Label htmlFor="scripts" className="font-body text-xs text-navy/60 mb-1 block">Head Scripts</Label>
      <textarea
        id="scripts"
        value={value}
        onChange={e => { setValue(e.target.value); setSaved(false); }}
        rows={10}
        className="w-full font-mono text-sm border border-navy/20 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-steel/30 resize-y"
        placeholder="<!-- Paste your <script> tags here -->"
      />
      <div className="flex items-center gap-4 mt-4">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-orange text-white hover:bg-orange/90">
          {mutation.isPending ? 'Saving…' : 'Save Scripts'}
        </Button>
        {saved && <span className="font-body text-sm text-green-600">Saved.</span>}
        {mutation.isError && <span className="font-body text-sm text-red-600">Save failed.</span>}
      </div>
    </div>
  );
}

// ─── Redirects ────────────────────────────────────────────────────────────────

function RedirectsTab({ prefilledFrom, onPrefilledUsed }: { prefilledFrom?: string; onPrefilledUsed?: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ from_path: '', to_path: '', status_code: 301 });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (prefilledFrom) {
      setForm(f => ({ ...f, from_path: prefilledFrom }));
      onPrefilledUsed?.();
    }
  }, [prefilledFrom]);

  const { data: redirects, isLoading } = useQuery({
    queryKey: ['redirects'],
    queryFn: async () => {
      const res = await api.get<Redirect[]>('/redirects');
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      await api.post('/redirects', form);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['redirects'] });
      setForm({ from_path: '', to_path: '', status_code: 301 });
      setFormError('');
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.error || 'Failed to add redirect.');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      await api.put(`/redirects/${id}`, { active });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['redirects'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/redirects/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['redirects'] }),
  });

  function handleAdd() {
    setFormError('');
    if (!form.from_path || !form.to_path) { setFormError('Both paths are required.'); return; }
    addMutation.mutate();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-navy mb-6">Redirects</h1>

      {/* Add form */}
      <div className="bg-white rounded-xl border border-navy/10 p-5 mb-6">
        <h2 className="font-heading text-base text-navy mb-4">Add Redirect</h2>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <Label htmlFor="from" className="font-body text-xs text-navy/60 mb-1 block">From path</Label>
            <Input
              id="from"
              value={form.from_path}
              onChange={e => setForm(f => ({ ...f, from_path: e.target.value }))}
              placeholder="/old-page"
              className="font-mono text-sm"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <Label htmlFor="to" className="font-body text-xs text-navy/60 mb-1 block">To path</Label>
            <Input
              id="to"
              value={form.to_path}
              onChange={e => setForm(f => ({ ...f, to_path: e.target.value }))}
              placeholder="/new-page"
              className="font-mono text-sm"
            />
          </div>
          <div className="w-28">
            <Label htmlFor="status" className="font-body text-xs text-navy/60 mb-1 block">Type</Label>
            <select
              id="status"
              value={form.status_code}
              onChange={e => setForm(f => ({ ...f, status_code: Number(e.target.value) }))}
              className="w-full h-10 border border-navy/20 rounded-md px-2 text-sm font-body bg-white"
            >
              <option value={301}>301 Permanent</option>
              <option value={302}>302 Temporary</option>
            </select>
          </div>
          <Button onClick={handleAdd} disabled={addMutation.isPending} className="bg-orange text-white hover:bg-orange/90">
            {addMutation.isPending ? 'Adding…' : 'Add'}
          </Button>
        </div>
        {formError && <p className="font-body text-xs text-red-600 mt-2">{formError}</p>}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
        {isLoading ? (
          <p className="font-body text-navy/50 p-6">Loading…</p>
        ) : !redirects?.length ? (
          <p className="font-body text-navy/50 p-6 text-sm">No redirects yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-navy/5 text-navy/60 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">From</th>
                <th className="px-4 py-3 font-semibold">To</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Active</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {redirects.map(r => (
                <tr key={r.id} className="border-t border-navy/10">
                  <td className="px-4 py-3 font-mono text-xs text-navy">{r.from_path}</td>
                  <td className="px-4 py-3 font-mono text-xs text-navy/70">{r.to_path}</td>
                  <td className="px-4 py-3 text-xs text-navy/60">{r.status_code}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleMutation.mutate({ id: r.id, active: !r.active })}
                      className={cn(
                        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                        r.active ? 'bg-steel' : 'bg-navy/20'
                      )}
                    >
                      <span className={cn(
                        'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
                        r.active ? 'translate-x-4' : 'translate-x-1'
                      )} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteMutation.mutate(r.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── 404 Log ──────────────────────────────────────────────────────────────────

function NotFoundLogTab({ onCreateRedirect }: { onCreateRedirect: (url: string) => void }) {
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['404-logs'],
    queryFn: async () => {
      const res = await api.get<NotFoundLog[]>('/404-logs');
      return res.data;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-navy">404 Log</h1>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
      </div>

      <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
        {isLoading ? (
          <p className="font-body text-navy/50 p-6">Loading…</p>
        ) : !logs?.length ? (
          <p className="font-body text-navy/50 p-6 text-sm">No 404 errors logged yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-navy/5 text-navy/60 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">URL</th>
                <th className="px-4 py-3 font-semibold">Hits</th>
                <th className="px-4 py-3 font-semibold">Referrer</th>
                <th className="px-4 py-3 font-semibold">Last Seen</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-t border-navy/10">
                  <td className="px-4 py-3 font-mono text-xs text-navy max-w-[260px] truncate">{log.url}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-navy">{log.hits}</td>
                  <td className="px-4 py-3 text-xs text-navy/50 max-w-[160px] truncate">{log.referrer || '—'}</td>
                  <td className="px-4 py-3 text-xs text-navy/50 whitespace-nowrap">
                    {new Date(log.last_seen_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onCreateRedirect(log.url)}
                      className="text-xs text-steel hover:underline font-semibold border border-navy/20 rounded px-2 py-1 whitespace-nowrap"
                    >
                      → Redirect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
