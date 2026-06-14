import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

const GENERAL_FIELDS = [
  { key: 'whatsapp_number',  label: 'WhatsApp Number',   hint: 'Include country code, e.g. +919876543210. Leave blank to hide the floating icon.', type: 'tel' },
  { key: 'business_phone',   label: 'Business Phone',    hint: 'Shown on Contact page', type: 'tel' },
  { key: 'business_email',   label: 'Business Email',    hint: 'Shown on Contact page and footer', type: 'email' },
  { key: 'business_address', label: 'Business Address',  hint: 'Shown on Contact page', type: 'text' },
  { key: 'business_hours',   label: 'Business Hours',    hint: 'e.g. Mon-Sat 10 AM - 6 PM, Closed Sunday', type: 'text' },
] as const;

export function SettingsPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get<Record<string, string>>('/settings');
      return res.data;
    },
  });

  return (
    <AdminLayout>
      <div className="max-w-2xl p-8">
        <h1 className="font-heading text-2xl text-navy mb-2">Settings</h1>
        <p className="font-body text-navy/60 text-sm mb-8">General settings — contact information and WhatsApp configuration.</p>

        {isLoading || !settings ? (
          <p className="font-body text-navy/50">Loading settings…</p>
        ) : (
          <GeneralSettingsForm settings={settings} />
        )}
      </div>
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

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

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
            onChange={e => handleChange(field.key, e.target.value)}
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
