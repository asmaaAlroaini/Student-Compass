import apiClient from '@/api/client';
import type { LessonResponse, LessonsListResponse } from '../types/lesson.types';

export const lessonsApi = {
  // ── 1. List lessons for a unit ──
  listByUnit: async (subjectId: number | string, unitId: number | string): Promise<LessonsListResponse> => {
    const res = await apiClient.get<LessonsListResponse>(
      `/student/subjects/${subjectId}/units/${unitId}/lessons`
    );
    return res.data;
  },

  // ── 2. Get single lesson ──
  getLesson: async (id: number | string): Promise<LessonResponse> => {
    const res = await apiClient.get<LessonResponse>(`/student/lessons/${id}`);
    return res.data;
  },

  // ── 3. Create lesson ──
  createLesson: async (data: FormData | Record<string, any>): Promise<LessonResponse> => {
    const res = await apiClient.post<LessonResponse>('/teacher/lessons', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  // ── 4. Update lesson ──
  updateLesson: async (
    id: number | string,
    data: FormData | Record<string, any>
  ): Promise<LessonResponse> => {
    const res = await apiClient.post<LessonResponse>(`/teacher/lessons/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },
};
