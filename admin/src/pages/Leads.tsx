import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Upload } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Lead {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  product_interest: string | null;
  message: string | null;
  source_page: string | null;
  webhook_sent: boolean;
  created_at: string;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
}

export function LeadsPage() {
  const [page, setPage] = useState(1);
  const LIMIT = 25;

  const { data, isLoading, isError, refetch } = useQuery<LeadsResponse>({
    queryKey: ['leads', page],
    queryFn: () => api.get('/leads', { params: { page, limit: LIMIT } }).then(r => r.data),
  });

  const importRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/leads/import', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { imported, skipped, errors } = res.data as { imported: number; skipped: number; errors: string[] };
      setImportResult(`Imported ${imported} leads, skipped ${skipped}.${errors.length ? ` Errors: ${errors.slice(0, 3).join('; ')}` : ''}`);
      refetch();
    } catch {
      setImportResult('Import failed. Check the CSV format and try again.');
    } finally {
      setImporting(false);
      if (importRef.current) importRef.current.value = '';
    }
  };

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;
  const start = data ? (data.page - 1) * LIMIT + 1 : 0;
  const end = data ? Math.min(data.page * LIMIT, data.total) : 0;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl text-navy">Leads</h1>
            <p className="font-body text-navy/60 text-sm mt-1">
              {data ? `${data.total} total submissions` : 'All Get Quote submissions'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/api/leads/export', '_blank')}
            >
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <input
              ref={importRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => importRef.current?.click()}
              disabled={importing}
            >
              <Upload className="w-4 h-4 mr-2" /> {importing ? 'Importing…' : 'Import CSV'}
            </Button>
          </div>
        </div>

        {importResult && (
          <p className="font-body text-sm text-navy/70 mb-4">{importResult}</p>
        )}

        {isLoading && (
          <p className="font-body text-navy/60 p-8">Loading leads…</p>
        )}

        {isError && (
          <p className="font-body text-red-600 p-8">Failed to load leads.</p>
        )}

        {!isLoading && !isError && data && data.leads.length === 0 && (
          <p className="font-body text-navy/60 p-8">
            No leads yet. Leads appear here when visitors submit a Get Quote form.
          </p>
        )}

        {!isLoading && !isError && data && data.leads.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-navy/10">
                    <th className="font-heading text-xs uppercase text-navy/60 px-4 py-3">Name</th>
                    <th className="font-heading text-xs uppercase text-navy/60 px-4 py-3">Phone</th>
                    <th className="font-heading text-xs uppercase text-navy/60 px-4 py-3">Email</th>
                    <th className="font-heading text-xs uppercase text-navy/60 px-4 py-3">Product Interest</th>
                    <th className="font-heading text-xs uppercase text-navy/60 px-4 py-3">Source</th>
                    <th className="font-heading text-xs uppercase text-navy/60 px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((lead, i) => (
                    <tr key={lead.id} className={i % 2 === 0 ? 'bg-white' : 'bg-off-white/50'}>
                      <td className="font-body text-sm text-navy px-4 py-3">{lead.name}</td>
                      <td className="font-body text-sm text-navy px-4 py-3">{lead.phone ?? '—'}</td>
                      <td className="font-body text-sm text-navy px-4 py-3">{lead.email ?? '—'}</td>
                      <td className="font-body text-sm text-navy px-4 py-3">{lead.product_interest ?? '—'}</td>
                      <td className="font-body text-sm text-navy px-4 py-3">{lead.source_page ?? '—'}</td>
                      <td className="font-body text-sm text-navy px-4 py-3">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="font-body text-sm text-navy/60">
                Showing {start}–{end} of {data.total} leads
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
