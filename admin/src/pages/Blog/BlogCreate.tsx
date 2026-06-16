import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { createBlogPost } from '@/lib/api';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required'),
  excerpt: z.string().optional(),
  body: z.string().default(''),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  published: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const inputCls = 'w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel font-body';

export function BlogCreatePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, setValue, getValues, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { body: '', published: false, excerpt: '' },
  });

  const published = watch('published');

  const mutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => navigate('/blog'),
  });

  const onTitleBlur = () => {
    const title = getValues('title');
    if (title) setValue('slug', slugify(title));
  };

  return (
    <AdminLayout>
      <ContentTabs />

      <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-3 border-b border-navy/10 bg-white">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/blog')} className="font-body text-sm text-navy/60 hover:text-navy">← Back</button>
            <span className="font-heading text-lg text-navy">Untitled blog post</span>
            <span className="text-xs bg-navy/10 text-navy/60 px-2 py-0.5 rounded font-body">
              {published ? 'Published' : 'Draft'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/blog')} className="font-body text-sm text-navy/60 hover:text-navy px-3 py-1.5 rounded border border-navy/20">Cancel <span className="text-navy/40">Esc</span></button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save ▾'}
            </Button>
          </div>
        </div>

        {/* 2-column body */}
        <div className="flex min-h-[calc(100vh-8rem)]">
          {/* Left: main content */}
          <div className="flex-1 px-8 py-6 overflow-y-auto space-y-5 max-w-3xl">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Title *</label>
              <input {...register('title')} onBlur={onTitleBlur} className={inputCls} placeholder="Post title" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Slug *</label>
              <input {...register('slug')} className={`${inputCls} font-mono`} placeholder="post-slug" />
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
                  <TiptapEditor value={field.value} onChange={field.onChange} placeholder="Write your blog post…" />
                )}
              />
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <aside className="w-72 shrink-0 border-l border-navy/10 bg-white">
            <div className="sticky top-0 p-5 space-y-5 max-h-screen overflow-y-auto">

              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Status</label>
                <select
                  value={published ? 'published' : 'draft'}
                  onChange={e => setValue('published', e.target.value === 'published')}
                  className={inputCls}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="border-t border-navy/10 pt-5">
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-3">SEO</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Meta Title</label>
                    <input {...register('meta_title')} className={inputCls} placeholder="SEO title" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Meta Description</label>
                    <textarea {...register('meta_description')} rows={3} className={inputCls} placeholder="SEO description" />
                  </div>
                </div>
              </div>

              {mutation.isError && (
                <p className="text-red-500 text-xs">Failed to create post. Try again.</p>
              )}
            </div>
          </aside>
        </div>
      </form>
    </AdminLayout>
  );
}
