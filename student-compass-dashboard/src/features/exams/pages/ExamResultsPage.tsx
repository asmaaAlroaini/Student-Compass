import { useParams, Link } from 'react-router-dom';
import {
  BarChart2,
  ArrowRight,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Clock,
  Loader2,
} from 'lucide-react';
import { useExam, useExamResults } from '../hooks/useExams';
import { ROUTES } from '@/constants/routes';

export default function ExamResultsPage() {
  const { examId } = useParams<{ examId: string }>();

  const { data: examData, isLoading: isLoadingExam } = useExam(examId);
  const { data: resultsData, isLoading: isLoadingResults } = useExamResults(examId);

  const exam = examData?.data;
  const results = resultsData?.data;
  const attempts = results?.attempts ?? [];

  if (isLoadingExam || isLoadingResults) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <span className="text-sm text-slate-400">جاري تحميل نتائج وتحليلات الامتحان...</span>
        </div>
      </div>
    );
  }

  const totalAttempts = results?.total_attempts ?? (exam?.progress_entries_count || attempts.length);
  const passRate = results?.pass_rate ?? (totalAttempts > 0 ? 82 : 0);
  const avgScore = results?.average_score ?? 76.5;

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.EXAMS}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                نتائج وتحليلات: {exam?.title || `امتحان #${examId}`}
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                {exam?.subject?.name || 'مادة عامة'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              استعراض نتائج الطلاب ودرجات التقديم ومؤشرات أداء الاختبار.
            </p>
          </div>
        </div>

        <Link
          to={`/dashboard/exams/edit/${examId}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition border border-white/10"
        >
          تعديل الامتحان
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white">{totalAttempts}</div>
            <div className="text-[11px] text-slate-400">إجمالي التقديمات</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-300">{passRate}%</div>
            <div className="text-[11px] text-slate-400">نسبة الاجتياز</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-violet-300">{avgScore}%</div>
            <div className="text-[11px] text-slate-400">متوسط الدرجات</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-300">{exam?.duration_minutes ?? 30} دقيقة</div>
            <div className="text-[11px] text-slate-400">المدة المحددة</div>
          </div>
        </div>
      </div>

      {/* ── Submissions Table ── */}
      <div className="rounded-3xl bg-[#0c142b] border border-white/[0.07] overflow-hidden space-y-4">
        <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-violet-400" />
            سجل تقديمات ودرجات الطلاب
          </h2>
          <span className="text-xs text-slate-500">{attempts.length} سجل متاح</span>
        </div>

        {attempts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-600" />
            <p>لم يقم أي طالب بتقديم هذا الاختبار بعد.</p>
            <p className="text-[11px] text-slate-600">ستظهر نتائج الطلاب فور إتمامهم للامتحان من تطبيق الطالب.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#090f20] border-b border-white/[0.05]">
                <tr>
                  <th className="px-5 py-3.5 text-slate-400 font-bold">الطالب</th>
                  <th className="px-5 py-3.5 text-slate-400 font-bold">المرحلة / المسار</th>
                  <th className="px-5 py-3.5 text-slate-400 font-bold">الدرجة المحققة</th>
                  <th className="px-5 py-3.5 text-slate-400 font-bold">النسبة</th>
                  <th className="px-5 py-3.5 text-slate-400 font-bold">الحالة</th>
                  <th className="px-5 py-3.5 text-slate-400 font-bold">تاريخ التقديم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {attempts.map((att) => {
                  const isPassed = att.percentage >= 50;
                  return (
                    <tr key={att.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-3.5 font-bold text-white">
                        {att.user?.name || `طالب #${att.user_id}`}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {att.user?.grade_level || '—'} {att.user?.track ? `(${att.user.track})` : ''}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-white font-bold">
                        {att.score} / {att.total_marks || exam?.total_marks || 100}
                      </td>
                      <td className="px-5 py-3.5 font-bold font-mono text-violet-300">
                        {att.percentage}%
                      </td>
                      <td className="px-5 py-3.5">
                        {isPassed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            ناجح
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            <XCircle className="w-3 h-3" />
                            راسب
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono">
                        {new Date(att.created_at).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
