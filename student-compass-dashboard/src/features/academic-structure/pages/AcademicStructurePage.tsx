import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  GraduationCap,
  BookOpen,
  Users,
  ChevronLeft,
  School,
  FlaskConical,
  PenLine,
  Globe,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Compass,
  DoorOpen,
} from 'lucide-react';
import {
  useAdminGradeLevels,
  useCreateGradeLevel,
  useUpdateGradeLevel,
  useDeleteGradeLevel,
  useAssignSubjectsToGrade,
} from '../hooks/useAcademicStructure';
import type { AdminGradeLevel } from '../types/academic.types';
import { ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { SubjectIconBadge } from '@/features/subjects/components/SubjectIconBadge';

// ── Track icon & color mapping ──
const trackConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  gradient: string;
  desc: string;
}> = {
  علمي: {
    icon: FlaskConical,
    color: 'text-blue-500',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    gradient: 'from-blue-500/10 to-indigo-500/5 border-blue-500/20',
    desc: 'يركز على العلوم الطبيعية والرياضيات والفيزياء والكيمياء والأحياء للتهيؤ للتخصصات الهندسية والطبية.',
  },
  أدبي: {
    icon: PenLine,
    color: 'text-violet-500',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    gradient: 'from-violet-500/10 to-purple-500/5 border-violet-500/20',
    desc: 'يركز على اللغات والعلوم الإنسانية والاجتماعية والتاريخ والجغرافيا والفلسفة للتهيؤ للعلوم القانونية والإدارية.',
  },
  عام: {
    icon: Globe,
    color: 'text-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    gradient: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20',
    desc: 'المسار التأسيسي المشترك لجميع طلاب المرحلة الثانوية الأولى لبناء قاعدة معرفية متوازنة في شتى العلوم.',
  },
};

// ── Add / Edit Grade Modal ──
interface GradeFormModalProps {
  open: boolean;
  grade?: AdminGradeLevel | null;
  onClose: () => void;
}

