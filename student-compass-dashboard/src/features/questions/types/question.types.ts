export type QuestionType = 'mcq' | 'true_false' | 'essay';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOptionItem {
  id?: string | number;
  text: string;
  is_correct?: boolean;
}

export interface Question {
  id: number;
  subject_id: number;
  unit_id?: number | null;
  lesson_id?: number | null;
  question_text: string;
  question_image?: string | null;
  type: QuestionType;
  options?: any;
  correct_answer: string;
  explanation?: string | null;
  difficulty: QuestionDifficulty;
  year?: number | null;
  source?: string | null;
  points: number;
  created_by?: number | null;
  subject?: { id: number; name: string };
  unit?: { id: number; title: string };
  lesson?: { id: number; title: string };
  created_at: string;
  updated_at: string;
}

export interface QuestionFilters {
  page?: number;
  search?: string;
  subject_id?: number | string;
  unit_id?: number | string;
  lesson_id?: number | string;
  difficulty?: QuestionDifficulty | '';
  year?: number | string;
  source?: string;
}

export interface QuestionsPaginatedResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Question[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

export interface QuestionDetailResponse {
  success: boolean;
  data: Question;
}

export interface BulkImportPreviewRow {
  row_number?: number;
  subject_id?: number | string;
  unit_id?: number | string;
  lesson_id?: number | string;
  question_text: string;
  type: string;
  options?: string[] | Record<string, string>;
  correct_answer: string;
  explanation?: string;
  difficulty: string;
  year?: number;
  source?: string;
  points?: number;
  status?: 'valid' | 'invalid';
  errors?: string[];
}

export interface BulkImportPreviewResponse {
  success: boolean;
  message?: string;
  data: {
    total_rows: number;
    valid_count: number;
    invalid_count: number;
    valid_questions: BulkImportPreviewRow[];
    invalid_questions: BulkImportPreviewRow[];
    all_rows?: BulkImportPreviewRow[];
  };
}

export interface BulkImportConfirmResponse {
  success: boolean;
  message: string;
  imported_count: number;
}
