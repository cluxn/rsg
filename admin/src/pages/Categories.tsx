import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { getCategoriesAdmin, createCategory, updateCategory, deleteCategory, type Category } from '@/lib/api';

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function CategoriesPage() {
  const qc = useQueryClient();
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategoriesAdmin,
  });

  const blogCats = categories.filter(c => c.type === 'blog');

  const [addName, setAddName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] });

  const createMut = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { invalidate(); setAddName(''); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateCategory(id, { name, slug: toSlug(name) }),
    onSuccess: () => { invalidate(); setEditId(null); },
  });

  const deleteMut = useMutation({ mutationFn: deleteCategory, onSuccess: invalidate });

  function handleAdd() {
    const trimmed = addName.trim();
    if (!trimmed) return;
    createMut.mutate({ type: 'blog', name: trimmed, slug: toSlug(trimmed) });
  }

  function handleEditSave() {
    if (!editId || !editName.trim()) return;
    updateMut.mutate({ id: editId, name: editName.trim() });
  }

  return (
    <AdminLayout>
      <ContentTabs />
      <div className="p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="font-heading text-2xl text-navy">Blog Categories</h1>
          <p className="text-sm text-navy/50 mt-0.5">Organise blog posts by topic</p>
        </div>

        {isLoading ? (
          <p className="text-navy/50 text-sm">Loading…</p>
        ) : (
          <div className="border border-navy/10 rounded-xl overflow-hidden">
            {blogCats.length === 0 ? (
              <p className="text-navy/50 text-sm p-6">No categories yet.</p>
            ) : (
              <ul className="divide-y divide-navy/8">
                {blogCats.map(cat => (
                  <li key={cat.id} className="flex items-center gap-3 px-4 py-3 hover:bg-navy/2 transition-colors">
                    {editId === cat.id ? (
                      <>
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditId(null); }}
                          autoFocus
                          className="flex-1 border border-navy/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-steel"
                        />
                        <span className="text-xs text-navy/30 font-mono">/{toSlug(editName)}</span>
                        <button onClick={handleEditSave} className="text-xs text-steel font-semibold hover:text-steel/80">Save</button>
                        <button onClick={() => setEditId(null)} className="text-xs text-navy/50 hover:text-navy">Cancel</button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-navy text-sm">{cat.name}</span>
                          <span className="ml-2 text-xs text-navy/40 font-mono">/{cat.slug}</span>
                        </div>
                        <button
                          onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                          className="text-xs text-steel hover:text-steel/80 font-semibold"
                        >Rename</button>
                        <button
                          onClick={() => { if (confirm(`Delete category "${cat.name}"? Blog posts using this category will keep their tag.`)) deleteMut.mutate(cat.id); }}
                          className="text-xs text-red-500 hover:text-red-600"
                        >Delete</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Inline add row */}
            <div className="border-t border-navy/10 px-4 py-3 flex gap-2 items-center bg-navy/1">
              <input
                value={addName}
                onChange={e => setAddName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
                placeholder="Add blog category…"
                className="flex-1 border border-navy/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-steel"
              />
              {addName.trim() && (
                <span className="text-xs text-navy/30 font-mono">/{toSlug(addName)}</span>
              )}
              <Button
                onClick={handleAdd}
                disabled={createMut.isPending || !addName.trim()}
              >
                {createMut.isPending ? 'Adding…' : 'Add'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
