import { fetchClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  ApiResponse,
  ChangePasswordParams,
  LoginParams,
  LoginResponseData,
  RegisterParams,
  ResetPasswordParams,
  ResetPasswordRequestParams,
  UpdateProfileParams,
  VerifyResetCodeParams,
} from '@/types/auth';
import type { User, UserSettings } from '@/types/user';

export const authApi = {
  login: (params: LoginParams): Promise<ApiResponse<LoginResponseData>> => {
    return fetchClient<ApiResponse<LoginResponseData>>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  register: (params: RegisterParams): Promise<ApiResponse<{ user: User }>> => {
    return fetchClient<ApiResponse<{ user: User }>>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  getProfile: (): Promise<ApiResponse<User>> => {
    return fetchClient<ApiResponse<User>>(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
    });
  },

  updateProfile: (params: UpdateProfileParams): Promise<ApiResponse<User>> => {
    return fetchClient<ApiResponse<User>>(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(params),
    });
  },

  changePassword: (params: ChangePasswordParams): Promise<ApiResponse<null>> => {
    return fetchClient<ApiResponse<null>>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify(params),
    });
  },

  resetPasswordRequest: (params: ResetPasswordRequestParams): Promise<ApiResponse<{ code?: string; expires_in_minutes?: number }>> => {
    return fetchClient<ApiResponse<{ code?: string; expires_in_minutes?: number }>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD_REQUEST,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  },

  verifyResetCode: (params: VerifyResetCodeParams): Promise<ApiResponse<null>> => {
    return fetchClient<ApiResponse<null>>(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  resetPassword: (params: ResetPasswordParams): Promise<ApiResponse<null>> => {
    return fetchClient<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  getSettings: (): Promise<ApiResponse<UserSettings>> => {
    return fetchClient<ApiResponse<UserSettings>>(API_ENDPOINTS.AUTH.SETTINGS, {
      method: 'GET',
    });
  },

  updateSettings: (params: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> => {
    return fetchClient<ApiResponse<UserSettings>>(API_ENDPOINTS.AUTH.SETTINGS, {
      method: 'PUT',
      body: JSON.stringify(params),
    });
  },

  logout: (): Promise<ApiResponse<null>> => {
    return fetchClient<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  },
};
