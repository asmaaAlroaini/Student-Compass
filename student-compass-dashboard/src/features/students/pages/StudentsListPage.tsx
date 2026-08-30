import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  ShieldCheck,
  UserX,
} from 'lucide-react';
import { useUsers, useUpdateUserStatus } from '@/features/users/hooks/useUsers';
import { useAcademicOptions } from '@/features/academic-structure/hooks/useAcademicStructure';

export default function StudentsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: academicData } = useAcademicOptions();
  const gradeOptions = academicData?.data?.grade_levels?.map((g) => g.name) ?? [
    'الثالث الثانوي',
    'الثاني الثانوي',
    'الأول الثانوي',
  ];

  const { data: usersData, isLoading, isError } = useUsers({
    role: 'student',
    page,
    search: search || undefined,
    grade_level: gradeFilter || undefined,
    track: trackFilter || undefined,
  });

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

  const students = (usersData?.data?.data ?? []).filter((u) => {
    if (statusFilter === 'active') return u.is_active;
    if (statusFilter === 'inactive') return !u.is_active;
    return true;
  });

  const pagination = usersData?.data;
  const totalStudents = pagination?.total ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black text-foreground tracking-tight">إدارة شؤون الطلاب</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Students CMS
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            متابعة الطلاب المسجلين، التحقق من الحسابات، وإدارة حالات التفعيل.
          </p>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الطلاب المسجلين', value: totalStudents, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Users },
          { label: 'طلاب نشطون', value: students.filter((s) => s.is_active).length, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
          { label: 'المرحلة الثالث الثانوي', value: students.filter((s) => s.grade_level?.includes('الثالث')).length, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', icon: GraduationCap },
          { label: 'مسار علمي', value: students.filter((s) => s.track === 'علمي').length, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Sparkles },
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
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث باسم الطالب أو البريد الإلكتروني..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
            dir="rtl"
          />
        </div>

        <select
          value={gradeFilter}
          onChange={(e) => {
            setGradeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition"
          dir="rtl"
        >
          <option value="">كل المراحل</option>
          {gradeOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={trackFilter}
          onChange={(e) => {
            setTrackFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition"
          dir="rtl"
        >
          <option value="">كل المسارات</option>
          <option value="علمي">علمي</option>
          <option value="أدبي">أدبي</option>
          <option value="عام">عام</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition"
          dir="rtl"
        >
          <option value="">كل الحالات</option>
          <option value="active">نشط فقط</option>
          <option value="inactive">معطل فقط</option>
        </select>
      </div>

      {/* ── Error State ── */}
      {isError && (
        <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
          ⚠️ تعذر جلب قائمة الطلاب. تأكد من تشغيل الخادم وصلاحيات المدير.
        </div>
      )}

      {/* ── Students Table ── */}
      <div className="rounded-3xl bg-card text-card-foreground border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground font-semibold">
            {isLoading ? 'جاري التحميل...' : `عرض ${students.length} من إجمالي ${totalStudents} طالب`}
          </span>
          {(search || gradeFilter || trackFilter || statusFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setGradeFilter('');
                setTrackFilter('');
                setStatusFilter('');
                setPage(1);
              }}
              className="text-xs text-primary hover:underline transition cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">الطالب</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">المرحلة والمسار</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">تاريخ التسجيل</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">الحالة</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-border/40 animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded-lg w-36" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-muted rounded-lg w-28" /></td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 bg-muted rounded-lg w-20" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded-lg w-16" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded-lg w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-muted-foreground text-sm">
                    {totalStudents === 0 ? 'لا يوجد طلاب مسجلون بعد.' : 'لا توجد نتائج مطابقة.'}
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                          {student.name.slice(0, 1)}
                        </div>
                        <div>
                          <Link
                            to={`/dashboard/students/${student.id}`}
                            className="text-sm font-bold text-foreground hover:text-primary transition"
                          >
                            {student.name}
                          </Link>
                          <div className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="text-xs text-foreground font-medium">
                        {student.grade_level || '—'}
                      </div>
                      {student.track && (
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 mt-0.5 inline-block">
                          {student.track}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-muted-foreground font-mono">
                      {new Date(student.created_at).toLocaleDateString('ar-EG')}
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => updateStatus({ id: student.id, is_active: !student.is_active })}
                        disabled={isUpdatingStatus}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          student.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                        }`}
                        title={student.is_active ? 'انقر لتعطيل الحساب' : 'انقر لتفعيل الحساب'}
                      >
                        {student.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            نشط
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            معطل
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/dashboard/students/${student.id}`}
                          className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition"
                          title="الملف الأكاديمي"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => updateStatus({ id: student.id, is_active: !student.is_active })}
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            student.is_active
                              ? 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                          title={student.is_active ? 'تعطيل' : 'تفعيل'}
                        >
                          {student.is_active ? <UserX className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-5 py-3.5 border-t border-border/60 flex items-center justify-between bg-muted/20">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card hover:bg-muted disabled:opacity-40 text-xs font-semibold text-foreground border border-border transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              السابقة
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
              التالية
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
