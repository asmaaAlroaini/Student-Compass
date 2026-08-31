import { fetchClient } from '@/api/client';
import type {
  SubjectsListResponse,
  SubjectResponse,
  SubjectFormData,
} from '../types/subject.types';

const BASE = '/admin/subjects';

export const subjectsApi = {
  /** GET /admin/subjects */
  list: (params?: { grade_level?: string; track?: string; search?: string }): Promise<SubjectsListResponse> => {
    const sp = new URLSearchParams();
    if (params?.grade_level) sp.append('grade_level', params.grade_level);
    if (params?.track) sp.append('track', params.track);
    if (params?.search) sp.append('search', params.search);
    const q = sp.toString();
    return fetchClient<SubjectsListResponse>(q ? `${BASE}?${q}` : BASE);
  },

  /** GET /admin/subjects/:id */
  get: (id: number): Promise<SubjectResponse> =>
    fetchClient<SubjectResponse>(`${BASE}/${id}`),

  /** POST /admin/subjects */
  create: (data: SubjectFormData): Promise<SubjectResponse> =>
    fetchClient<SubjectResponse>(BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** PUT /admin/subjects/:id */
  update: (id: number, data: Partial<SubjectFormData>): Promise<SubjectResponse> =>
    fetchClient<SubjectResponse>(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** DELETE /admin/subjects/:id */
  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    fetchClient(`${BASE}/${id}`, { method: 'DELETE' }),
};
