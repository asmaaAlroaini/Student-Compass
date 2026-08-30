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
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-12 text-center rounded-3xl bg-card border border-border space-y-4 max-w-md mx-auto" dir="rtl">
        <GraduationCap className="w-12 h-12 text-muted-foreground/40 mx-auto" />
        <h2 className="text-base font-bold text-foreground">لم يتم العثور على المعلم</h2>
        <p className="text-xs text-muted-foreground">قد يكون الحساب محذوفاً أو المعرف غير صحيح.</p>
        <Link
          to={ROUTES.DASHBOARD.TEACHERS}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition"
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
          className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-foreground tracking-tight">الملف المهني للمعلم / المشرف</h1>
          <p className="text-xs text-muted-foreground mt-0.5">تفاصيل الحساب، الصلاحيات، وإحصائيات المحتوى المُنشأ.</p>
        </div>
      </div>

      {/* ── Profile Summary Card ── */}
      <div className="p-6 rounded-3xl bg-card text-card-foreground border border-border space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-primary/20">
              {teacher.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black text-foreground">{teacher.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground">
                  ID: #{teacher.id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="font-mono text-foreground" dir="ltr">{teacher.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-semibold">
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
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20'
                  : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20'
              }`}
            >
              {teacher.is_active ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  الحساب نشط (انقر للتعطيل)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-destructive" />
                  الحساب معطل (انقر للتفعيل)
                </>
              )}
            </button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              تاريخ الانضمام
            </div>
            <div className="text-xs font-bold text-foreground font-mono">
              {new Date(teacher.created_at).toLocaleDateString('ar-EG')}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              الأسئلة المُضافة
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
              بنك الأسئلة
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <FileCheck2 className="w-3.5 h-3.5 text-violet-500" />
              الامتحانات المُصممة
            </div>
            <div className="text-xs font-bold text-violet-600 dark:text-violet-400 font-mono">
              معتمد ومُوثق
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              التقييم العام
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              كادر معتمد
            </div>
          </div>
        </div>
      </div>

      {/* ── Action / Overview ── */}
      <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-primary" />
          الصلاحيات والمواد التدريسية
        </h3>
        <div className="p-4 rounded-2xl bg-muted/30 border border-border text-xs text-muted-foreground leading-relaxed">
          يمتلك هذا المعلم صلاحية إضافة الأسئلة، إنشاء النماذج الاختبارية، ورفع ملفات المناهج والشروحات للمواد المخصصة له في المنصة.
        </div>
      </div>

    </div>
  );
}
