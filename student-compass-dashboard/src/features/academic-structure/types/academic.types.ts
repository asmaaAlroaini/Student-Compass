// ── Academic Structure Types ──

export interface GradeLevel {
  id: string;         // e.g. "الثالث الثانوي"
  name: string;
  tracks: string[];
  subjects_count?: number;
}

export interface Track {
  id: string;         // e.g. "علمي"
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
