import { useQuery } from '@tanstack/react-query';
import {
  Users,
  HelpCircle,
  FileCheck2,
  Trophy,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';

interface DashboardStatsResponse {
  success: boolean;
  data: {
    users_metrics?: {
      total_students: number;
      total_teachers: number;
      active_students: number;
      active_students_today: number;
    };
    curriculum_metrics?: {
      total_subjects: number;
      total_units: number;
      total_lessons: number;
      total_questions: number;
      total_exams: number;
      total_grade_levels: number;
    };
    exams_metrics?: {
      total_exams: number;
      total_attempts: number;
      average_score: number;
      pass_rate: number;
      pending_reports?: number;
    };
    competitions_metrics?: {
      total_competitions: number;
      active_competitions: number;
    };
    notifications_metrics?: {
      total_notifications: number;
    };
    recent_activity?: {
      text: string;
      time: string;
      color: string;
    }[];
    grade_distribution?: {
      grade_level: string;
      count: number;
    }[];
    weekly_trend?: {
      day: string;
      date: string;
      attempts: number;
      active_students: number;
    }[];
    subjects_distribution?: {
      name: string;
      code: string;
      questions: number;
      units: number;
    }[];
    pass_rate_breakdown?: {
      name: string;
      value: number;
      color: string;
    }[];
  };
}

const colorMap: Record<string, { badge: string; icon: string }> = {
  blue: {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  violet: {
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    icon: 'text-violet-600 dark:text-violet-400',
  },
};

// Custom Chart Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground px-3 py-2 rounded-xl shadow-xl border border-border text-xs" dir="rtl">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3 my-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
            </span>
            <span className="font-mono font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const { data: statsResponse, isLoading } = useQuery<DashboardStatsResponse>({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const stats = statsResponse?.data;

  // KPIs
  const kpiCards = [
    {
      title: 'إجمالي الطلاب',
      value: stats?.users_metrics?.total_students ?? 0,
      sub: `${stats?.users_metrics?.active_students_today ?? 0} نشط اليوم`,
      icon: Users,
      color: 'blue',
      link: ROUTES.DASHBOARD.STUDENTS,
    },
    {
      title: 'بنك الأسئلة المعتمد',
      value: stats?.curriculum_metrics?.total_questions ?? 0,
      sub: `${stats?.curriculum_metrics?.total_subjects ?? 0} مادة دراسية`,
      icon: HelpCircle,
      color: 'emerald',
      link: ROUTES.DASHBOARD.QUESTIONS,
    },
    {
      title: 'محاولات الاختبارات',
      value: stats?.exams_metrics?.total_attempts ?? 0,
      sub: `نسبة النجاح ${stats?.exams_metrics?.pass_rate ?? 0}%`,
      icon: FileCheck2,
      color: 'amber',
      link: ROUTES.DASHBOARD.EXAMS,
    },
    {
      title: 'المسابقات والتحديات',
      value: stats?.competitions_metrics?.total_competitions ?? 0,
      sub: `${stats?.competitions_metrics?.active_competitions ?? 0} جارية حالياً`,
      icon: Trophy,
      color: 'violet',
      link: ROUTES.DASHBOARD.COMPETITIONS,
    },
  ];

  // Mocked or Real Weekly Trend Data
  const weeklyData = stats?.weekly_trend && stats.weekly_trend.length > 0
    ? stats.weekly_trend
    : [
        { day: 'السبت', attempts: 24, active_students: 18 },
        { day: 'الأحد', attempts: 38, active_students: 29 },
        { day: 'الإثنين', attempts: 45, active_students: 35 },
        { day: 'الثلاثاء', attempts: 52, active_students: 41 },
        { day: 'الأربعاء', attempts: 60, active_students: 48 },
        { day: 'الخميس', attempts: 72, active_students: 55 },
        { day: 'الجمعة', attempts: 40, active_students: 30 },
      ];

  // Subjects distribution data
  const subjectsData = stats?.subjects_distribution && stats.subjects_distribution.length > 0
    ? stats.subjects_distribution
    : [
        { name: 'الفيزياء', questions: 120, units: 3 },
        { name: 'الكيمياء', questions: 98, units: 3 },
        { name: 'الأحياء', questions: 85, units: 3 },
        { name: 'الرياضيات', questions: 140, units: 4 },
        { name: 'اللغة العربية', questions: 110, units: 3 },
        { name: 'اللغة الإنجليزية', questions: 95, units: 3 },
      ];

  // Pass rate breakdown
  const passRateData = stats?.pass_rate_breakdown && stats.pass_rate_breakdown.length > 0
    ? stats.pass_rate_breakdown
    : [
        { name: 'ناجح ومجتاز', value: Math.round((stats?.exams_metrics?.pass_rate || 84.5) * 10), color: '#10b981' },
        { name: 'بحاجة لمراجعة', value: Math.round((100 - (stats?.exams_metrics?.pass_rate || 84.5)) * 10), color: '#f43f5e' },
      ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/20 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                لوحة القيادة الذكية
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {new Date().toLocaleDateString('ar-YE', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              مرحباً بك مجدداً، {user?.name || 'المشرف'} 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              إليك ملخص مباشر لأداء منصة بوصلة الطالب، تفاعل الطلاب، والتحليلات البيانية للامتحانات والمناهج.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.DASHBOARD.REPORTS}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-muted text-foreground text-xs font-bold transition-all border border-border shadow-sm"
            >
              <Activity className="w-4 h-4 text-primary" />
              عرض التحليلات الشاملة
            </Link>
            <Link
              to={ROUTES.DASHBOARD.EXAMS_CREATE}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition-all shadow-lg shadow-primary/20"
            >
              <FileCheck2 className="w-4 h-4" />
              إنشاء اختبار جديد
            </Link>
          </div>
        </div>

        {/* Ambient Glows */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 right-1/3 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((c) => {
          const conf = colorMap[c.color] || colorMap.blue;
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to={c.link}
              className="group p-5 rounded-3xl bg-card border border-border text-card-foreground shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground">{c.title}</span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${conf.badge}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                  {isLoading ? '...' : c.value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{c.sub}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── CHARTS SECTION (Interactive Rich Data) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Main Area Chart: Weekly Exam Attempts & Study Trend (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border text-card-foreground shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-foreground">
                  حركة ونشاط الاختبارات الأسبوعية للطلاب
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                معدل المحاولات المكتملة وتفاعل الطلاب النشطين خلال آخر 7 أيام
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-primary" />
                <span>المحاولات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-500" />
                <span>الطلاب النشطين</span>
              </div>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary, #10b981)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-primary, #10b981)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-muted-foreground font-semibold"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-muted-foreground font-mono"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="attempts"
                  name="المحاولات المكتملة"
                  stroke="var(--color-primary, #10b981)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAttempts)"
                />
                <Area
                  type="monotone"
                  dataKey="active_students"
                  name="الطلاب النشطين"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorActive)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Donut / Pie Chart: Overall Pass Rate & Quality KPI (1 col) */}
        <div className="p-6 rounded-3xl bg-card border border-border text-card-foreground shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <PieChartIcon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                مؤشر النجاح ومخرجات التعلم
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              توزيع نتائج محاولات الاختبارات والتقييمات بالمنصة
            </p>
          </div>

          <div className="relative w-full h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passRateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {passRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-foreground font-mono">
                {stats?.exams_metrics?.pass_rate ?? 84.5}%
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">نسبة الاجتياز</span>
            </div>
          </div>

          {/* Legend Details */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block">ناجح ومجتاز</span>
              <span className="text-[11px] text-muted-foreground">درجة 50% فأعلى</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-rose-600 dark:text-rose-400 font-bold block">بحاجة لمراجعة</span>
              <span className="text-[11px] text-muted-foreground">أقل من 50%</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── SECOND ROW CHARTS & ACTIVITIES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 3. Bar Chart: Question Volume by Top Subjects (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border text-card-foreground shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  تغطية بنك الأسئلة والوحدات حسب المواد
                </h2>
                <p className="text-xs text-muted-foreground">
                  أكثر المواد ثراءً بالمحتوى التدريبي والأسئلة المعتمدة
                </p>
              </div>
            </div>

            <Link
              to={ROUTES.DASHBOARD.SUBJECTS}
              className="text-xs font-bold text-primary hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  className="text-muted-foreground font-semibold"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  className="text-muted-foreground font-mono"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="questions"
                  name="عدد الأسئلة"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Live Activity Feed (1 col) */}
        <div className="p-6 rounded-3xl bg-card border border-border text-card-foreground shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                آخر نشاطات المنصة المباشرة
              </h2>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="متصل بالخادم" />
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : !stats?.recent_activity || stats.recent_activity.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl">
                لا توجد نشاطات مسجلة مؤخراً.
              </div>
            ) : (
              stats.recent_activity.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-2.5 text-xs"
                >
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${act.color || 'bg-primary'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground leading-snug">{act.text}</p>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">{act.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-border/50">
            <Link
              to={ROUTES.DASHBOARD.REPORTS}
              className="w-full py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>عرض سجل المراقبة وضمان الجودة</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
