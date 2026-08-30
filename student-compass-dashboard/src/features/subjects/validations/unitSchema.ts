import { z } from 'zod';

export const unitSchema = z.object({
  subject_id: z
    .union([z.string().min(1, 'المادة الدراسية مطلوبة'), z.number().min(1, 'المادة الدراسية مطلوبة')])
    .transform((val) => Number(val)),
  title: z
    .string()
    .min(1, 'عنوان الوحدة مطلوب')
    .min(2, 'يجب أن يكون عنوان الوحدة حرفين على الأقل')
    .max(255, 'العنوان طويل جداً'),
  unit_number: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  order: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  description: z.string().optional().default(''),
});

export type UnitSchemaInput = z.input<typeof unitSchema>;
export type UnitSchemaOutput = z.output<typeof unitSchema>;
