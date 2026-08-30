// ── Unit Types ──

export interface Unit {
  id: number;
  subject_id: number;
  title: string;
  unit_number: number | null;
  order: number | null;
  description: string | null;
  lessons_count?: number;
  questions_count?: number;
  subject?: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export interface UnitFormData {
  subject_id: number;
  title: string;
  unit_number: number | '';
  order: number | '';
  description: string;
}

export interface UnitsListResponse {
  success: boolean;
  data: Unit[];
}

export interface UnitResponse {
  success: boolean;
  message?: string;
  data: Unit;
}
