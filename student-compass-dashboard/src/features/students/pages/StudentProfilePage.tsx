import { useParams, Link } from 'react-router-dom';
import {
  Users,
  ArrowRight,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  FileCheck2,
  HelpCircle,
  Loader2,
  Mail,
} from 'lucide-react';
import { useUsers, useUpdateUserStatus } from '@/features/users/hooks/useUsers';
import { ROUTES } from '@/constants/routes';

export default function StudentProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const numId = Number(studentId);

  const { data: usersData, isLoading } = useUsers({ role: 'student' });
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

  const student = (usersData?.data?.data ?? []).find((u) => u.id === numId);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4 max-w-md mx-auto" dir="rtl">
        <Users className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-base font-bold text-white">لم يتم العثور على الطالب</h2>
        <p className="text-xs text-slate-400">قد يكون الحساب محذوفاً أو المعرف غير صحيح.</p>
        <Link
          to={ROUTES.DASHBOARD.STUDENTS}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
        >
          العودة لقائمة الطلاب
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.DASHBOARD.STUDENTS}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">الملف الأكاديمي للطالب</h1>
          <p className="text-xs text-slate-400 mt-0.5">تفاصيل الحساب، المستوى الدراسي، وسجل التفاعل الأكاديمي.</p>
        </div>
      </div>

      {/* ── Profile Summary Card ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c142b] to-[#080d1e] border border-white/[0.07] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-blue-500/20">
              {student.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black text-white">{student.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                  ID: #{student.id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-300" dir="ltr">{student.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>{student.grade_level || 'المرحلة الثانوية'}</span>
                </span>
                {student.track && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                    مسار {student.track}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateStatus({ id: student.id, is_active: !student.is_active })}
              disabled={isUpdatingStatus}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                student.is_active
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/20'
              }`}
            >
              {student.is_active ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  الحساب نشط (انقر للتعطيل)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  الحساب معطل (انقر للتفعيل)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.05]">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              تاريخ التسجيل
            </div>
            <div className="text-xs font-bold text-white font-mono">
              {new Date(student.created_at).toLocaleDateString('ar-EG')}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              نسبة التقدم الكلية
            </div>
            <div className="text-xs font-bold text-emerald-300 font-mono">
              68.5%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <FileCheck2 className="w-3.5 h-3.5 text-violet-400" />
              الاختبارات المجتازة
            </div>
            <div className="text-xs font-bold text-violet-300 font-mono">
              14 اختبار
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              معدل الدرجات
            </div>
            <div className="text-xs font-bold text-amber-300 font-mono">
              84.2%
            </div>
          </div>
        </div>
      </div>

      {/* ── Academic Journey Sections ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Exams history */}
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-violet-400" />
            آخر الاختبارات المقدمة
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { title: 'امتحان الفيزياء التجريبي — الوحدة الأولى', score: '92/100', status: 'اجتياز ممتاز', date: '28 أغسطس 2026' },
              { title: 'تقييم الرياضيات التراكمي', score: '78/100', status: 'اجتياز', date: '25 أغسطس 2026' },
              { title: 'اختبار الكيمياء العامة', score: '88/100', status: 'اجتياز ممتاز', date: '20 أغسطس 2026' },
            ].map((e, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#080d1e] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{e.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{e.date}</div>
                </div>
                <div className="text-left">
                  <div className="font-mono font-bold text-emerald-400">{e.score}</div>
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak spots & Questions */}
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            سجل التدريب وبنك الأسئلة
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#080d1e] border border-white/[0.05] flex items-center justify-between">
              <span className="text-slate-300">الأسئلة المحلولة في وضع التدريب</span>
              <span className="font-mono font-bold text-white">245 سؤال</span>
            </div>
            <div className="p-3 rounded-xl bg-[#080d1e] border border-white/[0.05] flex items-center justify-between">
              <span className="text-slate-300">الأسئلة الخاطئة المعاد تدريبها</span>
              <span className="font-mono font-bold text-emerald-400">18 سؤال من 22</span>
            </div>
            <div className="p-3 rounded-xl bg-[#080d1e] border border-white/[0.05] flex items-center justify-between">
              <span className="text-slate-300">الأسئلة المحفوظة في المفضلة</span>
              <span className="font-mono font-bold text-amber-400">15 سؤال</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
