import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'staff'>;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, allowedRoles = ['admin', 'staff'] }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role as 'admin' | 'staff')) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
