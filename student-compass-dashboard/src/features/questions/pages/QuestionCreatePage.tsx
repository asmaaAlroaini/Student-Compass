import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  HelpCircle,
  ArrowRight,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Sparkles,
  Layers,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { questionSchema, type QuestionSchemaOutput } from '../validations/questionSchema';
import { useCreateQuestion, useUpdateQuestion, useQuestion } from '../hooks/useQuestions';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { useUnits } from '@/features/subjects/hooks/useUnits';
import { useLessonsByUnit } from '@/features/subjects/hooks/useLessons';
import type { Unit } from '@/features/subjects/types/unit.types';
import { ROUTES } from '@/constants/routes';
import type { QuestionType, QuestionDifficulty } from '../types/question.types';
import { toast } from 'sonner';

export default function QuestionCreatePage() {
  const { questionId } = useParams<{ questionId?: string }>();
  const isEdit = !!questionId;
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Queries
  const { data: questionData, isLoading: isLoadingQuestion } = useQuestion(questionId);
  const { data: subjects = [] } = useSubjects();
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      subject_id: 0,
      unit_id: 0,
      lesson_id: 0,
      question_text: '',
      type: 'mcq' as QuestionType,
      options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
      correct_answer: '',
      explanation: '',
      difficulty: 'medium' as QuestionDifficulty,
      year: undefined as number | undefined,
      source: '',
      points: 1,
      question_image: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const selectedSubjectId = watch('subject_id');
  const selectedUnitId = watch('unit_id');
  const selectedType = watch('type');
  const selectedCorrectAnswer = watch('correct_answer');
  const currentQuestionText = watch('question_text');
  const currentDifficulty = watch('difficulty');

  // Fetch units for selected subject
  const { data: units = [] } = useUnits(selectedSubjectId ? Number(selectedSubjectId) : undefined);

  // Fetch lessons for selected unit
  const { data: lessonsRes, isLoading: loadingLessons } = useLessonsByUnit(
    selectedSubjectId ? Number(selectedSubjectId) : undefined,
    selectedUnitId ? Number(selectedUnitId) : undefined
  );
  const availableLessons = lessonsRes?.data ?? [];

  // Set initial data when editing
  useEffect(() => {
    if (questionData?.data) {
      const q = questionData.data;
      let opts: { text: string }[] = [];
      if (Array.isArray(q.options)) {
        opts = q.options.map((o) => (typeof o === 'string' ? { text: o } : { text: o.text || '' }));
      } else if (q.options && typeof q.options === 'object') {
        opts = Object.values(q.options).map((v) => ({ text: String(v) }));
      }
      if (opts.length === 0) {
        opts = [{ text: '' }, { text: '' }];
      }

      reset({
        subject_id: q.subject_id,
        unit_id: q.unit_id ?? 0,
        lesson_id: q.lesson_id ?? 0,
        question_text: q.question_text,
        type: q.type,
        options: opts,
        correct_answer: q.correct_answer,
        explanation: q.explanation ?? '',
        difficulty: q.difficulty,
        year: q.year ?? undefined,
        source: q.source ?? '',
        points: q.points ?? 1,
        question_image: q.question_image ?? '',
      });

      if (q.question_image) {
        setImagePreview(
          q.question_image.startsWith('http')
            ? q.question_image
            : `http://127.0.0.1:8000/storage/${q.question_image}`
        );
      }
    }
  }, [questionData, reset]);

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue('question_image', '');
  };

  const onSubmit: SubmitHandler<QuestionSchemaOutput> = (data) => {
    const formData = new FormData();
    formData.append('subject_id', String(data.subject_id));
    formData.append('unit_id', String(data.unit_id));
    if (data.lesson_id) {
      formData.append('lesson_id', String(data.lesson_id));
    }
    formData.append('question_text', data.question_text);
    formData.append('type', data.type);
    formData.append('correct_answer', data.correct_answer);
    formData.append('difficulty', data.difficulty);
    formData.append('points', String(data.points));
    if (data.explanation) formData.append('explanation', data.explanation);
    if (data.year) formData.append('year', String(data.year));
    if (data.source) formData.append('source', data.source);

    if (data.type === 'mcq') {
      data.options.forEach((opt, idx) => {
        formData.append(`options[${idx}]`, opt.text);
      });
    } else if (data.type === 'true_false') {
      formData.append('options[0]', 'صح');
      formData.append('options[1]', 'خطأ');
    }

    if (imageFile) {
      formData.append('question_image_file', imageFile);
    }

    const handleError = (err: any) => {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((field) => {
          const msgs = serverErrors[field];
          const errorMsg = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
          setError(field as any, {
            type: 'server',
            message: errorMsg,
          });
        });
        toast.error('يرجى مراجعة الحقول المحددة باللون الأحمر وتصحيحها.');
      }
    };

    if (isEdit && questionId) {
      updateQuestion(
        { id: questionId, data: formData },
        {
          onSuccess: () => navigate(ROUTES.DASHBOARD.QUESTIONS),
          onError: handleError,
        }
      );
    } else {
      createQuestion(formData, {
        onSuccess: () => navigate(ROUTES.DASHBOARD.QUESTIONS),
        onError: handleError,
      });
    }
  };

  const isTrueSelected =
    selectedCorrectAnswer === 'صح' ||
    selectedCorrectAnswer === 'true' ||
    selectedCorrectAnswer === 'صواب';

  const isFalseSelected =
    selectedCorrectAnswer === 'خطأ' ||
    selectedCorrectAnswer === 'false' ||
    selectedCorrectAnswer === 'خطأ';

  if (isEdit && isLoadingQuestion) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">جاري تحميل بيانات السؤال...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.QUESTIONS}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">
              {isEdit ? `تعديل السؤال #${questionId}` : 'إضافة سؤال جديد إلى بنك الأسئلة'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              قم بملء تفاصيل السؤال والخيارات والتفسير مع التحقق التلقائي المباشر من صحة الحقول.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isCreating || isUpdating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-xs font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          {isCreating || isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isCreating || isUpdating ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'حفظ السؤال'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left/Main Form (2 cols) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Academic Structure Cascades */}
            <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                الموقع في الهيكل الأكاديمي
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    المادة <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('subject_id')}
                    className={`w-full px-3 py-2.5 rounded-xl bg-background border text-sm text-foreground focus:outline-none transition cursor-pointer ${
                      errors.subject_id
                        ? 'border-destructive ring-2 ring-destructive/20 focus:ring-destructive/30'
                        : 'border-input focus:border-primary'
                    }`}
                  >
                    <option value="0">— اختر المادة —</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade_level})
                      </option>
                    ))}
                  </select>
                  {errors.subject_id && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {errors.subject_id.message}
                    </p>
                  )}
                </div>

                {/* Unit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    الوحدة <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('unit_id')}
                    disabled={!selectedSubjectId}
                    className={`w-full px-3 py-2.5 rounded-xl bg-background border text-sm text-foreground focus:outline-none disabled:opacity-50 transition cursor-pointer ${
                      errors.unit_id
                        ? 'border-destructive ring-2 ring-destructive/20 focus:ring-destructive/30'
                        : 'border-input focus:border-primary'
                    }`}
                  >
                    <option value="0">— اختر الوحدة —</option>
                    {units.map((u: Unit) => (
                      <option key={u.id} value={u.id}>
                        {u.title}
                      </option>
                    ))}
                  </select>
                  {errors.unit_id && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {errors.unit_id.message}
                    </p>
                  )}
                </div>

                {/* Lesson Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    الدرس التابع للوحدة <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('lesson_id')}
                    disabled={!selectedUnitId}
                    className={`w-full px-3 py-2.5 rounded-xl bg-background border text-sm text-foreground focus:outline-none disabled:opacity-50 transition cursor-pointer ${
                      errors.lesson_id
                        ? 'border-destructive ring-2 ring-destructive/20 focus:ring-destructive/30'
                        : 'border-input focus:border-primary'
                    }`}
                  >
                    <option value="0">
                      {loadingLessons
                        ? 'جاري تحميل الدروس...'
                        : availableLessons.length === 0
                        ? '— درس عام / تلقائي —'
                        : '— اختر الدرس —'}
                    </option>
                    {availableLessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.lesson_number ? `درس ${l.lesson_number}: ` : ''}{l.title}
                      </option>
                    ))}
                  </select>
                  {errors.lesson_id && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {errors.lesson_id.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Question Text & Media */}
            <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                محتوى السؤال
              </h2>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  نص السؤال <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...register('question_text')}
                  rows={4}
                  placeholder="اكتب نص السؤال بدقة ووضوح هنا..."
                  className={`w-full p-4 rounded-xl bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition leading-relaxed resize-none ${
                    errors.question_text
                      ? 'border-destructive ring-2 ring-destructive/20 focus:ring-destructive/30'
                      : 'border-input focus:border-primary'
                  }`}
                />
                {errors.question_text && (
                  <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errors.question_text.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  صورة توضيحية أو مخطط بياني (اختياري)
                </label>
                
                {imagePreview ? (
                  <div className="relative inline-block border border-border rounded-2xl overflow-hidden p-2 bg-muted/30">
                    <img
                      src={imagePreview}
                      alt="Question Preview"
                      className="max-h-48 rounded-xl object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 left-4 p-1.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition shadow cursor-pointer"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-border rounded-2xl p-4 text-center hover:bg-muted/20 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-1.5">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-foreground font-semibold">اسحب الصورة هنا أو انقر للرفع</span>
                      <span className="text-[11px] text-muted-foreground">PNG, JPG, WebP حتى 5 ميجابايت</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Options / Answers Based on Type */}
            <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  خيارات الإجابة وتحديد الحل الصحيح
                </h2>
                <span className="text-xs text-muted-foreground font-mono">نوع السؤال: {selectedType}</span>
              </div>

              {/* MCQ Options */}
              {selectedType === 'mcq' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      أدخل الخيارات وحدد الإجابة الصحيحة بالضغط على علامة الصح الخضراء:
                    </span>
                    <button
                      type="button"
                      onClick={() => append({ text: '' })}
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة خيار
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {fields.map((field, idx) => {
                      const optionText = watch(`options.${idx}.text`);
                      const isCorrect = selectedCorrectAnswer === optionText && optionText !== '';
                      return (
                        <div key={field.id} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setValue('correct_answer', optionText || '')}
                            className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                            }`}
                            title="تعيين كإجابة صحيحة"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <div className="relative flex-1">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                              {idx + 1}.
                            </span>
                            <input
                              {...register(`options.${idx}.text`)}
                              type="text"
                              placeholder={`نص الخيار رقم ${idx + 1}`}
                              className={`w-full pr-8 pl-4 py-2.5 rounded-xl bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition ${
                                isCorrect
                                  ? 'border-emerald-500/60 bg-emerald-500/[0.04]'
                                  : 'border-input focus:border-primary'
                              }`}
                            />
                          </div>

                          {fields.length > 2 && (
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="p-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition cursor-pointer"
                              title="حذف الخيار"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {errors.options && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {errors.options.message}
                    </p>
                  )}
                  {errors.correct_answer && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {errors.correct_answer.message}
                    </p>
                  )}
                </div>
              )}

              {/* True/False selection */}
              {selectedType === 'true_false' && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-foreground block">حدد الإجابة الصحيحة:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue('correct_answer', 'صح')}
                      className={`p-4 rounded-2xl border text-center font-bold text-sm transition cursor-pointer ${
                        isTrueSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10'
                          : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      ✓ صواب (صح)
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('correct_answer', 'خطأ')}
                      className={`p-4 rounded-2xl border text-center font-bold text-sm transition cursor-pointer ${
                        isFalseSelected
                          ? 'bg-destructive/20 border-destructive text-destructive shadow-lg shadow-destructive/10'
                          : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      ✗ خطأ
                    </button>
                  </div>
                  {errors.correct_answer && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {errors.correct_answer.message}
                    </p>
                  )}
                </div>
              )}

              {/* Essay Answer */}
              {selectedType === 'essay' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">الإجابة النموذجية / مفتاح التصحيح</label>
                  <textarea
                    {...register('correct_answer')}
                    rows={3}
                    placeholder="اكتب الإجابة النموذجية أو الكلمات المفتاحية للتصحيح..."
                    className="w-full p-3 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
                  />
                  {errors.correct_answer && (
                    <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {errors.correct_answer.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-3 shadow-sm">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                تفسير الإجابة وشرح الحل (Explanation)
              </h2>
              <textarea
                {...register('explanation')}
                rows={3}
                placeholder="تفسير علمي يظهر للطالب بعد إجابة السؤال يشرح سبب صحة الإجابة..."
                className="w-full p-3.5 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition leading-relaxed resize-none"
              />
            </div>

          </div>

          {/* ── Right Sidebar / Question Properties ── */}
          <div className="space-y-5">
            <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">خصائص السؤال</h2>

              {/* Question Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">نوع السؤال</label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                >
                  <option value="mcq">اختيار من متعدد (MCQ)</option>
                  <option value="true_false">صح وخطأ (True/False)</option>
                  <option value="essay">سؤال مقالي (Essay)</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">مستوى الصعوبة</label>
                <select
                  {...register('difficulty')}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                >
                  <option value="easy">سهل (Easy)</option>
                  <option value="medium">متوسط (Medium)</option>
                  <option value="hard">صعب (Hard)</option>
                </select>
              </div>

              {/* Points */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>درجة / نقاط السؤال</span>
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                </label>
                <input
                  {...register('points')}
                  type="number"
                  min={1}
                  max={20}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
                />
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">السنة الوزارية (اختياري)</label>
                <input
                  {...register('year')}
                  type="number"
                  placeholder="2024"
                  min={2000}
                  max={2030}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                />
              </div>

              {/* Source */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">المصدر / نموذج الامتحان</label>
                <input
                  {...register('source')}
                  type="text"
                  placeholder="مثال: امتحان وزاري 2024 الدور الأول"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            {/* Preview Summary Box */}
            <div className="p-5 rounded-3xl bg-muted/30 border border-border space-y-3">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                معاينة مظهر الطالب
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {currentQuestionText || 'اكتب نص السؤال لمشاهدة المعاينة هنا...'}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                <span className="px-2 py-0.5 rounded-md bg-background border border-border">
                  {currentDifficulty}
                </span>
                <span>{selectedType}</span>
              </div>
            </div>

          </div>

        </div>
      </form>

    </div>
  );
}
