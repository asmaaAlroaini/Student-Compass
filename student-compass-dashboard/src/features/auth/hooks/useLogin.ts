import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/store/authStore';
import { useThemeStore } from '@/app/store/themeStore';
import { ROUTES } from '@/constants/routes';
import { authApi } from '@/features/auth/api/authApi';
import type { LoginParams } from '@/types/auth';

interface UseLoginOptions {
  rememberMe?: boolean;
  redirectTo?: string;
}

export const useLogin = (options: UseLoginOptions = {}) => {
  const { rememberMe = true, redirectTo } = options;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (params: LoginParams) => authApi.login(params),
    onSuccess: (response) => {
      if (response?.data) {
        const { user, token } = response.data;
        setAuth(user, token, rememberMe);
        if (user.dark_mode) {
          useThemeStore.getState().setMode(user.dark_mode);
        }
        queryClient.setQueryData(['auth', 'profile'], user);

        toast.success(`مرحباً بك مجدداً، ${user.name}!`, {
          description: 'تم تسجيل الدخول بنجاح.',
        });

        // Determine destination based on user role
        const targetRoute = redirectTo || ROUTES.DASHBOARD.HOME;
        navigate(targetRoute, { replace: true });
      }
    },
    onError: (error: Error) => {
      toast.error('فشل تسجيل الدخول', {
        description: error.message || 'يرجى التأكد من صحة البريد الإلكتروني وكلمة المرور.',
      });
    },
  });
};
