import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebar } from '@/contexts/SidebarContext';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <>
      <Sidebar />
      <Header />
      <main className={`pt-16 min-h-screen bg-off-white transition-all duration-200 ${collapsed ? 'ml-14' : 'ml-56'}`}>
        {children}
      </main>
    </>
  );
}
