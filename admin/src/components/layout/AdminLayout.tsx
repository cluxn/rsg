import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 min-h-screen bg-off-white">
        {children}
      </main>
    </>
  );
}
