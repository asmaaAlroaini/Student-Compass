import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Plus,
  Search,
  BookOpen,
  Clock,
  Award,
  Users,
  Trash2,
  Pencil,
  BarChart2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useExams, useDeleteExam } from '../hooks/useExams';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { ROUTES } from '@/constants/routes';
import type { Exam, ExamType } from '../types/exam.types';

const typeConfig: Record<ExamType, { label: string; color: string }> = {
  practice: { label: 'تجريبي', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  assessment: { label: 'تقييمي', color: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  ministerial: { label: 'وزاري شامل', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
};

function DeleteExamModal({
  exam,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  exam: Exam;
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
            <h3 className="text-sm font-bold text-white">تأكيد حذف الامتحان</h3>
            <p className="text-xs text-slate-400 mt-0.5">هذا الإجراء سيحذف الاختبار وسجلاته</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 bg-rose-500/5 border border-rose-500/15 rounded-xl p-3">
          هل أنت متأكد من حذف امتحان <strong className="text-rose-300">"{exam.title}"</strong>؟
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isDeleting ? 'جاري الحذف...' : 'حذف الامتحان'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExamsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ExamType | ''>('');
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);

  // Queries
  const { data: subjects = [] } = useSubjects();
  const { data: examsData, isLoading, isError } = useExams({
    page,
    search: search || undefined,
    subject_id: selectedSubject || undefined,
    type: selectedType || undefined,
  });

  const { mutate: deleteExam, isPending: isDeleting } = useDeleteExam();

  const exams = examsData?.data?.data ?? [];
  const pagination = examsData?.data;

  // KPIs
  const totalExams = pagination?.total ?? 0;
  const practiceCount = exams.filter((e) => e.type === 'practice').length;
  const assessmentCount = exams.filter((e) => e.type === 'assessment').length;
  const ministerialCount = exams.filter((e) => e.type === 'ministerial').length;

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteExam(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-6" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck2 className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-black text-white tracking-tight">إدارة الامتحانات والاختبارات</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
              Exam CMS
            </span>
          </div>
          <p className="text-sm text-slate-400">
            تصميم وبناء الاختبارات التجريبية والوزارية وتتبع نتائج وتقديمات الطلاب.
          </p>
        </div>

        <Link
          to={ROUTES.DASHBOARD.EXAMS_CREATE}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/20"
        >
          <Plus className="w-4 h-4" />
          إنشاء امتحان جديد
        </Link>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الامتحانات', value: totalExams, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: FileCheck2 },
          { label: 'امتحانات تجريبية', value: practiceCount, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: BookOpen },
          { label: 'امتحانات تقييمية', value: assessmentCount, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: Award },
          { label: 'نماذج وزارية', value: ministerialCount, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Sparkles },
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
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="البحث في عنوان الامتحان..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition"
            dir="rtl"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 cursor-pointer transition"
          dir="rtl"
        >
          <option value="">كل المواد</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value as ExamType | '');
            setPage(1);
          }}
          className="px-3 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 cursor-pointer transition"
          dir="rtl"
        >
          <option value="">كل الأنواع</option>
          <option value="practice">تجريبي</option>
          <option value="assessment">تقييمي</option>
          <option value="ministerial">وزاري شامل</option>
        </select>
      </div>

      {/* ── Error State ── */}
      {isError && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300 text-center">
          ⚠️ تعذر جلب الامتحانات. تأكد من تشغيل الخادم والاتصال.
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-2xl bg-[#0c142b] border border-white/[0.07] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isLoading ? 'جاري التحميل...' : `عرض ${exams.length} من إجمالي ${totalExams} امتحان`}
          </span>
          {(search || selectedSubject || selectedType) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedSubject('');
                setSelectedType('');
                setPage(1);
              }}
              className="text-xs text-violet-400 hover:text-violet-300 transition cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">الامتحان</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">المادة والوحدة</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">النوع</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">المدة والدرجات</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">المحاولات</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-white/[0.04] animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-3/4" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-white/[0.05] rounded-lg w-1/2" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-16" /></td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 bg-white/[0.05] rounded-lg w-20" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 bg-white/[0.05] rounded-lg w-14" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-slate-500 text-sm">
                    {totalExams === 0
                      ? 'لا توجد اختبارات مضافة بعد. ابدأ بإنشاء أول امتحان.'
                      : 'لا توجد نتائج مطابقة لبحثك.'}
                  </td>
                </tr>
              ) : (
                exams.map((exam) => {
                  const typeCfg = typeConfig[exam.type] ?? typeConfig.practice;
                  return (
                    <tr key={exam.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                      {/* Title */}
                      <td className="px-4 py-3.5 max-w-sm">
                        <Link
                          to={`/dashboard/exams/${exam.id}/results`}
                          className="text-sm font-bold text-white hover:text-violet-300 transition line-clamp-1"
                        >
                          {exam.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span>#{exam.id}</span>
                          <span>• {exam.questions_count ?? (exam.questions?.length || 0)} سؤال</span>
                          {exam.is_published ? (
                            <span className="text-emerald-400">✓ منشور</span>
                          ) : (
                            <span className="text-amber-400">مسودة</span>
                          )}
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                          {exam.subject?.name || '—'}
                        </div>
                        {exam.unit?.title && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{exam.unit.title}</div>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${typeCfg.color}`}>
                          {typeCfg.label}
                        </span>
                      </td>

                      {/* Duration & Marks */}
                      <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-slate-300">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{exam.duration_minutes} دقيقة</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {exam.total_marks} درجة (نجاح: {exam.pass_marks})
                        </div>
                      </td>

                      {/* Attempts */}
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                          <Users className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{exam.progress_entries_count ?? 0} تقديم</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/dashboard/exams/${exam.id}/results`}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 transition"
                            title="عرض النتائج والتحليلات"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/dashboard/exams/edit/${exam.id}`}
                            className="p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 border border-violet-500/20 transition"
                            title="تعديل الامتحان"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(exam)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition cursor-pointer"
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

        {/* ── Pagination ── */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-4 py-3 border-t border-white/[0.05] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              السابقة
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
              التالية
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteExamModal
          exam={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
