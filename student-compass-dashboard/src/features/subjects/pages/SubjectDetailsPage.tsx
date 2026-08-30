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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0d1632] border border-white/[0.09] rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {isEdit ? 'تعديل الوحدة الدراسية' : 'إضافة وحدة دراسية جديدة'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              عنوان الوحدة <span className="text-rose-400">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="مثال: الوحدة الأولى — الميكانيكا الكلاسيكية"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition"
            />
            {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">رقم الوحدة</label>
              <input
                {...register('unit_number')}
                type="number"
                min={1}
                className="w-full px-3 py-2 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">ترتيب العرض</label>
              <input
                {...register('order')}
                type="number"
                min={1}
                className="w-full px-3 py-2 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">وصف الوحدة (اختياري)</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="وصف مختصر لموضوعات الوحدة..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#080d1e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-blue-500/60 transition"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20"
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
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
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
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
              {currentSubject?.icon || '📘'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  {currentSubject?.name || 'تفاصيل المادة'}
                </h1>
                {currentSubject?.code && (
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                    {currentSubject.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentSubject?.grade_level || 'المرحلة الثانوية'} {currentSubject?.track ? `• المسار ${currentSubject.track}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`${ROUTES.DASHBOARD.QUESTIONS}?subject_id=${numSubjectId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition border border-white/10"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            بنك الأسئلة للمادة
          </Link>

          <button
            type="button"
            onClick={() => {
              setEditingUnit(null);
              setUnitModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            إضافة وحدة دراسية
          </button>
        </div>
      </div>

      {/* ── KPIs Bar ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white">{units.length}</div>
            <div className="text-[11px] text-slate-400">الوحدات الدراسية</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-300">
              {units.reduce((sum, u) => sum + (u.lessons_count || 0), 0)}
            </div>
            <div className="text-[11px] text-slate-400">إجمالي الدروس</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-300">
              {units.reduce((sum, u) => sum + (u.questions_count || 0), 0)}
            </div>
            <div className="text-[11px] text-slate-400">إجمالي الأسئلة</div>
          </div>
        </div>
      </div>

      {/* ── Units Accordion / List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            منهج المادة والوحدات الدراسية
          </h2>
          <span className="text-xs text-slate-500">{units.length} وحدة مضافة</span>
        </div>

        {isLoadingUnits ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-3xl bg-[#0c142b] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : units.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0c142b] border border-dashed border-white/10 space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">لا توجد وحدات دراسية مضافة بعد</p>
            <p className="text-xs text-slate-400">ابدأ بإضافة الوحدة الأولى لتنظيم الدروس والأسئلة داخل المادة.</p>
            <button
              type="button"
              onClick={() => {
                setEditingUnit(null);
                setUnitModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow"
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
                className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] hover:border-blue-500/30 transition-all space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-xs font-mono font-bold text-blue-300 shrink-0">
                      {unit.unit_number || idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                        {unit.title}
                      </h3>
                      {unit.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{unit.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-400">
                      {unit.lessons_count ?? 0} درس
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      {unit.questions_count ?? 0} سؤال
                    </span>

                    <Link
                      to={`/dashboard/subjects/${numSubjectId}/curriculum?unit_id=${unit.id}`}
                      className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 text-xs font-semibold flex items-center gap-1 transition"
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
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                      title="تعديل الوحدة"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(unit)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition cursor-pointer"
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-[#0d1632] border border-white/[0.09] rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">تأكيد حذف الوحدة</h3>
                <p className="text-xs text-slate-400 mt-0.5">سيتم حذف الوحدة وجميع الدروس التابعة لها</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 bg-rose-500/5 border border-rose-500/15 rounded-xl p-3">
              هل أنت متأكد من حذف وحدة <strong className="text-rose-300">"{deleteTarget.title}"</strong>؟
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteUnit}
                disabled={isDeletingUnit}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
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
