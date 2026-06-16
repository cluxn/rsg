import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

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
        {isLoading || !settings ? (
          <p className="font-body text-navy/50">Loading…</p>
        ) : (
          <>
            {activeTab === 'meta' && <MetaOGTab settings={settings} />}
            {activeTab === 'scripts' && <ScriptsTab settings={settings} />}
            {activeTab === 'sitemap' && <PlaceholderTab title="Sitemap" description="Auto-generated sitemap configuration coming soon." />}
            {activeTab === 'robots' && <PlaceholderTab title="Robots.txt" description="Robots.txt configuration coming soon." />}
            {activeTab === 'redirects' && <PlaceholderTab title="Redirects" description="URL redirect rules coming soon." />}
            {activeTab === '404' && <PlaceholderTab title="404 Log" description="Track 404 errors and broken links coming soon." />}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

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

function PlaceholderTab({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="font-heading text-2xl text-navy mb-2">{title}</h1>
      <p className="font-body text-navy/60 text-sm">{description}</p>
    </div>
  );
}
