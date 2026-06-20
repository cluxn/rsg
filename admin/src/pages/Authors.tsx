import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { CoverImageUploader } from '@/components/ui/CoverImageUploader';
import { getAuthorsAdmin, createAuthor, updateAuthor, deleteAuthor, type Author, type AuthorInput } from '@/lib/api';

const ROLES = ['Author', 'Editor', 'Contributor', 'Admin'];

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className="w-9 h-9 rounded-full object-cover" />;
  }
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['bg-steel', 'bg-navy', 'bg-amber-600', 'bg-emerald-600', 'bg-purple-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-9 h-9 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold`}>
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    Editor: 'bg-purple-100 text-purple-700',
    Admin: 'bg-red-100 text-red-700',
    Contributor: 'bg-amber-100 text-amber-700',
    Author: 'bg-steel/10 text-steel',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${map[role] ?? 'bg-navy/10 text-navy'}`}>
      {role}
    </span>
  );
}

export function AuthorsPage() {
  const qc = useQueryClient();
  const { data: authors = [], isLoading } = useQuery<Author[]>({
    queryKey: ['authors'],
    queryFn: getAuthorsAdmin,
  });

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<AuthorInput>({ name: '', email: '', role: 'Author', active: true });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<AuthorInput>>({});

  const invalidate = () => qc.invalidateQueries({ queryKey: ['authors'] });

  const createMut = useMutation({ mutationFn: createAuthor, onSuccess: () => { invalidate(); setShowAdd(false); setAddForm({ name: '', email: '', role: 'Author', active: true }); } });
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<AuthorInput> }) => updateAuthor(id, data), onSuccess: () => { invalidate(); setEditId(null); } });
  const deleteMut = useMutation({ mutationFn: deleteAuthor, onSuccess: invalidate });
  const toggleMut = useMutation({ mutationFn: ({ id, active }: { id: number; active: boolean }) => updateAuthor(id, { active }), onSuccess: invalidate });

  return (
    <AdminLayout>
      <ContentTabs />
      <div className="p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl text-navy">Authors</h1>
            <p className="text-sm text-navy/50 mt-0.5">Manage blog post authors and contributors</p>
          </div>
          <Button onClick={() => setShowAdd(s => !s)}>+ New Author</Button>
        </div>

        {showAdd && (
          <div className="mb-6 p-4 border border-navy/15 rounded-xl bg-navy/2 flex flex-col gap-3">
            <p className="text-sm font-semibold text-navy">New Author</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-1">Full Name *</label>
                <input
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Mohit Sharma"
                  className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-1">Email</label>
                <input
                  type="email"
                  value={addForm.email ?? ''}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="author@rsgprofilesheets.com"
                  className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-1">Role</label>
                <select
                  value={addForm.role ?? 'Author'}
                  onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-steel"
                >
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-1">Photo</label>
                <CoverImageUploader
                  value={addForm.photo_url ?? ''}
                  onUploaded={url => setAddForm(f => ({ ...f, photo_url: url }))}
                  onRemove={() => setAddForm(f => ({ ...f, photo_url: '' }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => addForm.name.trim() && createMut.mutate(addForm)} disabled={createMut.isPending}>
                {createMut.isPending ? 'Adding…' : 'Add Author'}
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="text-navy/50 text-sm">Loading…</p>
        ) : authors.length === 0 ? (
          <p className="text-navy/50 text-sm">No authors yet.</p>
        ) : (
          <div className="border border-navy/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy/3 border-b border-navy/10">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy/50 uppercase tracking-wide">Author</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-navy/50 uppercase tracking-wide">Role</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-navy/50 uppercase tracking-wide">Active</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-navy/50 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/8">
                {authors.map(author => (
                  <tr key={author.id} className="hover:bg-navy/2 transition-colors">
                    {editId === author.id ? (
                      <>
                        <td className="px-4 py-3" colSpan={2}>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              value={editForm.name ?? ''}
                              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                              placeholder="Name"
                              className="border border-navy/20 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-steel"
                            />
                            <input
                              value={editForm.email ?? ''}
                              onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                              placeholder="Email"
                              className="border border-navy/20 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-steel"
                            />
                            <select
                              value={editForm.role ?? 'Author'}
                              onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                              className="border border-navy/20 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-steel"
                            >
                              {ROLES.map(r => <option key={r}>{r}</option>)}
                            </select>
                            <div>
                              <p className="text-xs text-navy/50 mb-1">Photo</p>
                              <CoverImageUploader
                                value={editForm.photo_url ?? ''}
                                onUploaded={url => setEditForm(f => ({ ...f, photo_url: url }))}
                                onRemove={() => setEditForm(f => ({ ...f, photo_url: '' }))}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3" />
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => updateMut.mutate({ id: author.id, data: editForm })} className="text-xs text-steel hover:text-steel/80 font-semibold">Save</button>
                            <button onClick={() => setEditId(null)} className="text-xs text-navy/50 hover:text-navy">Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={author.name} photoUrl={author.photo_url} />
                            <div>
                              <p className="font-semibold text-navy text-sm">{author.name}</p>
                              {author.email && <p className="text-xs text-navy/50">{author.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={author.role} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleMut.mutate({ id: author.id, active: !author.active })}
                            className={`w-8 h-4 rounded-full transition-colors relative ${author.active ? 'bg-green-500' : 'bg-navy/20'}`}
                          >
                            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${author.active ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => { setEditId(author.id); setEditForm({ name: author.name, email: author.email ?? '', role: author.role, photo_url: author.photo_url ?? '' }); }}
                              className="text-xs text-steel hover:text-steel/80 font-semibold"
                            >Edit Profile</button>
                            <button
                              onClick={() => { if (confirm(`Delete "${author.name}"?`)) deleteMut.mutate(author.id); }}
                              className="text-xs text-red-500 hover:text-red-600"
                            >Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
