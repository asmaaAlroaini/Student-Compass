import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BarChart2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  BookOpen,
  HelpCircle,
  Loader2,
  XCircle,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';

interface QuestionReportItem {
  id: number;
  question_id: number;
  status: 'pending' | 'resolved' | 'dismissed';
  reason?: string;
  admin_notes?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  question?: {
    id: number;
    question_text: string;
    subject?: {
      id: number;
      name: string;
    };
  };
}

interface AnalyticsResponse {
  success: boolean;
  data: {
    reports_summary: {
      total: number;
      pending: number;
      resolved: number;
      dismissed: number;
    };
    academic_summary: {
      total_attempts: number;
      completed_exams_count: number;
      pass_rate: number;
      average_score: number;
    };
    questions_by_subject: {
      id: number;
      name: string;
      code: string;
      grade_level: string;
      track: string | null;
      questions_count: number;
    }[];
  };
}

export default function ReportsAnalyticsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 1. Fetch live analytics
  const { data: analyticsRes, isLoading: loadingAnalytics } = useQuery<AnalyticsResponse>({
    queryKey: ['admin', 'reports', 'analytics'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.REPORTS_ANALYTICS);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  // 2. Fetch live question reports
  const { data: reportsRes, isLoading: loadingReports } = useQuery<{
    success: boolean;
    data: { data: QuestionReportItem[] };
  }>({
    queryKey: ['admin', 'reports', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'all'
        ? API_ENDPOINTS.ADMIN.REPORTS
        : `${API_ENDPOINTS.ADMIN.REPORTS}?status=${statusFilter}`;
      const res = await apiClient.get(url);
      return res.data;
    },
    staleTime: 1000 * 60,
  });

  // 3. Resolve / Dismiss Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'resolved' | 'dismissed' | 'pending' }) => {
      const res = await apiClient.put(`${API_ENDPOINTS.ADMIN.REPORTS}/${id}/resolve`, {
        status,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', 'analytics'] });
      toast.success(data?.message || 'تم تحديث حالة البلاغ بنجاح ✅');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث حالة البلاغ');
    },
  });

  const a = analyticsRes?.data;
  const reportsList = reportsRes?.data?.data ?? [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black text-foreground tracking-tight">التقارير الشاملة وضمان جودة المحتوى</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Analytics & QA
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            مؤشرات الأداء الأكاديمي الحقيقية، إحصائيات بنك الأسئلة، ومعالجة بلاغات الطلاب حول الأسئلة.
          </p>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-foreground">
              {loadingAnalytics ? '—' : `${a?.academic_summary?.pass_rate ?? 0}%`}
            </div>
            <div className="text-[11px] text-muted-foreground">معدل اجتياز الاختبارات</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {loadingAnalytics ? '—' : (a?.academic_summary?.total_attempts ?? 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">إجمالي محاولات الاختبارات</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {loadingAnalytics ? '—' : (a?.reports_summary?.pending ?? 0)}
            </div>
            <div className="text-[11px] text-muted-foreground">بلاغات معلقة قيد المراجعة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-violet-600 dark:text-violet-400">
              {loadingAnalytics ? '—' : (a?.reports_summary?.resolved ?? 0)}
            </div>
            <div className="text-[11px] text-muted-foreground">بلاغات تمت معالجتها</div>
          </div>
        </div>
      </div>

      {/* ── Content Distribution ── */}
      {a?.questions_by_subject && a.questions_by_subject.length > 0 && (
        <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            توزيع بنك الأسئلة حسب المواد والمراحل الدراسية
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {a.questions_by_subject.map((subj) => (
              <div key={subj.id} className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground">{subj.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {subj.grade_level} {subj.track ? `• ${subj.track}` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    {subj.questions_count} سؤال
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Question Reports Table ── */}
      <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">بلاغات الطلاب والمعلمين حول الأسئلة</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs">
            {[
              { label: 'الكل', value: 'all' },
              { label: 'المعلقة', value: 'pending' },
              { label: 'المعالجة', value: 'resolved' },
              { label: 'المستبعدة', value: 'dismissed' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === tab.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loadingReports ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
            جاري تحميل البلاغات...
          </div>
        ) : reportsList.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground rounded-2xl bg-muted/20 border border-dashed border-border">
            لا توجد بلاغات تطابق الفلتر المحدد حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground bg-muted/30">
                  <th className="p-3 font-semibold rounded-tr-xl">المادة والسؤال</th>
                  <th className="p-3 font-semibold">مقدم البلاغ</th>
                  <th className="p-3 font-semibold">السبب والملاحظات</th>
                  <th className="p-3 font-semibold">الحالة</th>
                  <th className="p-3 font-semibold rounded-tl-xl text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {reportsList.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-foreground truncate">
                        {r.question?.question_text || `سؤال #${r.question_id}`}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {r.question?.subject?.name || 'مادة عامة'}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground">{r.user?.name || 'مستخدم المنصة'}</div>
                      <div className="text-[10px] text-muted-foreground font-mono" dir="ltr">{r.user?.email}</div>
                    </td>
                    <td className="p-3.5 max-w-sm">
                      <p className="text-muted-foreground leading-relaxed">{r.reason || 'لا توجد تفاصيل إضافية'}</p>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          r.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : r.status === 'dismissed'
                            ? 'bg-muted text-muted-foreground border-border'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {r.status === 'resolved' ? 'تمت معالجته' : r.status === 'dismissed' ? 'مستبعد' : 'معلق'}
                      </span>
                    </td>
                    <td className="p-3.5 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status !== 'resolved' && (
                          <button
                            type="button"
                            onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'resolved' })}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            title="حل البلاغ"
                          >
                            <Check className="w-3.5 h-3.5" />
                            معالجة
                          </button>
                        )}
                        {r.status !== 'dismissed' && (
                          <button
                            type="button"
                            onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'dismissed' })}
                            className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                            title="استبعاد البلاغ"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            استبعاد
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
