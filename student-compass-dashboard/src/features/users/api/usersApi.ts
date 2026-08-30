import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'supervisor' | 'student';
  phone?: string | null;
  avatar?: string | null;
  grade_level?: string | null;
  track?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsersPaginatedResponse {
  success: boolean;
  data: {
    current_page: number;
    data: UserRecord[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

export interface UserFilters {
  role?: string;
  page?: number;
  search?: string;
  grade_level?: string;
  track?: string;
  is_active?: boolean | '';
}

export const usersApi = {
  getUsers: async (params?: UserFilters): Promise<UsersPaginatedResponse> => {
    const res = await apiClient.get<UsersPaginatedResponse>(API_ENDPOINTS.ADMIN.USERS, {
      params,
    });
    return res.data;
  },

  updateUserStatus: async (
    id: number | string,
    is_active: boolean
  ): Promise<{ success: boolean; data: UserRecord; message: string }> => {
    const res = await apiClient.put<{ success: boolean; data: UserRecord; message: string }>(
      `${API_ENDPOINTS.ADMIN.USERS}/${id}/status`,
      { is_active }
    );
    return res.data;
  },
};
