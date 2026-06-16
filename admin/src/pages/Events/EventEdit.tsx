import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { getEventsAdmin, updateEvent, type EventRecord } from '@/lib/api';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required'),
  body: z.string().default(''),
  event_date: z.string().optional(),
  published: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

export function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: events = [] } = useQuery<EventRecord[]>({
    queryKey: ['events-admin'],
    queryFn: getEventsAdmin,
  });

  const event = events.find(e => String(e.id) === id);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { body: '', published: false },
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        slug: event.slug,
        body: event.body ?? '',
        event_date: event.event_date ?? '',
        published: event.published,
      });
    }
  }, [event, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateEvent(Number(id), data),
    onSuccess: () => navigate('/events'),
  });

  if (!event) return <AdminLayout><div className="p-8 text-navy/60">Loading…</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <h1 className="font-heading text-2xl text-navy mb-6">Edit Event</h1>
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Title *</label>
            <input {...register('title')} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
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
                <TiptapEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Event Date</label>
            <input type="date" {...register('event_date')} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" {...register('published')} className="w-4 h-4 accent-steel" />
            <label htmlFor="published" className="text-sm font-semibold text-navy">Published</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/events')}>Cancel</Button>
          </div>
          {mutation.isError && <p className="text-red-500 text-sm">Failed to save. Try again.</p>}
        </form>
      </div>
    </AdminLayout>
  );
}
