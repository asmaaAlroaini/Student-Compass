import { z } from 'zod';

export interface Competition {
  id: number;
  title: string;
  subject_id?: number | null;
  subject?: { id: number; name: string };
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_marks: number;
  participants_count?: number;
  status: 'upcoming' | 'active' | 'ended';
  prizes_summary?: string;
  created_at: string;
}

export interface LeaderboardUser {
  rank: number;
  user_id: number;
  name: string;
  email: string;
  avatar?: string;
  grade_level?: string;
  total_points: number;
  exams_completed: number;
  success_rate: number;
  badge?: string;
}

export const competitionSchema = z
  .object({
    title: z
      .string()
      .min(1, 'عنوان المسابقة مطلوب')
      .min(3, 'يجب أن يكون عنوان المسابقة 3 أحرف على الأقل')
      .max(255, 'العنوان طويل جداً'),
    subject_id: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    start_time: z.string().min(1, 'تاريخ ووقت بدء المسابقة مطلوب'),
    end_time: z.string().min(1, 'تاريخ ووقت انتهاء المسابقة مطلوب'),
    duration_minutes: z
      .union([z.string(), z.number()])
      .default(30)
      .transform((val) => Number(val) || 30),
    total_marks: z
      .union([z.string(), z.number()])
      .default(100)
      .transform((val) => Number(val) || 100),
    prizes_summary: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.start_time && data.end_time) {
      const start = new Date(data.start_time).getTime();
      const end = new Date(data.end_time).getTime();
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'تاريخ انتهاء المسابقة يجب أن يكون بعد تاريخ البدء',
          path: ['end_time'],
        });
      }
    }
  });

export type CompetitionSchemaInput = z.input<typeof competitionSchema>;
export type CompetitionSchemaOutput = z.output<typeof competitionSchema>;
