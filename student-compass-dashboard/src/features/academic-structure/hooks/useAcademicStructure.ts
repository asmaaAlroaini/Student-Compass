import { useQuery } from '@tanstack/react-query';
import { academicApi } from '../api/academicApi';
import type { GradeLevel, Track } from '../types/academic.types';

const QK = {
  options: ['academic', 'options'] as const,
};

export function useAcademicOptions() {
  return useQuery({
    queryKey: QK.options,
    queryFn: () => academicApi.getOptions(),
    staleTime: 1000 * 60 * 10, // 10 minutes — بيانات شبه ثابتة
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
