import { z } from 'zod';

export const questionSchema = z
  .object({
    subject_id: z
      .union([z.string().min(1, 'المادة الدراسية مطلوبة'), z.number().min(1, 'المادة الدراسية مطلوبة')])
      .transform((val) => Number(val)),
    unit_id: z
      .union([z.string().min(1, 'الوحدة الدراسية مطلوبة'), z.number().min(1, 'الوحدة الدراسية مطلوبة')])
      .transform((val) => Number(val)),
    lesson_id: z
      .union([z.string().min(1, 'الدرس مطلوب'), z.number().min(1, 'الدرس مطلوب')])
      .transform((val) => Number(val)),
    question_text: z
      .string()
      .min(1, 'نص السؤال مطلوب')
      .min(3, 'يجب أن يحتوي السؤال على 3 أحرف على الأقل'),
    type: z.enum(['mcq', 'true_false', 'essay'], {
      required_error: 'نوع السؤال مطلوب',
    }),
    options: z
      .array(
        z.object({
          text: z.string().min(1, 'نص الخيار مطلوب'),
        })
      )
      .default([]),
    correct_answer: z.string().min(1, 'يرجى تحديد الإجابة الصحيحة'),
    explanation: z.string().optional().default(''),
    difficulty: z.enum(['easy', 'medium', 'hard'], {
      required_error: 'مستوى الصعوبة مطلوب',
    }),
    year: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    source: z.string().max(255).optional().default(''),
    points: z
      .union([z.string(), z.number()])
      .default(1)
      .transform((val) => Number(val) || 1),
    question_image: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'mcq') {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'يجب إضافة خيارين على الأقل لأسئلة الاختيار من متعدد',
          path: ['options'],
        });
      }
      if (!data.correct_answer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'يجب تحديد خيار كإجابة صحيحة',
          path: ['correct_answer'],
        });
      }
    }
  });

export type QuestionSchemaInput = z.input<typeof questionSchema>;
export type QuestionSchemaOutput = z.output<typeof questionSchema>;
