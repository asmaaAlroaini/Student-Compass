// ── Subject Types ──

export interface Subject {
  id: number;
  name: string;
  code: string | null;
  grade_level: string | null;
  track: string | null;
  icon: string | null;
  is_active: boolean;
  units_count?: number;
  lessons_count?: number;
  questions_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SubjectFormData {
  name: string;
  code: string;
  grade_level: string;
  track: string;
  icon: string;
  is_active: boolean;
}

export interface SubjectsListResponse {
  success: boolean;
  data: Subject[];
}

export interface SubjectResponse {
  success: boolean;
  message?: string;
  data: Subject;
}
