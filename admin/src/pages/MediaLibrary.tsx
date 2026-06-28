import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, RefreshCw, Trash2, Search } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { MediaCard, type MediaItem } from '@/components/ui/MediaCard';
import { UploadModal } from '@/components/ui/UploadModal';
import { api } from '@/lib/api';

export function MediaLibraryPage() {
  const qc = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [editName, setEditName] = useState('');
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null);
  const [deleteUsage, setDeleteUsage] = useState<{ used: boolean; products: { slug: string; name: string }[] } | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ['media'],
    queryFn: () => api.get('/media').then(r => r.data),
  });

  const filtered = useMemo(() =>
    search.trim() ? mediaItems.filter(m => m.original_name.toLowerCase().includes(search.toLowerCase())) : mediaItems,
    [mediaItems, search]
  );

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/media/bulk-delete', { ids }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); setSelected(new Set()); },
  });

  function toggleSelect(id: number) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll() {
    setSelected(filtered.every(m => selected.has(m.id)) ? new Set() : new Set(filtered.map(m => m.id)));
  }

  const editMutation = useMutation({
    mutationFn: ({ id, alt_text, original_name }: { id: number; alt_text: string; original_name: string }) =>
      api.put(`/media/${id}`, { alt_text, original_name }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); setEditItem(null); },
  });

  const [syncMsg, setSyncMsg] = useState('');
  const syncMutation = useMutation({
    mutationFn: () => api.post('/media/sync-static').then(r => r.data as { added: number; total: number }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['media'] });
      setSyncMsg(`Synced: ${data.added} new image${data.added !== 1 ? 's' : ''} added (${data.total} total found)`);
      setTimeout(() => setSyncMsg(''), 5000);
    },
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
      <ContentTabs />
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-2xl text-navy mb-2">Media Library</h1>
            <p className="font-body text-navy/60">Manage uploaded images and alt text</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by filename…"
                className="pl-9 pr-3 py-2 border border-navy/20 rounded-lg text-sm text-navy outline-none focus:border-steel w-52"
              />
            </div>
            {syncMsg && <span className="font-body text-xs text-green-600">{syncMsg}</span>}
            <Button
              variant="outline"
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              {syncMutation.isPending ? 'Syncing…' : 'Sync from Website'}
            </Button>
            <Button onClick={() => setUploadOpen(true)} className="gap-2 bg-accent text-white hover:bg-accent/90">
              <Upload className="w-4 h-4" /> Upload New
            </Button>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4">
            <span className="font-body text-sm text-red-600 font-semibold">{selected.size} selected</span>
            <Button
              size="sm"
              disabled={bulkDeleteMutation.isPending}
              onClick={() => { if (window.confirm(`Delete ${selected.size} image(s)? This cannot be undone.`)) bulkDeleteMutation.mutate([...selected]); }}
              className="bg-red-500 text-white hover:bg-red-600 gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete selected
            </Button>
            <button onClick={() => setSelected(new Set())} className="ml-auto text-red-400 hover:text-red-600 text-xs">Clear</button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20 text-navy/40 font-body">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-navy/40 font-body">
            {search ? 'No images match your search.' : 'No media uploaded yet. Click "Upload New" to add your first image.'}
          </div>
        ) : (
          <>
            {filtered.length > 1 && (
              <div className="flex items-center gap-2 mb-3">
                <input type="checkbox" checked={filtered.every(m => selected.has(m.id))} onChange={toggleAll} className="rounded border-navy/30" />
                <span className="text-xs text-navy/50">Select all {filtered.length}</span>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(item => (
                <div key={item.id} className="relative group">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="absolute top-2 left-2 z-10 rounded border-navy/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ opacity: selected.has(item.id) ? 1 : undefined }}
                  />
                  <MediaCard
                    item={item}
                    onEdit={item => { setEditItem(item); setEditAltText(item.alt_text); setEditName(item.original_name); }}
                    onDelete={handleDeleteClick}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

        {/* Edit Alt Text Modal */}
        {editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
              <h2 className="font-heading text-navy text-lg font-semibold mb-4">Edit Media Details</h2>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="font-body text-navy/70 text-sm block mb-1">File Name</label>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-navy/20 p-3 font-body text-sm text-navy focus:outline-none focus:ring-2 focus:ring-steel/40"
                  />
                </div>
                <div>
                  <label className="font-body text-navy/70 text-sm block mb-1">
                    Alt Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editAltText}
                    onChange={e => setEditAltText(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-navy/20 p-3 font-body text-sm text-navy resize-none focus:outline-none focus:ring-2 focus:ring-steel/40"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditItem(null)} className="flex-1">Cancel</Button>
                <Button
                  onClick={() => editMutation.mutate({ id: editItem.id, alt_text: editAltText.trim(), original_name: editName.trim() })}
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
