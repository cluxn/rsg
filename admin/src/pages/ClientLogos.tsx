import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import {
  getClientLogosAdmin, createClientLogo, updateClientLogo,
  deleteClientLogo, reorderClientLogos, type ClientLogo, type ClientLogoInput,
} from '@/lib/api';

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface AddLogoForm {
  name: string;
  industry: string;
  logo_url: string;
}

export function ClientLogosPage() {
  const qc = useQueryClient();
  const { data: logos = [], isLoading } = useQuery<ClientLogo[]>({
    queryKey: ['client-logos'],
    queryFn: getClientLogosAdmin,
  });

  const [addForm, setAddForm] = useState<AddLogoForm>({ name: '', industry: '', logo_url: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ClientLogoInput>>({});
  const [addUploading, setAddUploading] = useState(false);
  const [editUploading, setEditUploading] = useState(false);
  const addFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const handleUploadLogo = async (file: File, target: 'add' | 'edit') => {
    const setter = target === 'add' ? setAddUploading : setEditUploading;
    setter(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('alt_text', file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') + ' logo');
      const res = await api.post<{ url: string }>('/media/upload', form);
      if (target === 'add') setAddForm(f => ({ ...f, logo_url: res.data.url }));
      else setEditForm(f => ({ ...f, logo_url: res.data.url }));
    } finally {
      setter(false);
    }
  };

  const invalidate = () => qc.invalidateQueries({ queryKey: ['client-logos'] });

  const createMut = useMutation({ mutationFn: createClientLogo, onSuccess: () => { invalidate(); setShowAdd(false); setAddForm({ name: '', industry: '', logo_url: '' }); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<ClientLogoInput> }) => updateClientLogo(id, data), onSuccess: () => { invalidate(); setEditId(null); } });
  const deleteMut = useMutation({ mutationFn: deleteClientLogo, onSuccess: invalidate });
  const reorderMut = useMutation({ mutationFn: reorderClientLogos, onSuccess: invalidate });

  function toggleVisible(logo: ClientLogo) {
    updateMut.mutate({ id: logo.id, data: { visible: !logo.visible } });
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const ids = logos.map(l => l.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    reorderMut.mutate(ids);
  }

  function moveDown(index: number) {
    if (index === logos.length - 1) return;
    const ids = logos.map(l => l.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    reorderMut.mutate(ids);
  }

  function startEdit(logo: ClientLogo) {
    setEditId(logo.id);
    setEditForm({ name: logo.name, industry: logo.industry ?? '', logo_url: logo.logo_url ?? '' });
  }

  function handleAddSubmit() {
    if (!addForm.name.trim() || !addForm.logo_url.trim()) return;
    createMut.mutate({ name: addForm.name, industry: addForm.industry, logo_url: addForm.logo_url, visible: true });
  }

  function handleEditSave(id: number) {
    updateMut.mutate({ id, data: editForm });
  }

  return (
    <AdminLayout>
      <ContentTabs />
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl text-navy">Client Logos</h1>
            <p className="text-sm text-navy/50 mt-0.5">Manage partner logos shown in the homepage marquee</p>
          </div>
          <Button onClick={() => setShowAdd(s => !s)}>+ Add Logo</Button>
        </div>

        {showAdd && (
          <div className="mb-6 p-4 border border-navy/15 rounded-xl bg-navy/2 flex flex-col gap-3">
            <p className="text-sm font-semibold text-navy">New Client Logo</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-1">Company Name *</label>
                <input
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Tata Steel"
                  className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-1">Industry</label>
                <input
                  value={addForm.industry}
                  onChange={e => setAddForm(f => ({ ...f, industry: e.target.value }))}
                  placeholder="e.g. Steel"
                  className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-1">Logo Image *</label>
                <div className="flex gap-2">
                  <input
                    value={addForm.logo_url}
                    onChange={e => setAddForm(f => ({ ...f, logo_url: e.target.value }))}
                    placeholder="URL or upload →"
                    className="flex-1 border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel"
                  />
                  <button
                    type="button"
                    onClick={() => addFileRef.current?.click()}
                    disabled={addUploading}
                    className="flex items-center gap-1 px-3 py-2 text-xs border border-navy/20 rounded-lg hover:bg-navy/5 disabled:opacity-50 whitespace-nowrap"
                  >
                    <Upload className="w-3 h-3" />
                    {addUploading ? 'Uploading…' : 'Upload'}
                  </button>
                  <input ref={addFileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && handleUploadLogo(e.target.files[0], 'add')} />
                </div>
                {addForm.logo_url && (
                  <img src={addForm.logo_url} alt="preview" className="mt-2 h-10 object-contain rounded border border-navy/10" />
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddSubmit} disabled={createMut.isPending}>
                {createMut.isPending ? 'Adding…' : 'Add Logo'}
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="text-navy/50 text-sm">Loading…</p>
        ) : logos.length === 0 ? (
          <p className="text-navy/50 text-sm">No logos yet. Click "Add Logo" to get started.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {logos.map((logo, index) => (
              <div
                key={logo.id}
                className={`relative border rounded-xl p-4 flex flex-col items-center gap-3 transition-opacity ${logo.visible ? 'border-navy/15 bg-white' : 'border-navy/10 bg-navy/3 opacity-50'}`}
              >
                {/* Sequence controls */}
                <div className="absolute top-2 left-2 flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="w-5 h-5 flex items-center justify-center rounded text-navy/40 hover:text-navy disabled:opacity-20 text-xs"
                    title="Move up"
                  >▲</button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === logos.length - 1}
                    className="w-5 h-5 flex items-center justify-center rounded text-navy/40 hover:text-navy disabled:opacity-20 text-xs"
                    title="Move down"
                  >▼</button>
                </div>

                {/* Visible toggle */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleVisible(logo)}
                    title={logo.visible ? 'Hide logo' : 'Show logo'}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${logo.visible ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-navy/20 text-navy/40'}`}
                  >
                    {logo.visible ? '●' : '○'}
                  </button>
                </div>

                {/* Logo image */}
                <div className="w-24 h-16 flex items-center justify-center mt-4">
                  {logo.logo_url ? (
                    <img
                      src={logo.logo_url}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="w-24 h-16 bg-navy/5 rounded-lg flex items-center justify-center text-navy/30 text-xs">No image</div>
                  )}
                </div>

                {editId === logo.id ? (
                  <div className="w-full flex flex-col gap-2">
                    <input
                      value={editForm.name ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Company name"
                      className="w-full border border-navy/20 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-steel"
                    />
                    <div className="flex gap-1">
                      <input
                        value={editForm.logo_url ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, logo_url: e.target.value }))}
                        placeholder="Logo URL"
                        className="flex-1 border border-navy/20 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-steel"
                      />
                      <button
                        type="button"
                        onClick={() => editFileRef.current?.click()}
                        disabled={editUploading}
                        className="px-2 py-1 text-xs border border-navy/20 rounded hover:bg-navy/5 disabled:opacity-50"
                        title="Upload image"
                      >
                        <Upload className="w-3 h-3" />
                      </button>
                      <input ref={editFileRef} type="file" accept="image/*" className="hidden"
                        onChange={e => e.target.files?.[0] && handleUploadLogo(e.target.files[0], 'edit')} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEditSave(logo.id)} className="flex-1 text-xs bg-steel text-white rounded py-1 hover:bg-steel/90">Save</button>
                      <button onClick={() => setEditId(null)} className="flex-1 text-xs border border-navy/20 rounded py-1 hover:bg-navy/5">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-navy leading-tight">{logo.name}</p>
                      {logo.industry && <p className="text-xs text-navy/50">{logo.industry}</p>}
                    </div>
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => startEdit(logo)}
                        className="flex-1 text-xs text-steel hover:text-steel/80 border border-steel/30 rounded py-1 hover:bg-steel/5"
                      >Edit</button>
                      <button
                        onClick={() => { if (confirm(`Delete "${logo.name}"?`)) deleteMut.mutate(logo.id); }}
                        className="flex-1 text-xs text-red-500 hover:text-red-600 border border-red-200 rounded py-1 hover:bg-red-50"
                      >Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
