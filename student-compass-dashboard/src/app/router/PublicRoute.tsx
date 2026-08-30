import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getAccessToken } from '@/lib/authStorage';
import { ROUTES } from '@/constants/routes';

export const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const token = getAccessToken();

  if (isAuthenticated && token) {
    return <Navigate to={ROUTES.DASHBOARD.HOME} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
