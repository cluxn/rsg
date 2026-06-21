import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { CoverImageUploader } from '@/components/ui/CoverImageUploader';
import { createEvent, type ContentStatus } from '@/lib/api';

const EVENT_TYPES = ['Conference', 'Exhibition', 'Trade Show', 'Webinar', 'Workshop', 'Product Launch', 'News'];

const schema = z.object({
  title: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required'),
  body: z.string().default(''),
  excerpt: z.string().optional(),
  event_type: z.string().optional(),
  location: z.string().optional(),
  event_date: z.string().optional(),
  end_date: z.string().optional(),
  cover_image: z.string().optional(),
  show_sidebar_form: z.boolean().default(true),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
  scheduled_at: z.string().nullable().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const inputCls = 'w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel font-body';
const labelCls = 'block text-xs font-semibold text-navy mb-1';

export function EventCreatePage() {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const { register, handleSubmit, control, setValue, getValues, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { body: '', status: 'draft', featured: false, show_sidebar_form: true },
  });

  const status = watch('status') as ContentStatus;

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => navigate('/events'),
  });

  const onTitleBlur = () => {
    const title = getValues('title');
    if (title) setValue('slug', slugify(title));
  };

  const submitWithStatus = (targetStatus: 'draft' | 'published' | 'scheduled') => {
    setValue('status', targetStatus);
    setShowSaveMenu(false);
    setTimeout(() => handleSubmit(d => mutation.mutate(d))(), 0);
  };

  const handlePreview = () => {
    const s = getValues('slug');
    if (!s) { alert('Enter a slug first to preview.'); return; }
    window.open(`http://localhost:3000/events/${s}`, '_blank');
  };

  const saveLabel = status === 'published' ? 'Update' : status === 'scheduled' ? 'Schedule' : 'Save Draft';

  return (
    <AdminLayout>
      <ContentTabs />

      <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-3 border-b border-navy/10 bg-white">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/events')} className="font-body text-sm text-navy/60 hover:text-navy">← Back</button>
            <span className="font-heading text-lg text-navy">New Event</span>
            <span className={`text-xs px-2 py-0.5 rounded font-body capitalize
              ${status === 'published' ? 'bg-green-100 text-green-700' : status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-navy/10 text-navy/60'}`}>
              {status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/events')}
              className="font-body text-sm text-navy/60 hover:text-navy px-3 py-1.5 rounded border border-navy/20">
              Cancel
            </button>
            <button type="button" onClick={handlePreview}
              className="font-body text-sm text-navy/70 hover:text-navy px-3 py-1.5 rounded border border-navy/20 hover:bg-navy/5">
              Preview
            </button>
            <div className="relative" ref={dropdownRef}>
              <div className="flex">
                <button type="submit" disabled={mutation.isPending}
                  className="bg-steel text-white text-sm font-body px-4 py-1.5 rounded-l-lg hover:bg-steel/90 disabled:opacity-60">
                  {mutation.isPending ? 'Saving…' : saveLabel}
                </button>
                <button type="button" onClick={() => setShowSaveMenu(v => !v)}
                  className="bg-steel text-white px-2 py-1.5 rounded-r-lg border-l border-white/30 hover:bg-steel/90">
                  ▾
                </button>
              </div>
              {showSaveMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-navy/20 rounded-lg shadow-lg py-1 z-50 w-40">
                  <button type="button" onClick={() => submitWithStatus('draft')}
                    className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-navy/5">Save Draft</button>
                  <button type="button" onClick={() => submitWithStatus('published')}
                    className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-navy/5">Publish Now</button>
                  <button type="button" onClick={() => { setValue('status', 'scheduled'); setShowSaveMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-navy/5">Schedule…</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2-column body */}
        <div className="flex min-h-[calc(100vh-8rem)]">
          {/* Left: main content */}
          <div className="flex-1 px-8 py-6 overflow-y-auto space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Title *</label>
              <input {...register('title')} onBlur={onTitleBlur} className={inputCls} placeholder="Event title" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Slug *</label>
              <input {...register('slug')} className={`${inputCls} font-mono`} placeholder="event-slug" />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Excerpt</label>
              <textarea {...register('excerpt')} rows={2} className={inputCls} placeholder="Short description shown in listings…" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Content</label>
              <Controller
                name="body"
                control={control}
                render={({ field }) => (
                  <TiptapEditor value={field.value} onChange={field.onChange} placeholder="Write event details…" />
                )}
              />
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <aside className="w-72 shrink-0 border-l border-navy/10 bg-white">
            <div className="sticky top-0 p-5 space-y-5 max-h-screen overflow-y-auto">

              {/* Cover image */}
              <div>
                <label className={labelCls}>Cover Image</label>
                <Controller
                  name="cover_image"
                  control={control}
                  render={({ field }) => (
                    <CoverImageUploader
                      value={field.value}
                      onUploaded={url => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  )}
                />
              </div>

              {/* Publish settings */}
              <div className="border-t border-navy/10 pt-4 space-y-3">
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Publish</p>
                <div>
                  <label className={labelCls}>Status</label>
                  <select {...register('status')} className={inputCls}>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                {status === 'scheduled' && (
                  <div>
                    <label className={labelCls}>Schedule At</label>
                    <input type="datetime-local" {...register('scheduled_at')} className={inputCls} />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" {...register('featured')} className="rounded" />
                  <label htmlFor="featured" className="text-sm text-navy">Featured event</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="show_sidebar_form" {...register('show_sidebar_form')} className="rounded" />
                  <label htmlFor="show_sidebar_form" className="text-sm text-navy">Show sidebar registration form</label>
                </div>
              </div>

              {/* Event details */}
              <div className="border-t border-navy/10 pt-4 space-y-3">
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Event Details</p>
                <div>
                  <label className={labelCls}>Event Type</label>
                  <select {...register('event_type')} className={inputCls}>
                    <option value="">— None —</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input {...register('location')} className={inputCls} placeholder="City or venue" />
                </div>
                <div>
                  <label className={labelCls}>Event Date</label>
                  <input type="date" {...register('event_date')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>End Date</label>
                  <input type="date" {...register('end_date')} className={inputCls} />
                </div>
              </div>

              {/* SEO */}
              <div className="border-t border-navy/10 pt-4 space-y-3">
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide">SEO</p>
                <div>
                  <label className={labelCls}>Meta Title</label>
                  <input {...register('meta_title')} className={inputCls} placeholder="SEO title" />
                </div>
                <div>
                  <label className={labelCls}>Meta Description</label>
                  <textarea {...register('meta_description')} rows={3} className={inputCls} placeholder="SEO description" />
                </div>
                <div>
                  <label className={labelCls}>Canonical URL</label>
                  <input {...register('canonical_url')} className={inputCls} placeholder="https://…" />
                </div>
              </div>

              {mutation.isError && (
                <p className="text-red-500 text-xs">Failed to create event. Try again.</p>
              )}
            </div>
          </aside>
        </div>
      </form>
    </AdminLayout>
  );
}
