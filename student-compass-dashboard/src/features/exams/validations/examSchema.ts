import { z } from 'zod';

export const examSchema = z
  .object({
    title: z
      .string()
      .min(1, 'عنوان الامتحان مطلوب')
      .min(3, 'يجب أن يكون عنوان الامتحان 3 أحرف على الأقل')
      .max(255, 'العنوان طويل جداً'),
    subject_id: z
      .union([z.string().min(1, 'المادة الدراسية مطلوبة'), z.number().min(1, 'المادة الدراسية مطلوبة')])
      .transform((val) => Number(val)),
    unit_id: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    lesson_id: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    type: z.enum(['practice', 'assessment', 'ministerial'], {
      required_error: 'نوع الامتحان مطلوب (تجريبي / تقييمي / وزاري)',
    }),
    duration_minutes: z
      .union([z.string(), z.number()])
      .default(30)
      .transform((val) => Number(val) || 30)
      .refine((val) => val >= 5 && val <= 300, {
        message: 'مدة الامتحان يجب أن تكون بين 5 و 300 دقيقة',
      }),
    total_marks: z
      .union([z.string(), z.number()])
      .default(100)
      .transform((val) => Number(val) || 100),
    pass_marks: z
      .union([z.string(), z.number()])
      .default(50)
      .transform((val) => Number(val) || 50),
    is_published: z.boolean().default(true),
    questions: z
      .array(
        z.object({
          question_id: z.number().min(1),
          marks: z.number().min(1, 'الدرجة يجب أن تكون 1 على الأقل'),
          order: z.number().optional().default(1),
        })
      )
      .min(1, 'يجب إضافة سؤال واحد على الأقل للامتحان'),
  })
  .superRefine((data, ctx) => {
    if (data.pass_marks > data.total_marks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'درجة النجاح لا يمكن أن تتجاوز الدرجة الكلية للامتحان',
        path: ['pass_marks'],
      });
    }
  });

export type ExamSchemaInput = z.input<typeof examSchema>;
export type ExamSchemaOutput = z.output<typeof examSchema>;
