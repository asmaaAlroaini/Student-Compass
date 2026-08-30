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
  BookOpen,
} from 'lucide-react';
import { questionSchema, type QuestionSchemaOutput } from '../validations/questionSchema';
import { useCreateQuestion, useUpdateQuestion, useQuestion } from '../hooks/useQuestions';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { useUnits } from '@/features/subjects/hooks/useUnits';
import type { Unit } from '@/features/subjects/types/unit.types';
import { ROUTES } from '@/constants/routes';
import type { QuestionType, QuestionDifficulty } from '../types/question.types';

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
  const selectedType = watch('type');
  const selectedCorrectAnswer = watch('correct_answer');
  const currentQuestionText = watch('question_text');
  const currentDifficulty = watch('difficulty');
  const currentOptions = watch('options');

  // Fetch units for selected subject
  const { data: units = [] } = useUnits(selectedSubjectId ? Number(selectedSubjectId) : undefined);

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
    formData.append('lesson_id', String(data.lesson_id));
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
    }

    if (imageFile) {
      formData.append('question_image_file', imageFile);
    }

    if (isEdit && questionId) {
      updateQuestion(
        { id: questionId, data: formData },
        {
          onSuccess: () => navigate(ROUTES.DASHBOARD.QUESTIONS),
        }
      );
    } else {
      createQuestion(formData, {
        onSuccess: () => navigate(ROUTES.DASHBOARD.QUESTIONS),
      });
    }
  };

  if (isEdit && isLoadingQuestion) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-sm text-slate-400">جاري تحميل بيانات السؤال...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.QUESTIONS}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {isEdit ? `تعديل السؤال #${questionId}` : 'إضافة سؤال جديد إلى بنك الأسئلة'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              قم بملء تفاصيل السؤال والخيارات والتفسير مع التحقق التلقائي من الحقول.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isCreating || isUpdating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
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
            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                الموقع في الهيكل الأكاديمي
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    المادة <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register('subject_id')}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition cursor-pointer"
                  >
                    <option value="0">— اختر المادة —</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.subject_id && (
                    <p className="text-xs text-rose-400">{errors.subject_id.message}</p>
                  )}
                </div>

                {/* Unit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    الوحدة <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register('unit_id')}
                    disabled={!selectedSubjectId}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 disabled:opacity-50 transition cursor-pointer"
                  >
                    <option value="0">— اختر الوحدة —</option>
                    {units.map((u: Unit) => (
                      <option key={u.id} value={u.id}>
                        {u.title}
                      </option>
                    ))}
                  </select>
                  {errors.unit_id && (
                    <p className="text-xs text-rose-400">{errors.unit_id.message}</p>
                  )}
                </div>

                {/* Lesson */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    الدرس <span className="text-rose-400">*</span>
                  </label>
                  <input
                    {...register('lesson_id')}
                    type="number"
                    placeholder="رقم الدرس (مثال: 1)"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition"
                  />
                  {errors.lesson_id && (
                    <p className="text-xs text-rose-400">{errors.lesson_id.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Question Text & Media */}
            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                محتوى السؤال
              </h2>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  نص السؤال <span className="text-rose-400">*</span>
                </label>
                <textarea
                  {...register('question_text')}
                  rows={4}
                  placeholder="اكتب نص السؤال بدقة هنا..."
                  className="w-full p-4 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition leading-relaxed"
                />
                {errors.question_text && (
                  <p className="text-xs text-rose-400">{errors.question_text.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  صورة توضيحية أو مخطط بياني (اختياري)
                </label>
                
                {imagePreview ? (
                  <div className="relative inline-block border border-white/10 rounded-2xl overflow-hidden p-2 bg-[#080d1e]">
                    <img
                      src={imagePreview}
                      alt="معاينة المرفق"
                      className="max-h-48 rounded-xl object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 left-4 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition cursor-pointer"
                      title="إزالة الصورة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl bg-[#080d1e]/50 hover:bg-[#080d1e] transition cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-xs font-semibold text-slate-300">اضغط لرفع صورة السؤال</span>
                    <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, WebP حتى 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Question Type & Options */}
            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  نوع السؤال والخيارات
                </h2>

                {/* Type pills */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  {[
                    { id: 'mcq', label: 'اختيار من متعدد' },
                    { id: 'true_false', label: 'صح / خطأ' },
                    { id: 'essay', label: 'مقالي' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setValue('type', t.id as QuestionType);
                        if (t.id === 'true_false') {
                          setValue('correct_answer', 'true');
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        selectedType === t.id
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MCQ Options */}
              {selectedType === 'mcq' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      أدخل الخيارات وحدد الإجابة الصحيحة بالضغط على الدائرة الخضراء:
                    </span>
                    <button
                      type="button"
                      onClick={() => append({ text: '' })}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
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
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                : 'bg-[#080d1e] border-white/10 text-slate-500 hover:text-slate-300'
                            }`}
                            title="تعيين كإجابة صحيحة"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <div className="relative flex-1">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                              {idx + 1}.
                            </span>
                            <input
                              {...register(`options.${idx}.text`)}
                              type="text"
                              placeholder={`الخيار رقم ${idx + 1}`}
                              className={`w-full pr-8 pl-4 py-2.5 rounded-xl bg-[#080d1e] border text-sm text-white placeholder:text-slate-600 focus:outline-none transition ${
                                isCorrect
                                  ? 'border-emerald-500/40 bg-emerald-500/[0.02]'
                                  : 'border-white/[0.08] focus:border-blue-500/60'
                              }`}
                            />
                          </div>

                          {fields.length > 2 && (
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
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
                    <p className="text-xs text-rose-400">{errors.options.message}</p>
                  )}
                  {errors.correct_answer && (
                    <p className="text-xs text-rose-400">{errors.correct_answer.message}</p>
                  )}
                </div>
              )}

              {/* True/False selection */}
              {selectedType === 'true_false' && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">حدد الإجابة الصحيحة:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue('correct_answer', 'true')}
                      className={`p-4 rounded-2xl border text-center font-bold text-sm transition cursor-pointer ${
                        selectedCorrectAnswer === 'true'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                          : 'bg-[#080d1e] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      ✓ صواب (True)
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('correct_answer', 'false')}
                      className={`p-4 rounded-2xl border text-center font-bold text-sm transition cursor-pointer ${
                        selectedCorrectAnswer === 'false'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10'
                          : 'bg-[#080d1e] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      ✗ خطأ (False)
                    </button>
                  </div>
                </div>
              )}

              {/* Essay Answer */}
              {selectedType === 'essay' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">الإجابة النموذجية / مفتاح التصحيح</label>
                  <textarea
                    {...register('correct_answer')}
                    rows={3}
                    placeholder="اكتب الإجابة النموذجية أو الكلمات المفتاحية للتصحيح..."
                    className="w-full p-3 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition"
                  />
                  {errors.correct_answer && (
                    <p className="text-xs text-rose-400">{errors.correct_answer.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                تفسير الإجابة وشرح الحل (Explanation)
              </h2>
              <textarea
                {...register('explanation')}
                rows={3}
                placeholder="تفسير علمي يظهر للطالب بعد إجابة السؤال يشرح سبب صحة الإجابة..."
                className="w-full p-3.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition leading-relaxed"
              />
            </div>
          </div>

          {/* ── Right Sidebar / Settings & Preview (1 col) ── */}
          <div className="space-y-5">

            {/* Attributes & Metadata Card */}
            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">خصائص السؤال</h2>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">مستوى الصعوبة</label>
                <select
                  {...register('difficulty')}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition cursor-pointer"
                >
                  <option value="easy">سهل (Easy)</option>
                  <option value="medium">متوسط (Medium)</option>
                  <option value="hard">صعب (Hard)</option>
                </select>
              </div>

              {/* Points */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">درجة / نقاط السؤال</label>
                <input
                  {...register('points')}
                  type="number"
                  min={1}
                  max={50}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition"
                />
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">السنة الوزارية (اختياري)</label>
                <input
                  {...register('year')}
                  type="number"
                  placeholder="مثال: 2024"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition"
                />
              </div>

              {/* Source */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">المصدر / نموذج الامتحان</label>
                <input
                  {...register('source')}
                  type="text"
                  placeholder="مثال: النموذج الوزاري الأول 2024"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition"
                />
              </div>
            </div>

            {/* Live Student Preview Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-bl from-blue-600/10 via-[#0c142b] to-[#0c142b] border border-blue-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  معاينة مظهر الطالب
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  {currentDifficulty}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080d1e] border border-white/[0.05] space-y-3">
                <p className="text-xs font-bold text-white leading-relaxed">
                  {currentQuestionText || 'نص السؤال سيظهر هنا...'}
                </p>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="معاينة"
                    className="max-h-32 rounded-lg object-contain mx-auto"
                  />
                )}

                {selectedType === 'mcq' && (
                  <div className="space-y-1.5">
                    {currentOptions?.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg text-[11px] border flex items-center justify-between ${
                          opt.text === selectedCorrectAnswer && opt.text
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-bold'
                            : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
                        }`}
                      >
                        <span>{opt.text || `خيار ${i + 1}`}</span>
                        {opt.text === selectedCorrectAnswer && opt.text && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </form>

    </div>
  );
}
