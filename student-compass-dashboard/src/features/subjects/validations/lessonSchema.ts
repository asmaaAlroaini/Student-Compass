import { z } from 'zod';

export const lessonSchema = z.object({
  subject_id: z
    .union([z.string().min(1, 'المادة الدراسية مطلوبة'), z.number().min(1, 'المادة الدراسية مطلوبة')])
    .transform((val) => Number(val)),
  unit_id: z
    .union([z.string().min(1, 'الوحدة الدراسية مطلوبة'), z.number().min(1, 'الوحدة الدراسية مطلوبة')])
    .transform((val) => Number(val)),
  title: z
    .string()
    .min(1, 'عنوان الدرس مطلوب')
    .min(2, 'يجب أن يكون عنوان الدرس حرفين على الأقل')
    .max(255, 'عنوان الدرس طويل جداً'),
  lesson_number: z
    .union([z.string(), z.number()])
    .default(1)
    .transform((val) => Number(val) || 1),
  order: z
    .union([z.string(), z.number()])
    .default(1)
    .transform((val) => Number(val) || 1),
  summary: z.string().optional().default(''),
  video_url: z
    .string()
    .optional()
    .default('')
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://') || val.includes('youtube') || val.includes('youtu.be'),
      {
        message: 'يرجى إدخال رابط فيديو صالح (مثال: https://youtube.com/...)',
      }
    ),
  pdf_path: z.string().optional().default(''),
});

export type LessonSchemaInput = z.input<typeof lessonSchema>;
export type LessonSchemaOutput = z.output<typeof lessonSchema>;
