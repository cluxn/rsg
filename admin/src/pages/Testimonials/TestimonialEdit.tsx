import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { CoverImageUploader } from '@/components/ui/CoverImageUploader';
import { getTestimonialsAdmin, updateTestimonial, type Testimonial } from '@/lib/api';

const schema = z.object({
  text: z.string().min(1, 'Required'),
  author_name: z.string().min(1, 'Required'),
  author_city: z.string().optional(),
  author_image: z.string().optional(),
  company: z.string().optional(),
  designation: z.string().optional(),
  product_bought: z.string().optional(),
  rating: z.preprocess(v => (v === '' || v === null || v === undefined) ? undefined : Number(v), z.number().min(1).max(5).optional()),
  source: z.enum(['google', 'indiamart', 'justdial', 'other']),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

const inputCls = 'w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel';
const labelCls = 'block text-sm font-semibold text-navy mb-1';

export function TestimonialEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials-admin'],
    queryFn: getTestimonialsAdmin,
  });

  const testimonial = testimonials.find(t => String(t.id) === id);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { source: 'google', active: true },
  });

  useEffect(() => {
    if (testimonial) {
      reset({
        text: testimonial.text,
        author_name: testimonial.author_name,
        author_city: testimonial.author_city ?? '',
        author_image: testimonial.author_image ?? '',
        company: testimonial.company ?? '',
        designation: testimonial.designation ?? '',
        product_bought: testimonial.product_bought ?? '',
        rating: testimonial.rating,
        source: testimonial.source,
        active: testimonial.active,
      });
    }
  }, [testimonial, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateTestimonial(Number(id), data),
    onSuccess: () => navigate('/testimonials'),
  });

  if (!testimonial) return <AdminLayout><div className="p-8 text-navy/60">Loading…</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="font-heading text-2xl text-navy mb-6">Edit Testimonial</h1>
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">

          {/* Review text */}
          <div>
            <label className={labelCls}>Review Text *</label>
            <textarea {...register('text')} rows={4} className={inputCls} />
            {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text.message}</p>}
          </div>

          {/* Author photo */}
          <div>
            <label className={labelCls}>Photo of Reviewer</label>
            <Controller
              name="author_image"
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

          {/* Author name + city */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Author Name *</label>
              <input {...register('author_name')} className={inputCls} />
              {errors.author_name && <p className="text-red-500 text-xs mt-1">{errors.author_name.message}</p>}
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input {...register('author_city')} className={inputCls} />
            </div>
          </div>

          {/* Company + designation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Company</label>
              <input {...register('company')} placeholder="e.g. Sharma Constructions" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Designation</label>
              <input {...register('designation')} placeholder="e.g. Site Engineer" className={inputCls} />
            </div>
          </div>

          {/* Product bought */}
          <div>
            <label className={labelCls}>Product Bought</label>
            <input {...register('product_bought')} placeholder="e.g. Colour Coated Roofing Sheet" className={inputCls} />
          </div>

          {/* Rating + source */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Rating (1–5)</label>
              <input type="number" step="0.1" min="1" max="5" {...register('rating')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Source</label>
              <select {...register('source')} className={`${inputCls} bg-white`}>
                <option value="google">Google</option>
                <option value="indiamart">IndiaMART</option>
                <option value="justdial">Justdial</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" {...register('active')} className="w-4 h-4 accent-steel" />
            <label htmlFor="active" className="text-sm font-semibold text-navy">Show on public site</label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/testimonials')}>Cancel</Button>
          </div>
          {mutation.isError && <p className="text-red-500 text-sm">Failed to save. Try again.</p>}
        </form>
      </div>
    </AdminLayout>
  );
}
