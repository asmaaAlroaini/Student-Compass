import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lessonsApi } from '../api/lessonsApi';

export function useLessonsByUnit(subjectId?: number | string, unitId?: number | string) {
  return useQuery({
    queryKey: ['lessons', 'unit', subjectId, unitId],
    queryFn: () => lessonsApi.listByUnit(subjectId!, unitId!),
    enabled: !!subjectId && !!unitId,
  });
}

export function useLesson(id?: number | string) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonsApi.getLesson(id!),
    enabled: !!id,
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | Record<string, any>) => lessonsApi.createLesson(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success(res.message || 'تم إنشاء الدرس وإرفاق محتوياته بنجاح.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر حفظ الدرس.';
      toast.error(msg);
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: FormData | Record<string, any> }) =>
      lessonsApi.updateLesson(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.id] });
      toast.success(res.message || 'تم تحديث بيانات الدرس والمحتويات بنجاح.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر تحديث الدرس.';
      toast.error(msg);
    },
  });
}
