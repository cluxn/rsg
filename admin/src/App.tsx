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

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <LeadsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/media"
              element={
                <ProtectedRoute>
                  <MediaLibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalog"
              element={
                <ProtectedRoute>
                  <CatalogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalog/:slug"
              element={
                <ProtectedRoute>
                  <ProductEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seo"
              element={
                <ProtectedRoute>
                  <SeoPage />
                </ProtectedRoute>
              }
            />
            <Route path="/blog" element={<ProtectedRoute><BlogListPage /></ProtectedRoute>} />
            <Route path="/blog/create" element={<ProtectedRoute><BlogCreatePage /></ProtectedRoute>} />
            <Route path="/blog/edit/:id" element={<ProtectedRoute><BlogEditPage /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><EventListPage /></ProtectedRoute>} />
            <Route path="/events/create" element={<ProtectedRoute><EventCreatePage /></ProtectedRoute>} />
            <Route path="/events/edit/:id" element={<ProtectedRoute><EventEditPage /></ProtectedRoute>} />
            <Route path="/testimonials" element={<ProtectedRoute><TestimonialListPage /></ProtectedRoute>} />
            <Route path="/testimonials/create" element={<ProtectedRoute><TestimonialCreatePage /></ProtectedRoute>} />
            <Route path="/testimonials/edit/:id" element={<ProtectedRoute><TestimonialEditPage /></ProtectedRoute>} />
            <Route path="/guides" element={<ProtectedRoute><GuidesPage /></ProtectedRoute>} />
            <Route path="/case-studies" element={<ProtectedRoute><CaseStudyListPage /></ProtectedRoute>} />
            <Route path="/case-studies/create" element={<ProtectedRoute><CaseStudyCreatePage /></ProtectedRoute>} />
            <Route path="/case-studies/edit/:id" element={<ProtectedRoute><CaseStudyEditPage /></ProtectedRoute>} />
            <Route path="/client-logos" element={<ProtectedRoute><ClientLogosPage /></ProtectedRoute>} />
            <Route path="/authors" element={<ProtectedRoute><AuthorsPage /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><MarketingPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
