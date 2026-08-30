import apiClient, { fetchClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  EducationalOptionsResponse,
  AdminGradeLevelsResponse,
  AdminGradeLevelSingleResponse,
  CreateGradeLevelPayload,
  UpdateGradeLevelPayload,
  AssignSubjectsPayload,
} from '../types/academic.types';

export const academicApi = {
  /** GET /auth/educational-options — جلب المراحل والمسارات الدراسية لخيارات التسجيل والفلترة */
  getOptions: (): Promise<EducationalOptionsResponse> =>
    fetchClient<EducationalOptionsResponse>(API_ENDPOINTS.AUTH.EDUCATIONAL_OPTIONS),

  /** GET /admin/grade-levels — جلب كافة الصفوف والمراحل مع الإحصائيات والمواد */
  getAdminGradeLevels: async (): Promise<AdminGradeLevelsResponse> => {
    const res = await apiClient.get<AdminGradeLevelsResponse>(API_ENDPOINTS.ADMIN.GRADE_LEVELS);
    return res.data;
  },

  /** POST /admin/grade-levels — إضافة مرحلة / صف دراسي جديد */
  createGradeLevel: async (payload: CreateGradeLevelPayload): Promise<AdminGradeLevelSingleResponse> => {
    const res = await apiClient.post<AdminGradeLevelSingleResponse>(API_ENDPOINTS.ADMIN.GRADE_LEVELS, payload);
    return res.data;
  },

  /** PUT /admin/grade-levels/{id} — تعديل بيانات صف دراسي */
  updateGradeLevel: async (id: number, payload: UpdateGradeLevelPayload): Promise<AdminGradeLevelSingleResponse> => {
    const res = await apiClient.put<AdminGradeLevelSingleResponse>(`${API_ENDPOINTS.ADMIN.GRADE_LEVELS}/${id}`, payload);
    return res.data;
  },

  /** DELETE /admin/grade-levels/{id} — حذف صف دراسي */
  deleteGradeLevel: async (id: number, force = false): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      `${API_ENDPOINTS.ADMIN.GRADE_LEVELS}/${id}${force ? '?force=1' : ''}`
    );
    return res.data;
  },

  /** GET /admin/grade-levels/{id}/subjects — جلب مواد صف دراسي محدد */
  getGradeSubjects: async (id: number): Promise<{ success: boolean; data: any[] }> => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>(API_ENDPOINTS.ADMIN.GRADE_LEVEL_SUBJECTS(id));
    return res.data;
  },

  /** POST /admin/grade-levels/{id}/assign-subjects — تعيين وتحديد المواد التابعة للصف */
  assignSubjectsToGrade: async (id: number, payload: AssignSubjectsPayload): Promise<{ success: boolean; message: string; data: any[] }> => {
    const res = await apiClient.post<{ success: boolean; message: string; data: any[] }>(
      API_ENDPOINTS.ADMIN.GRADE_LEVEL_ASSIGN(id),
      payload
    );
    return res.data;
  },
};
