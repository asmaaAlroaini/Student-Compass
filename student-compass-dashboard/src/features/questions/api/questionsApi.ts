import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  QuestionFilters,
  QuestionsPaginatedResponse,
  QuestionDetailResponse,
  BulkImportPreviewResponse,
  BulkImportConfirmResponse,
  Question,
} from '../types/question.types';

export const questionsApi = {
  // ── 1. List with filters ──
  getQuestions: async (params?: QuestionFilters): Promise<QuestionsPaginatedResponse> => {
    const res = await apiClient.get<QuestionsPaginatedResponse>(API_ENDPOINTS.TEACHER.QUESTIONS, {
      params,
    });
    return res.data;
  },

  // ── 2. Get single question ──
  getQuestion: async (id: number | string): Promise<QuestionDetailResponse> => {
    const res = await apiClient.get<QuestionDetailResponse>(`${API_ENDPOINTS.TEACHER.QUESTIONS}/${id}`);
    return res.data;
  },

  // ── 3. Create question ──
  createQuestion: async (data: FormData | Record<string, any>): Promise<{ success: boolean; data: Question; message: string }> => {
    const res = await apiClient.post(`${API_ENDPOINTS.TEACHER.QUESTIONS}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  // ── 4. Update question ──
  updateQuestion: async (
    id: number | string,
    data: FormData | Record<string, any>
  ): Promise<{ success: boolean; data: Question; message: string }> => {
    const res = await apiClient.post(`${API_ENDPOINTS.TEACHER.QUESTIONS}/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data;
  },

  // ── 5. Delete question ──
  deleteQuestion: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete(`${API_ENDPOINTS.TEACHER.QUESTIONS}/${id}`);
    return res.data;
  },

  // ── 6. Download Excel/CSV template ──
  downloadTemplate: async (): Promise<Blob> => {
    const res = await apiClient.get(API_ENDPOINTS.TEACHER.QUESTIONS_TEMPLATE, {
      responseType: 'blob',
    });
    return res.data;
  },

  // ── 7. Bulk Import Preview ──
  previewBulkImport: async (payload: FormData | { questions: any[] }): Promise<BulkImportPreviewResponse> => {
    const res = await apiClient.post<BulkImportPreviewResponse>(
      API_ENDPOINTS.TEACHER.QUESTIONS_IMPORT_PREVIEW,
      payload,
      {
        headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      }
    );
    return res.data;
  },

  // ── 8. Bulk Import Confirm ──
  confirmBulkImport: async (questions: any[]): Promise<BulkImportConfirmResponse> => {
    const res = await apiClient.post<BulkImportConfirmResponse>(
      API_ENDPOINTS.TEACHER.QUESTIONS_IMPORT_CONFIRM,
      { questions }
    );
    return res.data;
  },
};
