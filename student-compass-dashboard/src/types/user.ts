export type UserRole = 'admin' | 'teacher' | 'supervisor' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  grade_level?: string | null;
  track?: string | null;
  avatar?: string | null;
  is_active: boolean;
  notifications_enabled?: boolean;
  dark_mode?: 'light' | 'dark' | 'system';
  preferred_locale?: 'ar' | 'en';
  subscription_tier?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserSettings {
  notifications_enabled: boolean;
  dark_mode: 'light' | 'dark' | 'system';
  preferred_locale: 'ar' | 'en';
  subscription_tier: string;
}
