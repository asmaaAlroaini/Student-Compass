import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  FileSpreadsheet,
  Download,
  Search,
  Trash2,
  Pencil,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  X,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useQuestions, useDeleteQuestion, useDownloadTemplate } from '../hooks/useQuestions';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { ROUTES } from '@/constants/routes';
import type { Question, QuestionDifficulty } from '../types/question.types';

// ── Difficulty configuration ──
const difficultyBadgeMap: Record<QuestionDifficulty, { label: string; color: string }> = {
  easy: { label: 'سهل', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  medium: { label: 'متوسط', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  hard: { label: 'صعب', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
};

const typeLabelMap: Record<string, string> = {
  mcq: 'اختيار من متعدد',
  true_false: 'صح / خطأ',
  essay: 'مقالي',
};

// ── Delete Confirmation Modal ──
function DeleteQuestionModal({
  question,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  question: Question;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-card text-card-foreground border border-border rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-destructive/15 border border-destructive/25 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">تأكيد حذف السؤال</h3>
            <p className="text-xs text-muted-foreground mt-0.5">سيتم إزالة السؤال من بنك الأسئلة والامتحانات المرتبطة</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground bg-destructive/10 border border-destructive/20 rounded-xl p-3 line-clamp-3 leading-relaxed">
          "{question.question_text}"
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 disabled:opacity-60 text-destructive-foreground text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-destructive/20"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isDeleting ? 'جاري الحذف...' : 'حذف السؤال'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Question Preview Modal ──
function QuestionDetailsModal({
  question,
  onClose,
  onEdit,
}: {
  question: Question;
  onClose: () => void;
  onEdit: (q: Question) => void;
}) {
  const diff = difficultyBadgeMap[question.difficulty] ?? difficultyBadgeMap.medium;

  let parsedOptions: string[] = [];
  if (Array.isArray(question.options)) {
    parsedOptions = question.options.map((opt) => (typeof opt === 'string' ? opt : opt.text || JSON.stringify(opt)));
  } else if (question.options && typeof question.options === 'object') {
    parsedOptions = Object.values(question.options);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card text-card-foreground border border-border rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">معاينة السؤال #{question.id}</h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>
                  {diff.label}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {typeLabelMap[question.type] || question.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {question.subject?.name || 'مادة عامة'} {question.unit?.title ? `• ${question.unit.title}` : ''}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">نص السؤال:</span>
            <p className="text-base font-bold text-foreground leading-relaxed">{question.question_text}</p>
            
            {question.question_image && (
              <div className="mt-3 pt-3 border-t border-border">
                <img
                  src={question.question_image.startsWith('http') ? question.question_image : `http://127.0.0.1:8000/storage/${question.question_image}`}
                  alt="مرفق السؤال"
                  className="max-h-56 rounded-xl border border-border object-contain mx-auto"
                />
              </div>
            )}
          </div>

          {/* Options / Choices */}
          {question.type === 'mcq' && parsedOptions.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">الخيارات المتاحة:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {parsedOptions.map((opt, idx) => {
                  const isCorrect = String(opt).trim() === String(question.correct_answer).trim();
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-sm transition-all ${
                        isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'bg-muted/30 border-border text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-mono">
                          {idx + 1}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          صحيحة
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* True / False */}
          {question.type === 'true_false' && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-muted-foreground">الإجابة الصحيحة:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold ${
                  question.correct_answer === 'true' || question.correct_answer === 'صح'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-destructive/10 border-destructive/30 text-destructive'
                }`}
              >
                {question.correct_answer === 'true' || question.correct_answer === 'صح' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    صح (True)
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    خطأ (False)
                  </>
                )}
              </span>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                تفسير الإجابة النموذجية:
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Meta details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground block">النقاط</span>
              <span className="text-sm font-bold text-foreground">{question.points} نقطة</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground block">السنة الوزارية</span>
              <span className="text-sm font-bold text-foreground">{question.year || 'عام'}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground block">المصدر</span>
              <span className="text-xs font-bold text-foreground truncate block mt-0.5">{question.source || 'بنك الأسئلة'}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground block">تاريخ الإضافة</span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">{new Date(question.created_at).toLocaleDateString('ar-EG')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(question);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            تعديل السؤال
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuestionBankListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | ''>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  // Queries
  const { data: subjectsData } = useSubjects();
  const { data: questionsData, isLoading, isError } = useQuestions({
    page,
    search: search || undefined,
    subject_id: selectedSubject || undefined,
    difficulty: selectedDifficulty || undefined,
    year: selectedYear || undefined,
  });

  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();
  const { mutate: downloadTemplate, isPending: isDownloading } = useDownloadTemplate();

  const questions = questionsData?.data?.data ?? [];
  const pagination = questionsData?.data;
  const subjects = subjectsData ?? [];

  const totalQuestionsCount = pagination?.total ?? 0;
  const easyCount = useMemo(() => questions.filter((q) => q.difficulty === 'easy').length, [questions]);
  const mediumCount = useMemo(() => questions.filter((q) => q.difficulty === 'medium').length, [questions]);
  const hardCount = useMemo(() => questions.filter((q) => q.difficulty === 'hard').length, [questions]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteQuestion(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black text-foreground tracking-tight">بنك الأسئلة المركزي</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              بنك الأسئلة المعتمد
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            إدارة والبحث المتقدم في كافة الأسئلة والخيارات والنماذج الوزارية والتقييمية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => downloadTemplate()}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-all border border-border cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            قالب Excel
          </button>

          <Link
            to={ROUTES.DASHBOARD.QUESTIONS_IMPORT}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all border border-emerald-500/30"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            استيراد جماعي
          </Link>

          <Link
            to={ROUTES.DASHBOARD.QUESTIONS_CREATE}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            إضافة سؤال
          </Link>
        </div>
      </div>

      {/* ── KPI Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الأسئلة', value: totalQuestionsCount, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: HelpCircle },
          { label: 'سهل (في الصفحة)', value: easyCount, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
          { label: 'متوسط (في الصفحة)', value: mediumCount, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Sparkles },
          { label: 'صعب (في الصفحة)', value: hardCount, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: AlertTriangle },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-foreground">{isLoading ? '—' : s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث في نص السؤال أو المصدر..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
            dir="rtl"
          />
        </div>

        {/* Subject filter */}
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition-all"
          dir="rtl"
        >
          <option value="">كل المواد</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name} ({sub.grade_level})
            </option>
          ))}
        </select>

        {/* Difficulty filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => {
            setSelectedDifficulty(e.target.value as QuestionDifficulty | '');
            setPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition-all"
          dir="rtl"
        >
          <option value="">كل الصعوبات</option>
          <option value="easy">سهل</option>
          <option value="medium">متوسط</option>
          <option value="hard">صعب</option>
        </select>

        {/* Year filter */}
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition-all"
          dir="rtl"
        >
          <option value="">كل السنوات</option>
          {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* ── Error State ── */}
      {isError && (
        <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
          ⚠️ تعذر جلب الأسئلة. تأكد من تشغيل الخادم وصلاحيات الحساب.
        </div>
      )}

      {/* ── Questions Table ── */}
      <div className="rounded-3xl bg-card text-card-foreground border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground font-semibold">
            {isLoading ? 'جاري التحميل...' : `عرض ${questions.length} من إجمالي ${totalQuestionsCount} سؤال`}
          </span>
          {(search || selectedSubject || selectedDifficulty || selectedYear) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedSubject('');
                setSelectedDifficulty('');
                setSelectedYear('');
                setPage(1);
              }}
              className="text-xs text-primary hover:underline transition-colors cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">السؤال</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">المادة والوحدة</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">النوع</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">الصعوبة</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">السنة / المصدر</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-border/40 animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded-lg w-3/4" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-muted rounded-lg w-1/2" /></td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 bg-muted rounded-lg w-16" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded-lg w-12" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 bg-muted rounded-lg w-20" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded-lg w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground text-sm">
                    {totalQuestionsCount === 0
                      ? 'لا توجد أسئلة مضافة بعد. ابدأ بإضافة سؤال أو استيراد ملف الأسئلة.'
                      : 'لا توجد نتائج مطابقة لبحثك. جرب تعديل الفلاتر.'}
                  </td>
                </tr>
              ) : (
                questions.map((q) => {
                  const diff = difficultyBadgeMap[q.difficulty] ?? difficultyBadgeMap.medium;
                  return (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors group">
                      {/* Question Text */}
                      <td className="px-4 py-3.5 max-w-md">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setPreviewQuestion(q)}
                            className="text-sm font-semibold text-foreground hover:text-primary text-right line-clamp-2 transition-colors cursor-pointer"
                          >
                            {q.question_text}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                          <span>#{q.id}</span>
                          <span>• {q.points} نقطة</span>
                          {q.question_image && <span className="text-primary">🖼️ يحتوي صورة</span>}
                        </div>
                      </td>

                      {/* Subject / Unit */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          {q.subject?.name || '—'}
                        </div>
                        {q.unit?.title && (
                          <div className="text-[11px] text-muted-foreground mt-0.5">{q.unit.title}</div>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground bg-muted border border-border px-2 py-1 rounded-md">
                          {typeLabelMap[q.type] || q.type}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-lg border ${diff.color}`}>
                          {diff.label}
                        </span>
                      </td>

                      {/* Year / Source */}
                      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-muted-foreground">
                        <div>{q.year ? `وزاري ${q.year}` : 'تقييمي'}</div>
                        {q.source && <div className="text-[11px] text-muted-foreground truncate max-w-[120px]">{q.source}</div>}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewQuestion(q)}
                            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
                            title="معاينة السؤال"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/dashboard/question-bank/edit/${q.id}`}
                            className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all"
                            title="تعديل"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(q)}
                            className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 transition-all cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-5 py-3.5 border-t border-border/60 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card hover:bg-muted disabled:opacity-40 text-xs font-semibold text-foreground border border-border transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              الصفحة السابقة
            </button>

            <span className="text-xs text-muted-foreground font-semibold">
              صفحة {pagination.current_page} من {pagination.last_page}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
              disabled={page >= pagination.last_page}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card hover:bg-muted disabled:opacity-40 text-xs font-semibold text-foreground border border-border transition cursor-pointer"
            >
              الصفحة التالية
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {previewQuestion && (
        <QuestionDetailsModal
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          onEdit={(q) => navigate(`/dashboard/question-bank/edit/${q.id}`)}
        />
      )}

      {deleteTarget && (
        <DeleteQuestionModal
          question={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
