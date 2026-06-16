import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { createEvent } from '@/lib/api';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required'),
  body: z.string().default(''),
  event_date: z.string().optional(),
  published: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function EventCreatePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { body: '', published: false },
  });

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => navigate('/events'),
  });

  const onTitleBlur = () => {
    const title = getValues('title');
    if (title) setValue('slug', slugify(title));
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <h1 className="font-heading text-2xl text-navy mb-6">New Event</h1>
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Title *</label>
            <input {...register('title')} onBlur={onTitleBlur} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Slug *</label>
            <input {...register('slug')} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-steel" />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Body</label>
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <TiptapEditor value={field.value} onChange={field.onChange} placeholder="Write event details..." />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Event Date</label>
            <input type="date" {...register('event_date')} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" {...register('published')} className="w-4 h-4 accent-steel" />
            <label htmlFor="published" className="text-sm font-semibold text-navy">Publish immediately</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating…' : 'Create Event'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/events')}>Cancel</Button>
          </div>
          {mutation.isError && <p className="text-red-500 text-sm">Failed to create event. Try again.</p>}
        </form>
      </div>
    </AdminLayout>
  );
}
