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
    <div className="flex items-center gap-4">
      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
      {saved && <span className="font-body text-sm text-green-600">Saved.</span>}
      {error && <span className="font-body text-sm text-red-600">Save failed. Try again.</span>}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const safeHex = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#000000';
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={safeHex}
          onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg border border-navy/20 cursor-pointer p-0.5 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className="w-28 border border-navy/20 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-steel"
        />
      </div>
    </div>
  );
}

const TEXT_SIZES = [
  { value: 'xs',   label: 'S',  px: 12 },
  { value: 'sm',   label: 'M',  px: 14 },
  { value: 'base', label: 'L',  px: 16 },
  { value: 'lg',   label: 'XL', px: 18 },
] as const;

const SIZE_TO_PX: Record<string, number> = { xs: 12, sm: 14, base: 16, lg: 18 };

function TextSizePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={labelCls}>Text Size</label>
      <div className="flex gap-1.5">
        {TEXT_SIZES.map(s => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={cn(
              'w-9 h-9 rounded-lg text-xs font-semibold border transition-colors',
              value === s.value
                ? 'border-steel bg-steel/10 text-steel'
                : 'border-navy/20 text-navy/50 hover:border-navy/40'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function renderHighlighted(text: string, phrase: string, highlightColor: string, textColor: string, fontSize: number) {
  const style: React.CSSProperties = { color: textColor, fontSize };
  if (!phrase || !text.includes(phrase)) {
    return <span style={style}>{text || <span className="opacity-30 italic">Text will appear here…</span>}</span>;
  }
  const parts = text.split(phrase);
  return (
    <span style={style}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <mark style={{ backgroundColor: highlightColor, color: 'inherit', borderRadius: 2, padding: '0 2px' }}>
              {phrase}
            </mark>
          )}
        </span>
      ))}
    </span>
  );
}

// ─── Announcement preview — full-width realistic bar ─────────────────────────

const BG_NAME_TO_HEX: Record<string, string> = {
  orange: '#F04F00',
  steel:  '#0E4FA8',
  navy:   '#07152B',
  green:  '#16a34a',
};

function migrateAnnouncementBg(v: string): string {
  if (v.startsWith('#')) return v;
  return BG_NAME_TO_HEX[v] ?? '#0E4FA8';
}

function AnnouncementBarPreview({
  text, cta, bgColor, textColor, ctaColor, textSize, highlightText, highlightColor,
}: {
  text: string; cta: string; bgColor: string; textColor: string; ctaColor: string;
  textSize: string; highlightText: string; highlightColor: string;
}) {
  const tc   = textColor  || '#ffffff';
  const fs   = SIZE_TO_PX[textSize] ?? 14;

  return (
    <div>
      <div
        className="w-full flex items-center justify-center gap-4 px-6 py-3 rounded-lg"
        style={{ backgroundColor: bgColor || '#0E4FA8' }}
      >
        <span className="font-body">
          {renderHighlighted(text || 'Your announcement message appears here', highlightText, highlightColor, tc, fs)}
        </span>
        {cta && (
          <button
            className="shrink-0 font-semibold rounded-md px-3 py-1 border shrink-0"
            style={{ color: ctaColor || '#ffffff', borderColor: ctaColor || '#ffffff', fontSize: fs }}
          >
            {cta}
          </button>
        )}
      </div>
      <p className="text-center text-xs text-navy/30 font-body mt-1.5">Live Preview</p>
    </div>
  );
}

// ─── Popup preview — floating card style (like real site nudge) ───────────────

