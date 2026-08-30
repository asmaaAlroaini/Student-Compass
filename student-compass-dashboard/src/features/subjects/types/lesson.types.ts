export interface Lesson {
  id: number;
  unit_id: number;
  subject_id: number;
  title: string;
  lesson_number: number;
  order: number;
  summary?: string | null;
  video_url?: string | null;
  pdf_path?: string | null;
  created_at: string;
  updated_at: string;
  unit?: { id: number; title: string };
  subject?: { id: number; name: string };
  questions_count?: number;
}

export interface LessonFormData {
  unit_id: number;
  subject_id: number;
  title: string;
  lesson_number?: number;
  order?: number;
  summary?: string;
  video_url?: string;
  pdf_file?: File | null;
}

export interface LessonResponse {
  success: boolean;
  message?: string;
  data: Lesson;
}

export interface LessonsListResponse {
  success: boolean;
  data: Lesson[];
}
