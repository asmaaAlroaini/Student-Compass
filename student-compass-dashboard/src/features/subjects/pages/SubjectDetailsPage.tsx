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
  ChevronDown,
  ChevronUp,
  Video,
} from 'lucide-react';
import { useSubjects, useSubject } from '../hooks/useSubjects';
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from '../hooks/useUnits';
import { useLessonsByUnit, useDeleteLesson } from '../hooks/useLessons';
import { unitSchema, type UnitSchemaOutput } from '../validations/unitSchema';
import { SubjectIconBadge } from '../components/SubjectIconBadge';
import { LessonModal } from '../components/LessonModal';
import { ROUTES } from '@/constants/routes';
import type { Unit } from '../types/unit.types';
import type { Lesson } from '../types/lesson.types';

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

// ── Unit Accordion Item ──
function UnitAccordionItem({
  unit,
  subjectId,
  index,
  onEditUnit,
  onDeleteUnit,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: {
  unit: Unit;
  subjectId: number;
  index: number;
  onEditUnit: (u: Unit) => void;
  onDeleteUnit: (u: Unit) => void;
  onAddLesson: (unit: Unit) => void;
  onEditLesson: (unit: Unit, lesson: Lesson) => void;
  onDeleteLesson: (lesson: Lesson) => void;
}) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const { data: lessonsRes, isLoading: loadingLessons } = useLessonsByUnit(subjectId, unit.id);
  const lessons = lessonsRes?.data ?? [];

  return (
    <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm overflow-hidden transition-all hover:border-primary/30">
      {/* Unit Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
        <div
          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-xs font-mono font-bold text-primary shrink-0">
            {unit.unit_number || index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground hover:text-primary transition truncate">
                {unit.title}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted border border-border text-muted-foreground shrink-0">
                {lessons.length || unit.lessons_count || 0} دروس
              </span>
            </div>
            {unit.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{unit.description}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onAddLesson(unit)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة درس</span>
          </button>

          <Link
            to={`${ROUTES.DASHBOARD.QUESTIONS}?subject_id=${subjectId}&unit_id=${unit.id}`}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold transition flex items-center gap-1"
            title="أسئلة الوحدة"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">الأسئلة</span>
          </Link>

          <button
            type="button"
            onClick={() => onEditUnit(unit)}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition cursor-pointer"
            title="تعديل الوحدة"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteUnit(unit)}
            className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition cursor-pointer"
            title="حذف الوحدة"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition cursor-pointer"
            title={isOpen ? 'طي الوحدة' : 'عرض الدروس'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Lessons List */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-border/60 bg-card space-y-3">
          {loadingLessons ? (
            <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              جاري تحميل دروس الوحدة...
            </div>
          ) : lessons.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-border rounded-2xl space-y-2">
              <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto" />
              <p className="text-xs font-bold text-foreground">لا توجد دروس مضافة لهذه الوحدة بعد</p>
              <p className="text-[11px] text-muted-foreground">أضف الدرس الأول لتنظيم المنهج وإرفاق الملفات وبنك الأسئلة.</p>
              <button
                type="button"
                onClick={() => onAddLesson(unit)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition shadow cursor-pointer mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة الدرس الأول الآن
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, lIdx) => (
                <div
                  key={lesson.id}
                  className="p-3.5 rounded-2xl bg-muted/30 border border-border/80 hover:bg-muted/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-7 h-7 rounded-xl bg-card border border-border flex items-center justify-center font-mono font-bold text-muted-foreground text-[11px] shrink-0">
                      {lesson.lesson_number || lIdx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground truncate">{lesson.title}</span>
                        {lesson.pdf_path && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1 shrink-0">
                            <FileText className="w-2.5 h-2.5" />
                            PDF
                          </span>
                        )}
                        {lesson.video_url && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1 shrink-0">
                            <Video className="w-2.5 h-2.5" />
                            فيديو
                          </span>
                        )}
                      </div>
                      {lesson.summary && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{lesson.summary}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`${ROUTES.DASHBOARD.QUESTIONS}?subject_id=${subjectId}&unit_id=${unit.id}&lesson_id=${lesson.id}`}
                      className="px-2.5 py-1 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground text-[11px] font-semibold flex items-center gap-1 transition"
                      title="أسئلة الدرس"
                    >
                      <HelpCircle className="w-3 h-3 text-amber-500" />
                      <span>{lesson.questions_count ?? 0} سؤال</span>
                    </Link>

                    <Link
                      to={`${ROUTES.DASHBOARD.QUESTIONS_CREATE}?subject_id=${subjectId}&unit_id=${unit.id}&lesson_id=${lesson.id}`}
                      className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition"
                      title="إضافة سؤال لهذا الدرس"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onEditLesson(unit, lesson)}
                      className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition cursor-pointer"
                      title="تعديل الدرس"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteLesson(lesson)}
                      className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition cursor-pointer"
                      title="حذف الدرس"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Subject Details Page ──
export default function SubjectDetailsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const numSubjectId = Number(subjectId);

  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deleteUnitTarget, setDeleteUnitTarget] = useState<Unit | null>(null);

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetUnitForLesson, setTargetUnitForLesson] = useState<Unit | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteLessonTarget, setDeleteLessonTarget] = useState<Lesson | null>(null);

  // Queries
  const { data: singleSubject, isLoading: isLoadingSingleSubject } = useSubject(numSubjectId);
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects();
  const { data: units = [], isLoading: isLoadingUnits } = useUnits(numSubjectId);
  const { mutate: deleteUnit, isPending: isDeletingUnit } = useDeleteUnit();
  const { mutate: deleteLesson, isPending: isDeletingLesson } = useDeleteLesson();

  const currentSubject = singleSubject || subjects.find((s) => s.id === numSubjectId);

  const handleDeleteUnit = () => {
    if (!deleteUnitTarget) return;
    deleteUnit(deleteUnitTarget.id, {
      onSuccess: () => setDeleteUnitTarget(null),
    });
  };

  const handleDeleteLesson = () => {
    if (!deleteLessonTarget) return;
    deleteLesson(deleteLessonTarget.id, {
      onSuccess: () => setDeleteLessonTarget(null),
    });
  };

  const handleOpenAddLesson = (unit: Unit) => {
    setTargetUnitForLesson(unit);
    setEditingLesson(null);
    setLessonModalOpen(true);
  };

  const handleOpenEditLesson = (unit: Unit, lesson: Lesson) => {
    setTargetUnitForLesson(unit);
    setEditingLesson(lesson);
    setLessonModalOpen(true);
  };

  if ((isLoadingSubjects && !currentSubject) || (isLoadingSingleSubject && !currentSubject)) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const totalLessons = units.reduce((sum, u) => sum + (u.lessons_count || 0), 0);
  const totalQuestions = units.reduce((sum, u) => sum + (u.questions_count || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.SUBJECTS}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition cursor-pointer shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <SubjectIconBadge icon={currentSubject?.icon} name={currentSubject?.name} size="lg" />
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
            إضافة وحدة دراسية جديدة
          </button>
        </div>
      </div>

      {/* ── KPIs Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-foreground">{units.length}</div>
            <div className="text-[11px] text-muted-foreground">الوحدات الدراسية</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {totalLessons}
            </div>
            <div className="text-[11px] text-muted-foreground">إجمالي الدروس التعليمية</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {totalQuestions}
            </div>
            <div className="text-[11px] text-muted-foreground">إجمالي الأسئلة المعتمدة</div>
          </div>
        </div>
      </div>

      {/* ── Units List & Accordion ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            منهج المادة، الوحدات والدروس التفصيلية
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
            <p className="text-sm font-semibold text-foreground">لا توجد وحدات دراسية مضافة بعد لهذه المادة</p>
            <p className="text-xs text-muted-foreground">ابدأ بإضافة الوحدة الأولى لتنظيم الدروس والملخصات والأسئلة داخل المادة.</p>
            <button
              type="button"
              onClick={() => {
                setEditingUnit(null);
                setUnitModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة الوحدة الأولى الآن
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {units.map((unit, idx) => (
              <UnitAccordionItem
                key={unit.id}
                unit={unit}
                subjectId={numSubjectId}
                index={idx}
                onEditUnit={(u) => {
                  setEditingUnit(u);
                  setUnitModalOpen(true);
                }}
                onDeleteUnit={(u) => setDeleteUnitTarget(u)}
                onAddLesson={handleOpenAddLesson}
                onEditLesson={handleOpenEditLesson}
                onDeleteLesson={(l) => setDeleteLessonTarget(l)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Unit Modal ── */}
      <UnitModal
        open={unitModalOpen}
        subjectId={numSubjectId}
        unit={editingUnit}
        onClose={() => {
          setUnitModalOpen(false);
          setEditingUnit(null);
        }}
      />

      {/* ── Lesson Modal ── */}
      {targetUnitForLesson && (
        <LessonModal
          open={lessonModalOpen}
          subjectId={numSubjectId}
          unitId={targetUnitForLesson.id}
          unitTitle={targetUnitForLesson.title}
          lesson={editingLesson}
          onClose={() => {
            setLessonModalOpen(false);
            setEditingLesson(null);
            setTargetUnitForLesson(null);
          }}
        />
      )}

      {/* ── Delete Unit Confirmation ── */}
      {deleteUnitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteUnitTarget(null)} />
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
              هل أنت متأكد من حذف وحدة <strong className="text-foreground">"{deleteUnitTarget.title}"</strong>؟
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteUnitTarget(null)}
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

      {/* ── Delete Lesson Confirmation ── */}
      {deleteLessonTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteLessonTarget(null)} />
          <div className="relative w-full max-w-sm bg-card text-card-foreground border border-border rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-destructive/15 border border-destructive/25 flex items-center justify-center text-destructive">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">تأكيد حذف الدرس</h3>
                <p className="text-xs text-muted-foreground mt-0.5">سيتم حذف الدرس ومحتوياته</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              هل أنت متأكد من حذف درس <strong className="text-foreground">"{deleteLessonTarget.title}"</strong>؟
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteLessonTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteLesson}
                disabled={isDeletingLesson}
                className="flex-1 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 disabled:opacity-60 text-destructive-foreground text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-destructive/20"
              >
                {isDeletingLesson ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {isDeletingLesson ? 'جاري الحذف...' : 'حذف الدرس'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
