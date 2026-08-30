import { fetchClient } from '@/api/client';
import type { EducationalOptionsResponse } from '../types/academic.types';

const BASE = '/auth/educational-options';

export const academicApi = {
  /** GET /auth/educational-options — جلب المراحل والمسارات الدراسية */
  getOptions: (): Promise<EducationalOptionsResponse> =>
    fetchClient<EducationalOptionsResponse>(BASE),
};
