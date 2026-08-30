import { useAuthStore } from '@/app/store/authStore';
import type { UserRole } from '@/types/user';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const role = user?.role as UserRole | undefined;
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  const isSupervisor = role === 'supervisor';
  const isStudent = role === 'student';
  const hasStaffAccess = isAdmin || isTeacher || isSupervisor;

  return {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    isAdmin,
    isTeacher,
    isSupervisor,
    isStudent,
    hasStaffAccess,
    setAuth,
    setUser,
    updateUser,
    logout,
  };
};
