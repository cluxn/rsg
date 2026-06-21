import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { CoverImageUploader } from '@/components/ui/CoverImageUploader';
import {
  getBlogPostsAdmin,
  updateBlogPost,
  getAuthorsAdmin,
  getCategoriesAdmin,
  type BlogPost,
  type ContentStatus,
  type Author,
  type Category,
} from '@/lib/api';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required'),
  excerpt: z.string().optional(),
  body: z.string().default(''),
  author_name: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().default(false),
  featured_image: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
  scheduled_at: z.string().nullable().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputCls = 'w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel font-body';
const labelCls = 'block text-xs font-semibold text-navy mb-1';

export function BlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ['blog-admin'],
    queryFn: getBlogPostsAdmin,
  });

  const post = posts.find(p => String(p.id) === id);

  const { register, handleSubmit, control, reset, watch, setValue, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { body: '', status: 'draft', featured: false },
  });

  const status = watch('status') as ContentStatus;

  const { data: authors = [] } = useQuery<Author[]>({ queryKey: ['authors-admin'], queryFn: getAuthorsAdmin });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ['categories-admin'], queryFn: getCategoriesAdmin });
  const blogCategories = categories.filter(c => !c.type || c.type === 'blog');

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        body: post.body,
        excerpt: post.excerpt ?? '',
        author_name: post.author_name ?? '',
        category: post.category ?? '',
        featured: post.featured,
        featured_image: post.featured_image ?? '',
        status: post.status,
        scheduled_at: post.scheduled_at ?? '',
        meta_title: post.meta_title ?? '',
        meta_description: post.meta_description ?? '',
        canonical_url: post.canonical_url ?? '',
      });
    }
  }, [post, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateBlogPost(Number(id), data),
    onSuccess: () => navigate('/blog'),
  });

  const submitWithStatus = (targetStatus: 'draft' | 'published' | 'scheduled') => {
    setValue('status', targetStatus);
    setShowSaveMenu(false);
    setTimeout(() => handleSubmit(d => mutation.mutate(d))(), 0);
  };

  const handlePreview = () => {
    const s = getValues('slug');
    if (!s) { alert('No slug set for preview.'); return; }
    window.open(`http://localhost:3000/blog/${s}`, '_blank');
  };

  const saveLabel = status === 'published' ? 'Update' : status === 'scheduled' ? 'Schedule' : 'Save Draft';

  if (!post) return <AdminLayout><ContentTabs /><div className="p-8 text-navy/60">Loading…</div></AdminLayout>;

  return (
    <AdminLayout>
      <ContentTabs />

      <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-3 border-b border-navy/10 bg-white">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/blog')} className="font-body text-sm text-navy/60 hover:text-navy">← Back</button>
            <span className="font-heading text-lg text-navy">{post.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded font-body capitalize
              ${status === 'published' ? 'bg-green-100 text-green-700' : status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-navy/10 text-navy/60'}`}>
              {status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/blog')}
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
              <input {...register('title')} className={inputCls} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Slug *</label>
              <input {...register('slug')} className={`${inputCls} font-mono`} />
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
                  <TiptapEditor value={field.value} onChange={field.onChange} />
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
                  name="featured_image"
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
                  <label htmlFor="featured" className="text-sm text-navy">Featured post</label>
                </div>
              </div>

              {/* Post meta */}
              <div className="border-t border-navy/10 pt-4 space-y-3">
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Details</p>
                <div>
                  <label className={labelCls}>Author</label>
                  <select {...register('author_name')} className={inputCls}>
                    <option value="">— Select author —</option>
                    {authors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select {...register('category')} className={inputCls}>
                    <option value="">— Select category —</option>
                    {blogCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
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
                <p className="text-red-500 text-xs">Failed to save. Try again.</p>
              )}
            </div>
          </aside>
        </div>
      </form>
    </AdminLayout>
  );
}
