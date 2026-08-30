import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi, type UserFilters } from '../api/usersApi';

export const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: (filters: UserFilters) => [...USER_KEYS.lists(), filters] as const,
};

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: USER_KEYS.list(filters),
    queryFn: () => usersApi.getUsers(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }: { id: number | string; is_active: boolean }) =>
      usersApi.updateUserStatus(id, is_active),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success(res.message || 'تم تحديث حالة المستخدم بنجاح.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر تحديث حالة الحساب.';
      toast.error(msg);
    },
  });
}
