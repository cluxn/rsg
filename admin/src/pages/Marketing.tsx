import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

type MarketingTab = 'announcement' | 'popups';

const TABS: { label: string; key: MarketingTab; desc: string }[] = [
  { label: 'Announcement Bar', key: 'announcement', desc: 'A dismissible banner across the top of every page' },
  { label: 'Popups', key: 'popups', desc: 'Timed and exit-intent popups shown to visitors' },
];

const inputCls = 'w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel font-body';
const labelCls = 'block text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1';

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors cursor-pointer',
        value ? 'bg-steel' : 'bg-navy/20'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
        value ? 'translate-x-5' : 'translate-x-0'
      )} />
    </div>
  );
}

function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <span className={cn(
      'text-xs font-semibold px-2.5 py-0.5 rounded-full',
      enabled ? 'bg-green-100 text-green-700' : 'bg-navy/10 text-navy/40'
    )}>
      {enabled ? 'Enabled' : 'Disabled'}
    </span>
  );
}

function SaveRow({ saving, saved, error }: { saving: boolean; saved: boolean; error: boolean }) {
  return (
    <div className="flex items-center gap-4 pt-1">
      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
      {saved && <span className="font-body text-sm text-green-600">Saved.</span>}
      {error && <span className="font-body text-sm text-red-600">Save failed. Try again.</span>}
    </div>
  );
}

// ─── Browser mockup shell ─────────────────────────────────────────────────────

function BrowserShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-navy/15 shadow-sm bg-white">
      <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded text-[10px] text-gray-400 px-2 py-0.5 text-center">yoursite.com</div>
      </div>
      {children}
    </div>
  );
}

// ─── Preview components ────────────────────────────────────────────────────────

const BG_MAP: Record<string, string> = {
  orange: 'bg-orange',
  steel:  'bg-steel',
  navy:   'bg-navy',
  green:  'bg-emerald-600',
};

function AnnouncementPreview({ text, cta, bg }: { text: string; cta: string; bg: string }) {
  return (
    <BrowserShell>
      {/* Announcement bar */}
      <div className={cn(
        'flex items-center justify-center gap-3 px-4 py-2 text-white text-[11px]',
        BG_MAP[bg] || 'bg-steel'
      )}>
        <span className="truncate">{text || 'Your announcement message appears here'}</span>
        {cta && (
          <span className="shrink-0 border border-white/50 rounded px-2 py-0.5 text-[10px]">{cta}</span>
        )}
      </div>

      {/* Fake page body */}
      <div className="p-5 space-y-3">
        <div className="h-4 bg-navy rounded w-1/2" />
        <div className="space-y-1.5">
          <div className="h-2 bg-navy/10 rounded w-full" />
          <div className="h-2 bg-navy/10 rounded w-5/6" />
          <div className="h-2 bg-navy/10 rounded w-4/6" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-16 bg-steel/20 rounded" />
          <div className="h-6 w-16 bg-navy/10 rounded" />
        </div>
      </div>
    </BrowserShell>
  );
}

function TimedPopupPreview({ body, ctaLabel }: { body: string; ctaLabel: string }) {
  return (
    <BrowserShell>
      <div className="relative" style={{ minHeight: 192 }}>
        {/* Faded page behind overlay */}
        <div className="p-4 space-y-2 opacity-25">
          <div className="h-3 bg-navy rounded w-2/3" />
          <div className="h-2 bg-navy/40 rounded w-full" />
          <div className="h-2 bg-navy/40 rounded w-5/6" />
          <div className="h-2 bg-navy/40 rounded w-3/4" />
        </div>

        {/* Overlay + popup card */}
        <div className="absolute inset-0 flex items-center justify-center bg-navy/40">
          <div className="bg-white rounded-xl shadow-xl mx-4 p-4 w-full max-w-[200px] text-center">
            <p className="font-body text-[11px] text-navy/70 leading-snug mb-3">
              {body || 'Your popup message will appear here.'}
            </p>
            <div className="bg-steel text-white text-[11px] font-semibold rounded-lg px-3 py-1.5 inline-block">
              {ctaLabel || 'Click Here'}
            </div>
          </div>
        </div>
      </div>
    </BrowserShell>
  );
}

