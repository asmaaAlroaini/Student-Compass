import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Layers,
  FileText,
  HelpCircle,
  X,
  Loader2,
  AlertTriangle,
  FolderPlus,
} from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from '../hooks/useUnits';
import { unitSchema, type UnitSchemaOutput } from '../validations/unitSchema';
import { ROUTES } from '@/constants/routes';
import type { Unit } from '../types/unit.types';

// ── Unit Create / Edit Modal ──
function UnitModal({
  open,
  subjectId,
  unit,
  onClose,
}: {
  open: boolean;
  subjectId: number;
  unit?: Unit | null;
  onClose: () => void;
}) {
  const isEdit = !!unit;
  const { mutate: createUnit, isPending: isCreating } = useCreateUnit();
  const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      subject_id: subjectId,
      title: unit?.title || '',
      unit_number: unit?.unit_number || 1,
      order: unit?.order || 1,
      description: unit?.description || '',
    },
  });

  const onSubmit: SubmitHandler<UnitSchemaOutput> = (data) => {
    if (isEdit && unit) {
      updateUnit(
        {
          id: unit.id,
          data: {
            subject_id: subjectId,
            title: data.title,
            unit_number: data.unit_number,
            order: data.order,
            description: data.description,
          },
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
    } else {
      createUnit(
        {
          subject_id: subjectId,
          title: data.title,
          unit_number: data.unit_number,
          order: data.order,
          description: data.description,
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card text-card-foreground border border-border rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              {isEdit ? 'تعديل الوحدة الدراسية' : 'إضافة وحدة دراسية جديدة'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              عنوان الوحدة <span className="text-destructive">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="مثال: الوحدة الأولى — الميكانيكا الكلاسيكية"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">رقم الوحدة</label>
              <input
                {...register('unit_number')}
                type="number"
                min={1}
                className="w-full px-3 py-2 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">ترتيب العرض</label>
              <input
                {...register('order')}
                type="number"
                min={1}
                className="w-full px-3 py-2 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">وصف الوحدة (اختياري)</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="وصف مختصر لموضوعات الوحدة..."
              className="w-full px-3.5 py-2 rounded-xl bg-background border border-input text-xs text-foreground focus:outline-none focus:border-primary transition resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Layers className="w-3.5 h-3.5" />
              )}
              {isCreating || isUpdating ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديل' : 'إضافة الوحدة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SubjectDetailsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const numSubjectId = Number(subjectId);

  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Unit | null>(null);

  // Queries
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects();
  const { data: units = [], isLoading: isLoadingUnits } = useUnits(numSubjectId);
  const { mutate: deleteUnit, isPending: isDeletingUnit } = useDeleteUnit();

  const currentSubject = subjects.find((s) => s.id === numSubjectId);

  const handleDeleteUnit = () => {
    if (!deleteTarget) return;
    deleteUnit(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  if (isLoadingSubjects) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.SUBJECTS}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">
              {currentSubject?.icon || '📘'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-foreground tracking-tight">
                  {currentSubject?.name || 'تفاصيل المادة'}
                </h1>
                {currentSubject?.code && (
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground">
                    {currentSubject.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentSubject?.grade_level || 'المرحلة الثانوية'} {currentSubject?.track ? `• المسار ${currentSubject.track}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`${ROUTES.DASHBOARD.QUESTIONS}?subject_id=${numSubjectId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition border border-border"
          >
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
            بنك الأسئلة للمادة
          </Link>

          <button
            type="button"
            onClick={() => {
              setEditingUnit(null);
              setUnitModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition shadow-lg shadow-primary/20 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            إضافة وحدة دراسية
          </button>
        </div>
      </div>

      {/* ── KPIs Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-foreground">{units.length}</div>
            <div className="text-[11px] text-muted-foreground">الوحدات الدراسية</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {units.reduce((sum, u) => sum + (u.lessons_count || 0), 0)}
            </div>
            <div className="text-[11px] text-muted-foreground">إجمالي الدروس</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {units.reduce((sum, u) => sum + (u.questions_count || 0), 0)}
            </div>
            <div className="text-[11px] text-muted-foreground">إجمالي الأسئلة</div>
          </div>
        </div>
      </div>

      {/* ── Units Accordion / List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            منهج المادة والوحدات الدراسية
          </h2>
          <span className="text-xs text-muted-foreground">{units.length} وحدة مضافة</span>
        </div>

        {isLoadingUnits ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-3xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : units.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-card border border-dashed border-border space-y-3">
            <Layers className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">لا توجد وحدات دراسية مضافة بعد</p>
            <p className="text-xs text-muted-foreground">ابدأ بإضافة الوحدة الأولى لتنظيم الدروس والأسئلة داخل المادة.</p>
            <button
              type="button"
              onClick={() => {
                setEditingUnit(null);
                setUnitModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة الوحدة الأولى
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {units.map((unit, idx) => (
              <div
                key={unit.id}
                className="p-5 rounded-3xl bg-card text-card-foreground border border-border hover:border-primary/30 transition-all space-y-3 group shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono font-bold text-primary shrink-0">
                      {unit.unit_number || idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition">
                        {unit.title}
                      </h3>
                      {unit.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{unit.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-muted border border-border text-muted-foreground">
                      {unit.lessons_count ?? 0} درس
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                      {unit.questions_count ?? 0} سؤال
                    </span>

                    <Link
                      to={`/dashboard/subjects/${numSubjectId}/curriculum?unit_id=${unit.id}`}
                      className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold flex items-center gap-1 transition"
                      title="إضافة درس للوحدة"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      درس
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingUnit(unit);
                        setUnitModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition cursor-pointer"
                      title="تعديل الوحدة"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(unit)}
                      className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 transition cursor-pointer"
                      title="حذف الوحدة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <UnitModal
        open={unitModalOpen}
        subjectId={numSubjectId}
        unit={editingUnit}
        onClose={() => {
          setUnitModalOpen(false);
          setEditingUnit(null);
        }}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-card text-card-foreground border border-border rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-destructive/15 border border-destructive/25 flex items-center justify-center text-destructive">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">تأكيد حذف الوحدة</h3>
                <p className="text-xs text-muted-foreground mt-0.5">سيتم حذف الوحدة وجميع الدروس التابعة لها</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              هل أنت متأكد من حذف وحدة <strong className="text-foreground">"{deleteTarget.title}"</strong>؟
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteUnit}
                disabled={isDeletingUnit}
                className="flex-1 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 disabled:opacity-60 text-destructive-foreground text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-destructive/20"
              >
                {isDeletingUnit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {isDeletingUnit ? 'جاري الحذف...' : 'حذف الوحدة'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
