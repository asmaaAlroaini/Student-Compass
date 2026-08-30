import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileCheck2,
  ArrowRight,
  Save,
  Trash2,
  Search,
  BookOpen,
  CheckCircle2,
  Loader2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { examSchema, type ExamSchemaOutput } from '../validations/examSchema';
import { useCreateExam, useUpdateExam, useExam } from '../hooks/useExams';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { useUnits } from '@/features/subjects/hooks/useUnits';
import { useQuestions } from '@/features/questions/hooks/useQuestions';
import { ROUTES } from '@/constants/routes';
import type { ExamType } from '../types/exam.types';
import type { Question } from '@/features/questions/types/question.types';
import type { Unit } from '@/features/subjects/types/unit.types';

interface SelectedQuestionEntry {
  question_id: number;
  marks: number;
  order: number;
  question_text?: string;
  type?: string;
  difficulty?: string;
}

export default function ExamBuilderPage() {
  const { examId } = useParams<{ examId?: string }>();
  const isEdit = !!examId;
  const navigate = useNavigate();

  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestionEntry[]>([]);

  // Queries
  const { data: examData, isLoading: isLoadingExam } = useExam(examId);
  const { data: subjects = [] } = useSubjects();
  const { mutate: createExam, isPending: isCreating } = useCreateExam();
  const { mutate: updateExam, isPending: isUpdating } = useUpdateExam();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      subject_id: 0,
      unit_id: undefined as number | undefined,
      lesson_id: undefined as number | undefined,
      type: 'practice' as ExamType,
      duration_minutes: 30,
      total_marks: 100,
      pass_marks: 50,
      is_published: true,
      questions: [] as { question_id: number; marks: number; order?: number }[],
    },
  });

  const selectedSubjectId = watch('subject_id');
  const durationMinutes = watch('duration_minutes');
  const totalMarks = watch('total_marks');
  const isPublished = watch('is_published');

  // Units for chosen subject
  const { data: units = [] } = useUnits(selectedSubjectId ? Number(selectedSubjectId) : undefined);

  // Questions from Question Bank filtered by subject
  const { data: bankData, isLoading: isLoadingBank } = useQuestions({
    subject_id: selectedSubjectId ? Number(selectedSubjectId) : undefined,
    search: questionSearch || undefined,
  });

  const bankQuestions = bankData?.data?.data ?? [];

  // Populate data when editing
  useEffect(() => {
    if (examData?.data) {
      const e = examData.data;
      const loadedQuestions: SelectedQuestionEntry[] = (e.questions ?? []).map((q, idx) => ({
        question_id: q.id,
        marks: q.pivot?.marks || 1,
        order: q.pivot?.order || idx + 1,
        question_text: q.question_text,
        type: q.type,
        difficulty: q.difficulty,
      }));

      setSelectedQuestions(loadedQuestions);

      reset({
        title: e.title,
        subject_id: e.subject_id,
        unit_id: e.unit_id ?? undefined,
        lesson_id: e.lesson_id ?? undefined,
        type: e.type,
        duration_minutes: e.duration_minutes,
        total_marks: e.total_marks,
        pass_marks: e.pass_marks,
        is_published: e.is_published,
        questions: loadedQuestions.map((q) => ({
          question_id: q.question_id,
          marks: q.marks,
          order: q.order,
        })),
      });
    }
  }, [examData, reset]);

  // Keep form questions synced with selectedQuestions state
  useEffect(() => {
    setValue(
      'questions',
      selectedQuestions.map((q, i) => ({
        question_id: q.question_id,
        marks: Number(q.marks) || 1,
        order: i + 1,
      })),
      { shouldValidate: true }
    );
  }, [selectedQuestions, setValue]);

  // Toggle question in/out of exam
  const handleToggleQuestion = (q: Question) => {
    setSelectedQuestions((prev) => {
      const exists = prev.some((item) => item.question_id === q.id);
      if (exists) {
        return prev.filter((item) => item.question_id !== q.id);
      } else {
        const defaultMark = Math.max(1, Math.floor(Number(totalMarks || 100) / (prev.length + 1)));
        return [
          ...prev,
          {
            question_id: q.id,
            marks: defaultMark,
            order: prev.length + 1,
            question_text: q.question_text,
            type: q.type,
            difficulty: q.difficulty,
          },
        ];
      }
    });
  };

  // Update marks for a specific question
  const handleUpdateMarks = (questionId: number, marks: number) => {
    setSelectedQuestions((prev) =>
      prev.map((q) => (q.question_id === questionId ? { ...q, marks: Math.max(1, marks) } : q))
    );
  };

  // Remove question from selection
  const handleRemoveQuestion = (questionId: number) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.question_id !== questionId));
  };

  // Calculate allocated marks sum
  const allocatedMarksSum = useMemo(() => {
    return selectedQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  }, [selectedQuestions]);

  const onSubmit: SubmitHandler<ExamSchemaOutput> = (data) => {
    const payload = {
      title: data.title,
      subject_id: data.subject_id,
      unit_id: data.unit_id || null,
      lesson_id: data.lesson_id || null,
      type: data.type,
      duration_minutes: data.duration_minutes,
      total_marks: data.total_marks,
      pass_marks: data.pass_marks,
      is_published: data.is_published,
      questions: data.questions,
    };

    if (isEdit && examId) {
      updateExam(
        { id: examId, data: payload },
        {
          onSuccess: () => navigate(ROUTES.DASHBOARD.EXAMS),
        }
      );
    } else {
      createExam(payload, {
        onSuccess: () => navigate(ROUTES.DASHBOARD.EXAMS),
      });
    }
  };

  if (isEdit && isLoadingExam) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <span className="text-sm text-slate-400">جاري تحميل بيانات الامتحان...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.EXAMS}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {isEdit ? `تعديل الامتحان #${examId}` : 'منشئ ومصمم الامتحانات الذكي'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              تحديد الخصائص، ربط الأسئلة من بنك الأسئلة، وتوزيع الدرجات التلقائي.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isCreating || isUpdating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-xs font-bold transition shadow-lg shadow-violet-600/20 cursor-pointer"
        >
          {isCreating || isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isCreating || isUpdating ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'نشر الامتحان'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column / Basic Settings (1 col) ── */}
          <div className="space-y-5">

            {/* Basic Info */}
            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-violet-400" />
                بيانات الامتحان الأساسية
              </h2>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  عنوان الامتحان <span className="text-rose-400">*</span>
                </label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="مثال: الاختبار التجريبي الأول - الفيزياء 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition"
                />
                {errors.title && (
                  <p className="text-xs text-rose-400">{errors.title.message}</p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  المادة الدراسية <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register('subject_id')}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/60 transition cursor-pointer"
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

              {/* Unit (optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">الوحدة (اختياري)</label>
                <select
                  {...register('unit_id')}
                  disabled={!selectedSubjectId}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/60 disabled:opacity-50 transition cursor-pointer"
                >
                  <option value="">— كامل المنهج / بدون تحديد —</option>
                  {units.map((u: Unit) => (
                    <option key={u.id} value={u.id}>
                      {u.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">نوع الامتحان</label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/60 transition cursor-pointer"
                >
                  <option value="practice">تجريبي (تدريب مفتوح)</option>
                  <option value="assessment">تقييمي (محدد بوقت ورصد درجات)</option>
                  <option value="ministerial">وزاري شامل (محاكاة الاختبار الوزاري)</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>مدة الامتحان (بالدقائق)</span>
                  <span className="text-violet-300 font-mono font-bold">{durationMinutes} دقيقة</span>
                </label>
                <input
                  {...register('duration_minutes')}
                  type="number"
                  min={5}
                  max={300}
                  step={5}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/60 transition"
                />
                {errors.duration_minutes && (
                  <p className="text-xs text-rose-400">{errors.duration_minutes.message}</p>
                )}
              </div>

              {/* Total Marks & Pass Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">الدرجة الكلية</label>
                  <input
                    {...register('total_marks')}
                    type="number"
                    min={1}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/60 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">درجة النجاح</label>
                  <input
                    {...register('pass_marks')}
                    type="number"
                    min={1}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/60 transition"
                  />
                </div>
              </div>
              {errors.pass_marks && (
                <p className="text-xs text-rose-400">{errors.pass_marks.message}</p>
              )}

              {/* Published toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <div className="text-xs font-semibold text-white">حالة النشر</div>
                  <div className="text-[10px] text-slate-400">
                    {isPublished ? 'متاح للطلاب فوراً' : 'مسودة غير مرئية'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('is_published', !isPublished)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 cursor-pointer ${
                    isPublished ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: isPublished ? '22px' : '2px' }}
                  />
                </button>
              </div>

            </div>

            {/* Summary Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-bl from-violet-600/15 via-[#0c142b] to-[#0c142b] border border-violet-500/20 space-y-3">
              <h3 className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ملخص هيكل الاختبار
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>عدد الأسئلة المختارة:</span>
                  <span className="font-bold text-white">{selectedQuestions.length} سؤال</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>مجموع الدرجات الموزعة:</span>
                  <span
                    className={`font-bold ${
                      allocatedMarksSum === Number(totalMarks)
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {allocatedMarksSum} / {totalMarks}
                  </span>
                </div>
                {allocatedMarksSum !== Number(totalMarks) && (
                  <p className="text-[11px] text-amber-300/80 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    ⚠️ تنبيه: مجموع درجات الأسئلة ({allocatedMarksSum}) لا يطابق الدرجة الكلية ({totalMarks}).
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* ── Right Column / Questions Selector & List (2 cols) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Selected Questions Section */}
            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  أسئلة الامتحان المختارة ({selectedQuestions.length})
                </h2>
                {errors.questions && (
                  <span className="text-xs text-rose-400 font-semibold">{errors.questions.message}</span>
                )}
              </div>

              {selectedQuestions.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-slate-500 text-xs space-y-2">
                  <HelpCircle className="w-8 h-8 mx-auto text-slate-600" />
                  <p>لم يتم اختيار أي أسئلة للاختبار بعد.</p>
                  <p className="text-[11px] text-slate-600">اختر أسئلة من بنك الأسئلة بالأسفل لإضافتها.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {selectedQuestions.map((sq, idx) => (
                    <div
                      key={sq.question_id}
                      className="p-3 rounded-xl bg-[#080d1e] border border-white/[0.06] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center font-mono text-slate-400 text-[11px] shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-white font-medium truncate">{sq.question_text || `سؤال #${sq.question_id}`}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-[11px]">الدرجة:</span>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={sq.marks}
                            onChange={(e) => handleUpdateMarks(sq.question_id, Number(e.target.value))}
                            className="w-14 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-center font-bold text-white text-xs focus:outline-none focus:border-violet-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(sq.question_id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                          title="إزالة من الامتحان"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bank Question Picker */}
            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  اختيار من بنك الأسئلة
                </h2>
                <div className="relative max-w-xs">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="بحث في بنك الأسئلة..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60"
                  />
                </div>
              </div>

              {/* Questions List from Bank */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {isLoadingBank ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-16 rounded-xl bg-white/[0.03] animate-pulse" />
                  ))
                ) : bankQuestions.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    {!selectedSubjectId
                      ? 'اختر مادة دراسية أولاً لعرض الأسئلة المتاحة في بنك الأسئلة.'
                      : 'لا توجد أسئلة متوفرة لهذه المادة. يمكنك إضافة أسئلة من قسم بنك الأسئلة.'}
                  </div>
                ) : (
                  bankQuestions.map((q) => {
                    const isSelected = selectedQuestions.some((item) => item.question_id === q.id);
                    return (
                      <div
                        key={q.id}
                        onClick={() => handleToggleQuestion(q)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition cursor-pointer ${
                          isSelected
                            ? 'bg-violet-600/15 border-violet-500/40 text-violet-200'
                            : 'bg-[#080d1e] border-white/[0.05] hover:bg-white/[0.02] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-violet-600 focus:ring-0 cursor-pointer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white truncate">{q.question_text}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                              <span>#{q.id}</span>
                              <span>• {q.type}</span>
                              <span>• {q.difficulty}</span>
                              {q.year && <span>• وزاري {q.year}</span>}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                            isSelected
                              ? 'bg-violet-600 text-white'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ مضاف' : '+ إضافة'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      </form>

    </div>
  );
}
