import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
  FileCheck2,
  HelpCircle,
  Loader2,
  Mail,
} from 'lucide-react';
import { useUsers, useUpdateUserStatus } from '@/features/users/hooks/useUsers';
import { ROUTES } from '@/constants/routes';

export default function TeacherDetailsPage() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const numId = Number(teacherId);

  const { data: usersData, isLoading } = useUsers({ role: 'teacher' });
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

  const teacher = (usersData?.data?.data ?? []).find((u) => u.id === numId);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-12 text-center rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4 max-w-md mx-auto" dir="rtl">
        <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-base font-bold text-white">لم يتم العثور على المعلم</h2>
        <p className="text-xs text-slate-400">قد يكون الحساب محذوفاً أو المعرف غير صحيح.</p>
        <Link
          to={ROUTES.DASHBOARD.TEACHERS}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
        >
          العودة لقائمة المعلمين
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.DASHBOARD.TEACHERS}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">الملف المهني للمعلم / المشرف</h1>
          <p className="text-xs text-slate-400 mt-0.5">تفاصيل الحساب، الصلاحيات، وإحصائيات المحتوى المُنشأ.</p>
        </div>
      </div>

      {/* ── Profile Summary Card ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c142b] to-[#080d1e] border border-white/[0.07] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-500/20">
              {teacher.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black text-white">{teacher.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                  ID: #{teacher.id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-300" dir="ltr">{teacher.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-indigo-300 font-semibold">
                    {teacher.role === 'supervisor' ? 'مشرف تربوي' : 'معلم'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateStatus({ id: teacher.id, is_active: !teacher.is_active })}
              disabled={isUpdatingStatus}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                teacher.is_active
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/20'
              }`}
            >
              {teacher.is_active ? (
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

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.05]">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              تاريخ الانضمام
            </div>
            <div className="text-xs font-bold text-white font-mono">
              {new Date(teacher.created_at).toLocaleDateString('ar-EG')}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              الأسئلة المُضافة
            </div>
            <div className="text-xs font-bold text-blue-300 font-mono">
              48 سؤال
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <FileCheck2 className="w-3.5 h-3.5 text-violet-400" />
              الامتحانات المُصممة
            </div>
            <div className="text-xs font-bold text-violet-300 font-mono">
              6 امتحانات
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              التقييم العام
            </div>
            <div className="text-xs font-bold text-emerald-300 font-mono">
              معتمد وموثق
            </div>
          </div>
        </div>
      </div>

      {/* ── Authored Content ── */}
      <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-indigo-400" />
          أحدث النماذج والامتحانات المُعدة بواسطة المعلم
        </h3>
        <div className="space-y-2 text-xs">
          {[
            { title: 'امتحان الفيزياء التجريبي — الوحدة الأولى', questions: 25, duration: '45 دقيقة', date: '28 أغسطس 2026' },
            { title: 'مراجعة الديناميكا الحرارية الشاملة', questions: 30, duration: '60 دقيقة', date: '22 أغسطس 2026' },
          ].map((e, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#080d1e] border border-white/[0.05] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{e.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{e.date} • {e.duration}</div>
              </div>
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                {e.questions} سؤال
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
