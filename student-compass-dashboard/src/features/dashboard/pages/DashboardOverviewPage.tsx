import { useQuery } from '@tanstack/react-query';
import {
  Users,
  HelpCircle,
  BookOpen,
  FileCheck2,
  Trophy,
  Bell,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  UserCheck,
  Loader2,
} from 'lucide-react';
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
  };
}

const colorMap: Record<string, { badge: string; icon: string }> = {
  blue: {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  indigo: {
    badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    icon: 'text-indigo-600 dark:text-indigo-400',
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
  orange: {
    badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    icon: 'text-orange-600 dark:text-orange-400',
  },
  cyan: {
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    icon: 'text-cyan-600 dark:text-cyan-400',
  },
  rose: {
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    icon: 'text-rose-600 dark:text-rose-400',
  },
};

const quickActions = [
  { label: 'إضافة سؤال جديد', path: ROUTES.DASHBOARD.QUESTIONS_CREATE, color: 'bg-blue-600 hover:bg-blue-500' },
  { label: 'إنشاء اختبار', path: ROUTES.DASHBOARD.EXAMS_CREATE, color: 'bg-violet-600 hover:bg-violet-500' },
  { label: 'إدارة الصفوف', path: ROUTES.DASHBOARD.ACADEMIC, color: 'bg-emerald-600 hover:bg-emerald-500' },
  { label: 'إرسال إشعار', path: ROUTES.DASHBOARD.NOTIFICATIONS_CREATE, color: 'bg-amber-600 hover:bg-amber-500' },
];

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const { data: dashboardData, isLoading } = useQuery<DashboardStatsResponse>({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await apiClient.get<DashboardStatsResponse>(API_ENDPOINTS.ADMIN.DASHBOARD);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const m = dashboardData?.data;

  const STATS = [
    {
      label: 'إجمالي الطلاب المسجلين',
      value: isLoading ? '—' : Number(m?.users_metrics?.total_students ?? 0).toLocaleString(),
      sub: `${m?.users_metrics?.active_students ?? 0} طالب نشط في المنصة`,
      icon: Users,
      color: 'blue',
      link: ROUTES.DASHBOARD.STUDENTS,
    },
    {
      label: 'المعلمون والمشرفون',
      value: isLoading ? '—' : String(m?.users_metrics?.total_teachers ?? 0),
      sub: 'كادر تدريسي وإشرافي معتمد',
      icon: UserCheck,
      color: 'indigo',
      link: ROUTES.DASHBOARD.TEACHERS,
    },
    {
      label: 'المواد والصفوف الدراسية',
      value: isLoading ? '—' : `${m?.curriculum_metrics?.total_subjects ?? 0} مادة`,
      sub: `${m?.curriculum_metrics?.total_grade_levels ?? 0} صفوف • ${m?.curriculum_metrics?.total_units ?? 0} وحدة`,
      icon: BookOpen,
      color: 'emerald',
      link: ROUTES.DASHBOARD.ACADEMIC,
    },
    {
      label: 'بنك الأسئلة المعتمدة',
      value: isLoading ? '—' : `${Number(m?.curriculum_metrics?.total_questions ?? 0).toLocaleString()}`,
      sub: 'سؤال وزاري وتقييمي وتفاعلي',
      icon: HelpCircle,
      color: 'amber',
      link: ROUTES.DASHBOARD.QUESTIONS,
    },
    {
      label: 'الاختبارات المنشأة',
      value: isLoading ? '—' : String(m?.exams_metrics?.total_exams ?? 0),
      sub: `${m?.exams_metrics?.total_attempts ?? 0} تقديم طالب للاختبارات`,
      icon: FileCheck2,
      color: 'violet',
      link: ROUTES.DASHBOARD.EXAMS,
    },
    {
      label: 'المسابقات النشطة',
      value: isLoading ? '—' : `${m?.competitions_metrics?.active_competitions ?? 0} نشطة`,
      sub: `من إجمالي ${m?.competitions_metrics?.total_competitions ?? 0} مسابقة`,
      icon: Trophy,
      color: 'orange',
      link: ROUTES.DASHBOARD.COMPETITIONS,
    },
    {
      label: 'الإشعارات الصادرة',
      value: isLoading ? '—' : String(m?.notifications_metrics?.total_notifications ?? 0),
      sub: 'تنبيهات فورية مرسلة للطلاب',
      icon: Bell,
      color: 'cyan',
      link: ROUTES.DASHBOARD.NOTIFICATIONS,
    },
    {
      label: 'معدل اجتياز الاختبارات',
      value: isLoading ? '—' : `${m?.exams_metrics?.pass_rate ?? 0}%`,
      sub: `متوسط الدرجات: ${m?.exams_metrics?.average_score ?? 0}%`,
      icon: TrendingUp,
      color: 'rose',
      link: ROUTES.DASHBOARD.REPORTS,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-bl from-primary/20 via-primary/10 to-transparent border border-primary/20 shadow-sm">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-4 left-4 text-primary/10 text-8xl font-black select-none pointer-events-none">
          ADMIN
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              لوحة التحكم المركزية — نظام بوصلة الطالب
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              أهلاً، {user?.name} 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg">
              لوحة إحصائيات المنصة الشاملة. راقب أداء الطلاب، إدارة المناهج والصفوف، وتتبع مؤشرات الأداء الحقيقية.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.path}
                to={a.path}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-xs shadow-lg transition-all ${a.color}`}
              >
                {a.label}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Stats Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">مؤشرات الأداء الرئيسية (Live KPIs)</h2>
          {isLoading && (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              جاري تحديث المؤشرات...
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            const style = colorMap[stat.color] ?? colorMap.blue;
            return (
              <Link
                key={stat.label}
                to={stat.link || '#'}
                className="group p-4 rounded-2xl bg-card text-card-foreground border border-border hover:border-primary/40 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${style.badge}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</div>
                </div>
                <div className="text-[11px] text-muted-foreground/80 font-medium">{stat.sub}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity + System Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Real Activity Feed */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              آخر نشاطات المنصة المباشرة
            </h2>
            <Link to={ROUTES.DASHBOARD.REPORTS} className="text-xs text-primary hover:underline transition">
              عرض التحليلات
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                جاري جلب أحدث الأنشطة...
              </div>
            ) : m?.recent_activity && m.recent_activity.length > 0 ? (
              m.recent_activity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} mt-1.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground rounded-2xl bg-muted/30">
                لا توجد أنشطة مسجلة حديثاً في المنصة.
              </div>
            )}
          </div>
        </div>

        {/* Session & Quick Info */}
        <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            بيانات جلسة المسؤول
          </h2>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">الاسم الكامل</p>
              <p className="text-xs text-foreground font-bold">{user?.name}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">البريد الإلكتروني</p>
              <p className="text-xs text-foreground font-mono" dir="ltr">{user?.email}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
              <p className="text-[11px] text-muted-foreground mb-1">الدور والصلاحية</p>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 inline-block">
                المدير العام (System Administrator)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              جلسة متصلة ومؤمنة بنجاح
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
