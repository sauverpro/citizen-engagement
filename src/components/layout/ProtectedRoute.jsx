import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth.js';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuthContext();
  if (loading) return null; // Or a loader
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
