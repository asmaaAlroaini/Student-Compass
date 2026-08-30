import { z } from 'zod';

export const subjectSchema = z.object({
  name: z
    .string()
    .min(1, 'اسم المادة مطلوب')
    .min(2, 'يجب أن يكون اسم المادة حرفين على الأقل')
    .max(255, 'اسم المادة طويل جداً'),
  code: z.string().max(50, 'كود المادة لا يتجاوز 50 حرف').default(''),
  grade_level: z.string().max(100).default(''),
  track: z.string().max(100).default(''),
  icon: z.string().max(100).default('📘'),
  is_active: z.boolean().default(true),
});

export type SubjectSchemaInput = z.input<typeof subjectSchema>;
export type SubjectSchemaOutput = z.output<typeof subjectSchema>;
