import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subjectsApi } from '../api/subjectsApi';
import type { SubjectFormData } from '../types/subject.types';

const QK = {
  all: ['subjects'] as const,
  list: () => [...QK.all, 'list'] as const,
};

export function useSubjects() {
  return useQuery({
    queryKey: QK.list(),
    queryFn: () => subjectsApi.list(),
    select: (res) => res.data,
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SubjectFormData) => subjectsApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: QK.list() });
      toast.success(res.message ?? 'تم إنشاء المادة بنجاح ✅');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'فشل إنشاء المادة');
    },
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SubjectFormData> }) =>
      subjectsApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: QK.list() });
      toast.success(res.message ?? 'تم تحديث المادة بنجاح ✅');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'فشل تحديث المادة');
    },
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => subjectsApi.delete(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: QK.list() });
      toast.success(res.message ?? 'تم حذف المادة بنجاح');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'فشل حذف المادة');
    },
  });
}
