import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

type MarketingTab = 'announcement' | 'popup' | 'whatsapp';

const TABS: { label: string; key: MarketingTab; desc: string }[] = [
  { label: 'Announcement Bar', key: 'announcement', desc: 'A dismissible banner across the top of every page' },
  { label: 'Exit Intent Popup', key: 'popup', desc: 'Shown when a visitor is about to leave the site' },
  { label: 'WhatsApp Nudge', key: 'whatsapp', desc: 'Floating WhatsApp CTA on every page' },
];

const ANNOUNCEMENT_FIELDS = [
  { key: 'announcement_enabled', label: 'Enable Announcement Bar', type: 'toggle' },
  { key: 'announcement_text',    label: 'Message',                  type: 'text',  placeholder: 'e.g. Free site survey for orders above ₹5 lakh — Call now!' },
  { key: 'announcement_cta',     label: 'CTA Button Text',          type: 'text',  placeholder: 'e.g. Get Quote' },
  { key: 'announcement_link',    label: 'CTA Link',                 type: 'url',   placeholder: 'e.g. /contact' },
  { key: 'announcement_bg',      label: 'Background Color',         type: 'select', options: ['orange', 'steel', 'navy', 'green'] },
] as const;

const POPUP_FIELDS = [
  { key: 'popup_enabled',   label: 'Enable Exit Intent Popup', type: 'toggle' },
  { key: 'popup_headline',  label: 'Headline',                 type: 'text',  placeholder: 'e.g. Get a Free Quote Before You Go!' },
  { key: 'popup_body',      label: 'Body Text',                type: 'textarea', placeholder: 'e.g. Our team can suggest the best material for your project — no obligation.' },
  { key: 'popup_cta',       label: 'CTA Button Text',          type: 'text',  placeholder: 'e.g. Yes, Get My Free Quote' },
] as const;

const WHATSAPP_FIELDS = [
  { key: 'whatsapp_number',  label: 'WhatsApp Number',    type: 'tel',  placeholder: '+919876543210' },
  { key: 'whatsapp_message', label: 'Pre-filled Message', type: 'text', placeholder: 'e.g. Hi, I need a quote for roofing sheets' },
] as const;

type FieldDef = { key: string; label: string; type: string; placeholder?: string; options?: readonly string[] };

const inputCls = 'w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel font-body';

function SettingsForm({
  fields,
  settings,
  onSave,
  saving,
  saved,
  error,
}: {
  fields: readonly FieldDef[];
  settings: Record<string, string>;
  onSave: (vals: Record<string, string>) => void;
  saving: boolean;
  saved: boolean;
  error: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach(f => { init[f.key] = settings[f.key] ?? ''; });
    return init;
  });

  const set = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }));

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSave(values); }}
      className="space-y-5 max-w-xl"
    >
      {fields.map(f => (
        <div key={f.key}>
          <label className="block text-sm font-semibold text-navy mb-1">{f.label}</label>
          {f.type === 'toggle' ? (
            <label className="inline-flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => set(f.key, values[f.key] === 'true' ? 'false' : 'true')}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  values[f.key] === 'true' ? 'bg-steel' : 'bg-navy/20'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  values[f.key] === 'true' ? 'translate-x-5' : 'translate-x-0'
                )} />
              </div>
              <span className="font-body text-sm text-navy">
                {values[f.key] === 'true' ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          ) : f.type === 'textarea' ? (
            <textarea
              value={values[f.key] ?? ''}
              onChange={e => set(f.key, e.target.value)}
              rows={3}
              placeholder={f.placeholder}
              className={inputCls}
            />
          ) : f.type === 'select' ? (
            <select value={values[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} className={inputCls}>
              <option value="">— Select —</option>
              {f.options?.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          ) : (
            <input
              type={f.type}
              value={values[f.key] ?? ''}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={inputCls}
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
        {saved && <span className="font-body text-sm text-green-600">Saved.</span>}
        {error && <span className="font-body text-sm text-red-600">Save failed. Try again.</span>}
      </div>
    </form>
  );
}

export function MarketingPage() {
  const [tab, setTab] = useState<MarketingTab>('announcement');
  const [saved, setSaved] = useState(false);
  const qc = useQueryClient();

  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get<Record<string, string>>('/settings');
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (updates: Record<string, string>) => api.put('/settings', updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const activeTab = TABS.find(t => t.key === tab)!;

  const fields =
    tab === 'announcement' ? ANNOUNCEMENT_FIELDS :
    tab === 'popup'        ? POPUP_FIELDS :
    WHATSAPP_FIELDS;

  return (
    <AdminLayout>
      {/* Tab nav */}
      <div className="border-b border-navy/10 bg-white">
        <div className="flex px-6">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'px-4 py-3 font-body text-sm border-b-2 transition-colors -mb-px whitespace-nowrap',
                tab === t.key
                  ? 'border-steel text-steel font-semibold'
                  : 'border-transparent text-navy/60 hover:text-navy hover:border-navy/30'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-2xl">
        <h1 className="font-heading text-2xl text-navy mb-1">{activeTab.label}</h1>
        <p className="font-body text-navy/60 text-sm mb-8">{activeTab.desc}</p>

        {isLoading ? (
          <p className="font-body text-navy/50">Loading settings…</p>
        ) : (
          <SettingsForm
            key={tab}
            fields={fields}
            settings={settings}
            onSave={vals => mutation.mutate(vals)}
            saving={mutation.isPending}
            saved={saved}
            error={mutation.isError}
          />
        )}
      </div>
    </AdminLayout>
  );
}
