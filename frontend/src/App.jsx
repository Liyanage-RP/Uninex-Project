import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import StudentRoute from './components/StudentRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';

import ResourcesPage from './pages/Resources/ResourcesPage';
import UploadResource from './pages/Resources/UploadResource';
import MyBookmarks from './pages/Resources/MyBookmarks';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Dummy pages so App doesn't crash before they build them
function MarketplacePage() { return <Dashboard />; }
function CommunitiesPage() { return <Dashboard />; }
function ProfilePage() { return <Dashboard />; }

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Protected routes (any logged-in user) */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <ProtectedRoute><MarketplacePage /></ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute><ResourcesPage /></ProtectedRoute>
            } />
            <Route path="/resources/bookmarks" element={
              <ProtectedRoute><MyBookmarks /></ProtectedRoute>
            } />
            <Route path="/communities" element={
              <ProtectedRoute><CommunitiesPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            {/* Any logged-in user can upload (students & admins) */}
            <Route path="/resources/upload" element={
              <ProtectedRoute><UploadResource /></ProtectedRoute>
            } />

            {/* Admin only routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
