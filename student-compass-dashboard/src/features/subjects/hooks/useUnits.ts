import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unitsApi } from '../api/unitsApi';
import type { UnitFormData, Unit } from '../types/unit.types';

const QK = {
  bySubject: (subjectId?: number) => ['units', 'subject', subjectId ?? 'all'] as const,
};

export function useUnits(subjectId?: number) {
  return useQuery({
    queryKey: QK.bySubject(subjectId),
    queryFn: async () => {
      if (subjectId && subjectId > 0) {
        return unitsApi.listBySubject(subjectId);
      }
      return { success: true, data: [] as Unit[] };
    },
    select: (res) => res.data,
    enabled: typeof subjectId === 'number' && subjectId > 0,
  });
}

export function useUnitsBySubject(subjectId: number) {
  return useUnits(subjectId);
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
