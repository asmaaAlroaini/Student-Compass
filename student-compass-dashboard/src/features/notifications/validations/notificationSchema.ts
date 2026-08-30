import { z } from 'zod';

export const notificationSchema = z.object({
  title: z
    .string()
    .min(1, 'عنوان الإشعار مطلوب')
    .min(3, 'يجب أن يكون عنوان الإشعار 3 أحرف على الأقل')
    .max(150, 'العنوان طويل جداً'),
  message: z
    .string()
    .min(1, 'نص الرسالة مطلوب')
    .min(5, 'نص الرسالة يجب أن يكون 5 أحرف على الأقل')
    .max(1000, 'الرسالة طويلة جداً'),
  type: z.enum(['system', 'exam_reminder', 'announcement', 'achievement'], {
    required_error: 'نوع الإشعار مطلوب',
  }),
  target_audience: z.enum(['all', 'students', 'teachers', 'grade_3'], {
    required_error: 'الجمهور المستهدف مطلوب',
  }),
});

export type NotificationSchemaInput = z.input<typeof notificationSchema>;
export type NotificationSchemaOutput = z.output<typeof notificationSchema>;
