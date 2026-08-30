import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  ArrowRight,
  Medal,
  Search,
  Sparkles,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import type { LeaderboardUser } from '../types/competition.types';

const mockLeaderboard: LeaderboardUser[] = [
  {
    rank: 1,
    user_id: 101,
    name: 'سارة أحمد اليافعي',
    email: 'sarah.yafei@example.com',
    grade_level: 'الثالث الثانوي — علمي',
    total_points: 3850,
    exams_completed: 28,
    success_rate: 98.4,
    badge: '👑 بطلة الجمهورية',
  },
  {
    rank: 2,
    user_id: 102,
    name: 'محمد عبد الله الأصبحي',
    email: 'm.asbahi@example.com',
    grade_level: 'الثالث الثانوي — علمي',
    total_points: 3620,
    exams_completed: 26,
    success_rate: 96.1,
    badge: '🥈 المركز الثاني',
  },
  {
    rank: 3,
    user_id: 103,
    name: 'ريمان خالد العولقي',
    email: 'reeman.awlaqi@example.com',
    grade_level: 'الثالث الثانوي — أدبي',
    total_points: 3410,
    exams_completed: 24,
    success_rate: 95.0,
    badge: '🥉 المركز الثالث',
  },
  {
    rank: 4,
    user_id: 104,
    name: 'عبد الرحمن الشميري',
    email: 'abdulrahman.sh@example.com',
    grade_level: 'الثالث الثانوي — علمي',
    total_points: 3180,
    exams_completed: 22,
    success_rate: 93.2,
    badge: 'عبقري الرياضيات',
  },
  {
    rank: 5,
    user_id: 105,
    name: 'فاطمة طارق الزبيري',
    email: 'fatima.zubairi@example.com',
    grade_level: 'الثاني الثانوي',
    total_points: 2990,
    exams_completed: 21,
    success_rate: 92.5,
    badge: 'نجمة العلوم',
  },
];

export default function LeaderboardPage() {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<'all' | 'monthly'>('all');

  const top3 = mockLeaderboard.slice(0, 3);
  const rest = mockLeaderboard.slice(3).filter((u) => u.name.includes(search));

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.COMPETITIONS}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              لوحة المتصدرين والأوائل
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ترتيب الطلاب حسب النقاط المحققة ونسب التفوق في الاختبارات والمسابقات.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setPeriod('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              period === 'all'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            الترتيب العام الشامل
          </button>
          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              period === 'monthly'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            متصدرو هذا الشهر
          </button>
        </div>
      </div>

      {/* ── Top 3 Podium ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Silver #2 */}
        {top3[1] && (
          <div className="order-2 md:order-1 p-5 rounded-3xl bg-card text-card-foreground border border-border text-center space-y-3 relative overflow-hidden shadow-sm">
            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-black text-sm flex items-center justify-center mx-auto shadow">
              2
            </div>
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-2xl font-black text-foreground mx-auto">
              {top3[1].name.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{top3[1].name}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{top3[1].grade_level}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex justify-around text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">النقاط</span>
                <span className="font-bold text-foreground font-mono">{top3[1].total_points}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">النسبة</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{top3[1].success_rate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Gold #1 */}
        {top3[0] && (
          <div className="order-1 md:order-2 p-6 rounded-3xl bg-card text-card-foreground border-2 border-amber-500/40 text-center space-y-3 relative overflow-hidden shadow-xl shadow-amber-500/5 -mt-2">
            <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Sparkles className="w-3 h-3" />
              المركز الأول
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              👑
            </div>
            <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl font-black text-amber-600 dark:text-amber-400 mx-auto shadow-sm">
              {top3[0].name.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">{top3[0].name}</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{top3[0].grade_level}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex justify-around text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">إجمالي النقاط</span>
                <span className="font-black text-amber-600 dark:text-amber-400 font-mono text-sm">{top3[0].total_points}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">نسبة النجاح</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">{top3[0].success_rate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Bronze #3 */}
        {top3[2] && (
          <div className="order-3 md:order-3 p-5 rounded-3xl bg-card text-card-foreground border border-border text-center space-y-3 relative overflow-hidden shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center mx-auto shadow">
              3
            </div>
            <div className="w-16 h-16 rounded-2xl bg-amber-700/10 border border-amber-700/20 flex items-center justify-center text-2xl font-black text-amber-800 dark:text-amber-400 mx-auto">
              {top3[2].name.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{top3[2].name}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{top3[2].grade_level}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex justify-around text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">النقاط</span>
                <span className="font-bold text-foreground font-mono">{top3[2].total_points}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">النسبة</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{top3[2].success_rate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Full Rankings Table ── */}
      <div className="rounded-3xl bg-card text-card-foreground border border-border overflow-hidden space-y-4 shadow-sm">
        <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Medal className="w-4 h-4 text-amber-500" />
            باقي جدول الترتيب العام
          </h2>
          <div className="relative max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث بالاسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-muted/30 border-b border-border/60">
              <tr>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">الترتيب</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">الطالب</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">المرحلة والمسار</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">إجمالي النقاط</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">الاختبارات المجتازة</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">نسبة التفوق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rest.map((user) => (
                <tr key={user.user_id} className="hover:bg-muted/30 transition">
                  <td className="px-5 py-3.5 font-bold font-mono text-muted-foreground">
                    #{user.rank}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-foreground">
                    {user.name}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {user.grade_level || '—'}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {user.total_points}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {user.exams_completed} اختبار
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {user.success_rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
