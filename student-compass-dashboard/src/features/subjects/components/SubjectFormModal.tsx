import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, BookOpen, Loader2 } from 'lucide-react';
import type { Subject, SubjectFormData } from '../types/subject.types';
import { subjectSchema, type SubjectSchemaOutput } from '../validations/subjectSchema';

// ── Educational Options (matching backend) ──
const GRADE_LEVELS = ['الثالث الثانوي', 'الثاني الثانوي', 'الأول الثانوي'];
const TRACKS = ['علمي', 'أدبي', 'عام'];
const SUBJECT_ICONS = ['📘', '📗', '📕', '📙', '🔬', '⚗️', '🧮', '🗺️', '📐', '📏', '🧲', '💻', '🌍', '🎨', '📜'];

interface SubjectFormModalProps {
  open: boolean;
  subject?: Subject | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectFormData) => void;
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
}: SubjectFormModalProps) {
  const isEdit = !!subject;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues,
  });

  const selectedIcon = watch('icon');
  const isActive = watch('is_active');

  // Populate form when editing or resetting
  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        code: subject.code ?? '',
        grade_level: subject.grade_level ?? '',
        track: subject.track ?? '',
        icon: subject.icon ?? '📘',
        is_active: subject.is_active,
      });
    } else {
      reset(defaultValues);
    }
  }, [subject, open, reset]);

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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-[#0d1632] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-gradient-to-l from-blue-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-lg">
              {selectedIcon || '📘'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isEdit ? 'تعديل المادة الدراسية' : 'إضافة مادة دراسية جديدة'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEdit ? `تعديل: ${subject?.name}` : 'أدخل بيانات المادة الجديدة مع التحقق التلقائي'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              اسم المادة <span className="text-rose-400">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="مثال: الفيزياء — الثالث الثانوي العلمي"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#0b1226] border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.name
                  ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                  : 'border-white/[0.08] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30'
              }`}
              dir="rtl"
            />
            {errors.name && (
              <p className="text-xs text-rose-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Code + Icon Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">كود المادة</label>
              <input
                {...register('code')}
                type="text"
                placeholder="PHY-3S"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#0b1226] border text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono transition-all ${
                  errors.code ? 'border-rose-500/60' : 'border-white/[0.08] focus:border-blue-500/60'
                }`}
                dir="ltr"
                maxLength={20}
              />
              {errors.code && (
                <p className="text-xs text-rose-400">{errors.code.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">الأيقونة</label>
              <div className="relative">
                <select
                  {...register('icon')}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1226] border border-white/[0.08] focus:border-blue-500/60 text-sm text-white focus:outline-none transition-all cursor-pointer"
                  dir="ltr"
                >
                  {SUBJECT_ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grade Level + Track */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">المرحلة الدراسية</label>
              <select
                {...register('grade_level')}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b1226] border border-white/[0.08] focus:border-blue-500/60 text-sm text-white focus:outline-none transition-all cursor-pointer"
                dir="rtl"
              >
                <option value="">— اختر المرحلة —</option>
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">المسار الدراسي</label>
              <select
                {...register('track')}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b1226] border border-white/[0.08] focus:border-blue-500/60 text-sm text-white focus:outline-none transition-all cursor-pointer"
                dir="rtl"
              >
                <option value="">— اختر المسار —</option>
                {TRACKS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-sm font-semibold text-white">حالة المادة</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {isActive ? 'المادة ظاهرة ومتاحة للطلاب' : 'المادة مخفية ولا تظهر للطلاب'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValue('is_active', !isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                isActive ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300`}
                style={{ left: isActive ? '22px' : '2px' }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
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
