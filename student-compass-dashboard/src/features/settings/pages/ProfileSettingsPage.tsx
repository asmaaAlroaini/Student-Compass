import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Lock,
  Save,
  Shield,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    new_password: z.string().min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'),
    confirm_password: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'كلمات المرور غير متطابقة',
        path: ['confirm_password'],
      });
    }
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors, isSubmitting: isSubmittingPass },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async () => {
    // In production connects to authApi.changePassword(data)
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success('تم تحديث كلمة المرور بنجاح ✅');
    resetPass();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <User className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-black text-white tracking-tight">الملف الشخصي وإعدادات الأمان</h1>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
            Account Security
          </span>
        </div>
        <p className="text-sm text-slate-400">
          إدارة بيانات الحساب الشخصي وتغيير كلمة المرور الخاصة بالمدير.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Account Summary (1 col) ── */}
        <div className="p-6 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white mx-auto shadow-xl shadow-blue-500/20">
            {user?.name?.slice(0, 1) || 'A'}
          </div>

          <div>
            <h2 className="text-base font-black text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5" dir="ltr">{user?.email}</p>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              مدير النظام (System Administrator)
            </span>
          </div>

          <div className="pt-4 border-t border-white/[0.05] text-xs text-slate-400 text-right space-y-2">
            <div className="flex justify-between">
              <span>حالة الحساب:</span>
              <span className="text-emerald-400 font-bold">نشط وموثق</span>
            </div>
            <div className="flex justify-between">
              <span>مستوى الصلاحيات:</span>
              <span className="text-white font-bold">كامل الصلاحيات (Super Admin)</span>
            </div>
          </div>
        </div>

        {/* ── Change Password Form (2 cols) ── */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">تغيير كلمة المرور</h2>
              <p className="text-xs text-slate-400 mt-0.5">احرص على استخدام كلمة مرور قوية وغير مكررة</p>
            </div>
          </div>

          <form onSubmit={handlePassSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                كلمة المرور الحالية <span className="text-rose-400">*</span>
              </label>
              <input
                {...registerPass('current_password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition"
              />
              {passErrors.current_password && (
                <p className="text-xs text-rose-400">{passErrors.current_password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                كلمة المرور الجديدة <span className="text-rose-400">*</span>
              </label>
              <input
                {...registerPass('new_password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition"
              />
              {passErrors.new_password && (
                <p className="text-xs text-rose-400">{passErrors.new_password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                تأكيد كلمة المرور الجديدة <span className="text-rose-400">*</span>
              </label>
              <input
                {...registerPass('confirm_password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/60 transition"
              />
              {passErrors.confirm_password && (
                <p className="text-xs text-rose-400">{passErrors.confirm_password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmittingPass}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              {isSubmittingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmittingPass ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
