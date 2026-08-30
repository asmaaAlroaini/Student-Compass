import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, BookOpen, Loader2 } from 'lucide-react';
import type { Subject, SubjectFormData } from '../types/subject.types';
import { subjectSchema, type SubjectSchemaOutput } from '../validations/subjectSchema';
import { useAcademicOptions } from '@/features/academic-structure/hooks/useAcademicStructure';

const SUBJECT_ICONS = ['📘', '📗', '📕', '📙', '🔬', '⚗️', '🧮', '🗺️', '📐', '📏', '🧲', '💻', '🌍', '🎨', '📜', '⚖️', '💡', '🧪'];

interface SubjectFormModalProps {
  open: boolean;
  subject?: Subject | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectFormData) => void;
  defaultGrade?: string;
  defaultTrack?: string;
}

const defaultValues: SubjectSchemaOutput = {
  name: '',
  code: '',
  grade_level: '',
  track: '',
  icon: '📘',
  is_active: true,
};

export function SubjectFormModal({
  open,
  subject,
  isSubmitting,
  onClose,
  onSubmit,
  defaultGrade,
  defaultTrack,
}: SubjectFormModalProps) {
  const isEdit = !!subject;
  const { data: academicData } = useAcademicOptions();

  const gradeLevels = academicData?.data?.grade_levels ?? [
    { id: 'الثالث الثانوي', name: 'الثالث الثانوي', tracks: ['علمي', 'أدبي'] },
    { id: 'الثاني الثانوي', name: 'الثاني الثانوي', tracks: ['علمي', 'أدبي'] },
    { id: 'الأول الثانوي', name: 'الأول الثانوي', tracks: ['عام'] },
  ];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      ...defaultValues,
      grade_level: defaultGrade || '',
      track: defaultTrack || '',
    },
  });

  const selectedIcon = watch('icon');
  const isActive = watch('is_active');
  const selectedGrade = watch('grade_level');

  // المسارات المتاحة بناءً على الصف الدراسي المختار
  const currentGradeObj = gradeLevels.find((g) => g.name === selectedGrade || g.id === selectedGrade);
  const availableTracks = currentGradeObj?.tracks ?? ['علمي', 'أدبي', 'عام'];

  // Populate form when editing or resetting
  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        code: subject.code ?? '',
        grade_level: subject.grade_level ?? defaultGrade ?? '',
        track: subject.track ?? defaultTrack ?? '',
        icon: subject.icon ?? '📘',
        is_active: subject.is_active,
      });
    } else {
      reset({
        ...defaultValues,
        grade_level: defaultGrade ?? '',
        track: defaultTrack ?? '',
      });
    }
  }, [subject, open, reset, defaultGrade, defaultTrack]);

  if (!open) return null;

  const onFormSubmit = (data: SubjectSchemaOutput) => {
    onSubmit({
      name: data.name,
      code: data.code,
      grade_level: data.grade_level,
      track: data.track,
      icon: data.icon,
      is_active: data.is_active,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">
              {selectedIcon || '📘'}
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? 'تعديل المادة الدراسية' : 'إضافة مادة دراسية جديدة'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEdit ? `تعديل بيانات: ${subject?.name}` : 'حدد الصف الدراسي والمسار وبيانات المادة'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              اسم المادة <span className="text-destructive">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="مثال: الرياضيات (التفاضل والتكامل)"
              className={`w-full px-4 py-2.5 rounded-xl bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${
                errors.name
                  ? 'border-destructive focus:ring-2 focus:ring-destructive/20'
                  : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              dir="rtl"
            />
            {errors.name && (
              <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Grade Level + Track */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                الصف / المرحلة الدراسية <span className="text-destructive">*</span>
              </label>
              <select
                {...register('grade_level')}
                className={`w-full px-4 py-2.5 rounded-xl bg-background border text-sm text-foreground focus:outline-none transition-all cursor-pointer ${
                  errors.grade_level
                    ? 'border-destructive focus:ring-2 focus:ring-destructive/20'
                    : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                dir="rtl"
              >
                <option value="">— اختر الصف الدراسي —</option>
                {gradeLevels.map((g) => (
                  <option key={g.id || g.name} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.grade_level && (
                <p className="text-xs text-destructive font-medium">{errors.grade_level.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">المسار الدراسي</label>
              <select
                {...register('track')}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground focus:outline-none transition-all cursor-pointer"
                dir="rtl"
              >
                <option value="">مشترك / بدون مسار</option>
                {availableTracks.map((t) => (
                  <option key={t} value={t}>
                    المسار {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Code + Icon Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">كود المادة (اختياري)</label>
              <input
                {...register('code')}
                type="text"
                placeholder="MTH301"
                className={`w-full px-4 py-2.5 rounded-xl bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono transition-all ${
                  errors.code
                    ? 'border-destructive'
                    : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                dir="ltr"
                maxLength={20}
              />
              {errors.code && (
                <p className="text-xs text-destructive">{errors.code.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">الأيقونة</label>
              <select
                {...register('icon')}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground focus:outline-none transition-all cursor-pointer"
                dir="ltr"
              >
                {SUBJECT_ICONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
            <div>
              <div className="text-sm font-semibold text-foreground">حالة المادة</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isActive ? 'المادة مفعلة وظاهرة للطلاب' : 'المادة مخفية وموقوفة'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValue('is_active', !isActive)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                isActive ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300"
                style={{ left: isActive ? '26px' : '2px' }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-sm font-semibold transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
              {isSubmitting ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المادة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectFormModal;
