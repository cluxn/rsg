import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { createTestimonial } from '@/lib/api';

const schema = z.object({
  text: z.string().min(1, 'Required'),
  author_name: z.string().min(1, 'Required'),
  author_city: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  source: z.enum(['google', 'indiamart', 'justdial', 'other']),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export function TestimonialCreatePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { source: 'google', active: true },
  });

  const mutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => navigate('/testimonials'),
  });

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="font-heading text-2xl text-navy mb-6">Add Testimonial</h1>
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Review Text *</label>
            <textarea {...register('text')} rows={3} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
            {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Author Name *</label>
              <input {...register('author_name')} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
              {errors.author_name && <p className="text-red-500 text-xs mt-1">{errors.author_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1">City</label>
              <input {...register('author_city')} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Rating (1–5)</label>
              <input type="number" step="0.1" min="1" max="5" {...register('rating')} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Source</label>
              <select {...register('source')} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel bg-white">
                <option value="google">Google</option>
                <option value="indiamart">IndiaMART</option>
                <option value="justdial">Justdial</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" {...register('active')} className="w-4 h-4 accent-steel" />
            <label htmlFor="active" className="text-sm font-semibold text-navy">Show on public site</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Adding…' : 'Add Testimonial'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/testimonials')}>Cancel</Button>
          </div>
          {mutation.isError && <p className="text-red-500 text-sm">Failed to add testimonial. Try again.</p>}
        </form>
      </div>
    </AdminLayout>
  );
}
