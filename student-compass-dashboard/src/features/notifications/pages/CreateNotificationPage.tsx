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
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">إرسال وتعميم إشعار فوري</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              بث تنبيه مباشر يظهر للطلاب والمعلمين عبر المنصة وإشعارات الهاتف المحمول.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          إرسال وبث الإشعار الآن
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Form (2 cols) ── */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                محتوى الإشعار والجمهور
              </h2>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  عنوان الإشعار <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="مثال: موعد اختبار الفيزياء التجريبي الشامل"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              {/* Type and Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">نوع الإشعار</label>
                  <select
                    {...register('type')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="announcement">إعلان عام</option>
                    <option value="exam_reminder">تذكير باختبار</option>
                    <option value="achievement">تهنئة وتفوق</option>
                    <option value="system">تنبيه نظام وصيانة</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">الجمهور المستهدف</label>
                  <select
                    {...register('target_audience')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
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
                <label className="text-xs font-semibold text-foreground">
                  نص الرسالة والتفاصيل <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="اكتب تفاصيل الإشعار هنا..."
                  className="w-full p-4 rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition leading-relaxed resize-none"
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
              </div>

            </div>

          </form>
        </div>

        {/* ── Live Mobile Preview (1 col) ── */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              معاينة الإشعار على هاتف الطالب
            </h3>

            {/* Mobile notification mockup */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border/60 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>بوصلة الطالب — إشعار فوري</span>
                </div>
                <span>الآن</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">
                  {previewTitle || 'عنوان الإشعار التجريبي...'}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                  {previewMessage || 'هنا سيظهر نص الإشعار كما سيشاهده الطلاب في شريط إشعارات الهاتف المحمول وتطبيق المنصة.'}
                </p>
              </div>

              <div className="pt-2 text-[10px] text-primary font-semibold flex items-center gap-1">
                <span>النوع: {previewType}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
