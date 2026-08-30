import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { questionsApi } from '../api/questionsApi';
import type { QuestionFilters } from '../types/question.types';

export const QUESTION_KEYS = {
  all: ['questions'] as const,
  lists: () => [...QUESTION_KEYS.all, 'list'] as const,
  list: (filters: QuestionFilters) => [...QUESTION_KEYS.lists(), filters] as const,
  details: () => [...QUESTION_KEYS.all, 'detail'] as const,
  detail: (id: number | string) => [...QUESTION_KEYS.details(), id] as const,
};

// ── 1. Hook for list of questions ──
export function useQuestions(filters: QuestionFilters = {}) {
  return useQuery({
    queryKey: QUESTION_KEYS.list(filters),
    queryFn: () => questionsApi.getQuestions(filters),
    staleTime: 1000 * 60 * 2, // 2 mins cache
  });
}

// ── 2. Hook for single question ──
export function useQuestion(id: number | string | undefined) {
  return useQuery({
    queryKey: QUESTION_KEYS.detail(id ?? ''),
    queryFn: () => questionsApi.getQuestion(id!),
    enabled: !!id,
  });
}

// ── 3. Hook to create question ──
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | Record<string, any>) => questionsApi.createQuestion(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: QUESTION_KEYS.lists() });
      toast.success(res.message || 'تمت إضافة السؤال بنجاح إلى بنك الأسئلة.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'فشل في حفظ السؤال. تأكد من صحة البيانات المدخلة.';
      toast.error(msg);
    },
  });
}

// ── 4. Hook to update question ──
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: FormData | Record<string, any> }) =>
      questionsApi.updateQuestion(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: QUESTION_KEYS.all });
      toast.success(res.message || 'تم تحديث السؤال بنجاح.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر تحديث السؤال.';
      toast.error(msg);
    },
  });
}

// ── 5. Hook to delete question ──
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => questionsApi.deleteQuestion(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: QUESTION_KEYS.lists() });
      toast.success(res.message || 'تم حذف السؤال من بنك الأسئلة.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر حذف السؤال.';
      toast.error(msg);
    },
  });
}

// ── 6. Hook for bulk import preview ──
export function useBulkImportPreview() {
  return useMutation({
    mutationFn: (payload: FormData | { questions: any[] }) => questionsApi.previewBulkImport(payload),
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر فحص ملف الأسئلة.';
      toast.error(msg);
    },
  });
}

// ── 7. Hook for bulk import confirm ──
export function useBulkImportConfirm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questions: any[]) => questionsApi.confirmBulkImport(questions),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: QUESTION_KEYS.lists() });
      toast.success(res.message || 'تم استيراد الأسئلة بنجاح.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر استيراد الأسئلة.';
      toast.error(msg);
    },
  });
}

// ── 8. Hook to download template ──
export function useDownloadTemplate() {
  return useMutation({
    mutationFn: () => questionsApi.downloadTemplate(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_compass_questions_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('تم تنزيل قالب الاستيراد بنجاح.');
    },
    onError: () => {
      toast.error('تعذر تنزيل قالب الاستيراد.');
    },
  });
}
