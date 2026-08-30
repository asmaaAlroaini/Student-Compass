import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Settings2,
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

// ── Track icon & color mapping ──
const trackConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
}> = {
  علمي: {
    icon: FlaskConical,
    color: 'text-blue-500',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  أدبي: {
    icon: PenLine,
    color: 'text-violet-500',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  },
  عام: {
    icon: Globe,
    color: 'text-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
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

  React.useEffect(() => {
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
      setTracks(['عام']);
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              اسم الصف الدراسي <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الصف التاسع الأساسي أو الثالث الثانوي"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">الرمز التعريفي (Code)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="G9 أو G12"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none transition-all"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">ترتيب العرض</label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Tracks Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">المسارات التخصصية المتاحة</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tracks.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTrack(t)}
                    className="hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
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
                placeholder="أضف مساراً (مثلاً: علمي، أدبي، عام، مهني...)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddTrack}
                className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all cursor-pointer"
              >
                إضافة مسار
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">وصف اختياري</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ملاحظات حول المنهج أو المرحلة الدراسية..."
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition-all resize-none"
            />
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
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
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
  grade: AdminGradeLevel | null;
  onClose: () => void;
}

function AssignSubjectsModal({ open, grade, onClose }: AssignSubjectsModalProps) {
  const assignMutation = useAssignSubjectsToGrade();
  const { data: allSubjectsRes, isLoading: loadingSubjects } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ['admin', 'subjects'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.SUBJECTS);
      return res.data;
    },
    enabled: open,
  });

  const allSubjects = allSubjectsRes?.data ?? [];
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>('');

  React.useEffect(() => {
    if (grade && grade.subjects) {
      setSelectedSubjectIds(grade.subjects.map((s) => s.id));
    } else {
      setSelectedSubjectIds([]);
    }
  }, [grade, open]);

  if (!open || !grade) return null;

  const toggleSubject = (id: number) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    assignMutation.mutate(
      {
        id: grade.id,
        payload: {
          subject_ids: selectedSubjectIds,
          track: selectedTrack || null,
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  const gradeTracks = Array.isArray(grade.tracks) ? grade.tracks : ['عام'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card text-card-foreground border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
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
              <span className="text-primary">{selectedSubjectIds.length} مادة محددة</span>
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
                        <span className="text-lg shrink-0">{s.icon || '📘'}</span>
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
  const [expanded, setExpanded] = useState(true);

  const colors = [
    { ring: 'ring-blue-500/20', num: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    { ring: 'ring-indigo-500/20', num: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' },
    { ring: 'ring-violet-500/20', num: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30' },
  ];
  const c = colors[index % colors.length];

  const tracks = Array.isArray(grade.tracks) ? grade.tracks : ['عام'];
  const subjects = grade.subjects ?? [];

  return (
    <div
      className={`rounded-3xl bg-card text-card-foreground border border-border ring-1 ${c.ring} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
    >
      {/* Card Header */}
      <div className="p-5 flex items-center justify-between gap-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border font-black text-sm ${c.num}`}>
            {grade.order || index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">{grade.name}</h3>
              {grade.code && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                  {grade.code}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {subjects.length} مواد دراسية • {grade.students_count ?? 0} طالب مسجل
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            title="تعديل بيانات الصف"
            className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="حذف الصف"
            className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${expanded ? '-rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="p-5 space-y-4">
          
          {/* Tracks Section */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-muted-foreground">المسارات الدراسية:</div>
            <div className="flex flex-wrap gap-2">
              {tracks.map((trackName) => {
                const cfg = trackConfig[trackName] ?? trackConfig['عام'];
                const Icon = cfg.icon;
                return (
                  <div
                    key={trackName}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${cfg.badge}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    المسار {trackName}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Subjects Preview */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-muted-foreground">
                المواد المعينة ({subjects.length}):
              </div>
              <button
                type="button"
                onClick={onAssignSubjects}
                className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                تعيين وإدارة المواد
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground rounded-xl bg-muted/30 border border-dashed border-border">
                لم يتم تعيين مواد لهذا الصف بعد. اضغط على "تعيين وإدارة المواد" لربط المواد به.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subjects.slice(0, 6).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm">📘</span>
                      <span className="font-semibold text-foreground truncate">{sub.name}</span>
                    </div>
                    {sub.track && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-background border border-border text-muted-foreground shrink-0">
                        {sub.track}
                      </span>
                    )}
                  </div>
                ))}
                {subjects.length > 6 && (
                  <div className="p-2 text-center text-xs text-muted-foreground col-span-full">
                    +{subjects.length - 6} مواد إضافية أخرى...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick link */}
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
      )}
    </div>
  );
}

// ── Main Academic Structure Page ──
export default function AcademicStructurePage() {
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
            <h1 className="text-xl font-black text-foreground tracking-tight">إدارة الصفوف والمراحل الدراسية</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              CMS Management
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            إضافة وتعديل وحذف الصفوف الدراسية وتحديد المسارات (علمي/أدبي/عام) وتعيين المواد لكل صف.
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

      {/* ── KPI Summary Cards ── */}
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

      {/* ── Search & Filter Bar ── */}
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

      {/* ── Error State ── */}
      {isError && (
        <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
          ⚠️ تعذر جلب الصفوف الدراسية من الخادم. تأكد من تشغيل الباك إند بشكل صحيح.
        </div>
      )}

      {/* ── Grades Grid ── */}
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
