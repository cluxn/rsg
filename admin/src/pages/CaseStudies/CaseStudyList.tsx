import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';
import { Button } from '@/components/ui/button';
import { getCaseStudiesAdmin, deleteCaseStudy, type CaseStudy } from '@/lib/api';

export function CaseStudyListPage() {
  const qc = useQueryClient();
  const { data: studies = [], isLoading } = useQuery<CaseStudy[]>({
    queryKey: ['case-studies-admin'],
    queryFn: getCaseStudiesAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCaseStudy,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['case-studies-admin'] }),
  });

  const handleDelete = (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <ContentTabs />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl text-navy">Case Studies</h1>
          <Link to="/case-studies/create">
            <Button>New Case Study</Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-navy/60 font-body">Loading…</p>
        ) : studies.length === 0 ? (
          <p className="text-navy/60 font-body">No case studies yet. Add your first one.</p>
        ) : (
          <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy/5 text-navy/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Industry</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Published At</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studies.map(study => (
                  <tr key={study.id} className="border-t border-navy/10 hover:bg-navy/2">
                    <td className="px-4 py-3 font-medium text-navy">{study.title}</td>
                    <td className="px-4 py-3 text-navy/60">{study.client_name ?? '—'}</td>
                    <td className="px-4 py-3 text-navy/60">{study.industry ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${study.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {study.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-navy/60 text-xs">
                      {study.published_at ? new Date(study.published_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link to={`/case-studies/edit/${study.id}`} className="text-steel hover:underline text-xs font-semibold">Edit</Link>
                      <button
                        onClick={() => handleDelete(study.id, study.title)}
                        className="text-red-500 hover:underline text-xs font-semibold"
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
      </div>
    </AdminLayout>
  );
}
