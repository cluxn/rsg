import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { GlassStatCard } from '@/components/ui/GlassStatCard';
import { Users, Package, Image, FileText } from 'lucide-react';
import { api } from '@/lib/api';

export function DashboardPage() {
  const { data: leadsData } = useQuery<{ total: number }>({
    queryKey: ['leads-count'],
    queryFn: () => api.get('/leads', { params: { page: 1, limit: 1 } }).then(r => ({ total: r.data.total })),
  });

  const stats = [
    { label: 'Leads', value: leadsData?.total ?? 0, icon: <Users className="w-6 h-6" /> },
    { label: 'Products', value: 10, icon: <Package className="w-6 h-6" /> },
    { label: 'Media', value: 0, icon: <Image className="w-6 h-6" /> },
    { label: 'Blog Posts', value: 0, icon: <FileText className="w-6 h-6" /> },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-heading text-2xl text-navy mb-2">Dashboard</h1>
        <p className="font-body text-navy/60 mb-8">Welcome to RSG Admin Panel</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(s => (
            <GlassStatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
