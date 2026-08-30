import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getAccessToken } from '@/lib/authStorage';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const token = getAccessToken();
  const location = useLocation();

  // 1. If not authenticated or token missing, redirect to login
  if (!token) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} state={{ from: location }} replace />;
  }

  // 2. If token exists but user object not in store yet
  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090f20] text-white">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 3. If role restriction specified, verify user role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.PUBLIC.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
