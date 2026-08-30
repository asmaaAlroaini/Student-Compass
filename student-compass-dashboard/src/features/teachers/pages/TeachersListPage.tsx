import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  ChevronRight,
  ChevronLeft,
  Eye,
  ShieldCheck,
  UserX,
  BookOpen,
} from 'lucide-react';
import { useUsers, useUpdateUserStatus } from '@/features/users/hooks/useUsers';

export default function TeachersListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'teacher' | 'supervisor' | ''>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: usersData, isLoading } = useUsers({
    role: roleFilter || 'teacher',
    page,
    search: search || undefined,
  });

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

  const teachers = (usersData?.data?.data ?? []).filter((u) => {
    if (statusFilter === 'active') return u.is_active;
    if (statusFilter === 'inactive') return !u.is_active;
    return true;
  });

  const pagination = usersData?.data;
  const totalTeachers = pagination?.total ?? 0;

  return (
    <div className="space-y-6" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-black text-white tracking-tight">إدارة المعلمين والمشرفين التربويين</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              Teachers & Staff
            </span>
          </div>
          <p className="text-sm text-slate-400">
            متابعة الكادر التعليمي، مراجعة الصلاحيات، وإدارة إمكانية نشر الأسئلة والاختبارات.
          </p>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الكادر التعليمي', value: totalTeachers, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', icon: GraduationCap },
          { label: 'معلمون نشطون', value: teachers.filter((t) => t.is_active).length, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
          { label: 'مشرفون تربويون', value: teachers.filter((t) => t.role === 'supervisor').length, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: Shield },
          { label: 'المواد المغطاة', value: 8, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: BookOpen },
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
            placeholder="بحث باسم المعلم أو البريد الإلكتروني..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition"
            dir="rtl"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as 'teacher' | 'supervisor' | '');
            setPage(1);
          }}
          className="px-3 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer transition"
          dir="rtl"
        >
          <option value="">كل الأدوار (معلمين ومشرفين)</option>
          <option value="teacher">معلم</option>
          <option value="supervisor">مشرف تربوي</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer transition"
          dir="rtl"
        >
          <option value="">كل الحالات</option>
          <option value="active">نشط فقط</option>
          <option value="inactive">معطل فقط</option>
        </select>
      </div>

      {/* ── Teachers Table ── */}
      <div className="rounded-2xl bg-[#0c142b] border border-white/[0.07] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isLoading ? 'جاري التحميل...' : `عرض ${teachers.length} من إجمالي ${totalTeachers} عضو كادر`}
          </span>
          {(search || roleFilter || statusFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setRoleFilter('');
                setStatusFilter('');
                setPage(1);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">المعلم / المشرف</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">الدور والصلاحية</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">تاريخ الانضمام</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-white/[0.04] animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-36" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-white/[0.05] rounded-lg w-24" /></td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 bg-white/[0.05] rounded-lg w-20" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-16" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/[0.05] rounded-lg w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-500 text-sm">
                    لا يوجد معلمين مطابقين لمعايير البحث.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-300 text-sm">
                          {teacher.name.slice(0, 1)}
                        </div>
                        <div>
                          <Link
                            to={`/dashboard/teachers/${teacher.id}`}
                            className="text-sm font-bold text-white hover:text-indigo-300 transition"
                          >
                            {teacher.name}
                          </Link>
                          <div className="text-[11px] text-slate-500 font-mono" dir="ltr">
                            {teacher.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
                          teacher.role === 'supervisor'
                            ? 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                            : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                        }`}
                      >
                        {teacher.role === 'supervisor' ? 'مشرف تربوي' : 'معلم مادة'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-slate-400 font-mono">
                      {new Date(teacher.created_at).toLocaleDateString('ar-EG')}
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => updateStatus({ id: teacher.id, is_active: !teacher.is_active })}
                        disabled={isUpdatingStatus}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          teacher.is_active
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
                        }`}
                        title={teacher.is_active ? 'انقر لتعطيل الحساب' : 'انقر لتفعيل الحساب'}
                      >
                        {teacher.is_active ? (
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
                          to={`/dashboard/teachers/${teacher.id}`}
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 transition"
                          title="الملف المهني"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => updateStatus({ id: teacher.id, is_active: !teacher.is_active })}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            teacher.is_active
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                          title={teacher.is_active ? 'تعطيل' : 'تفعيل'}
                        >
                          {teacher.is_active ? <UserX className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
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

    </div>
  );
}
