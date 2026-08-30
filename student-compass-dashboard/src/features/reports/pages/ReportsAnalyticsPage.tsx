import { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  BookOpen,
  HelpCircle,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

interface QuestionReportItem {
  id: number;
  question_id: number;
  question_text: string;
  subject_name: string;
  reason: string;
  reported_by: string;
  status: 'pending' | 'resolved';
  created_at: string;
}

const mockReports: QuestionReportItem[] = [
  {
    id: 1,
    question_id: 42,
    question_text: 'ما هي وحدة قياس القوة الدافعة الكهربائية الحثية؟',
    subject_name: 'الفيزياء',
    reason: 'وجود خطأ إملائي في الخيار الثالث (فولت أمبير بدلاً من فولت)',
    reported_by: 'أحمد صالح (طالب)',
    status: 'pending',
    created_at: '2026-08-28',
  },
  {
    id: 2,
    question_id: 88,
    question_text: 'تكامل الدالة الجيبية بالنسبة للمتغير س هو...',
    subject_name: 'الرياضيات',
    reason: 'الإجابة المحددة كصحيحة تحتاج مراجعة الإشارة السالبة',
    reported_by: 'أ. سامي المقطري (معلم)',
    status: 'pending',
    created_at: '2026-08-27',
  },
];

export default function ReportsAnalyticsPage() {
  const [reports, setReports] = useState<QuestionReportItem[]>(mockReports);

  const handleResolve = (id: number) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
    toast.success('تم حل البلاغ وتحديث حالة السؤال بنجاح ✅');
  };

  const handleDismiss = (id: number) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.info('تم استبعاد البلاغ.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-black text-white tracking-tight">التقارير الشاملة وضمان جودة المحتوى</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              Analytics & QA
            </span>
          </div>
          <p className="text-sm text-slate-400">
            مؤشرات الأداء الأكاديمي، إحصائيات بنك الأسئلة، ومعالجة بلاغات الطلاب حول الأسئلة.
          </p>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white">83.4%</div>
            <div className="text-[11px] text-slate-400">متوسط نسبة النجاح</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-300">1,240+</div>
            <div className="text-[11px] text-slate-400">امتحان مكتمل هذا الشهر</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-300">
              {reports.filter((r) => r.status === 'pending').length}
            </div>
            <div className="text-[11px] text-slate-400">بلاغات بانتظار المراجعة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-violet-300">92.8%</div>
            <div className="text-[11px] text-slate-400">معدل رضا الطلاب</div>
          </div>
        </div>
      </div>

      {/* ── Subject Performance & Difficulty Distribution ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Subject performance breakdown */}
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            متوسط درجات الطلاب حسب المادة
          </h2>

          <div className="space-y-3">
            {[
              { subject: 'الفيزياء', score: 86, color: 'bg-blue-500' },
              { subject: 'الرياضيات', score: 79, color: 'bg-indigo-500' },
              { subject: 'الكيمياء', score: 84, color: 'bg-emerald-500' },
              { subject: 'الأحياء', score: 91, color: 'bg-violet-500' },
              { subject: 'اللغة الإنجليزية', score: 82, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.subject} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{item.subject}</span>
                  <span className="text-slate-300 font-mono">{item.score}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Bank Difficulty Distribution */}
        <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            توزيع مستويات صعوبة بنك الأسئلة
          </h2>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-xs text-emerald-300 font-semibold">سهل</span>
              <div className="text-2xl font-black text-white font-mono">35%</div>
              <span className="text-[10px] text-slate-400">تدريب تأسيسي</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
              <span className="text-xs text-amber-300 font-semibold">متوسط</span>
              <div className="text-2xl font-black text-white font-mono">45%</div>
              <span className="text-[10px] text-slate-400">تقييم قياسي</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-1">
              <span className="text-xs text-rose-300 font-semibold">صعب</span>
              <div className="text-2xl font-black text-white font-mono">20%</div>
              <span className="text-[10px] text-slate-400">مستوى تميز ووزاري</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080d1e] border border-white/[0.05] text-xs text-slate-300 leading-relaxed">
            💡 <strong>توصية النظام التربوي:</strong> توزيع صعوبة الأسئلة متوازن ويتطابق مع المعايير الوزارية للاختبارات العامة.
          </div>
        </div>

      </div>

      {/* ── Question Quality Reports Queue ── */}
      <div className="rounded-3xl bg-[#0c142b] border border-white/[0.07] overflow-hidden space-y-4">
        <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            بلاغات مراجعة جودة الأسئلة المُرسلة من الطلاب والمعلمين
          </h2>
          <span className="text-xs text-slate-500">{reports.length} بلاغ</span>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="text-white font-bold">لا توجد بلاغات معلقة حالياً!</p>
            <p className="text-slate-400">جميع الأسئلة مفحوصة ومطابقة لمعايير الجودة.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {reports.map((r) => (
              <div key={r.id} className="p-5 hover:bg-white/[0.01] transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {r.subject_name}
                    </span>
                    <span className="text-xs font-bold text-white">سؤال #{r.question_id}: {r.question_text}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{r.created_at}</span>
                </div>

                <p className="text-xs text-amber-300/90 bg-amber-500/5 p-3 rounded-xl border border-amber-500/15">
                  <strong>ملاحظة البلاغ:</strong> {r.reason}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">مقدم البلاغ: {r.reported_by}</span>
                  {r.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleResolve(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                      >
                        معالجة وتعديل السؤال
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDismiss(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
                      >
                        استبعاد
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تمت المعالجة
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
