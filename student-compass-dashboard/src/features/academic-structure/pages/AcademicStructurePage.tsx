import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  GraduationCap,
  BookOpen,
  Users,
  ChevronLeft,
  Sparkles,
  School,
  FlaskConical,
  PenLine,
  Globe,
  Search,
  BarChart3,
} from 'lucide-react';
import { useAcademicOptions } from '../hooks/useAcademicStructure';
import { ROUTES } from '@/constants/routes';

// ── Track icon & color mapping ──
const trackConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
  dot: string;
}> = {
  علمي: {
    icon: FlaskConical,
    color: 'text-blue-300',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400',
  },
  أدبي: {
    icon: PenLine,
    color: 'text-violet-300',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    dot: 'bg-violet-400',
  },
  عام: {
    icon: Globe,
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
};

// ── Grade Level Card ──
function GradeCard({
  grade,
  index,
}: {
  grade: { id: string; name: string; tracks: string[] };
  index: number;
}) {
  const [expanded, setExpanded] = useState(true);

  const colors = [
    { ring: 'ring-blue-500/30', glow: 'shadow-blue-500/10', num: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { ring: 'ring-indigo-500/30', glow: 'shadow-indigo-500/10', num: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { ring: 'ring-violet-500/30', glow: 'shadow-violet-500/10', num: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  ];
  const c = colors[index % colors.length];

  return (
    <div
      className={`rounded-3xl bg-[#0c142b] border border-white/[0.07] ring-1 ${c.ring} shadow-xl ${c.glow} overflow-hidden transition-all duration-300`}
    >
      {/* Card Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border font-black text-sm ${c.num}`}>
            {index + 1}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{grade.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{grade.tracks.length} مسار دراسي</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${expanded ? '-rotate-90' : ''}`} />
        </button>
      </div>

      {/* Tracks list */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          <div className="w-full h-px bg-white/[0.06] mb-4" />
          {grade.tracks.map((trackName) => {
            const cfg = trackConfig[trackName] ?? trackConfig['عام'];
            const Icon = cfg.icon;
            return (
              <div
                key={trackName}
                className={`flex items-center gap-3 p-3.5 rounded-2xl ${cfg.bg} border ${cfg.border} group`}
              >
                <div className={`w-8 h-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${cfg.color}`}>
                    المسار {trackName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {grade.name} — {trackName}
                  </div>
                </div>
                <Link
                  to={`${ROUTES.DASHBOARD.SUBJECTS}?grade=${encodeURIComponent(grade.id)}&track=${encodeURIComponent(trackName)}`}
                  className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-all group-hover:gap-1.5"
                >
                  عرض المواد
                  <ChevronLeft className="w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Skeleton Card ──
function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-[#0c142b] border border-white/[0.07] p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/[0.06]" />
        <div className="space-y-2">
          <div className="h-4 w-36 bg-white/[0.06] rounded-lg" />
          <div className="h-3 w-20 bg-white/[0.04] rounded-lg" />
        </div>
      </div>
      <div className="h-px bg-white/[0.04]" />
      {[1, 2].map((i) => (
        <div key={i} className="h-14 rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}

// ── Main Page ──
export default function AcademicStructurePage() {
  const { data, isLoading, isError } = useAcademicOptions();
  const [search, setSearch] = useState('');

  const grades = data?.data?.grade_levels ?? [];
  const tracks = data?.data?.tracks ?? [];

  const filtered = grades.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  // Summary stats
  const totalGrades = grades.length;
  const totalTracks = tracks.length;
  const totalCombinations = grades.reduce((sum, g) => sum + g.tracks.length, 0);

  return (
    <div className="space-y-6" dir="rtl">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-black text-white tracking-tight">الهيكل التعليمي والمراحل</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/20">
              Admin Only
            </span>
          </div>
          <p className="text-sm text-slate-400">
            استعراض وإدارة المراحل الدراسية والمسارات (علمي / أدبي / عام) المتاحة في المنصة.
          </p>
        </div>

        <Link
          to={ROUTES.DASHBOARD.SUBJECTS}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          <BookOpen className="w-4 h-4" />
          إدارة المواد الدراسية
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Summary KPI ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'المراحل الدراسية', value: isLoading ? '—' : totalGrades, icon: GraduationCap, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { label: 'المسارات المتاحة', value: isLoading ? '—' : totalTracks, icon: Layers, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
          { label: 'مجموع التخصصات', value: isLoading ? '—' : totalCombinations, icon: BarChart3, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] space-y-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="البحث عن مرحلة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#0c142b] border border-white/[0.08] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
          dir="rtl"
        />
      </div>

      {/* ── Error State ── */}
      {isError && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300 text-center">
          ⚠️ تعذر الاتصال بالخادم. تأكد من تشغيل الباك إند على{' '}
          <code className="font-mono text-rose-200">http://127.0.0.1:8000</code>
        </div>
      )}

      {/* ── Grades Grid ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <School className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-300">المراحل الدراسية المتاحة</h2>
          {!isLoading && (
            <span className="text-xs text-slate-500">({filtered.length} مرحلة)</span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            لا توجد نتائج مطابقة لـ "{search}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((grade, i) => (
              <GradeCard key={grade.id} grade={grade} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Tracks Overview ── */}
      {!isLoading && tracks.length > 0 && (
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">المسارات الدراسية في المنصة</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {tracks.map((track) => {
              const cfg = trackConfig[track.name] ?? trackConfig['عام'];
              const Icon = cfg.icon;
              return (
                <div
                  key={track.id}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${cfg.bg} border ${cfg.border}`}
                >
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                  <span className={`text-sm font-semibold ${cfg.color}`}>المسار {track.name}</span>
                </div>
              );
            })}
          </div>

          {/* Info note */}
          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-slate-400 leading-relaxed">
            <strong className="text-blue-300">ملاحظة:</strong> يتم إدارة المراحل والمسارات مباشرة من خلال حقول{' '}
            <code className="text-blue-300 font-mono text-[11px]">grade_level</code> و{' '}
            <code className="text-blue-300 font-mono text-[11px]">track</code> في جدول المواد الدراسية.
            لإضافة مرحلة أو مسار جديد، انتقل لإدارة المواد وأضف مادة بالمرحلة الجديدة.
          </div>
        </div>
      )}

      {/* ── How it Works ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-bl from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/15 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          شجرة المنهج التعليمي
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
          {[
            { label: 'المرحلة الدراسية', icon: GraduationCap, color: 'text-blue-300 bg-blue-500/10 border-blue-500/20' },
            { label: 'المسار', icon: Layers, color: 'text-violet-300 bg-violet-500/10 border-violet-500/20' },
            { label: 'المادة الدراسية', icon: BookOpen, color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
            { label: 'الوحدة', icon: Layers, color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
            { label: 'الدرس', icon: Users, color: 'text-rose-300 bg-rose-500/10 border-rose-500/20' },
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${step.color}`}>
                <step.icon className="w-3.5 h-3.5" />
                {step.label}
              </div>
              {i < arr.length - 1 && (
                <ChevronLeft className="w-4 h-4 text-slate-600 rotate-180" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
}
