import type { Question } from '@/features/questions/types/question.types';

export type ExamType = 'practice' | 'assessment' | 'ministerial';

export interface ExamQuestionPivot {
  id?: number;
  question_id: number;
  marks: number;
  order?: number;
  question?: Question;
}

export interface Exam {
  id: number;
  subject_id: number;
  unit_id?: number | null;
  lesson_id?: number | null;
  title: string;
  type: ExamType;
  duration_minutes: number;
  total_marks: number;
  pass_marks: number;
  is_published: boolean;
  created_by?: number;
  subject?: { id: number; name: string };
  unit?: { id: number; title: string };
  lesson?: { id: number; title: string };
  creator?: { id: number; name: string };
  questions_count?: number;
  progress_entries_count?: number;
  questions?: (Question & { pivot?: { marks: number; order: number } })[];
  created_at: string;
  updated_at: string;
}

export interface ExamFilters {
  page?: number;
  search?: string;
  subject_id?: number | string;
  type?: ExamType | '';
}

export interface ExamsPaginatedResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Exam[];
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

export interface ExamDetailResponse {
  success: boolean;
  data: Exam;
}

export interface ExamAttemptItem {
  id: number;
  user_id: number;
  exam_id: number;
  score: number;
  total_marks: number;
  percentage: number;
  status: 'passed' | 'failed';
  time_spent_seconds?: number;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    grade_level?: string;
    track?: string;
  };
}

export interface ExamResultsResponse {
  success: boolean;
  data: {
    exam: Exam;
    total_attempts: number;
    passed_attempts: number;
    failed_attempts: number;
    average_score: number;
    pass_rate: number;
    attempts: ExamAttemptItem[];
  };
}
