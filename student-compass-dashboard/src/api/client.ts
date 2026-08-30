import { clearAllAuth, getAccessToken } from '@/lib/authStorage';
import type { ApiResponse } from '@/types/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const fetchClient = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAccessToken();

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      'تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الباك إند والاتصال بالإنترنت.',
      0
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  let data: ApiResponse<T> | null = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAllAuth();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    let errorMessage = 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.';
    if (data?.message) {
      errorMessage = data.message;
    } else if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey && data.errors[firstKey]?.length) {
        errorMessage = data.errors[firstKey][0];
      }
    } else if (response.statusText) {
      errorMessage = response.statusText;
    }

    throw new ApiError(errorMessage, response.status, data?.errors);
  }

  return (data as unknown) as T;
};
