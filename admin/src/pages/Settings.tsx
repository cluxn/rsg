import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

type SettingsTab = 'site' | 'users';

const SETTINGS_TABS: { label: string; key: SettingsTab }[] = [
  { label: 'Site Settings', key: 'site' },
  { label: 'Users', key: 'users' },
];

const GENERAL_FIELDS = [
  { key: 'whatsapp_number',  label: 'WhatsApp Number',   hint: 'Include country code, e.g. +919876543210. Leave blank to hide the floating icon.', type: 'tel' },
  { key: 'whatsapp_message', label: 'WhatsApp Pre-filled Message', hint: 'Default message pre-filled when visitors click WhatsApp. e.g. Hi, I need a quote for roofing sheets', type: 'text' },
  { key: 'business_phone',   label: 'Business Phone',    hint: 'Shown on Contact page', type: 'tel' },
  { key: 'business_email',   label: 'Business Email',    hint: 'Shown on Contact page and footer', type: 'email' },
  { key: 'business_address', label: 'Business Address',  hint: 'Shown on Contact page', type: 'text' },
  { key: 'business_hours',       label: 'Business Hours',      hint: 'e.g. Mon-Sat 10 AM - 6 PM, Closed Sunday', type: 'text' },
  { key: 'notification_email',  label: 'Notification Email',  hint: 'Lead alert emails are sent here. Leave blank to disable notifications.', type: 'email' },
] as const;

interface AdminUser {
  id: number;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
  permissions: string[] | null;
}

const MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'catalog',   label: 'Catalog (Products)' },
  { key: 'content',   label: 'Content (Blog, Events, Testimonials, Media…)' },
  { key: 'leads',     label: 'Leads' },
  { key: 'marketing', label: 'Marketing (Client Logos)' },
  { key: 'seo',       label: 'SEO' },
  { key: 'settings',  label: 'Settings & Users' },
];

function PermissionCheckboxes({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  function toggle(key: string) {
    onChange(value.includes(key) ? value.filter(k => k !== key) : [...value, key]);
  }
  return (
    <div className="border border-navy/10 rounded-lg p-3 space-y-2 bg-navy/[0.02]">
      {MODULES.map(m => (
        <label key={m.key} className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={value.includes(m.key)}
            onChange={() => toggle(m.key)}
            className="rounded border-navy/30 text-steel focus:ring-steel"
          />
          <span className="font-body text-sm text-navy">{m.label}</span>
        </label>
      ))}
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('site');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get<Record<string, string>>('/settings');
      return res.data;
    },
  });

  return (
    <AdminLayout>
      <div className="border-b border-navy/10 bg-white">
        <div className="flex px-6">
          {SETTINGS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-3 font-body text-sm border-b-2 transition-colors -mb-px whitespace-nowrap',
                activeTab === tab.key
                  ? 'border-steel text-steel font-semibold'
                  : 'border-transparent text-navy/60 hover:text-navy hover:border-navy/30'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'site' && (
        <div className="max-w-2xl p-8">
          <h1 className="font-heading text-2xl text-navy mb-2">Site Settings</h1>
          <p className="font-body text-navy/60 text-sm mb-8">Contact information and WhatsApp configuration.</p>
          {isLoading || !settings ? (
            <p className="font-body text-navy/50">Loading settings…</p>
          ) : (
            <GeneralSettingsForm settings={settings} />
          )}
        </div>
      )}

      {activeTab === 'users' && <UsersTab />}
    </AdminLayout>
  );
}

