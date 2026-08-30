import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle2,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || ROUTES.DASHBOARD.HOME;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin({
    rememberMe,
    redirectTo: from,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    login({ email: email.trim(), password });
  };

  const handleQuickFill = (roleEmail: string, rolePass: string = 'password123') => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0b1329] text-white selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* ── Left Side / Brand & Overview Panel (Desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0c1938] via-[#091226] to-[#040814] p-12 flex-col justify-between border-l border-white/5">
        
        {/* Background Glowing Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

        {/* Top Header / Logo */}
        <div className="relative z-10">
          <Link to={ROUTES.PUBLIC.LANDING} className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-7 h-7 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                  بوصلة الطالب
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Dashboard
                </span>
              </div>
              <p className="text-xs text-blue-200/60 font-medium">المنظومة الإدارية والأكاديمية المركزية</p>
            </div>
          </Link>
        </div>

        {/* Middle Content: Value Proposition & Stats */}
        <div className="relative z-10 space-y-8 my-auto max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-200">الجيل القادم من القيادة التعليمية</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.25] text-white">
              تحكم كامل في <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 bg-clip-text text-transparent">
                العملية الأكاديمية والامتحانات
              </span>
            </h1>
            <p className="text-slate-300/80 text-base leading-relaxed">
              منصة سحابية متقدمة لإدارة أكثر من 50,000+ سؤال، بناء الاختبارات الذكية، تتبع أداء الطلاب، وعزل صلاحيات المعلمين بدقة متناهية.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.05] transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">+50,000</div>
                  <div className="text-xs text-slate-400">سؤال بالبنك المركزي</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.05] transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">5 مراحل</div>
                  <div className="text-xs text-slate-400">رحلة التعلم الذكية</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.05] transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">RBAC 100%</div>
                  <div className="text-xs text-slate-400">أمان وعزل الصلاحيات</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.05] transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">تخصيص كامل</div>
                  <div className="text-xs text-slate-400">للفصول والمسارات</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom / Copyright & Security info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-white/5">
          <span>© {new Date().getFullYear()} بوصلة الطالب. جميع الحقوق محفوظة.</span>
          <span className="flex items-center gap-1.5 text-blue-400/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> اتصال مشفر وآمن (Sanctum)
          </span>
        </div>
      </div>

      {/* ── Right Side / Sign-in Form Panel ── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-gradient-to-b from-[#0b1329] to-[#080d1e] relative">
        
        {/* Top bar with back to home link */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          <Link
            to={ROUTES.PUBLIC.LANDING}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">بوصلة الطالب</span>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              تسجيل الدخول 🧭
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              أدخل بيانات حسابك المعتمدة للوصول إلى لوحة التحكم والإدارة.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studentcompass.com"
                  required
                  className="w-full pr-11 pl-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all shadow-inner"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 block">
                  كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <Link
                  to={ROUTES.PUBLIC.FORGOT_PASSWORD}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pr-11 pl-11 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all shadow-inner"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0 transition"
                />
                <span className="text-xs text-slate-300">تذكر تسجيل دخولي على هذا الجهاز</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 border border-white/10 hover:shadow-blue-500/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق والدخول...</span>
                </>
              ) : (
                <>
                  <span>دخول إلى لوحة التحكم</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Accounts Fill */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">حسابات تجريبية سريعة (انقر للتعبئة):</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@studentcompass.com')}
                className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-blue-600/10 border border-white/[0.06] hover:border-blue-500/30 text-right transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-blue-300">المدير العام (Admin)</div>
                <div className="text-[10px] text-slate-400 truncate">admin@studentcompass.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('teacher@studentcompass.com')}
                className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-indigo-600/10 border border-white/[0.06] hover:border-indigo-500/30 text-right transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-300">معلم المادة (Teacher)</div>
                <div className="text-[10px] text-slate-400 truncate">teacher@studentcompass.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('supervisor@studentcompass.com')}
                className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-emerald-600/10 border border-white/[0.06] hover:border-emerald-500/30 text-right transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">مشرف تربوي (Supervisor)</div>
                <div className="text-[10px] text-slate-400 truncate">supervisor@studentcompass.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('student@studentcompass.com')}
                className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-amber-600/10 border border-white/[0.06] hover:border-amber-500/30 text-right transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300">طالب (Student)</div>
                <div className="text-[10px] text-slate-400 truncate">student@studentcompass.com</div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info for mobile */}
        <div className="text-center text-xs text-slate-500 py-2">
          نظام بوصلة الطالب — معتمد ومحمي بتشفير Sanctum API
        </div>

      </div>

    </div>
  );
}
