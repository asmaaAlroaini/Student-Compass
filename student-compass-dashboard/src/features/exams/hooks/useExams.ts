import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { examsApi } from '../api/examsApi';
import type { ExamFilters } from '../types/exam.types';

export const EXAM_KEYS = {
  all: ['exams'] as const,
  lists: () => [...EXAM_KEYS.all, 'list'] as const,
  list: (filters: ExamFilters) => [...EXAM_KEYS.lists(), filters] as const,
  details: () => [...EXAM_KEYS.all, 'detail'] as const,
  detail: (id: number | string) => [...EXAM_KEYS.details(), id] as const,
  results: (id: number | string) => [...EXAM_KEYS.all, 'results', id] as const,
};

// ── 1. Hook for list of exams ──
export function useExams(filters: ExamFilters = {}) {
  return useQuery({
    queryKey: EXAM_KEYS.list(filters),
    queryFn: () => examsApi.getExams(filters),
    staleTime: 1000 * 60 * 2,
  });
}

// ── 2. Hook for single exam ──
export function useExam(id: number | string | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.detail(id ?? ''),
    queryFn: () => examsApi.getExam(id!),
    enabled: !!id,
  });
}

// ── 3. Hook for exam results ──
export function useExamResults(id: number | string | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.results(id ?? ''),
    queryFn: () => examsApi.getExamResults(id!),
    enabled: !!id,
  });
}

// ── 4. Hook to create exam ──
export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => examsApi.createExam(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.lists() });
      toast.success(res.message || 'تم إنشاء وتصميم الامتحان بنجاح.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'فشل في حفظ الامتحان. تأكد من إرفاق الأسئلة وصحة البيانات.';
      toast.error(msg);
    },
  });
}

// ── 5. Hook to update exam ──
export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      examsApi.updateExam(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.all });
      toast.success(res.message || 'تم تحديث بيانات الامتحان بنجاح.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر تحديث الامتحان.';
      toast.error(msg);
    },
  });
}

// ── 6. Hook to delete exam ──
export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => examsApi.deleteExam(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.lists() });
      toast.success(res.message || 'تم حذف الامتحان بنجاح.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر حذف الامتحان.';
      toast.error(msg);
    },
  });
}