function PopupPreview({
  title, body, ctaLabel, bgColor, textColor, ctaColor, textSize, highlightText, highlightColor,
}: {
  title?: string; body: string; ctaLabel: string;
  bgColor?: string; textColor?: string; ctaColor?: string;
  textSize?: string; highlightText?: string; highlightColor?: string;
}) {
  const bg   = bgColor   || '#ffffff';
  const tc   = textColor || '#07152B';
  const cta  = ctaColor  || '#0E4FA8';
  const fs   = SIZE_TO_PX[textSize ?? 'sm'] ?? 14;

  return (
    <div className="relative w-full rounded-lg border border-navy/10 bg-gray-50" style={{ minHeight: 180 }}>
      <span className="absolute top-3 left-4 text-[10px] font-semibold text-navy/30 uppercase tracking-widest select-none">
        Preview
      </span>

      <div className="absolute bottom-5 left-5">
        <div className="rounded-xl shadow-lg border border-black/8 p-4 w-64" style={{ backgroundColor: bg }}>
          {title && (
            <p className="font-heading text-sm font-bold mb-1 leading-snug" style={{ color: tc }}>{title}</p>
          )}
          <p className="font-body font-semibold leading-snug mb-2">
            {renderHighlighted(body, highlightText ?? '', highlightColor ?? '#FBBF24', tc, fs)}
          </p>
          {ctaLabel && (
            <span className="font-body text-sm font-semibold" style={{ color: cta }}>
              {ctaLabel} →
            </span>
          )}
        </div>
      </div>
    </div>
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
    announcement_enabled:         settings.announcement_enabled         ?? 'false',
    announcement_text:            settings.announcement_text            ?? '',
    announcement_cta:             settings.announcement_cta             ?? '',
    announcement_link:            settings.announcement_link            ?? '',
    announcement_bg:              migrateAnnouncementBg(settings.announcement_bg ?? ''),
    announcement_text_color:      settings.announcement_text_color      ?? '#ffffff',
    announcement_cta_color:       settings.announcement_cta_color       ?? '#ffffff',
    announcement_text_size:       settings.announcement_text_size       ?? 'sm',
    announcement_highlight_text:  settings.announcement_highlight_text  ?? '',
    announcement_highlight_color: settings.announcement_highlight_color ?? '#FBBF24',
  });

  const set = (k: string, v: string) => setVals(p => ({ ...p, [k]: v }));
  const enabled = vals.announcement_enabled === 'true';

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(vals); }} className="space-y-5 max-w-2xl">
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

      {/* Design */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Design</p>
        <div className="grid grid-cols-3 gap-4">
          <ColorField label="Background"  value={vals.announcement_bg}         onChange={v => set('announcement_bg', v)} />
          <ColorField label="Text Color"  value={vals.announcement_text_color} onChange={v => set('announcement_text_color', v)} />
          <ColorField label="CTA Color"   value={vals.announcement_cta_color}  onChange={v => set('announcement_cta_color', v)} />
        </div>
        <TextSizePicker value={vals.announcement_text_size} onChange={v => set('announcement_text_size', v)} />
        <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className={labelCls}>Highlight Phrase</label>
            <input
              type="text"
              value={vals.announcement_highlight_text}
              onChange={e => set('announcement_highlight_text', e.target.value)}
              placeholder="e.g. Free site survey"
              className={inputCls}
            />
          </div>
          <ColorField label="Highlight Color" value={vals.announcement_highlight_color} onChange={v => set('announcement_highlight_color', v)} />
        </div>
      </div>

      {/* Live preview — full-width bar */}
      <AnnouncementBarPreview
        text={vals.announcement_text}
        cta={vals.announcement_cta}
        bgColor={vals.announcement_bg}
        textColor={vals.announcement_text_color}
        ctaColor={vals.announcement_cta_color}
        textSize={vals.announcement_text_size}
        highlightText={vals.announcement_highlight_text}
        highlightColor={vals.announcement_highlight_color}
      />

      <SaveRow saving={saving} saved={saved} error={error} />
    </form>
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
    timed_enabled:         settings.timed_enabled         ?? 'false',
    timed_name:            settings.timed_name            ?? '',
    timed_url:             settings.timed_url             ?? '/*',
    timed_delay:           settings.timed_delay           ?? '5000',
    timed_body:            settings.timed_body            ?? '',
    timed_cta_label:       settings.timed_cta_label       ?? '',
    timed_cta_link:        settings.timed_cta_link        ?? '',
    timed_bg_color:        settings.timed_bg_color        ?? '#ffffff',
    timed_text_color:      settings.timed_text_color      ?? '#07152B',
    timed_cta_color:       settings.timed_cta_color       ?? '#0E4FA8',
    timed_text_size:       settings.timed_text_size       ?? 'sm',
    timed_highlight_text:  settings.timed_highlight_text  ?? '',
    timed_highlight_color: settings.timed_highlight_color ?? '#FBBF24',
  });

  const set = (k: string, v: string) => setVals(p => ({ ...p, [k]: v }));
  const enabled = vals.timed_enabled === 'true';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Toggle value={enabled} onChange={v => set('timed_enabled', v ? 'true' : 'false')} />
        <div>
          <p className="font-body text-sm font-semibold text-navy leading-none">Enable on save</p>
          <p className="font-body text-xs text-navy/50 mt-0.5">Shows automatically after the delay</p>
        </div>
        <StatusBadge enabled={enabled} />
      </div>

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

        {/* Design */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Design</p>
          <div className="grid grid-cols-3 gap-4">
            <ColorField label="Background" value={vals.timed_bg_color}   onChange={v => set('timed_bg_color', v)} />
            <ColorField label="Text Color"  value={vals.timed_text_color} onChange={v => set('timed_text_color', v)} />
            <ColorField label="CTA Color"   value={vals.timed_cta_color}  onChange={v => set('timed_cta_color', v)} />
          </div>
          <TextSizePicker value={vals.timed_text_size} onChange={v => set('timed_text_size', v)} />
          <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label className={labelCls}>Highlight Phrase</label>
              <input
                type="text"
                value={vals.timed_highlight_text}
                onChange={e => set('timed_highlight_text', e.target.value)}
                placeholder="e.g. discovery call"
                className={inputCls}
              />
            </div>
            <ColorField label="Highlight Color" value={vals.timed_highlight_color} onChange={v => set('timed_highlight_color', v)} />
          </div>
        </div>

        {/* Live preview */}
        <PopupPreview
          body={vals.timed_body}
          ctaLabel={vals.timed_cta_label}
          bgColor={vals.timed_bg_color}
          textColor={vals.timed_text_color}
          ctaColor={vals.timed_cta_color}
          textSize={vals.timed_text_size}
          highlightText={vals.timed_highlight_text}
          highlightColor={vals.timed_highlight_color}
        />

        <SaveRow saving={saving} saved={saved} error={error} />
      </form>
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
    popup_enabled:         settings.popup_enabled         ?? 'false',
    popup_title:           settings.popup_title           ?? settings.popup_headline ?? '',
    popup_body:            settings.popup_body            ?? '',
    popup_cta:             settings.popup_cta             ?? '',
    popup_cta_link:        settings.popup_cta_link        ?? '',
    popup_bg_color:        settings.popup_bg_color        ?? '#ffffff',
    popup_text_color:      settings.popup_text_color      ?? '#07152B',
    popup_cta_color:       settings.popup_cta_color       ?? '#0E4FA8',
    popup_text_size:       settings.popup_text_size       ?? 'sm',
    popup_highlight_text:  settings.popup_highlight_text  ?? '',
    popup_highlight_color: settings.popup_highlight_color ?? '#FBBF24',
  });

  const set = (k: string, v: string) => setVals(p => ({ ...p, [k]: v }));
  const enabled = vals.popup_enabled === 'true';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Toggle value={enabled} onChange={v => set('popup_enabled', v ? 'true' : 'false')} />
        <div>
          <p className="font-body text-sm font-semibold text-navy leading-none">Enable on save</p>
          <p className="font-body text-xs text-navy/50 mt-0.5">Triggers when cursor moves to browser chrome</p>
        </div>
        <StatusBadge enabled={enabled} />
      </div>

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

        {/* Design */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Design</p>
          <div className="grid grid-cols-3 gap-4">
            <ColorField label="Background" value={vals.popup_bg_color}   onChange={v => set('popup_bg_color', v)} />
            <ColorField label="Text Color"  value={vals.popup_text_color} onChange={v => set('popup_text_color', v)} />
            <ColorField label="CTA Color"   value={vals.popup_cta_color}  onChange={v => set('popup_cta_color', v)} />
          </div>
          <TextSizePicker value={vals.popup_text_size} onChange={v => set('popup_text_size', v)} />
          <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label className={labelCls}>Highlight Phrase</label>
              <input
                type="text"
                value={vals.popup_highlight_text}
                onChange={e => set('popup_highlight_text', e.target.value)}
                placeholder="e.g. audit checklist"
                className={inputCls}
              />
            </div>
            <ColorField label="Highlight Color" value={vals.popup_highlight_color} onChange={v => set('popup_highlight_color', v)} />
          </div>
        </div>

        {/* Live preview */}
        <PopupPreview
          title={vals.popup_title}
          body={vals.popup_body}
          ctaLabel={vals.popup_cta}
          bgColor={vals.popup_bg_color}
          textColor={vals.popup_text_color}
          ctaColor={vals.popup_cta_color}
          textSize={vals.popup_text_size}
          highlightText={vals.popup_highlight_text}
          highlightColor={vals.popup_highlight_color}
        />

        <SaveRow saving={saving} saved={saved} error={error} />
      </form>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type PopupTab = 'timed' | 'exit';

const POPUP_TABS: { label: string; key: PopupTab }[] = [
  { label: 'Timed Popup', key: 'timed' },
  { label: 'Exit Popup',  key: 'exit'  },
];

export function MarketingPage() {
  const [tab, setTab] = useState<MarketingTab>('announcement');
  const [popupTab, setPopupTab] = useState<PopupTab>('timed');
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

      {/* Popup sub-tab nav — only visible on Popups tab */}
      {tab === 'popups' && (
        <div className="border-b border-navy/10 bg-white px-6">
          <div className="flex">
            {POPUP_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setPopupTab(t.key)}
                className={cn(
                  'px-4 py-2.5 font-body text-sm border-b-2 transition-colors -mb-px whitespace-nowrap',
                  popupTab === t.key
                    ? 'border-steel text-steel font-semibold'
                    : 'border-transparent text-navy/60 hover:text-navy hover:border-navy/30'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-8 max-w-2xl">
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
        ) : popupTab === 'timed' ? (
          <TimedPopupSection
            key="timed"
            settings={settings}
            onSave={updates => popupMutation.mutate({ updates, section: 'timed' })}
            saving={popupMutation.isPending && popupMutation.variables?.section === 'timed'}
            saved={savedSection === 'timed'}
            error={popupMutation.isError && popupMutation.variables?.section === 'timed'}
          />
        ) : (
          <ExitPopupSection
            key="exit"
            settings={settings}
            onSave={updates => popupMutation.mutate({ updates, section: 'exit' })}
            saving={popupMutation.isPending && popupMutation.variables?.section === 'exit'}
            saved={savedSection === 'exit'}
            error={popupMutation.isError && popupMutation.variables?.section === 'exit'}
          />
        )}
      </div>
    </AdminLayout>
  );
}
