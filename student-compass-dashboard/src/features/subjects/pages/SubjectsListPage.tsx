import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  FlaskConical,
  PenLine,
  Globe,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  BookMarked,
  HelpCircle,
  Layers,
} from 'lucide-react';
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../hooks/useSubjects';
import { SubjectFormModal } from '../components/SubjectFormModal';
import type { Subject, SubjectFormData } from '../types/subject.types';
import { useAcademicOptions } from '@/features/academic-structure/hooks/useAcademicStructure';

// ── Track badge config ──
const trackConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  علمي: { icon: FlaskConical, label: 'علمي', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  أدبي: { icon: PenLine, label: 'أدبي', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20' },
  عام: { icon: Globe, label: 'عام', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
};

// ── Delete Confirm Modal ──
function DeleteConfirmModal({
  subject,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  subject: Subject;
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
            <h3 className="text-base font-bold text-foreground">تأكيد الحذف</h3>
            <p className="text-xs text-muted-foreground mt-0.5">هذا الإجراء لا يمكن التراجع عنه</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground bg-destructive/10 border border-destructive/20 rounded-xl p-3 leading-relaxed">
          هل أنت متأكد من حذف مادة{' '}
          <strong className="text-foreground font-bold">"{subject.name}"</strong>؟
          سيتم حذف الوحدات والدروس والأسئلة المرتبطة بها.
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
            {isDeleting ? 'جاري الحذف...' : 'نعم، احذف المادة'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Subject Row ──
function SubjectRow({
  subject,
  onEdit,
  onDelete,
}: {
  subject: Subject;
  onEdit: (s: Subject) => void;
  onDelete: (s: Subject) => void;
}) {
  const track = subject.track ? trackConfig[subject.track] : null;
  const TrackIcon = track?.icon ?? Globe;

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
      {/* Icon + Name */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shrink-0">
            {subject.icon ?? '📘'}
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{subject.name}</div>
            {subject.code && (
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{subject.code}</div>
            )}
          </div>
        </div>
      </td>

      {/* Grade Level */}
      <td className="px-4 py-3.5 hidden md:table-cell">
        <span className="text-xs font-semibold text-foreground bg-muted border border-border px-2.5 py-1 rounded-lg">
          {subject.grade_level ?? '—'}
        </span>
      </td>

      {/* Track */}
      <td className="px-4 py-3.5 hidden sm:table-cell">
        {track ? (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${track.color}`}>
            <TrackIcon className="w-3 h-3" />
            {track.label}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>

      {/* Stats */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            {subject.units_count ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <BookMarked className="w-3.5 h-3.5 text-emerald-500" />
            {subject.lessons_count ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            {subject.questions_count ?? 0}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 hidden sm:table-cell">
        {subject.is_active ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            نشطة
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-muted text-muted-foreground border border-border">
            <XCircle className="w-3.5 h-3.5" />
            متوقفة
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(subject)}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
            title="تعديل"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(subject)}
            className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all cursor-pointer"
            title="حذف"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Skeleton Row ──
function SkeletonRow() {
  return (
    <tr className="border-b border-border/50 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded-lg bg-muted" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Main Page ──
export default function SubjectsListPage() {
  const { data: subjects, isLoading, isError } = useSubjects();
  const { data: academicData } = useAcademicOptions();
  const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();
  const { mutate: deleteSubject, isPending: isDeleting } = useDeleteSubject();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterTrack, setFilterTrack] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const gradeOptions = academicData?.data?.grade_levels?.map((g) => g.name) ?? [
    ...new Set((subjects ?? []).map((s) => s.grade_level).filter(Boolean)),
  ] as string[];

  const trackOptions = ['علمي', 'أدبي', 'عام'];

  // Filtered list
  const filtered = useMemo(() => {
    return (subjects ?? []).filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.code ?? '').toLowerCase().includes(search.toLowerCase());
      const matchGrade = !filterGrade || s.grade_level === filterGrade;
      const matchTrack = !filterTrack || s.track === filterTrack;
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' ? s.is_active : !s.is_active);
      return matchSearch && matchGrade && matchTrack && matchStatus;
    });
  }, [subjects, search, filterGrade, filterTrack, filterStatus]);

  // Stats
  const totalActive = (subjects ?? []).filter((s) => s.is_active).length;

  const handleSubmit = (data: SubjectFormData) => {
    if (editTarget) {
      updateSubject(
        { id: editTarget.id, data },
        { onSuccess: () => { setModalOpen(false); setEditTarget(null); } }
      );
    } else {
      createSubject(data, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleEdit = (s: Subject) => {
    setEditTarget(s);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteSubject(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black text-foreground tracking-tight">إدارة المواد والمناهج الدراسية</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            استعراض كافة المواد في المنصة، وتحديد الصفوف والمسارات لكل مادة مع إمكانية التعديل والإضافة.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs transition-all shadow-lg shadow-primary/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          إضافة مادة دراسية جديدة
        </button>
      </div>

      {/* ── KPI Summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي المواد', value: subjects?.length ?? '—', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: BookOpen },
          { label: 'مواد مفعلة', value: totalActive, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
          { label: 'المراحل الدراسية', value: gradeOptions.length, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', icon: Layers },
          { label: 'المسارات التخصصية', value: trackOptions.length, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Filter },
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
            placeholder="بحث باسم المادة أو الكود..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
            dir="rtl"
          />
        </div>
        {/* Grade filter */}
        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition-all"
          dir="rtl"
        >
          <option value="">كل الصفوف والمراحل</option>
          {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        {/* Track filter */}
        <select
          value={filterTrack}
          onChange={(e) => setFilterTrack(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition-all"
          dir="rtl"
        >
          <option value="">كل المسارات</option>
          {trackOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition-all"
          dir="rtl"
        >
          <option value="all">كل الحالات</option>
          <option value="active">مفعلة فقط</option>
          <option value="inactive">متوقفة فقط</option>
        </select>
      </div>

      {/* ── Error State ── */}
      {isError && (
        <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
          ⚠️ تعذر جلب المواد. تأكد من تشغيل الباك إند وصلاحيات الـ Admin.
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-3xl bg-card text-card-foreground border border-border overflow-hidden shadow-sm">
        {/* Results count */}
        <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground font-semibold">
            {isLoading ? 'جاري التحميل...' : `${filtered.length} مادة دراسية`}
          </span>
          {(search || filterGrade || filterTrack || filterStatus !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setFilterGrade(''); setFilterTrack(''); setFilterStatus('all'); }}
              className="text-xs text-primary hover:underline transition-colors cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                {['المادة', 'الصف الدراسي', 'المسار', 'الإحصائيات', 'الحالة', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground text-sm">
                    {subjects?.length === 0
                      ? 'لا توجد مواد مضافة بعد. ابدأ بإضافة مادة جديدة.'
                      : 'لا توجد نتائج مطابقة للبحث والفلاتر المحددة.'}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <SubjectRow key={s.id} subject={s} onEdit={handleEdit} onDelete={setDeleteTarget} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      <SubjectFormModal
        open={modalOpen}
        subject={editTarget}
        isSubmitting={isCreating || isUpdating}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSubmit={handleSubmit}
        defaultGrade={filterGrade || undefined}
        defaultTrack={filterTrack || undefined}
      />

      {deleteTarget && (
        <DeleteConfirmModal
          subject={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