function GradeFormModal({ open, grade, onClose }: GradeFormModalProps) {
  const isEdit = !!grade;
  const createMutation = useCreateGradeLevel();
  const updateMutation = useUpdateGradeLevel();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [tracks, setTracks] = useState<string[]>(['علمي', 'أدبي']);
  const [newTrackInput, setNewTrackInput] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (grade) {
      setName(grade.name);
      setCode(grade.code || '');
      setOrder(grade.order ?? 1);
      setTracks(Array.isArray(grade.tracks) ? grade.tracks : ['عام']);
      setDescription(grade.description || '');
      setIsActive(grade.is_active ?? true);
    } else {
      setName('');
      setCode('');
      setOrder(1);
      setTracks(['علمي', 'أدبي']);
      setDescription('');
      setIsActive(true);
    }
  }, [grade, open]);

  if (!open) return null;

  const handleAddTrack = () => {
    const t = newTrackInput.trim();
    if (t && !tracks.includes(t)) {
      setTracks([...tracks, t]);
      setNewTrackInput('');
    }
  };

  const handleRemoveTrack = (trackToRemove: string) => {
    setTracks(tracks.filter((t) => t !== trackToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      code: code.trim() || undefined,
      order: Number(order) || 0,
      tracks: tracks.length > 0 ? tracks : ['عام'],
      description: description.trim() || undefined,
      is_active: isActive,
    };

    if (isEdit && grade) {
      updateMutation.mutate({ id: grade.id, payload }, { onSuccess: () => onClose() });
    } else {
      createMutation.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? 'تعديل بيانات الصف الدراسي' : 'إضافة صف / مرحلة دراسية جديدة'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEdit ? `تعديل: ${grade?.name}` : 'حدد اسم المرحلة والمسارات التعليمية التابعة لها'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              اسم الصف / المرحلة الدراسية <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الثالث الثانوي، الثاني الثانوي..."
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">كود المرحلة (اختياري)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="G12"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground font-mono focus:outline-none focus:border-primary transition"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">الترتيب</label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Tracks Tag Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              المسارات المتاحة لهذا الصف
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tracks.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTrack(t)}
                    className="hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTrackInput}
                onChange={(e) => setNewTrackInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTrack();
                  }
                }}
                placeholder="أضف مسار (مثال: علمي، أدبي، عام، تحضيري)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                dir="rtl"
              />
              <button
                type="button"
                onClick={handleAddTrack}
                className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition cursor-pointer"
              >
                إضافة
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">الوصف والملاحظات (اختياري)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف تفصيلي للصف الدراسي والمسارات المرتبطة به..."
              className="w-full p-3 rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
              dir="rtl"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
            <div>
              <div className="text-xs font-semibold text-foreground">حالة المرحلة</div>
              <div className="text-[10px] text-muted-foreground">تفعيل ظهور المرحلة للمستخدمين</div>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-300 cursor-pointer ${
                isActive ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: isActive ? '22px' : '2px' }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GraduationCap className="w-4 h-4" />
              )}
              {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الصف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Assign Subjects Modal ──
interface AssignSubjectsModalProps {
  open: boolean;
  grade?: AdminGradeLevel | null;
  onClose: () => void;
}

function AssignSubjectsModal({ open, grade, onClose }: AssignSubjectsModalProps) {
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>('');

  const assignMutation = useAssignSubjectsToGrade();

  const { data: subjectsRes, isLoading: loadingSubjects } = useQuery<{
    success: boolean;
    data: any[];
  }>({
    queryKey: ['admin', 'subjects', 'all'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.SUBJECTS);
      return res.data;
    },
    enabled: open,
  });

  const allSubjects = subjectsRes?.data ?? [];

  useEffect(() => {
    if (grade && open) {
      const existingIds = (grade.subjects ?? []).map((s) => s.id);
      setSelectedSubjectIds(existingIds);
      const gradeTracks = Array.isArray(grade.tracks) ? grade.tracks : ['عام'];
      setSelectedTrack(gradeTracks[0] || '');
    }
  }, [grade, open]);

  if (!open || !grade) return null;

  const toggleSubject = (id: number) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    assignMutation.mutate(
      {
        id: grade.id,
        payload: {
          subject_ids: selectedSubjectIds,
          track: selectedTrack || undefined,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const gradeTracks = Array.isArray(grade.tracks) ? grade.tracks : ['عام'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card text-card-foreground border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                إدارة وتعيين المواد لـ ({grade.name})
              </h2>
              <p className="text-xs text-muted-foreground">
                اختر المواد الدراسية التي تنتمي لهذا الصف وحدد مسارها الافتراضي
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Track Filter / Assignment */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-muted/40 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground">المسار للمواد المحددة:</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                سيتم تطبيق هذا المسار على المواد التي تقوم بتعيينها
              </div>
            </div>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-3 py-2 rounded-xl bg-background border border-input text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="">مشترك / بدون مسار</option>
              {gradeTracks.map((t) => (
                <option key={t} value={t}>
                  المسار {t}
                </option>
              ))}
            </select>
          </div>

          {/* Subjects Grid Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span>قائمة المواد المتاحة في المنصة</span>
              <span className="text-primary font-bold">{selectedSubjectIds.length} مادة محددة</span>
            </div>

            {loadingSubjects ? (
              <div className="p-8 text-center text-muted-foreground text-xs">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                جاري تحميل المواد...
              </div>
            ) : allSubjects.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs border border-dashed border-border rounded-2xl">
                لا توجد مواد مضافة في النظام حالياً. انتقل لإدارة المواد وأضف مادة جديدة أولاً.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {allSubjects.map((s) => {
                  const isSelected = selectedSubjectIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleSubject(s.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-foreground'
                          : 'bg-background hover:bg-muted/50 border-border text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <SubjectIconBadge icon={s.icon} name={s.name} size="sm" />
                        <div className="truncate">
                          <div className="text-xs font-bold truncate text-foreground">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {s.grade_level ? `حالياً: ${s.grade_level}` : 'غير مخصصة لصف'} {s.track ? `— ${s.track}` : ''}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={assignMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
          >
            {assignMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {assignMutation.isPending ? 'جاري الحفظ...' : 'حفظ تعيين المواد'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Grade Level Card Component ──
function GradeCard({
  grade,
  index,
  onEdit,
  onDelete,
  onAssignSubjects,
}: {
  grade: AdminGradeLevel;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onAssignSubjects: () => void;
}) {
  const colors = [
    { num: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    { num: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' },
    { num: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30' },
  ];
  const c = colors[index % colors.length];

  const tracks = Array.isArray(grade.tracks) ? grade.tracks : ['عام'];
  const subjects = grade.subjects ?? [];

  return (
    <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold border font-mono shrink-0 ${c.num}`}>
            {grade.code || index + 1}
          </span>
          <div>
            <h3 className="text-base font-black text-foreground">{grade.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {subjects.length} مواد دراسية • {grade.students_count ?? 0} طالب مسجل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition cursor-pointer"
            title="تعديل الصف"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition cursor-pointer"
            title="حذف الصف"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tracks Badges */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-muted-foreground">المسارات الدراسية:</div>
        <div className="flex flex-wrap gap-1.5">
          {tracks.map((t) => {
            const conf = trackConfig[t] || trackConfig['عام'];
            const Icon = conf.icon;
            return (
              <span
                key={t}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${conf.badge}`}
              >
                <Icon className="w-3 h-3" />
                المسار {t}
              </span>
            );
          })}
        </div>
      </div>

      {/* Subjects preview */}
      <div className="space-y-2 pt-1 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-muted-foreground">المواد المسندة للصف:</span>
          <button
            type="button"
            onClick={onAssignSubjects}
            className="text-primary hover:underline font-semibold cursor-pointer"
          >
            تعديل التعيين ({subjects.length})
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="p-3 text-center rounded-xl bg-muted/20 border border-dashed border-border text-xs text-muted-foreground">
            لم يتم إسناد مواد لهذا الصف بعد.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-0.5">
            {subjects.slice(0, 6).map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/80 text-[11px] truncate"
              >
                <span className="font-semibold text-foreground truncate">{sub.name}</span>
                {sub.track && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-background text-muted-foreground shrink-0 mr-1">
                    {sub.track}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action link */}
      <div className="pt-2">
        <Link
          to={`${ROUTES.DASHBOARD.SUBJECTS}?grade=${encodeURIComponent(grade.name)}`}
          className="w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          عرض مواد {grade.name} في شاشة المناهج
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ── Tracks Tab View Component ──
function TracksTabView({ gradeLevels }: { gradeLevels: AdminGradeLevel[] }) {
  const tracksList = [
    {
      id: 'علمي',
      name: 'المسار العلمي',
      code: 'SCI',
      color: 'blue',
      icon: FlaskConical,
      description: 'مسار تخصصي يركز على العلوم الدقيقة، الرياضيات، الفيزياء، الكيمياء، والأحياء لإعداد الطلاب للكليات العلمية والطبية والهندسية.',
      grades: gradeLevels.filter((g) => (g.tracks || []).includes('علمي')).map((g) => g.name),
      subjectsCount: 8,
      studentsCount: 1420,
    },
    {
      id: 'أدبي',
      name: 'المسار الأدبي',
      code: 'LIT',
      color: 'violet',
      icon: PenLine,
      description: 'مسار تخصصي يركز على اللغات، التاريخ، الجغرافيا، الفلسفة، والعلوم الإنسانية لتأهيل الطلاب للتخصصات الإدارية والقانونية والاجتماعية.',
      grades: gradeLevels.filter((g) => (g.tracks || []).includes('أدبي')).map((g) => g.name),
      subjectsCount: 6,
      studentsCount: 890,
    },
    {
      id: 'عام',
      name: 'المسار العام / المشترك',
      code: 'GEN',
      color: 'emerald',
      icon: Globe,
      description: 'المسار التأسيسي لجميع طلاب المرحلة الثانوية الأولى لتزويدهم بالمعارف الأساسية في شتى التخصصات قبل التفرع الأكاديمي.',
      grades: gradeLevels.filter((g) => (g.tracks || []).includes('عام')).map((g) => g.name),
      subjectsCount: 7,
      studentsCount: 1100,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tracksList.map((track) => {
          const Icon = track.icon;
          const conf = trackConfig[track.id] || trackConfig['عام'];
          return (
            <div
              key={track.id}
              className={`p-6 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 bg-gradient-to-b ${conf.gradient}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${conf.badge}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-background border border-border text-muted-foreground">
                    {track.code}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-foreground">{track.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {track.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border/60">
                <div className="text-xs font-bold text-foreground">المراحل المطبق عليها:</div>
                <div className="flex flex-wrap gap-1.5">
                  {track.grades.length > 0 ? (
                    track.grades.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs font-semibold text-foreground"
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">غير مخصص لصفوف حالياً</span>
                  )}
                </div>

                <Link
                  to={`${ROUTES.DASHBOARD.SUBJECTS}?track=${encodeURIComponent(track.id)}`}
                  className="w-full py-2.5 rounded-xl bg-background hover:bg-muted/80 border border-border text-foreground text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <BookOpen className="w-4 h-4 text-primary" />
                  استعراض مواد {track.name}
                  <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Classrooms Tab View Component ──
function ClassroomsTabView({ gradeLevels }: { gradeLevels: AdminGradeLevel[] }) {
  const [classrooms, setClassrooms] = useState([
    { id: 1, name: 'شعبة أ (التميز العلمي)', grade: 'الثالث الثانوي', track: 'علمي', students: 38, capacity: 40, supervisor: 'أ. سامي الحميري' },
    { id: 2, name: 'شعبة ب (الأوائل)', grade: 'الثالث الثانوي', track: 'علمي', students: 35, capacity: 40, supervisor: 'أ. مروان القدسي' },
    { id: 3, name: 'شعبة ج (الأدبي المتقدم)', grade: 'الثالث الثانوي', track: 'أدبي', students: 32, capacity: 35, supervisor: 'أ. فهد الرويشان' },
    { id: 4, name: 'شعبة 1 (العلمي العام)', grade: 'الثاني الثانوي', track: 'علمي', students: 40, capacity: 42, supervisor: 'أ. عادل النعمان' },
    { id: 5, name: 'شعبة 2 (الأدبي العام)', grade: 'الثاني الثانوي', track: 'أدبي', students: 28, capacity: 35, supervisor: 'أ. وليد العبسي' },
    { id: 6, name: 'شعبة أ (التأسيس العام)', grade: 'الأول الثانوي', track: 'عام', students: 42, capacity: 45, supervisor: 'أ. نبيل الشامي' },
  ]);

  const [addClassModal, setAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState(gradeLevels[0]?.name || 'الثالث الثانوي');
  const [newClassTrack, setNewClassTrack] = useState('علمي');
  const [newClassCapacity, setNewClassCapacity] = useState(40);
  const [newClassSupervisor, setNewClassSupervisor] = useState('');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    setClassrooms([
      ...classrooms,
      {
        id: Date.now(),
        name: newClassName.trim(),
        grade: newClassGrade,
        track: newClassTrack,
        students: 0,
        capacity: Number(newClassCapacity) || 40,
        supervisor: newClassSupervisor.trim() || 'غير معين',
      },
    ]);

    setNewClassName('');
    setNewClassSupervisor('');
    setAddClassModal(false);
  };

  const handleDeleteClass = (id: number) => {
    setClassrooms(classrooms.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-primary" />
            الشعب والمجموعات الدراسية المعتمدة
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            إدارة توزيع الطلاب في الفصول والشعب وتعيين المشرفين الأكاديميين.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddClassModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          إضافة شعبة / فصل جديد
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map((c) => {
          const conf = trackConfig[c.track] || trackConfig['عام'];
          const Icon = conf.icon;
          return (
            <div
              key={c.id}
              className="p-5 rounded-3xl bg-card border border-border text-card-foreground shadow-sm hover:border-primary/30 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-black text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.grade}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${conf.badge}`}>
                  <Icon className="w-3 h-3" />
                  {c.track}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>المشرف الأكاديمي:</span>
                  <span className="font-bold text-foreground">{c.supervisor}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>الطلاب المسجلين:</span>
                  <span className="font-bold text-foreground">
                    {c.students} / {c.capacity} طالب
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (c.students / c.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteClass(c.id)}
                  className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs transition cursor-pointer"
                  title="حذف الشعبة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Class Modal */}
      {addClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddClassModal(false)} />
          <div className="relative w-full max-w-md bg-card text-card-foreground border border-border rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-primary" />
                إضافة شعبة / فصل دراسي جديد
              </h3>
              <button
                type="button"
                onClick={() => setAddClassModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">اسم الشعبة / الفصل</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="مثال: شعبة أ (أوائل الثالث الثانوي)"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-input text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">الصف الدراسي</label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-input text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {gradeLevels.map((g) => (
                      <option key={g.id || g.name} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">المسار</label>
                  <select
                    value={newClassTrack}
                    onChange={(e) => setNewClassTrack(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-input text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="علمي">علمي</option>
                    <option value="أدبي">أدبي</option>
                    <option value="عام">عام</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">السعة الاستيعابية</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newClassCapacity}
                    onChange={(e) => setNewClassCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-input text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">المشرف الأكاديمي</label>
                  <input
                    type="text"
                    value={newClassSupervisor}
                    onChange={(e) => setNewClassSupervisor(e.target.value)}
                    placeholder="اسم المعلم المشرف"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-input text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddClassModal(false)}
                  className="flex-1 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow"
                >
                  حفظ الشعبة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Academic Structure Page ──
export default function AcademicStructurePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path
  const currentTab = location.pathname.includes('/tracks')
    ? 'tracks'
    : location.pathname.includes('/classrooms')
    ? 'classrooms'
    : 'stages';

  const { data: adminGradesRes, isLoading, isError } = useAdminGradeLevels();
  const deleteMutation = useDeleteGradeLevel();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<AdminGradeLevel | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningGrade, setAssigningGrade] = useState<AdminGradeLevel | null>(null);

  const gradeLevels = adminGradesRes?.data ?? [];

  const filtered = gradeLevels.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.code && g.code.toLowerCase().includes(search.toLowerCase()))
  );

  const totalGrades = gradeLevels.length;
  const totalSubjects = gradeLevels.reduce((sum, g) => sum + (g.subjects_count ?? g.subjects?.length ?? 0), 0);
  const totalStudents = gradeLevels.reduce((sum, g) => sum + (g.students_count ?? 0), 0);

  const handleOpenCreate = () => {
    setEditingGrade(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (grade: AdminGradeLevel) => {
    setEditingGrade(grade);
    setModalOpen(true);
  };

  const handleOpenAssign = (grade: AdminGradeLevel) => {
    setAssigningGrade(grade);
    setAssignModalOpen(true);
  };

  const handleDeleteGrade = (grade: AdminGradeLevel) => {
    const confirm = window.confirm(`هل أنت متأكد من حذف (${grade.name})؟`);
    if (!confirm) return;

    deleteMutation.mutate({ id: grade.id });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black text-foreground tracking-tight">إدارة الهيكل التعليمي والمراحل الدراسية</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              CMS Structure
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            تخصيص الصفوف، المراحل الدراسية، المسارات التخصصية (علمي/أدبي/عام) والفصول والشعب وتعيين المناهج.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={ROUTES.DASHBOARD.SUBJECTS}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs transition-all border border-border"
          >
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            شاشة المواد الدراسية
          </Link>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة صف دراسي جديد
          </button>
        </div>
      </div>

      {/* ── Tab Switcher Bar ── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border w-fit shadow-sm">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD.ACADEMIC_STAGES)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            currentTab === 'stages'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          المراحل والصفوف الدراسية ({totalGrades})
        </button>

        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD.ACADEMIC_TRACKS)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            currentTab === 'tracks'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          المسارات والأقسام التخصصية (3)
        </button>

        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD.ACADEMIC_CLASSROOMS)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            currentTab === 'classrooms'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <DoorOpen className="w-4 h-4" />
          الفصول والشعب والمجموعات
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      {currentTab === 'tracks' ? (
        <TracksTabView gradeLevels={gradeLevels} />
      ) : currentTab === 'classrooms' ? (
        <ClassroomsTabView gradeLevels={gradeLevels} />
      ) : (
        /* Stages View */
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: 'إجمالي المراحل والصفوف', value: isLoading ? '—' : totalGrades, icon: GraduationCap, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
              { label: 'المواد الدراسية المعينة', value: isLoading ? '—' : totalSubjects, icon: BookOpen, color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
              { label: 'إجمالي الطلاب المسجلين بالصفوف', value: isLoading ? '—' : totalStudents, icon: Users, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-card border border-border text-card-foreground space-y-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="البحث عن صف دراسي..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                dir="rtl"
              />
            </div>
          </div>

          {/* Error State */}
          {isError && (
            <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
              ⚠️ تعذر جلب الصفوف الدراسية من الخادم. تأكد من تشغيل الباك إند بشكل صحيح.
            </div>
          )}

          {/* Grades Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <School className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-bold text-foreground">الصفوف والمراحل الدراسية</h2>
              {!isLoading && (
                <span className="text-xs text-muted-foreground">({filtered.length} مرحلة)</span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-3xl bg-card border border-border p-5 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-36 bg-muted rounded-lg" />
                        <div className="h-3 w-20 bg-muted rounded-lg" />
                      </div>
                    </div>
                    <div className="h-20 rounded-2xl bg-muted" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-3xl p-8 space-y-3">
                <School className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground font-semibold">
                  {search ? `لا توجد نتائج مطابقة لـ "${search}"` : 'لا توجد صفوف دراسية مضافة حتى الآن'}
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  إضافة أول صف دراسي
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((grade, i) => (
                  <GradeCard
                    key={grade.id}
                    grade={grade}
                    index={i}
                    onEdit={() => handleOpenEdit(grade)}
                    onDelete={() => handleDeleteGrade(grade)}
                    onAssignSubjects={() => handleOpenAssign(grade)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <GradeFormModal
        open={modalOpen}
        grade={editingGrade}
        onClose={() => {
          setModalOpen(false);
          setEditingGrade(null);
        }}
      />

      {/* ── Assign Subjects Modal ── */}
      <AssignSubjectsModal
        open={assignModalOpen}
        grade={assigningGrade}
        onClose={() => {
          setAssignModalOpen(false);
          setAssigningGrade(null);
        }}
      />

    </div>
  );
}
