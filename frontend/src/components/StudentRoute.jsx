import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

/**
 * StudentRoute — accessible only by logged-in non-admin users.
 * Admins are redirected to /admin/dashboard.
 */
export default function StudentRoute({ children }) {
  const { user, loading } = useAuth();

  // Let ProtectedRoute handle loading + not-logged-in
  if (loading || !user) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
