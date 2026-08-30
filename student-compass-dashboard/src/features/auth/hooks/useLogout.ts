import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/store/authStore';
import { ROUTES } from '@/constants/routes';
import { authApi } from '@/features/auth/api/authApi';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Regardless of backend response, clear local state
      logout();
      queryClient.clear();
      toast.info('تم تسجيل الخروج بنجاح.');
      navigate(ROUTES.PUBLIC.LOGIN, { replace: true });
    },
  });
};
