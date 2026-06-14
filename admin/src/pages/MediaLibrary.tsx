import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { MediaCard, type MediaItem } from '@/components/ui/MediaCard';
import { UploadModal } from '@/components/ui/UploadModal';
import { api } from '@/lib/api';

export function MediaLibraryPage() {
  const qc = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null);
  const [deleteUsage, setDeleteUsage] = useState<{ used: boolean; products: { slug: string; name: string }[] } | null>(null);

  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ['media'],
    queryFn: () => api.get('/media').then(r => r.data),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, alt_text }: { id: number; alt_text: string }) =>
      api.put(`/media/${id}`, { alt_text }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); setEditItem(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/media/${id}`).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); setDeleteItem(null); setDeleteUsage(null); },
  });

  const handleDeleteClick = async (item: MediaItem) => {
    setDeleteItem(item);
    const usage = await api.get(`/media/${item.id}/usage`).then(r => r.data);
    setDeleteUsage(usage);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-2xl text-navy mb-2">Media Library</h1>
            <p className="font-body text-navy/60">Manage uploaded images and alt text</p>
          </div>
          <Button onClick={() => setUploadOpen(true)} className="gap-2 bg-accent text-white hover:bg-accent/90">
            <Upload className="w-4 h-4" /> Upload New
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-navy/40 font-body">Loading…</div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-20 text-navy/40 font-body">
            No media uploaded yet. Click "Upload New" to add your first image.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={item => { setEditItem(item); setEditAltText(item.alt_text); }}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

        {/* Edit Alt Text Modal */}
        {editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
              <h2 className="font-heading text-navy text-lg font-semibold mb-4">Edit Alt Text</h2>
              <textarea
                value={editAltText}
                onChange={e => setEditAltText(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-navy/20 p-3 font-body text-sm text-navy resize-none focus:outline-none focus:ring-2 focus:ring-steel/40 mb-4"
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditItem(null)} className="flex-1">Cancel</Button>
                <Button
                  onClick={() => editMutation.mutate({ id: editItem.id, alt_text: editAltText.trim() })}
                  disabled={!editAltText.trim() || editMutation.isPending}
                  className="flex-1 bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
                >
                  {editMutation.isPending ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm / Warning Modal */}
        {deleteItem && deleteUsage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
              {deleteUsage.used ? (
                <>
                  <h2 className="font-heading text-navy text-lg font-semibold mb-3">Cannot Delete</h2>
                  <p className="font-body text-navy/70 text-sm mb-3">
                    This image is used by the following products. Remove it from those products first:
                  </p>
                  <ul className="list-disc list-inside text-sm font-body text-navy/80 mb-5 space-y-1">
                    {deleteUsage.products.map(p => <li key={p.slug}>{p.name}</li>)}
                  </ul>
                  <Button variant="outline" onClick={() => { setDeleteItem(null); setDeleteUsage(null); }} className="w-full">
                    OK
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="font-heading text-navy text-lg font-semibold mb-3">Delete Image?</h2>
                  <p className="font-body text-navy/70 text-sm mb-5">
                    This will permanently delete "{deleteItem.original_name}". This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => { setDeleteItem(null); setDeleteUsage(null); }} className="flex-1">Cancel</Button>
                    <Button
                      onClick={() => deleteMutation.mutate(deleteItem.id)}
                      disabled={deleteMutation.isPending}
                      className="flex-1 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