function ExitPopupPreview({ title, body, ctaLabel }: { title: string; body: string; ctaLabel: string }) {
  return (
    <BrowserShell>
      <div className="relative" style={{ minHeight: 224 }}>
        {/* Faded page */}
        <div className="p-4 space-y-2 opacity-25">
          <div className="h-3 bg-navy rounded w-2/3" />
          <div className="h-2 bg-navy/40 rounded w-full" />
          <div className="h-2 bg-navy/40 rounded w-5/6" />
          <div className="h-2 bg-navy/40 rounded w-3/4" />
        </div>

        {/* Overlay + popup card */}
        <div className="absolute inset-0 flex items-center justify-center bg-navy/40">
          <div className="bg-white rounded-xl shadow-xl mx-4 p-4 w-full max-w-[210px] text-center">
            {(title || !body) && (
              <p className="font-heading text-sm text-navy font-bold mb-1.5">
                {title || 'Before you go'}
              </p>
            )}
            <p className="font-body text-[11px] text-navy/70 leading-snug mb-3">
              {body || 'Your exit message will appear here.'}
            </p>
            <div className="bg-steel text-white text-[11px] font-semibold rounded-lg px-3 py-1.5 inline-block">
              {ctaLabel || 'Click Here'}
            </div>
          </div>
        </div>
      </div>
    </BrowserShell>
  );
}

// ─── Section components ────────────────────────────────────────────────────────

