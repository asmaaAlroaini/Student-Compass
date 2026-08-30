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

export const apiClient = {
  get: async <T = any>(
    endpoint: string,
    config?: { params?: Record<string, any>; responseType?: string }
  ): Promise<{ data: T }> => {
    let url = endpoint;
    if (config?.params) {
      const sp = new URLSearchParams();
      Object.entries(config.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          sp.append(k, String(v));
        }
      });
      const q = sp.toString();
      if (q) url += (url.includes('?') ? '&' : '?') + q;
    }

    if (config?.responseType === 'blob') {
      const token = getAccessToken();
      const headers = new Headers();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
      const res = await fetch(fullUrl, { headers });
      const blob = await res.blob();
      return { data: blob as unknown as T };
    }

    const data = await fetchClient<T>(url, { method: 'GET' });
    return { data };
  },

  post: async <T = any>(
    endpoint: string,
    data?: any,
    config?: { headers?: Record<string, string> }
  ): Promise<{ data: T }> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const body = isFormData ? data : data !== undefined ? JSON.stringify(data) : undefined;
    const res = await fetchClient<T>(endpoint, {
      method: 'POST',
      body,
      headers: config?.headers,
    });
    return { data: res };
  },

  put: async <T = any>(
    endpoint: string,
    data?: any,
    config?: { headers?: Record<string, string> }
  ): Promise<{ data: T }> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const body = isFormData ? data : data !== undefined ? JSON.stringify(data) : undefined;
    const res = await fetchClient<T>(endpoint, {
      method: 'PUT',
      body,
      headers: config?.headers,
    });
    return { data: res };
  },

  delete: async <T = any>(endpoint: string): Promise<{ data: T }> => {
    const res = await fetchClient<T>(endpoint, { method: 'DELETE' });
    return { data: res };
  },
};

export default apiClient;
