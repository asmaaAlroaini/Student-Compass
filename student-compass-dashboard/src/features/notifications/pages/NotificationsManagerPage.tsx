import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Plus,
  Send,
  Users,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'system' | 'exam_reminder' | 'announcement' | 'achievement';
  target_audience: 'all' | 'students' | 'teachers' | 'grade_3';
  sent_at: string;
  recipients_count: number;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    title: 'تذكير: اختبار الفيزياء التجريبي متاح الآن',
    message: 'تم فتح باب التقديم لاختبار الفيزياء التجريبي لطلاب الثالث الثانوي، بالتوفيق للجميع!',
    type: 'exam_reminder',
    target_audience: 'grade_3',
    sent_at: '2026-08-29T14:30:00Z',
    recipients_count: 320,
  },
  {
    id: 2,
    title: 'تحديث منصة بوصلة الطالب — ميزات جديدة',
    message: 'تم إضافة بنك الأسئلة التفاعلي ووضع التدريب الذكي لجميع المواد الدراسية.',
    type: 'announcement',
    target_audience: 'all',
    sent_at: '2026-08-25T09:00:00Z',
    recipients_count: 1450,
  },
  {
    id: 3,
    title: 'تهنئة المتصدرين في مسابقة الرياضيات',
    message: 'نبارك لجميع الطلاب الأوائل الحاصلين على أعلى الدرجات في ماراثون التفاضل والتكامل.',
    type: 'achievement',
    target_audience: 'students',
    sent_at: '2026-08-20T18:15:00Z',
    recipients_count: 1100,
  },
];

const audienceLabels: Record<NotificationItem['target_audience'], string> = {
  all: 'جميع المستخدمين (طلاب ومعلمون)',
  students: 'جميع الطلاب',
  teachers: 'الكادر التعليمي والمعلمون',
  grade_3: 'طلاب الثالث الثانوي فقط',
};

const typeBadges: Record<NotificationItem['type'], { label: string; color: string }> = {
  system: { label: 'تنبيه نظام', color: 'bg-muted text-muted-foreground border-border' },
  exam_reminder: { label: 'تذكير اختبار', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20' },
  announcement: { label: 'إعلان عام', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  achievement: { label: 'تهنئة وإنجاز', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
};

export default function NotificationsManagerPage() {
  const [notifications] = useState<NotificationItem[]>(mockNotifications);
  const [search, setSearch] = useState('');

  const filtered = notifications.filter(
    (n) => n.title.includes(search) || n.message.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black text-foreground tracking-tight">مركز الإشعارات والتعميمات</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Push Broadcast
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            إرسال إشعارات فورية وتنبيهات مخصصة للطلاب والمعلمين عبر المنصة وتطبيق الهاتف.
          </p>
        </div>

        <Link
          to={ROUTES.DASHBOARD.NOTIFICATIONS_CREATE}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          إرسال إشعار جديد
        </Link>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الإشعارات المرسلة', value: notifications.length, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', icon: Send },
          { label: 'إجمالي المستلمين', value: '2,870 مستلم', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Users },
          { label: 'تذكيرات الاختبارات', value: 1, color: 'text-violet-500 bg-violet-500/10 border-violet-500/20', icon: Bell },
          { label: 'نسبة وصول الرسائل', value: '99.8%', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: Sparkles },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="بحث في سجل الإشعارات المرسلة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
          dir="rtl"
        />
      </div>

      {/* ── Notifications Log List ── */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const typeCfg = typeBadges[item.type];
          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-card text-card-foreground border border-border hover:border-primary/40 transition space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${typeCfg.color}`}>
                    {typeCfg.label}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.sent_at).toLocaleDateString('ar-EG')}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    {item.recipients_count} مستلم
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 p-3.5 rounded-2xl border border-border">
                {item.message}
              </p>

              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                <span>الجمهور المستهدف:</span>
                <span className="font-semibold text-primary">
                  {audienceLabels[item.target_audience]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
