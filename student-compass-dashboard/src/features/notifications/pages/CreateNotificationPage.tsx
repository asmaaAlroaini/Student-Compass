import { useNavigate, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Bell,
  ArrowRight,
  Send,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  notificationSchema,
  type NotificationSchemaOutput,
} from '../validations/notificationSchema';
import { ROUTES } from '@/constants/routes';

export default function CreateNotificationPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'announcement' as const,
      target_audience: 'all' as const,
    },
  });

  const previewTitle = watch('title');
  const previewMessage = watch('message');
  const previewType = watch('type');

  const onSubmit: SubmitHandler<NotificationSchemaOutput> = async () => {
    // In production connects to notificationsApi.broadcast(data)
    toast.success('تم إرسال وبث الإشعار لجميع المستهدفين بنجاح 🚀');
    navigate(ROUTES.DASHBOARD.NOTIFICATIONS);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.NOTIFICATIONS}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">إرسال وتعميم إشعار فوري</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              بث تنبيه مباشر يظهر للطلاب والمعلمين عبر المنصة وإشعارات الهاتف المحمول.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          إرسال وبث الإشعار الآن
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Form (2 cols) ── */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                محتوى الإشعار والجمهور
              </h2>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  عنوان الإشعار <span className="text-rose-400">*</span>
                </label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="مثال: موعد اختبار الفيزياء التجريبي الشامل"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition"
                />
                {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
              </div>

              {/* Type and Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">نوع الإشعار</label>
                  <select
                    {...register('type')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/60 transition cursor-pointer"
                  >
                    <option value="announcement">إعلان عام</option>
                    <option value="exam_reminder">تذكير باختبار</option>
                    <option value="achievement">تهنئة وتفوق</option>
                    <option value="system">تنبيه نظام وصيانة</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">الجمهور المستهدف</label>
                  <select
                    {...register('target_audience')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/60 transition cursor-pointer"
                  >
                    <option value="all">جميع المستخدمين (طلاب ومعلمون)</option>
                    <option value="students">جميع الطلاب فقط</option>
                    <option value="grade_3">طلاب الثالث الثانوي فقط</option>
                    <option value="teachers">الكادر التعليمي والمعلمون فقط</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  نص الرسالة والتفاصيل <span className="text-rose-400">*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="اكتب تفاصيل الإشعار هنا..."
                  className="w-full p-4 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition leading-relaxed"
                />
                {errors.message && <p className="text-xs text-rose-400">{errors.message.message}</p>}
              </div>

            </div>

          </form>
        </div>

        {/* ── Live Mobile Preview (1 col) ── */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              معاينة الإشعار على هاتف الطالب
            </h3>

            {/* Mobile notification mockup */}
            <div className="p-4 rounded-2xl bg-[#080d1e] border border-white/[0.08] space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-white/[0.05] pb-2">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>بوصلة الطالب — إشعار فوري</span>
                </div>
                <span>الآن</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">
                  {previewTitle || 'عنوان الإشعار التجريبي...'}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  {previewMessage || 'هنا سيظهر نص الإشعار كما سيشاهده الطلاب في شريط إشعارات الهاتف المحمول وتطبيق المنصة.'}
                </p>
              </div>

              <div className="pt-2 text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                <span>النوع: {previewType}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
