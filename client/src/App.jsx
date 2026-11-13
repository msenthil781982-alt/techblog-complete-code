
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Spinner from './components/ui/Spinner';
import LoginPage from './pages/admin/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';

const HomePage = lazy(() => import('./pages/public/HomePage'));
const BlogListPage = lazy(() => import('./pages/public/BlogListPage'));
const BlogDetailPage = lazy(() => import('./pages/public/BlogDetailPage'));
const SubmitBlogPage = lazy(() => import('./pages/public/SubmitBlogPage'));
const MyBlogsPage = lazy(() => import('./pages/public/MyBlogsPage'));

const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const PostEditorPage = lazy(() => import('./pages/admin/PostEditorPage'));
const CategoryPage = lazy(() => import('./pages/admin/CategoryPage'));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />
            <Route path="submit-blog" element={<SubmitBlogPage />} />
            <Route path="my-blogs" element={<MyBlogsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          <Route path="/admin" element={<ProtectedRoute roleRequired="admin" />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="posts/new" element={<PostEditorPage />} />
              <Route path="posts/edit/:id" element={<PostEditorPage />} />
              <Route path="categories" element={<CategoryPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