function GeneralSettingsForm({ settings }: { settings: Record<string, string> }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    GENERAL_FIELDS.forEach(f => { initial[f.key] = settings[f.key] ?? ''; });
    return initial;
  });
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: async (updates: Record<string, string>) => {
      await api.put('/settings', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {GENERAL_FIELDS.map(field => (
        <div key={field.key}>
          <Label htmlFor={field.key} className="font-body font-semibold text-navy text-sm mb-1 block">
            {field.label}
          </Label>
          <Input
            id={field.key}
            type={field.type}
            value={values[field.key] ?? ''}
            onChange={e => { setValues(prev => ({ ...prev, [field.key]: e.target.value })); setSaved(false); }}
            className="font-body"
            placeholder={field.hint}
          />
          <p className="font-body text-xs text-navy/50 mt-1">{field.hint}</p>
        </div>
      ))}
      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={mutation.isPending} className="bg-orange text-white hover:bg-orange/90">
          {mutation.isPending ? 'Saving…' : 'Save Settings'}
        </Button>
        {saved && <span className="font-body text-sm text-green-600">Settings saved.</span>}
        {mutation.isError && <span className="font-body text-sm text-red-600">Save failed. Please try again.</span>}
      </div>

      <div className="border-t border-navy/10 pt-6 mt-6">
        <p className="font-body text-sm font-semibold text-navy mb-1">Backup / Restore</p>
        <p className="font-body text-xs text-navy/50 mb-3">Export all settings to JSON or restore from a previously exported file.</p>
        <div className="flex gap-2 items-center">
          <Button type="button" variant="outline" size="sm" onClick={() => window.open('/api/settings/export', '_blank')}>
            Export JSON
          </Button>
          <label className="cursor-pointer">
            <span className="inline-flex items-center px-3 py-1.5 rounded border border-navy/20 text-xs font-semibold text-navy hover:bg-navy/5 transition-colors">Import JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const json = JSON.parse(text);
                  await api.post('/settings/import', json);
                  queryClient.invalidateQueries({ queryKey: ['settings'] });
                  setSaved(true);
                  setTimeout(() => setSaved(false), 3000);
                } catch { alert('Import failed — check the file is a valid settings JSON.'); }
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>
    </form>
  );
}

