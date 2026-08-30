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
    // In production this connects to competitionApi.create(data)
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
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">إنشاء مسابقة وتحدٍ أكاديمي جديد</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              تحديد توقيت التحدي، المادة المستهدفة، وتوزيع الجوائز للأوائل.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          جدولة ونشر المسابقة
        </button>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Basic Info */}
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            بيانات المسابقة
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              عنوان التحدي / المسابقة <span className="text-rose-400">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="مثال: دوري العباقرة — الكيمياء العضوية"
              className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition"
            />
            {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">المادة الدراسية (اختياري / مسابقة عامة)</label>
            <select
              {...register('subject_id')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/60 transition cursor-pointer"
            >
              <option value="">— تحدي عام لجميع المواد —</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timing & Duration */}
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            التوقيت والمدة الزمنية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                تاريخ ووقت البدء <span className="text-rose-400">*</span>
              </label>
              <input
                {...register('start_time')}
                type="datetime-local"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
              />
              {errors.start_time && <p className="text-xs text-rose-400">{errors.start_time.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                تاريخ ووقت الإغلاق <span className="text-rose-400">*</span>
              </label>
              <input
                {...register('end_time')}
                type="datetime-local"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
              />
              {errors.end_time && <p className="text-xs text-rose-400">{errors.end_time.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">مدة الاختبار لكل طالب (بالدقائق)</label>
              <input
                {...register('duration_minutes')}
                type="number"
                min={5}
                max={180}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">الدرجة الكلية</label>
              <input
                {...register('total_marks')}
                type="number"
                min={10}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
              />
            </div>
          </div>
        </div>

        {/* Prizes */}
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            الجوائز والأوسمة
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">وصف الجوائز الممنوحة للأوائل</label>
            <textarea
              {...register('prizes_summary')}
              rows={2}
              placeholder="مثال: المركز الأول: درع التميز + 1000 نقطة، المركز الثاني: وسام العبقري + 500 نقطة..."
              className="w-full p-4 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition"
            />
          </div>
        </div>

      </form>

    </div>
  );
}
