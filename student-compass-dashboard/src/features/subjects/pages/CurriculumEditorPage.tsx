import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen,
  ArrowRight,
  Save,
  Video,
  FileText,
  UploadCloud,
  Loader2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { lessonSchema, type LessonSchemaOutput } from '../validations/lessonSchema';
import { useCreateLesson, useUpdateLesson, useLesson } from '../hooks/useLessons';
import { useSubjects } from '../hooks/useSubjects';
import { useUnits } from '../hooks/useUnits';
import type { Unit } from '../types/unit.types';

export default function CurriculumEditorPage() {
  const { subjectId, lessonId } = useParams<{ subjectId?: string; unitId?: string; lessonId?: string }>();
  const [searchParams] = useSearchParams();
  const queryUnitId = searchParams.get('unit_id');
  const navigate = useNavigate();

  const isEdit = !!lessonId;
  const numSubjectId = Number(subjectId) || 0;

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingPdf, setExistingPdf] = useState<string | null>(null);

  // Queries
  const { data: subjects = [] } = useSubjects();
  const { data: lessonData, isLoading: isLoadingLesson } = useLesson(lessonId);
  const { mutate: createLesson, isPending: isCreating } = useCreateLesson();
  const { mutate: updateLesson, isPending: isUpdating } = useUpdateLesson();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      subject_id: numSubjectId,
      unit_id: queryUnitId ? Number(queryUnitId) : 0,
      title: '',
      lesson_number: 1,
      order: 1,
      summary: '',
      video_url: '',
      pdf_path: '',
    },
  });

  const selectedSubjectId = watch('subject_id') || numSubjectId;

  // Units for subject
  const { data: units = [] } = useUnits(selectedSubjectId ? Number(selectedSubjectId) : undefined);

  // Populate data when editing
  useEffect(() => {
    if (lessonData?.data) {
      const l = lessonData.data;
      reset({
        subject_id: l.subject_id,
        unit_id: l.unit_id,
        title: l.title,
        lesson_number: l.lesson_number || 1,
        order: l.order || 1,
        summary: l.summary || '',
        video_url: l.video_url || '',
        pdf_path: l.pdf_path || '',
      });
      if (l.pdf_path) {
        setExistingPdf(l.pdf_path);
      }
    }
  }, [lessonData, reset]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const onSubmit: SubmitHandler<LessonSchemaOutput> = (data) => {
    const formData = new FormData();
    formData.append('subject_id', String(data.subject_id));
    formData.append('unit_id', String(data.unit_id));
    formData.append('title', data.title);
    formData.append('lesson_number', String(data.lesson_number));
    formData.append('order', String(data.order));
    if (data.summary) formData.append('summary', data.summary);
    if (data.video_url) formData.append('video_url', data.video_url);
    if (pdfFile) formData.append('pdf_file', pdfFile);

    if (isEdit && lessonId) {
      updateLesson(
        { id: lessonId, data: formData },
        {
          onSuccess: () => navigate(`/dashboard/subjects/${selectedSubjectId}`),
        }
      );
    } else {
      createLesson(formData, {
        onSuccess: () => navigate(`/dashboard/subjects/${selectedSubjectId}`),
      });
    }
  };

  if (isEdit && isLoadingLesson) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/dashboard/subjects/${numSubjectId || ''}`}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">
              {isEdit ? `تعديل الدرس: ${lessonData?.data?.title || ''}` : 'إضافة درس تعليمي جديد'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              إعداد محتوى الدرس، إرفاق الفيديو، ورفع ملخص الـ PDF.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isCreating || isUpdating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-xs font-bold transition shadow-lg shadow-primary/20 cursor-pointer"
        >
          {isCreating || isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isCreating || isUpdating ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'نشر الدرس'}
        </button>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Academic Hierarchy */}
        <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            الموقع في الهيكل التعليمي
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                المادة الدراسية <span className="text-destructive">*</span>
              </label>
              <select
                {...register('subject_id')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
              >
                <option value="0">— اختر المادة —</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.grade_level})
                  </option>
                ))}
              </select>
              {errors.subject_id && (
                <p className="text-xs text-destructive">{errors.subject_id.message}</p>
              )}
            </div>

            {/* Unit */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                الوحدة الدراسية <span className="text-destructive">*</span>
              </label>
              <select
                {...register('unit_id')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
              >
                <option value="0">— اختر الوحدة —</option>
                {units.map((u: Unit) => (
                  <option key={u.id} value={u.id}>
                    {u.title}
                  </option>
                ))}
              </select>
              {errors.unit_id && (
                <p className="text-xs text-destructive">{errors.unit_id.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Details */}
        <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            بيانات الدرس
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              عنوان الدرس <span className="text-destructive">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="مثال: الدرس الأول — قوانين نيوتن للحركة"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          {/* Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">ملخص وملاحظات الدرس</label>
            <textarea
              {...register('summary')}
              rows={3}
              placeholder="ملخص للمفاهيم الأساسية والقوانين الرياضية في هذا الدرس..."
              className="w-full p-4 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Media & Attachments */}
        <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Video className="w-4 h-4 text-violet-500" />
            الفيديو التعليمي والملفات المرفقة
          </h2>

          {/* Video URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">رابط الفيديو (YouTube / Vimeo / MP4)</label>
            <input
              {...register('video_url')}
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
              dir="ltr"
            />
            {errors.video_url && (
              <p className="text-xs text-destructive">{errors.video_url.message}</p>
            )}
          </div>

          {/* PDF Attachment */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              ملف ملخص أو مذكرة الدرس (PDF حتى 20MB)
            </label>

            {existingPdf && !pdfFile && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>ملف الـ PDF الحالي مرفق ومحفوظ</span>
                </div>
                <a
                  href={`http://127.0.0.1:8000/storage/${existingPdf}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  معاينة الملف
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border hover:border-primary/50 rounded-2xl bg-muted/20 hover:bg-muted/40 transition cursor-pointer">
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs font-semibold text-foreground">
                {pdfFile ? pdfFile.name : 'اضغط لاختيار أو استبدال ملف PDF'}
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">
                {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF حتى 20MB'}
              </span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

      </form>

    </div>
  );
}
