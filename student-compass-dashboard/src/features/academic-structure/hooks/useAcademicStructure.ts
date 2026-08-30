import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { academicApi } from '../api/academicApi';
import type {
  GradeLevel,
  Track,
  CreateGradeLevelPayload,
  UpdateGradeLevelPayload,
  AssignSubjectsPayload,
} from '../types/academic.types';

export const ACADEMIC_QUERY_KEYS = {
  options: ['academic', 'options'] as const,
  adminGrades: ['admin', 'grade-levels'] as const,
  gradeSubjects: (id: number) => ['admin', 'grade-levels', id, 'subjects'] as const,
};

export function useAcademicOptions() {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.options,
    queryFn: () => academicApi.getOptions(),
    staleTime: 1000 * 60 * 5,
  });
}

/** Derived: return grade_levels array */
export function useGradeLevels() {
  const { data, ...rest } = useAcademicOptions();
  const grades: GradeLevel[] = data?.data?.grade_levels ?? [];
  return { grades, ...rest };
}

/** Derived: return flat tracks array */
export function useTracks() {
  const { data, ...rest } = useAcademicOptions();
  const tracks: Track[] = data?.data?.tracks ?? [];
  return { tracks, ...rest };
}

/** Admin Hook: Get full list of grade levels with subjects & statistics */
export function useAdminGradeLevels() {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.adminGrades,
    queryFn: () => academicApi.getAdminGradeLevels(),
    staleTime: 1000 * 60 * 2,
  });
}

/** Admin Mutation: Create Grade Level */
export function useCreateGradeLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGradeLevelPayload) => academicApi.createGradeLevel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_QUERY_KEYS.adminGrades });
      queryClient.invalidateQueries({ queryKey: ACADEMIC_QUERY_KEYS.options });
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      toast.success('تمت إضافة الصف الدراسي بنجاح 🎉');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'فشل إضافة الصف الدراسي';
      toast.error(msg);
    },
  });
}

/** Admin Mutation: Update Grade Level */
export function useUpdateGradeLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateGradeLevelPayload }) =>
      academicApi.updateGradeLevel(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_QUERY_KEYS.adminGrades });
      queryClient.invalidateQueries({ queryKey: ACADEMIC_QUERY_KEYS.options });
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      toast.success('تم تحديث بيانات الصف الدراسي بنجاح ✅');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'فشل تحديث بيانات الصف الدراسي';
      toast.error(msg);
    },
  });
}

/** Admin Mutation: Delete Grade Level */
export function useDeleteGradeLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) =>
      academicApi.deleteGradeLevel(id, force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_QUERY_KEYS.adminGrades });
      queryClient.invalidateQueries({ queryKey: ACADEMIC_QUERY_KEYS.options });
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      toast.success('تم حذف الصف الدراسي بنجاح 🗑️');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'فشل حذف الصف الدراسي';
      toast.error(msg);
    },
  });
}

/** Admin Mutation: Assign Subjects to Grade Level */
export function useAssignSubjectsToGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignSubjectsPayload }) =>
      academicApi.assignSubjectsToGrade(id, payload),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_QUERY_KEYS.adminGrades });
      queryClient.invalidateQueries({ queryKey: ACADEMIC_QUERY_KEYS.gradeSubjects(vars.id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      toast.success('تم تحديث وتعيين المواد للصف الدراسي بنجاح 📚');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'فشل تعيين المواد للصف الدراسي';
      toast.error(msg);
    },
  });
}
