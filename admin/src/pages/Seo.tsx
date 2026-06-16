import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

const PAGES = [
  { path: '/',         label: 'Home' },
  { path: '/about',    label: 'About' },
  { path: '/contact',  label: 'Contact' },
  { path: '/blog',     label: 'Blog' },
  { path: '/events',   label: 'Events' },
  { path: '/products', label: 'Products' },
] as const;

const ALL_KEYS = [
  'seo_head_scripts',
  ...PAGES.flatMap(p => [`meta_title_${p.path}`, `meta_desc_${p.path}`]),
] as const;

export function SeoPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get<Record<string, string>>('/settings');
      return res.data;
    },
  });

  return (
    <AdminLayout>
      <div className="max-w-2xl p-8">
        <h1 className="font-heading text-2xl text-navy mb-2">SEO</h1>
        <p className="font-body text-navy/60 text-sm mb-8">Search engine settings — script injection and per-page meta tags.</p>

        {isLoading || !settings ? (
          <p className="font-body text-navy/50">Loading settings…</p>
        ) : (
          <SeoForm settings={settings} />
        )}
      </div>
    </AdminLayout>
  );
}

function SeoForm({ settings }: { settings: Record<string, string> }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    ALL_KEYS.forEach(k => { initial[k] = settings[k] ?? ''; });
    return initial;
  });
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: async (updates: Record<string, string>) => {
      await api.put('/settings', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1 — Head Scripts */}
      <div>
        <h2 className="font-heading text-lg text-navy mb-1">Head Scripts</h2>
        <p className="font-body text-sm text-navy/60 mb-3">
          Paste full <code>&lt;script&gt;</code> tag(s) from GA, GTM, FB Pixel, etc. Injected into every public page.
        </p>
        <textarea
          id="seo_head_scripts"
          value={values['seo_head_scripts']}
          onChange={e => handleChange('seo_head_scripts', e.target.value)}
          rows={6}
          className="w-full font-mono text-sm border border-navy/20 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-steel/30 resize-y"
          placeholder="<!-- Paste your <script> tags here -->"
        />
      </div>

      <hr className="border-navy/10 my-8" />

      {/* Section 2 — Per-Page Meta */}
      <div>
        <h2 className="font-heading text-lg text-navy mb-1">Page Meta</h2>
        <p className="font-body text-sm text-navy/60 mb-4">Override meta title and description for each public page.</p>
        <div className="space-y-6">
          {PAGES.map(page => (
            <div key={page.path} className="space-y-3">
              <p className="font-body font-semibold text-navy text-sm">{page.label} <span className="text-navy/40 font-normal">({page.path})</span></p>
              <div>
                <Label htmlFor={`meta_title_${page.path}`} className="font-body text-xs text-navy/60 mb-1 block">Meta Title</Label>
                <Input
                  id={`meta_title_${page.path}`}
                  type="text"
                  value={values[`meta_title_${page.path}`]}
                  onChange={e => handleChange(`meta_title_${page.path}`, e.target.value)}
                  className="font-body"
                  placeholder="Leave blank to use default"
                />
              </div>
              <div>
                <Label htmlFor={`meta_desc_${page.path}`} className="font-body text-xs text-navy/60 mb-1 block">Meta Description</Label>
                <Input
                  id={`meta_desc_${page.path}`}
                  type="text"
                  value={values[`meta_desc_${page.path}`]}
                  onChange={e => handleChange(`meta_desc_${page.path}`, e.target.value)}
                  className="font-body"
                  placeholder="Leave blank to use default"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={mutation.isPending} className="bg-orange text-white hover:bg-orange/90">
          {mutation.isPending ? 'Saving…' : 'Save Settings'}
        </Button>
        {saved && <span className="font-body text-sm text-green-600">Settings saved.</span>}
        {mutation.isError && <span className="font-body text-sm text-red-600">Save failed. Please try again.</span>}
      </div>
    </form>
  );
}
