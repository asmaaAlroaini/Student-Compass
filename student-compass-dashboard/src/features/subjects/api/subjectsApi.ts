import { fetchClient } from '@/api/client';
import type {
  SubjectsListResponse,
  SubjectResponse,
  SubjectFormData,
} from '../types/subject.types';

const BASE = '/admin/subjects';

export const subjectsApi = {
  /** GET /admin/subjects */
  list: (): Promise<SubjectsListResponse> =>
    fetchClient<SubjectsListResponse>(BASE),

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
