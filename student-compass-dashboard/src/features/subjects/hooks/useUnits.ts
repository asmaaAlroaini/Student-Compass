import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unitsApi } from '../api/unitsApi';
import type { UnitFormData } from '../types/unit.types';

const QK = {
  bySubject: (subjectId: number) => ['units', 'subject', subjectId] as const,
};

export function useUnitsBySubject(subjectId: number) {
  return useQuery({
    queryKey: QK.bySubject(subjectId),
    queryFn: () => unitsApi.listBySubject(subjectId),
    select: (res) => res.data,
    enabled: subjectId > 0,
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UnitFormData) => unitsApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['units'] });
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success(res.message ?? 'تم إنشاء الوحدة بنجاح ✅');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UnitFormData> }) =>
      unitsApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['units'] });
      toast.success(res.message ?? 'تم تحديث الوحدة بنجاح ✅');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => unitsApi.delete(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['units'] });
      qc.invalidateQueries({ queryKey: ['subjects'] });
      toast.success(res.message ?? 'تم حذف الوحدة بنجاح');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