function UsersTab() {
  const qc = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get<AdminUser[]>('/auth/users');
      return res.data;
    },
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      api.put(`/auth/users/${id}/status`, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => api.delete(`/auth/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setDeleteTarget(null); },
  });

  function roleLabel(role: string) {
    return role === 'super_admin' ? 'Super Admin' : role;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-navy">Users</h1>
        <Button onClick={() => setShowAddModal(true)} className="bg-steel text-white hover:bg-steel/90">
          Add user
        </Button>
      </div>

      {isLoading ? (
        <p className="font-body text-navy/50">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy/5 text-navy/60 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-navy/10">
                  <td className="px-4 py-3 font-body text-navy">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-600">
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('flex items-center gap-1.5 font-body text-sm', user.active ? 'text-green-600' : 'text-navy/40')}>
                      <span className={cn('w-2 h-2 rounded-full', user.active ? 'bg-green-500' : 'bg-navy/30')} />
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-navy/60 text-sm">
                    {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => toggleStatus.mutate({ id: user.id, active: !user.active })}
                      disabled={toggleStatus.isPending}
                      className={cn(
                        'px-3 py-1 rounded border text-xs font-semibold transition-colors',
                        user.active
                          ? 'border-red-300 text-red-500 hover:bg-red-50'
                          : 'border-green-300 text-green-600 hover:bg-green-50'
                      )}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setEditTarget(user)}
                      className="px-3 py-1 rounded border border-steel/30 text-xs font-semibold text-steel hover:bg-steel/5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setResetTarget(user)}
                      className="px-3 py-1 rounded border border-navy/20 text-xs font-semibold text-navy/70 hover:bg-navy/5 transition-colors"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="px-3 py-1 rounded border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
      {editTarget && <EditUserModal user={editTarget} onClose={() => setEditTarget(null)} />}
      {resetTarget && <ResetPasswordModal user={resetTarget} onClose={() => setResetTarget(null)} />}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading text-lg text-navy mb-2">Delete User</h2>
            <p className="font-body text-sm text-navy/70 mb-5">
              Permanently delete <span className="font-semibold">{deleteTarget.email}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                type="button"
                disabled={deleteUser.isPending}
                onClick={() => deleteUser.mutate(deleteTarget.id)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {deleteUser.isPending ? 'Deleting…' : 'Delete User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

function AddUserModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('editor');
  const [permissions, setPermissions] = useState<string[]>(['dashboard']);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.post('/auth/users', {
      email: email.trim(), password, role,
      permissions: role === 'super_admin' ? null : permissions,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); onClose(); },
    onError: (err: unknown) => {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to add user.');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password are required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    mutation.mutate();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto py-8" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-lg text-navy mb-4">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="add-email" className="font-body font-semibold text-navy text-sm mb-1 block">Email</Label>
            <Input id="add-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" className="font-body" />
          </div>
          <div>
            <Label htmlFor="add-password" className="font-body font-semibold text-navy text-sm mb-1 block">Password</Label>
            <Input id="add-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className="font-body" />
          </div>
          <div>
            <Label htmlFor="add-role" className="font-body font-semibold text-navy text-sm mb-1 block">Role</Label>
            <select
              id="add-role"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-1 focus:ring-steel"
            >
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          {role !== 'super_admin' && (
            <div>
              <Label className="font-body font-semibold text-navy text-sm mb-1 block">
                Page Access <span className="font-normal text-navy/50">(select which sections this user can access)</span>
              </Label>
              <PermissionCheckboxes value={permissions} onChange={setPermissions} />
            </div>
          )}
          {role === 'super_admin' && (
            <p className="font-body text-xs text-navy/50 bg-navy/5 rounded-lg px-3 py-2">
              Super Admin has full access to all sections.
            </p>
          )}
          {error && <p className="font-body text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-steel text-white hover:bg-steel/90">
              {mutation.isPending ? 'Adding…' : 'Add User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditUserModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const qc = useQueryClient();
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [permissions, setPermissions] = useState<string[]>(user.permissions ?? MODULES.map(m => m.key));
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.put(`/auth/users/${user.id}`, {
      email: email.trim(), role,
      permissions: role === 'super_admin' ? null : permissions,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); onClose(); },
    onError: (err: unknown) => {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to update user.');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required.'); return; }
    mutation.mutate();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto py-8" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-lg text-navy mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-email" className="font-body font-semibold text-navy text-sm mb-1 block">Email</Label>
            <Input id="edit-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="font-body" />
          </div>
          <div>
            <Label htmlFor="edit-role" className="font-body font-semibold text-navy text-sm mb-1 block">Role</Label>
            <select
              id="edit-role"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full border border-navy/20 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-1 focus:ring-steel"
            >
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          {role !== 'super_admin' && (
            <div>
              <Label className="font-body font-semibold text-navy text-sm mb-1 block">
                Page Access <span className="font-normal text-navy/50">(select which sections this user can access)</span>
              </Label>
              <PermissionCheckboxes value={permissions} onChange={setPermissions} />
            </div>
          )}
          {role === 'super_admin' && (
            <p className="font-body text-xs text-navy/50 bg-navy/5 rounded-lg px-3 py-2">
              Super Admin has full access to all sections.
            </p>
          )}
          {error && <p className="font-body text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-steel text-white hover:bg-steel/90">
              {mutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResetPasswordModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.put(`/auth/users/${user.id}/reset-password`, { password }),
    onSuccess: () => setSuccess(true),
    onError: (err: unknown) => {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to reset password.');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    mutation.mutate();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-lg text-navy mb-1">Reset Password</h2>
        <p className="font-body text-sm text-navy/60 mb-4">{user.email}</p>
        {success ? (
          <div className="text-center py-4">
            <p className="font-body text-green-600 font-semibold mb-4">Password reset successfully.</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-pass" className="font-body font-semibold text-navy text-sm mb-1 block">New Password</Label>
              <Input id="new-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className="font-body" />
            </div>
            <div>
              <Label htmlFor="confirm-pass" className="font-body font-semibold text-navy text-sm mb-1 block">Confirm Password</Label>
              <Input id="confirm-pass" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" className="font-body" />
            </div>
            {error && <p className="font-body text-sm text-red-600">{error}</p>}
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending} className="bg-orange text-white hover:bg-orange/90">
                {mutation.isPending ? 'Saving…' : 'Reset Password'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
