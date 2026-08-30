// ── Academic Structure & Grade Levels Types ──

export interface GradeLevel {
  id: string | number;
  name: string;
  code?: string | null;
  order?: number;
  tracks: string[];
  subjects_count?: number;
  students_count?: number;
}

export interface AdminGradeLevel {
  id: number;
  name: string;
  code: string | null;
  order: number;
  tracks: string[];
  description: string | null;
  is_active: boolean;
  subjects_count?: number;
  students_count?: number;
  subjects?: {
    id: number;
    name: string;
    code: string;
    grade_level: string;
    track: string | null;
    is_active: boolean;
    units_count?: number;
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface Track {
  id: string;
  name: string;
  grade_level?: string;
  subjects_count?: number;
}

export interface EducationalOptionsResponse {
  success: boolean;
  data: {
    grade_levels: GradeLevel[];
    tracks: Track[];
  };
}

export interface AdminGradeLevelsResponse {
  success: boolean;
  data: AdminGradeLevel[];
}

export interface AdminGradeLevelSingleResponse {
  success: boolean;
  message?: string;
  data: AdminGradeLevel;
}

export interface CreateGradeLevelPayload {
  name: string;
  code?: string;
  order?: number;
  tracks?: string[];
  description?: string;
  is_active?: boolean;
}

export type UpdateGradeLevelPayload = Partial<CreateGradeLevelPayload>;

export interface AssignSubjectsPayload {
  subject_ids?: number[];
  track?: string | null;
  assignments?: { subject_id: number; track?: string | null }[];
}
