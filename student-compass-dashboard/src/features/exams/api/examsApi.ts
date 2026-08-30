import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  ExamFilters,
  ExamsPaginatedResponse,
  ExamDetailResponse,
  ExamResultsResponse,
  Exam,
} from '../types/exam.types';

export const examsApi = {
  // ── 1. List exams ──
  getExams: async (params?: ExamFilters): Promise<ExamsPaginatedResponse> => {
    const res = await apiClient.get<ExamsPaginatedResponse>(API_ENDPOINTS.TEACHER.EXAMS, {
      params,
    });
    return res.data;
  },

  // ── 2. Get single exam ──
  getExam: async (id: number | string): Promise<ExamDetailResponse> => {
    const res = await apiClient.get<ExamDetailResponse>(`${API_ENDPOINTS.TEACHER.EXAMS}/${id}`);
    return res.data;
  },

  // ── 3. Create exam ──
  createExam: async (data: any): Promise<{ success: boolean; data: Exam; message: string }> => {
    const res = await apiClient.post(`${API_ENDPOINTS.TEACHER.EXAMS}`, data);
    return res.data;
  },

  // ── 4. Update exam ──
  updateExam: async (
    id: number | string,
    data: any
  ): Promise<{ success: boolean; data: Exam; message: string }> => {
    const res = await apiClient.put(`${API_ENDPOINTS.TEACHER.EXAMS}/${id}`, data);
    return res.data;
  },

  // ── 5. Delete exam ──
  deleteExam: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete(`${API_ENDPOINTS.TEACHER.EXAMS}/${id}`);
    return res.data;
  },

  // ── 6. Get Exam Results & Analytics ──
  getExamResults: async (id: number | string): Promise<ExamResultsResponse> => {
    const res = await apiClient.get<ExamResultsResponse>(`/student/exams/${id}/results`);
    return res.data;
  },
};
