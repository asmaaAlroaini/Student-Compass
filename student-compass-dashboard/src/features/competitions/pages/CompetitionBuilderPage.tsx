import { useNavigate, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Trophy,
  ArrowRight,
  Save,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { competitionSchema, type CompetitionSchemaOutput } from '../types/competition.types';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { ROUTES } from '@/constants/routes';

export default function CompetitionBuilderPage() {
  const navigate = useNavigate();
  const { data: subjects = [] } = useSubjects();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(competitionSchema),
    defaultValues: {
      title: '',
      subject_id: undefined as number | undefined,
      start_time: '',
      end_time: '',
      duration_minutes: 30,
      total_marks: 100,
      prizes_summary: '',
    },
  });

  const onSubmit: SubmitHandler<CompetitionSchemaOutput> = async () => {
    toast.success('تم إنشاء المسابقة وجدولتها بنجاح 🏆');
    navigate(ROUTES.DASHBOARD.COMPETITIONS);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.COMPETITIONS}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">إنشاء مسابقة وتحدٍ أكاديمي جديد</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              تحديد توقيت التحدي، المادة المستهدفة، وتوزيع الجوائز للأوائل.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          جدولة ونشر المسابقة
        </button>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Basic Info */}
        <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            بيانات المسابقة
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              عنوان التحدي / المسابقة <span className="text-destructive">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="مثال: دوري العباقرة — الكيمياء العضوية"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">المادة الدراسية (اختياري / مسابقة عامة)</label>
            <select
              {...register('subject_id')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
            >
              <option value="">— تحدي عام لجميع المواد —</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade_level})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timing & Duration */}
        <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            التوقيت والمدة الزمنية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                تاريخ ووقت البدء <span className="text-destructive">*</span>
              </label>
              <input
                {...register('start_time')}
                type="datetime-local"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
              {errors.start_time && <p className="text-xs text-destructive">{errors.start_time.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                تاريخ ووقت الإغلاق <span className="text-destructive">*</span>
              </label>
              <input
                {...register('end_time')}
                type="datetime-local"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
              {errors.end_time && <p className="text-xs text-destructive">{errors.end_time.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">مدة الاختبار لكل طالب (بالدقائق)</label>
              <input
                {...register('duration_minutes')}
                type="number"
                min={5}
                max={180}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">الدرجة الكلية</label>
              <input
                {...register('total_marks')}
                type="number"
                min={10}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>
        </div>

        {/* Prizes */}
        <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            الجوائز والأوسمة
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">وصف الجوائز الممنوحة للأوائل</label>
            <textarea
              {...register('prizes_summary')}
              rows={2}
              placeholder="مثال: المركز الأول: درع التميز + 1000 نقطة، المركز الثاني: وسام العبقري + 500 نقطة..."
              className="w-full p-4 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
            />
          </div>
        </div>

      </form>

    </div>
  );
}
