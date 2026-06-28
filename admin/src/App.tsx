import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/Login';
import { DashboardPage } from '@/pages/Dashboard';
import { MediaLibraryPage } from '@/pages/MediaLibrary';
import { CatalogPage } from '@/pages/Catalog';
import { ProductEditorPage } from '@/pages/ProductEditor';
import { SettingsPage } from '@/pages/Settings';
import { SeoPage } from '@/pages/Seo';
import { LeadsPage } from '@/pages/Leads';
import { BlogListPage } from '@/pages/Blog/BlogList';
import { BlogCreatePage } from '@/pages/Blog/BlogCreate';
import { BlogEditPage } from '@/pages/Blog/BlogEdit';
import { EventListPage } from '@/pages/Events/EventList';
import { EventCreatePage } from '@/pages/Events/EventCreate';
import { EventEditPage } from '@/pages/Events/EventEdit';
import { TestimonialListPage } from '@/pages/Testimonials/TestimonialList';
import { TestimonialCreatePage } from '@/pages/Testimonials/TestimonialCreate';
import { TestimonialEditPage } from '@/pages/Testimonials/TestimonialEdit';
import { GuidesPage } from '@/pages/Guides';
import { CaseStudyListPage } from '@/pages/CaseStudies/CaseStudyList';
import { CaseStudyCreatePage } from '@/pages/CaseStudies/CaseStudyCreate';
import { CaseStudyEditPage } from '@/pages/CaseStudies/CaseStudyEdit';
import { ClientLogosPage } from '@/pages/ClientLogos';
import { AuthorsPage } from '@/pages/Authors';
import { CategoriesPage } from '@/pages/Categories';
import { MarketingPage } from '@/pages/Marketing';
import { NewsletterPage } from '@/pages/Newsletter';
import { SidebarProvider } from '@/contexts/SidebarContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute module="dashboard"><DashboardPage /></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute module="leads"><LeadsPage /></ProtectedRoute>} />
            <Route path="/media" element={<ProtectedRoute module="content"><MediaLibraryPage /></ProtectedRoute>} />
            <Route path="/catalog" element={<ProtectedRoute module="catalog"><CatalogPage /></ProtectedRoute>} />
            <Route path="/catalog/:slug" element={<ProtectedRoute module="catalog"><ProductEditorPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute module="settings"><SettingsPage /></ProtectedRoute>} />
            <Route path="/seo" element={<ProtectedRoute module="seo"><SeoPage /></ProtectedRoute>} />
            <Route path="/blog" element={<ProtectedRoute module="content"><BlogListPage /></ProtectedRoute>} />
            <Route path="/blog/create" element={<ProtectedRoute module="content"><BlogCreatePage /></ProtectedRoute>} />
            <Route path="/blog/edit/:id" element={<ProtectedRoute module="content"><BlogEditPage /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute module="content"><EventListPage /></ProtectedRoute>} />
            <Route path="/events/create" element={<ProtectedRoute module="content"><EventCreatePage /></ProtectedRoute>} />
            <Route path="/events/edit/:id" element={<ProtectedRoute module="content"><EventEditPage /></ProtectedRoute>} />
            <Route path="/testimonials" element={<ProtectedRoute module="content"><TestimonialListPage /></ProtectedRoute>} />
            <Route path="/testimonials/create" element={<ProtectedRoute module="content"><TestimonialCreatePage /></ProtectedRoute>} />
            <Route path="/testimonials/edit/:id" element={<ProtectedRoute module="content"><TestimonialEditPage /></ProtectedRoute>} />
            <Route path="/guides" element={<ProtectedRoute module="content"><GuidesPage /></ProtectedRoute>} />
            <Route path="/case-studies" element={<ProtectedRoute module="content"><CaseStudyListPage /></ProtectedRoute>} />
            <Route path="/case-studies/create" element={<ProtectedRoute module="content"><CaseStudyCreatePage /></ProtectedRoute>} />
            <Route path="/case-studies/edit/:id" element={<ProtectedRoute module="content"><CaseStudyEditPage /></ProtectedRoute>} />
            <Route path="/client-logos" element={<ProtectedRoute module="marketing"><ClientLogosPage /></ProtectedRoute>} />
            <Route path="/authors" element={<ProtectedRoute module="content"><AuthorsPage /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute module="content"><CategoriesPage /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute module="marketing"><MarketingPage /></ProtectedRoute>} />
            <Route path="/newsletter" element={<ProtectedRoute module="leads"><NewsletterPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
