import React, { useEffect, useRef } from 'react';
import { X, BookOpen, Loader2, FlaskConical, PenLine, Globe } from 'lucide-react';
import type { Subject, SubjectFormData } from '../types/subject.types';

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

const defaultForm: SubjectFormData = {
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
  const [form, setForm] = React.useState<SubjectFormData>(defaultForm);
  const [errors, setErrors] = React.useState<Partial<Record<keyof SubjectFormData, string>>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!subject;

  // Populate form when editing
  useEffect(() => {
    if (subject) {
      setForm({
        name: subject.name,
        code: subject.code ?? '',
        grade_level: subject.grade_level ?? '',
        track: subject.track ?? '',
        icon: subject.icon ?? '📘',
        is_active: subject.is_active,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [subject, open]);

  // Focus first input on open
  useEffect(() => {
    if (open) setTimeout(() => firstInputRef.current?.focus(), 120);
  }, [open]);

  if (!open) return null;

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'اسم المادة مطلوب';
    if (form.name.trim().length < 2) e.name = 'الاسم يجب أن يكون أكثر من حرفين';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onSubmit(form);
  };

  const set = <K extends keyof SubjectFormData>(key: K, val: SubjectFormData[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
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
              {form.icon || '📘'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isEdit ? 'تعديل المادة الدراسية' : 'إضافة مادة دراسية جديدة'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEdit ? `تعديل: ${subject?.name}` : 'أدخل بيانات المادة الجديدة'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              اسم المادة <span className="text-rose-400">*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="مثال: الفيزياء — الثالث الثانوي العلمي"
              className={`w-full px-4 py-2.5 rounded-xl bg-[#0b1226] border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.name
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-white/[0.08] focus:border-blue-500/60'
              }`}
              dir="rtl"
            />
            {errors.name && (
              <p className="text-xs text-rose-400">{errors.name}</p>
            )}
          </div>

          {/* Code + Icon Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">كود المادة</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="PHY-3S"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b1226] border border-white/[0.08] focus:border-blue-500/60 text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono transition-all"
                dir="ltr"
                maxLength={20}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">الأيقونة</label>
              <div className="relative">
                <select
                  value={form.icon}
                  onChange={(e) => set('icon', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1226] border border-white/[0.08] focus:border-blue-500/60 text-sm text-white focus:outline-none transition-all appearance-none cursor-pointer"
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
                value={form.grade_level}
                onChange={(e) => set('grade_level', e.target.value)}
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
                value={form.track}
                onChange={(e) => set('track', e.target.value)}
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
                {form.is_active ? 'المادة ظاهرة ومتاحة للطلاب' : 'المادة مخفية ولا تظهر للطلاب'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => set('is_active', !form.is_active)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                form.is_active ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                  form.is_active ? 'left-5.5 translate-x-0' : 'left-0.5'
                }`}
                style={{ left: form.is_active ? '22px' : '2px' }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
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
