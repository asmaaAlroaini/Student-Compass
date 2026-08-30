import React from 'react';
import {
  LayoutDashboard,
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
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getAccessToken } from '@/lib/authStorage';
import { ROUTES } from '@/constants/routes';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  link?: string;
}

const STATS: StatCard[] = [
  { label: 'إجمالي الطلاب', value: '2,847', sub: '+128 هذا الشهر', icon: Users, color: 'blue', link: ROUTES.DASHBOARD.STUDENTS },
  { label: 'المعلمون والمشرفون', value: '34', sub: '12 معلم نشط اليوم', icon: UserCheck, color: 'indigo', link: ROUTES.DASHBOARD.TEACHERS },
  { label: 'المواد الدراسية', value: '24', sub: 'علمي وأدبي', icon: BookOpen, color: 'emerald', link: ROUTES.DASHBOARD.SUBJECTS },
  { label: 'بنك الأسئلة', value: '50,000+', sub: 'سؤال وزاري وتقييمي', icon: HelpCircle, color: 'amber', link: ROUTES.DASHBOARD.QUESTIONS },
  { label: 'الاختبارات المنشأة', value: '182', sub: '14 اختبار هذا الأسبوع', icon: FileCheck2, color: 'violet', link: ROUTES.DASHBOARD.EXAMS },
  { label: 'المسابقات النشطة', value: '8', sub: '342 مشارك الآن', icon: Trophy, color: 'orange', link: ROUTES.DASHBOARD.COMPETITIONS },
  { label: 'الإشعارات المرسلة', value: '1,204', sub: 'معدل فتح 78%', icon: Bell, color: 'cyan', link: ROUTES.DASHBOARD.NOTIFICATIONS },
  { label: 'معدل اجتياز الاختبارات', value: '74%', sub: '+3% عن الشهر الماضي', icon: TrendingUp, color: 'rose', link: ROUTES.DASHBOARD.REPORTS },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const quickActions = [
  { label: 'إضافة سؤال جديد', path: ROUTES.DASHBOARD.QUESTIONS_CREATE, color: 'bg-blue-600 hover:bg-blue-500' },
  { label: 'إنشاء اختبار', path: ROUTES.DASHBOARD.EXAMS_CREATE, color: 'bg-violet-600 hover:bg-violet-500' },
  { label: 'استيراد أسئلة (Excel)', path: ROUTES.DASHBOARD.QUESTIONS_IMPORT, color: 'bg-emerald-600 hover:bg-emerald-500' },
  { label: 'إرسال إشعار', path: ROUTES.DASHBOARD.NOTIFICATIONS_CREATE, color: 'bg-amber-600 hover:bg-amber-500' },
];

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const token = getAccessToken();

  return (
    <div className="space-y-6" dir="rtl">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-bl from-blue-600/25 via-indigo-600/15 to-transparent border border-blue-500/20">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-4 left-4 text-blue-500/10 text-8xl font-black select-none pointer-events-none">
          ADMIN
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              لوحة التحكم المركزية — نظام بوصلة الطالب
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              أهلاً، {user?.name} 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg">
              لوحة إحصائيات المنصة الأكاديمية الشاملة. راقب أداء الطلاب، إدارة المحتوى، وتتبع مؤشرات الأداء الرئيسية.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.path}
                to={a.path}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-xs shadow-lg transition-all ${a.color}`}
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
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-1">مؤشرات الأداء الرئيسية (KPIs)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            const colorClass = colorMap[stat.color];
            return (
              <Link
                key={stat.label}
                to={stat.link || '#'}
                className="group p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-muted/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</div>
                </div>
                <div className="text-[11px] text-muted-foreground">{stat.sub}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity + Session Info ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Activity Feed Placeholder */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              آخر نشاطات المنصة
            </h2>
            <Link to={ROUTES.DASHBOARD.REPORTS} className="text-xs text-blue-400 hover:text-blue-300 transition">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { text: 'أضاف أ. أحمد 50 سؤالاً جديداً لمادة الفيزياء', time: 'منذ 5 دقائق', color: 'bg-blue-500' },
              { text: 'تم إنشاء اختبار وزاري لمادة الكيمياء 2025', time: 'منذ 23 دقيقة', color: 'bg-violet-500' },
              { text: 'طالب جديد: محمد عبدالله — الثالث الثانوي علمي', time: 'منذ ساعة', color: 'bg-emerald-500' },
              { text: 'تم إرسال إشعار "مسابقة رياضيات أسبوعية" لـ 1,204 طالب', time: 'منذ 3 ساعات', color: 'bg-amber-500' },
              { text: 'استيراد 1,500 سؤال وزاري جديد بنجاح', time: 'منذ يوم', color: 'bg-rose-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full ${item.color} mt-1.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200">{item.text}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Info */}
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            بيانات جلسة المدير
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[10px] text-slate-500 mb-1">الاسم الكامل</p>
              <p className="text-xs text-white font-semibold">{user?.name}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[10px] text-slate-500 mb-1">البريد الإلكتروني</p>
              <p className="text-xs text-white font-mono" dir="ltr">{user?.email}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[10px] text-slate-500 mb-1">رمز التوثيق (Bearer Token)</p>
              <p className="text-[10px] text-blue-300 font-mono truncate" dir="ltr">
                {token ? `${token.substring(0, 30)}...` : 'غير متاح'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              جلسة نشطة ومؤمنة بـ Sanctum
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
