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
  easy: { label: 'سهل', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  medium: { label: 'متوسط', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  hard: { label: 'صعب', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[#0d1632] border border-white/[0.09] rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">تأكيد حذف السؤال</h3>
            <p className="text-xs text-slate-400 mt-0.5">سيتم إزالة السؤال من بنك الأسئلة والامتحانات المرتبطة</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 bg-rose-500/5 border border-rose-500/15 rounded-xl p-3 line-clamp-3">
          "{question.question_text}"
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
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

  // Normalize options array
  let parsedOptions: string[] = [];
  if (Array.isArray(question.options)) {
    parsedOptions = question.options.map((opt) => (typeof opt === 'string' ? opt : opt.text || JSON.stringify(opt)));
  } else if (question.options && typeof question.options === 'object') {
    parsedOptions = Object.values(question.options);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0d1632] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-gradient-to-l from-blue-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">معاينة السؤال #{question.id}</h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>
                  {diff.label}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {typeLabelMap[question.type] || question.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {question.subject?.name || 'مادة عامة'} {question.unit?.title ? `• ${question.unit.title}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-xs font-semibold text-slate-400">نص السؤال:</span>
            <p className="text-base font-bold text-white leading-relaxed">{question.question_text}</p>
            
            {question.question_image && (
              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <img
                  src={question.question_image.startsWith('http') ? question.question_image : `http://127.0.0.1:8000/storage/${question.question_image}`}
                  alt="مرفق السؤال"
                  className="max-h-56 rounded-xl border border-white/10 object-contain mx-auto"
                />
              </div>
            )}
          </div>

          {/* Options / Choices */}
          {question.type === 'mcq' && parsedOptions.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">الخيارات المتاحة:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {parsedOptions.map((opt, idx) => {
                  const isCorrect = String(opt).trim() === String(question.correct_answer).trim();
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-sm transition-all ${
                        isCorrect
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200 font-semibold'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs text-slate-400 font-mono">
                          {idx + 1}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
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

          {/* True / False representation */}
          {question.type === 'true_false' && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-400">الإجابة الصحيحة:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold ${
                  question.correct_answer === 'true' || question.correct_answer === 'صح'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
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
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <Sparkles className="w-3.5 h-3.5" />
                تفسير الإجابة النموذجية:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Meta details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-slate-500 block">النقاط</span>
              <span className="text-sm font-bold text-white">{question.points} نقطة</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-slate-500 block">السنة الوزارية</span>
              <span className="text-sm font-bold text-white">{question.year || 'عام'}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-slate-500 block">المصدر</span>
              <span className="text-xs font-bold text-slate-300 truncate block mt-0.5">{question.source || 'بنك الأسئلة'}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[10px] text-slate-500 block">تاريخ الإضافة</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{new Date(question.created_at).toLocaleDateString('ar-EG')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.07] bg-white/[0.01]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(question);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
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

  // Summary KPIs
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
    <div className="space-y-6" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-black text-white tracking-tight">بنك الأسئلة المركزي</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
              50,000+ سؤال وزاري
            </span>
          </div>
          <p className="text-sm text-slate-400">
            إدارة والبحث المتقدم في كافة الأسئلة والخيارات والنماذج الوزارية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => downloadTemplate()}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all border border-white/10 cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            قالب Excel
          </button>

          <Link
            to={ROUTES.DASHBOARD.QUESTIONS_IMPORT}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 text-xs font-bold transition-all border border-emerald-500/30"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            استيراد جماعي
          </Link>

          <Link
            to={ROUTES.DASHBOARD.QUESTIONS_CREATE}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            إضافة سؤال
          </Link>
        </div>
      </div>

      {/* ── KPI Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الأسئلة', value: totalQuestionsCount, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: HelpCircle },
          { label: 'سهل (في الصفحة)', value: easyCount, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
          { label: 'متوسط (في الصفحة)', value: mediumCount, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Sparkles },
          { label: 'صعب (في الصفحة)', value: hardCount, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: AlertTriangle },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">{isLoading ? '—' : s.value}</div>
              <div className="text-[11px] text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="البحث في نص السؤال أو المصدر..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
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
          className="px-3 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 cursor-pointer transition-all"
          dir="rtl"
        >
          <option value="">كل المواد</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
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
          className="px-3 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 cursor-pointer transition-all"
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
          className="px-3 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 cursor-pointer transition-all"
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
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300 text-center">
          ⚠️ تعذر جلب الأسئلة. تأكد من تشغيل الخادم وصلاحيات الحساب.
        </div>
      )}

      {/* ── Questions Table ── */}
      <div className="rounded-2xl bg-[#0c142b] border border-white/[0.07] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
          <span className="text-xs text-slate-400">
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
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">السؤال</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">المادة والوحدة</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">النوع</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">الصعوبة</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">السنة / المصدر</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-white/[0.04] animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-3/4" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-white/[0.05] rounded-lg w-1/2" /></td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 bg-white/[0.05] rounded-lg w-16" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-12" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 bg-white/[0.05] rounded-lg w-20" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-slate-500 text-sm">
                    {totalQuestionsCount === 0
                      ? 'لا توجد أسئلة مضافة بعد. ابدأ بإضافة سؤال أو استيراد ملف الأسئلة.'
                      : 'لا توجد نتائج مطابقة لبحثك. جرب تعديل الفلاتر.'}
                  </td>
                </tr>
              ) : (
                questions.map((q) => {
                  const diff = difficultyBadgeMap[q.difficulty] ?? difficultyBadgeMap.medium;
                  return (
                    <tr key={q.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                      {/* Question Text */}
                      <td className="px-4 py-3.5 max-w-md">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setPreviewQuestion(q)}
                            className="text-sm font-semibold text-white hover:text-blue-300 text-right line-clamp-2 transition-colors cursor-pointer"
                          >
                            {q.question_text}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span>#{q.id}</span>
                          <span>• {q.points} نقطة</span>
                          {q.question_image && <span className="text-blue-400">🖼️ يحتوي صورة</span>}
                        </div>
                      </td>

                      {/* Subject / Unit */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                          {q.subject?.name || '—'}
                        </div>
                        {q.unit?.title && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{q.unit.title}</div>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-slate-400 bg-white/[0.03] border border-white/[0.06] px-2 py-1 rounded-md">
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
                      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-slate-400">
                        <div>{q.year ? `وزاري ${q.year}` : 'تقييمي'}</div>
                        {q.source && <div className="text-[11px] text-slate-500 truncate max-w-[120px]">{q.source}</div>}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewQuestion(q)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="معاينة السؤال"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/dashboard/question-bank/edit/${q.id}`}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-all"
                            title="تعديل"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(q)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
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
          <div className="px-4 py-3 border-t border-white/[0.05] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              الصفحة السابقة
            </button>

            <span className="text-xs text-slate-400">
              صفحة {pagination.current_page} من {pagination.last_page}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
              disabled={page >= pagination.last_page}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 text-xs font-semibold text-slate-300 transition cursor-pointer"
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
