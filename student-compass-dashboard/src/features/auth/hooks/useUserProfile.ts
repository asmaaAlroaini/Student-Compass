import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/authStore';
import { getAccessToken } from '@/lib/authStorage';
import { authApi } from '@/features/auth/api/authApi';

export const useUserProfile = () => {
  const token = getAccessToken();
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const response = await authApi.getProfile();
      if (response?.data) {
        setUser(response.data);
      }
      return response.data;
    },
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1,
  });
};
