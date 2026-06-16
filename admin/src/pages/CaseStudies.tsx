import { AdminLayout } from '@/components/layout/AdminLayout';
import { ContentTabs } from '@/components/ContentTabs';

export function CaseStudiesPage() {
  return (
    <AdminLayout>
      <ContentTabs />
      <div className="p-8">
        <h1 className="font-heading text-2xl text-navy mb-2">Case Studies</h1>
        <p className="font-body text-navy/60 text-sm">Coming soon — manage case studies here.</p>
      </div>
    </AdminLayout>
  );
}
