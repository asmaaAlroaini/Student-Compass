import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, BookOpen, Loader2, UploadCloud, Video, FileText } from 'lucide-react';
import { lessonSchema, type LessonSchemaOutput } from '../validations/lessonSchema';
import { useCreateLesson, useUpdateLesson } from '../hooks/useLessons';
import type { Lesson } from '../types/lesson.types';

interface LessonModalProps {
  open: boolean;
  subjectId: number;
  unitId: number;
  unitTitle?: string;
  lesson?: Lesson | null;
  onClose: () => void;
}

export function LessonModal({
  open,
  subjectId,
  unitId,
  unitTitle,
  lesson,
  onClose,
}: LessonModalProps) {
  const isEdit = !!lesson;
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const { mutate: createLesson, isPending: isCreating } = useCreateLesson();
  const { mutate: updateLesson, isPending: isUpdating } = useUpdateLesson();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      subject_id: subjectId,
      unit_id: unitId,
      title: lesson?.title || '',
      lesson_number: lesson?.lesson_number || 1,
      order: lesson?.order || 1,
      summary: lesson?.summary || '',
      video_url: lesson?.video_url || '',
      pdf_path: lesson?.pdf_path || '',
    },
  });

  useEffect(() => {
    if (lesson) {
      reset({
        subject_id: subjectId,
        unit_id: unitId,
        title: lesson.title,
        lesson_number: lesson.lesson_number || 1,
        order: lesson.order || 1,
        summary: lesson.summary || '',
        video_url: lesson.video_url || '',
        pdf_path: lesson.pdf_path || '',
      });
    } else {
      reset({
        subject_id: subjectId,
        unit_id: unitId,
        title: '',
        lesson_number: 1,
        order: 1,
        summary: '',
        video_url: '',
        pdf_path: '',
      });
    }
    setPdfFile(null);
  }, [lesson, unitId, subjectId, open, reset]);

  if (!open) return null;

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const onSubmit: SubmitHandler<LessonSchemaOutput> = (data) => {
    const formData = new FormData();
    formData.append('subject_id', String(subjectId));
    formData.append('unit_id', String(unitId));
    formData.append('title', data.title);
    formData.append('lesson_number', String(data.lesson_number));
    formData.append('order', String(data.order));
    if (data.summary) formData.append('summary', data.summary);
    if (data.video_url) formData.append('video_url', data.video_url);
    if (pdfFile) formData.append('pdf_file', pdfFile);

    if (isEdit && lesson) {
      updateLesson(
        { id: lesson.id, data: formData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createLesson(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? 'تعديل بيانات الدرس' : 'إضافة درس تعليمي جديد'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {unitTitle ? `تابع لـ: ${unitTitle}` : 'أدخل بيانات الدرس والمحتوى التعليمي'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              عنوان الدرس <span className="text-destructive">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="مثال: الدرس الأول — مقدمة في الحركة الدائرية"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Number & Order */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">رقم الدرس</label>
              <input
                {...register('lesson_number')}
                type="number"
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">ترتيب العرض</label>
              <input
                {...register('order')}
                type="number"
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Video URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-blue-500" />
              رابط الشرح المرئي (YouTube / Vimeo - اختياري)
            </label>
            <input
              {...register('video_url')}
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
              dir="ltr"
            />
          </div>

          {/* PDF File Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              ملف الملزمة / ملخص الـ PDF (اختياري)
            </label>
            <div className="relative border border-dashed border-border rounded-2xl p-4 text-center hover:bg-muted/30 transition">
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center gap-1.5">
                <UploadCloud className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  {pdfFile ? pdfFile.name : lesson?.pdf_path ? 'تم رفع ملف مسبقاً (انقر للاستبدال)' : 'انقر لرفع ملف PDF للملخص'}
                </span>
                <span className="text-[10px] text-muted-foreground">الحد الأقصى 20 ميجابايت</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">ملخص وأهداف الدرس</label>
            <textarea
              {...register('summary')}
              rows={3}
              placeholder="أهم النقاط والمفاهيم والقوانين التي يتعلمها الطالب في هذا الدرس..."
              className="w-full p-3 rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
              {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديل' : 'إضافة الدرس'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LessonModal;
