import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/types/user';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  /** When used as a wrapper (not a route layout), pass children directly */
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.PUBLIC.UNAUTHORIZED} replace />;
  }

  // When used as a layout route (no children), render nested routes
  // When used as a wrapper component (with children), render children
  return <>{children ?? <Outlet />}</>;
};

export default RoleGuard;