function AnnouncementSection({
  settings,
  onSave,
  saving,
  saved,
  error,
}: {
  settings: Record<string, string>;
  onSave: (vals: Record<string, string>) => void;
  saving: boolean;
  saved: boolean;
  error: boolean;
}) {
  const [vals, setVals] = useState({
    announcement_enabled: settings.announcement_enabled ?? 'false',
    announcement_text:    settings.announcement_text    ?? '',
    announcement_cta:     settings.announcement_cta     ?? '',
    announcement_link:    settings.announcement_link    ?? '',
    announcement_bg:      settings.announcement_bg      ?? 'steel',
  });

  const set = (k: string, v: string) => setVals(p => ({ ...p, [k]: v }));
  const enabled = vals.announcement_enabled === 'true';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
      {/* Form */}
      <form onSubmit={e => { e.preventDefault(); onSave(vals); }} className="space-y-5">
        {/* Enable toggle */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-1">Enable Announcement Bar</label>
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <Toggle value={enabled} onChange={v => set('announcement_enabled', v ? 'true' : 'false')} />
            <span className="font-body text-sm text-navy">{enabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1">Message</label>
          <input
            type="text"
            value={vals.announcement_text}
            onChange={e => set('announcement_text', e.target.value)}
            placeholder="e.g. Free site survey for orders above ₹5 lakh — Call now!"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">CTA Button Text</label>
            <input
              type="text"
              value={vals.announcement_cta}
              onChange={e => set('announcement_cta', e.target.value)}
              placeholder="e.g. Get Quote"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">CTA Link</label>
            <input
              type="url"
              value={vals.announcement_link}
              onChange={e => set('announcement_link', e.target.value)}
              placeholder="e.g. /contact"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1">Background Color</label>
          <select value={vals.announcement_bg} onChange={e => set('announcement_bg', e.target.value)} className={inputCls}>
            <option value="">— Select —</option>
            {(['orange', 'steel', 'navy', 'green'] as const).map(o => (
              <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
            ))}
          </select>
        </div>

        <SaveRow saving={saving} saved={saved} error={error} />
      </form>

      {/* Live preview */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Live Preview</p>
        <AnnouncementPreview
          text={vals.announcement_text}
          cta={vals.announcement_cta}
          bg={vals.announcement_bg}
        />
      </div>
    </div>
  );
}

function TimedPopupSection({
  settings,
  onSave,
  saving,
  saved,
  error,
}: {
  settings: Record<string, string>;
  onSave: (vals: Record<string, string>) => void;
  saving: boolean;
  saved: boolean;
  error: boolean;
}) {
  const [vals, setVals] = useState({
    timed_enabled:   settings.timed_enabled   ?? 'false',
    timed_name:      settings.timed_name      ?? '',
    timed_url:       settings.timed_url       ?? '/*',
    timed_delay:     settings.timed_delay     ?? '5000',
    timed_body:      settings.timed_body      ?? '',
    timed_cta_label: settings.timed_cta_label ?? '',
    timed_cta_link:  settings.timed_cta_link  ?? '',
  });

  const set = (k: string, v: string) => setVals(p => ({ ...p, [k]: v }));
  const enabled = vals.timed_enabled === 'true';

  return (
    <div className="bg-white border border-navy/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-lg text-navy">Timed Popup</h2>
        <StatusBadge enabled={enabled} />
      </div>

      <div className="mb-5">
        <p className="font-body text-sm font-semibold text-navy">Enable on save</p>
        <p className="font-body text-xs text-navy/50 mb-2">Shows automatically after the delay</p>
        <Toggle value={enabled} onChange={v => set('timed_enabled', v ? 'true' : 'false')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
        {/* Form */}
        <form onSubmit={e => { e.preventDefault(); onSave(vals); }} className="space-y-4">
          <div>
            <label className={labelCls}>Name / Internal Label</label>
            <input
              type="text"
              value={vals.timed_name}
              onChange={e => set('timed_name', e.target.value)}
              placeholder="e.g. Ready to automate your ops?"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Target URL Pattern</label>
              <input
                type="text"
                value={vals.timed_url}
                onChange={e => set('timed_url', e.target.value)}
                placeholder="/*"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Delay (ms)</label>
              <input
                type="number"
                value={vals.timed_delay}
                onChange={e => set('timed_delay', e.target.value)}
                placeholder="5000"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Body Text</label>
            <textarea
              value={vals.timed_body}
              onChange={e => set('timed_body', e.target.value)}
              rows={3}
              placeholder="e.g. Get a 20-minute discovery call and a quick automation roadmap."
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>CTA Label</label>
              <input
                type="text"
                value={vals.timed_cta_label}
                onChange={e => set('timed_cta_label', e.target.value)}
                placeholder="e.g. Schedule a Call"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>CTA Link</label>
              <input
                type="text"
                value={vals.timed_cta_link}
                onChange={e => set('timed_cta_link', e.target.value)}
                placeholder="/contact-us"
                className={inputCls}
              />
            </div>
          </div>

          <SaveRow saving={saving} saved={saved} error={error} />
        </form>

        {/* Live preview */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Live Preview</p>
          <TimedPopupPreview body={vals.timed_body} ctaLabel={vals.timed_cta_label} />
        </div>
      </div>
    </div>
  );
}

function ExitPopupSection({
  settings,
  onSave,
  saving,
  saved,
  error,
}: {
  settings: Record<string, string>;
  onSave: (vals: Record<string, string>) => void;
  saving: boolean;
  saved: boolean;
  error: boolean;
}) {
  const [vals, setVals] = useState({
    popup_enabled:  settings.popup_enabled  ?? 'false',
    popup_title:    settings.popup_title    ?? settings.popup_headline ?? '',
    popup_body:     settings.popup_body     ?? '',
    popup_cta:      settings.popup_cta      ?? '',
    popup_cta_link: settings.popup_cta_link ?? '',
  });

  const set = (k: string, v: string) => setVals(p => ({ ...p, [k]: v }));
  const enabled = vals.popup_enabled === 'true';

  return (
    <div className="bg-white border border-navy/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-lg text-navy">Exit-Intent Popup</h2>
        <StatusBadge enabled={enabled} />
      </div>

      <div className="mb-5">
        <p className="font-body text-sm font-semibold text-navy">Enable on save</p>
        <p className="font-body text-xs text-navy/50 mb-2">Triggers when cursor moves to browser chrome</p>
        <Toggle value={enabled} onChange={v => set('popup_enabled', v ? 'true' : 'false')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
        {/* Form */}
        <form onSubmit={e => { e.preventDefault(); onSave(vals); }} className="space-y-4">
          <div>
            <label className={labelCls}>Title</label>
            <input
              type="text"
              value={vals.popup_title}
              onChange={e => set('popup_title', e.target.value)}
              placeholder="e.g. Before you go"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Body</label>
            <textarea
              value={vals.popup_body}
              onChange={e => set('popup_body', e.target.value)}
              rows={3}
              placeholder="e.g. Want a quick audit checklist? We will send it in minutes."
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>CTA Label</label>
              <input
                type="text"
                value={vals.popup_cta}
                onChange={e => set('popup_cta', e.target.value)}
                placeholder="e.g. Get the Checklist"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>CTA Link</label>
              <input
                type="text"
                value={vals.popup_cta_link}
                onChange={e => set('popup_cta_link', e.target.value)}
                placeholder="/contact-us"
                className={inputCls}
              />
            </div>
          </div>

          <SaveRow saving={saving} saved={saved} error={error} />
        </form>

        {/* Live preview */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Live Preview</p>
          <ExitPopupPreview
            title={vals.popup_title}
            body={vals.popup_body}
            ctaLabel={vals.popup_cta}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function MarketingPage() {
  const [tab, setTab] = useState<MarketingTab>('announcement');
  const [announcementSaved, setAnnouncementSaved] = useState(false);
  const [savedSection, setSavedSection] = useState<'timed' | 'exit' | null>(null);
  const qc = useQueryClient();

  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get<Record<string, string>>('/settings');
      return res.data;
    },
  });

  const announcementMutation = useMutation({
    mutationFn: (updates: Record<string, string>) => api.put('/settings', updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setAnnouncementSaved(true);
      setTimeout(() => setAnnouncementSaved(false), 3000);
    },
  });

  const popupMutation = useMutation({
    mutationFn: ({ updates, section }: { updates: Record<string, string>; section: 'timed' | 'exit' }) =>
      api.put('/settings', updates).then(() => section),
    onSuccess: (section) => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 3000);
    },
  });

  const activeTab = TABS.find(t => t.key === tab)!;

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

      <div className="p-8 max-w-5xl">
        <h1 className="font-heading text-2xl text-navy mb-1">{activeTab.label}</h1>
        <p className="font-body text-navy/60 text-sm mb-8">{activeTab.desc}</p>

        {isLoading ? (
          <p className="font-body text-navy/50">Loading settings…</p>
        ) : tab === 'announcement' ? (
          <AnnouncementSection
            key="announcement"
            settings={settings}
            onSave={vals => announcementMutation.mutate(vals)}
            saving={announcementMutation.isPending}
            saved={announcementSaved}
            error={announcementMutation.isError}
          />
        ) : (
          <div key="popups" className="space-y-6">
            <TimedPopupSection
              settings={settings}
              onSave={updates => popupMutation.mutate({ updates, section: 'timed' })}
              saving={popupMutation.isPending && popupMutation.variables?.section === 'timed'}
              saved={savedSection === 'timed'}
              error={popupMutation.isError && popupMutation.variables?.section === 'timed'}
            />
            <ExitPopupSection
              settings={settings}
              onSave={updates => popupMutation.mutate({ updates, section: 'exit' })}
              saving={popupMutation.isPending && popupMutation.variables?.section === 'exit'}
              saved={savedSection === 'exit'}
              error={popupMutation.isError && popupMutation.variables?.section === 'exit'}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
