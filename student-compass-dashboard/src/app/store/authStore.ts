import { create } from 'zustand';
import type { AuthState } from '@/types/auth';
import type { User } from '@/types/user';
import {
  clearAllAuth,
  getAccessToken,
  getUserData,
  saveAccessToken,
  saveUserData,
} from '@/lib/authStorage';

const initialToken = getAccessToken();
const initialUser = getUserData();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken && initialUser),
  isLoading: false,

  setUser: (user: User | null) => {
    if (user) {
      saveUserData(user);
    }
    set({ user, isAuthenticated: Boolean(user && getAccessToken()) });
  },

  setToken: (token: string | null) => {
    if (token) {
      saveAccessToken(token);
    }
    set({ token, isAuthenticated: Boolean(token && getUserData()) });
  },

  setAuth: (user: User, token: string, rememberMe = true) => {
    saveAccessToken(token, rememberMe);
    saveUserData(user, rememberMe);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: (partialUser: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...partialUser };
      saveUserData(updated);
      return { user: updated };
    });
  },

  logout: () => {
    clearAllAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: () => {
    const token = getAccessToken();
    const user = getUserData();
    set({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading: false,
    });
  },
}));

// Listen for global unauthorized events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}
