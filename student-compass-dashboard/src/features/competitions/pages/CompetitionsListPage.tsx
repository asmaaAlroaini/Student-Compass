import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Plus,
  Calendar,
  Clock,
  Users,
  Search,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import type { Competition } from '../types/competition.types';

// Mock/Initial competitions list
const initialCompetitions: Competition[] = [
  {
    id: 1,
    title: 'تحدي الفيزياء الكبرى — أوائل المحافظات 2026',
    subject_id: 1,
    subject: { id: 1, name: 'الفيزياء' },
    start_time: '2026-09-01T10:00',
    end_time: '2026-09-01T12:00',
    duration_minutes: 60,
    total_marks: 100,
    participants_count: 142,
    status: 'upcoming',
    prizes_summary: 'جوائز نقدية وشهادات تميز للأوائل الثلاثة',
    created_at: '2026-08-25T10:00:00Z',
  },
  {
    id: 2,
    title: 'ماراثون الرياضيات — التفاضل والتكامل',
    subject_id: 2,
    subject: { id: 2, name: 'الرياضيات' },
    start_time: '2026-08-28T16:00',
    end_time: '2026-08-28T18:00',
    duration_minutes: 45,
    total_marks: 80,
    participants_count: 210,
    status: 'ended',
    prizes_summary: 'أوسمة فخرية واشتراكات مجانية',
    created_at: '2026-08-20T10:00:00Z',
  },
];

const statusBadge: Record<Competition['status'], { label: string; color: string }> = {
  upcoming: { label: 'قادمة قريباً', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  active: { label: 'جارية الآن 🔥', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 animate-pulse' },
  ended: { label: 'منتهية', color: 'bg-muted text-muted-foreground border-border' },
};

export default function CompetitionsListPage() {
  const [competitions] = useState<Competition[]>(initialCompetitions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filtered = competitions.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-black text-foreground tracking-tight">المسابقات والتحديات الأكاديمية</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Competitions Arena
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            إنشاء مسابقات وتحديات تفاعلية بين الطلاب مع احتساب النقاط ولوحة الأوائل.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={ROUTES.DASHBOARD.LEADERBOARD}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card hover:bg-muted text-amber-600 dark:text-amber-400 text-xs font-bold transition border border-amber-500/20 shadow-sm"
          >
            <Award className="w-4 h-4" />
            لوحة المتصدرين
          </Link>
          <Link
            to={ROUTES.DASHBOARD.COMPETITIONS_CREATE}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            إنشاء مسابقة جديدة
          </Link>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي المسابقات', value: competitions.length, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Trophy },
          { label: 'المسابقات القادمة', value: competitions.filter((c) => c.status === 'upcoming').length, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Calendar },
          { label: 'إجمالي المتسابقين', value: competitions.reduce((s, c) => s + (c.participants_count || 0), 0), color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: Users },
          { label: 'الجوائز الممنوحة', value: '15 جائزة', color: 'text-violet-500 bg-violet-500/10 border-violet-500/20', icon: Sparkles },
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

      {/* ── Filters Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث في عنوان المسابقة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
            dir="rtl"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer transition"
          dir="rtl"
        >
          <option value="">كل الحالات</option>
          <option value="upcoming">قادمة قريباً</option>
          <option value="active">جارية</option>
          <option value="ended">منتهية</option>
        </select>
      </div>

      {/* ── Competitions Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comp) => {
          const badge = statusBadge[comp.status];
          return (
            <div
              key={comp.id}
              className="p-5 rounded-3xl bg-card text-card-foreground border border-border hover:border-amber-500/40 transition-all space-y-4 group shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg border mb-2 ${badge.color}`}>
                    {badge.label}
                  </span>
                  <h3 className="text-base font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {comp.title}
                  </h3>
                  {comp.subject && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      <span>{comp.subject.name}</span>
                    </div>
                  )}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>

              {comp.prizes_summary && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>{comp.prizes_summary}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{comp.duration_minutes} دقيقة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{comp.total_marks} درجة</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Users className="w-3.5 h-3.5" />
                  <span>{comp.participants_count} مشارك</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
