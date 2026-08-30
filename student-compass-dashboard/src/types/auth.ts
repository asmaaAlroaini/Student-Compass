import type { User, UserRole } from './user';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  grade_level?: string;
  track?: string;
}

export interface ResetPasswordRequestParams {
  email: string;
}

export interface VerifyResetCodeParams {
  email: string;
  code: string;
}

export interface ResetPasswordParams {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordParams {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface UpdateProfileParams {
  name?: string;
  phone?: string;
  grade_level?: string;
  track?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuth: (user: User, token: string, rememberMe?: boolean) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
  initialize: () => void;
}
