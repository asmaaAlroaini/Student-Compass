import type { User } from '@/types/user';

const ACCESS_TOKEN_KEY = 'student_compass_token';
const USER_DATA_KEY = 'student_compass_user';
const REMEMBER_ME_KEY = 'student_compass_remember_me';

export const getRememberMeValue = (): boolean => {
  try {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  } catch {
    return false;
  }
};

export const saveRememberMeValue = (rememberMe: boolean): void => {
  try {
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
  } catch {
    // Ignore storage quota errors
  }
};

export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

export const saveAccessToken = (token: string, rememberMe?: boolean): void => {
  try {
    const isRemember = rememberMe !== undefined ? rememberMe : getRememberMeValue();
    if (isRemember) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    } else {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
};

export const removeAccessToken = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Ignore errors
  }
};

export const getUserData = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY) || sessionStorage.getItem(USER_DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const saveUserData = (user: User, rememberMe?: boolean): void => {
  try {
    const isRemember = rememberMe !== undefined ? rememberMe : getRememberMeValue();
    const serialized = JSON.stringify(user);
    if (isRemember) {
      localStorage.setItem(USER_DATA_KEY, serialized);
      sessionStorage.removeItem(USER_DATA_KEY);
    } else {
      sessionStorage.setItem(USER_DATA_KEY, serialized);
      localStorage.removeItem(USER_DATA_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

export const removeUserData = (): void => {
  try {
    localStorage.removeItem(USER_DATA_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
  } catch {
    // Ignore errors
  }
};

export const clearAllAuth = (): void => {
  removeAccessToken();
  removeUserData();
};
