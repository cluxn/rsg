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
    </form>
  );
}

function UsersTab() {
  const qc = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);

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
                      onClick={() => setResetTarget(user)}
                      className="px-3 py-1 rounded border border-navy/20 text-xs font-semibold text-navy/70 hover:bg-navy/5 transition-colors"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
      {resetTarget && <ResetPasswordModal user={resetTarget} onClose={() => setResetTarget(null)} />}
    </div>
  );
}

function AddUserModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.post('/auth/users', { email: email.trim(), password }),
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
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
