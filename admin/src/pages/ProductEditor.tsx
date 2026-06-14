import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { SpecRowsEditor, type SpecRow } from '@/components/ui/SpecRowsEditor';
import { MediaPickerModal } from '@/components/ui/MediaPickerModal';
import { type MediaItem } from '@/components/ui/MediaCard';
import { api } from '@/lib/api';

interface ProductDetail {
  id: number; slug: string; name: string;
  description: string | null;
  specs: SpecRow[] | null;
  media: (MediaItem & { display_order: number })[];
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function ProductEditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const qc = useQueryClient();

  const { data: product, isLoading } = useQuery<ProductDetail>({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data),
    enabled: !!slug,
  });

  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState<SpecRow[]>([]);
  const [productImages, setProductImages] = useState<MediaItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Initialize form state from the fetched product (runs once when it first loads)
  const [loadedProduct, setLoadedProduct] = useState<ProductDetail | null>(null);
  if (product && product !== loadedProduct) {
    setLoadedProduct(product);
    setDescription(product.description ?? '');
    setSpecs(product.specs ?? []);
    setProductImages([...product.media].sort((a, b) => a.display_order - b.display_order));
  }

  const saveMutation = useMutation({
    mutationFn: () => api.put(`/products/${slug}`, {
      description,
      specs,
      media_ids: productImages.map(m => m.id),
    }),
    onMutate: () => setSaveStatus('saving'),
    onSuccess: () => {
      setSaveStatus('saved');
      qc.invalidateQueries({ queryKey: ['product', slug] });
      qc.invalidateQueries({ queryKey: ['products'] });
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => { setSaveStatus('error'); setTimeout(() => setSaveStatus('idle'), 3000); },
  });

  const moveImage = (i: number, dir: 'up' | 'down') => {
    const next = [...productImages];
    const target = dir === 'up' ? i - 1 : i + 1;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setProductImages(next);
  };

  const removeImage = (id: number) => setProductImages(productImages.filter(m => m.id !== id));

  const handlePickerConfirm = (selected: MediaItem[]) => {
    // Append newly selected images that aren't already in the list
    const existingIds = productImages.map(m => m.id);
    const newImages = selected.filter(m => !existingIds.includes(m.id));
    setProductImages([...productImages, ...newImages]);
  };

  const saveLabel = saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'error' ? 'Error' : 'Save Changes';
  const saveClass = saveStatus === 'saved' ? 'bg-green-600 text-white' : saveStatus === 'error' ? 'bg-red-500 text-white' : 'bg-accent text-white hover:bg-accent/90';

  if (isLoading || !product) {
    return (
      <AdminLayout>
        <div className="p-8 text-navy/40 font-body">Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 relative">
        {/* Sticky save button */}
        <div className="flex items-center justify-between mb-6 sticky top-4 z-10 bg-off-white/95 py-2 -mx-8 px-8 backdrop-blur">
          <Link to="/catalog" className="flex items-center gap-1 font-body text-steel text-sm hover:text-navy transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Catalog
          </Link>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveStatus === 'saving'}
            className={`${saveClass} disabled:opacity-70 gap-2`}
          >
            {saveStatus === 'saved' && <Check className="w-4 h-4" />}
            {saveLabel}
          </Button>
        </div>

        {/* Product name (read-only) */}
        <h1 className="font-heading text-navy text-2xl lg:text-3xl font-bold mb-8">{product.name}</h1>

        {/* Description */}
        <section className="mb-8">
          <label className="font-body text-navy/60 text-xs uppercase tracking-widest block mb-2">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-navy/20 p-3 font-body text-[16px] text-navy resize-none focus:outline-none focus:ring-2 focus:ring-steel/40"
          />
        </section>

        {/* Spec Rows */}
        <section className="mb-8">
          <h2 className="font-heading text-navy text-lg font-semibold mb-3">Specifications</h2>
          <SpecRowsEditor rows={specs} onChange={setSpecs} />
        </section>

        {/* Product Images */}
        <section className="mb-8">
          <h2 className="font-heading text-navy text-lg font-semibold mb-3">Product Images</h2>
          {productImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {productImages.map((img, i) => (
                <div key={img.id} className="relative flex flex-col items-center">
                  {i === 0 && (
                    <span className="text-[10px] font-body bg-steel text-white px-2 py-0.5 rounded-full mb-1">Primary</span>
                  )}
                  <div className="relative">
                    <img
                      src={img.thumbnail_url ?? img.url}
                      alt={img.alt_text}
                      className="w-20 h-20 rounded-lg object-cover border border-navy/10"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => moveImage(i, 'up')} disabled={i === 0} className="text-navy/40 hover:text-navy disabled:opacity-20">
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button onClick={() => moveImage(i, 'down')} disabled={i === productImages.length - 1} className="text-navy/40 hover:text-navy disabled:opacity-20">
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" onClick={() => setPickerOpen(true)} className="text-navy/70 border-navy/20 hover:border-steel/40">
            Select from Media Library
          </Button>
          <MediaPickerModal
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            onConfirm={handlePickerConfirm}
            alreadyLinkedIds={productImages.map(m => m.id)}
          />
        </section>

        {/* Duplicate save button at bottom */}
        <div className="flex justify-end pt-4 border-t border-navy/10">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveStatus === 'saving'}
            className={`${saveClass} disabled:opacity-70`}
          >
            {saveLabel}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
