import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  useRequestResetCode,
  useVerifyResetCode,
  useResetPassword,
} from '@/features/auth/hooks/useForgotPassword';
import { ROUTES } from '@/constants/routes';

type Step = 'email' | 'code' | 'new-password' | 'success';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const requestResetCode = useRequestResetCode();
  const verifyResetCode = useVerifyResetCode();
  const resetPassword = useResetPassword();

  // Timer for resend code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'code' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Submit Email
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    requestResetCode.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setStep('code');
          setResendTimer(60);
        },
      }
    );
  };

  // Step 2: Submit OTP Code
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 6) return;

    verifyResetCode.mutate(
      { email: email.trim(), code: code.trim() },
      {
        onSuccess: () => {
          setStep('new-password');
        },
      }
    );
  };

  // Step 3: Submit New Password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !passwordConfirmation) return;

    resetPassword.mutate(
      {
        email: email.trim(),
        code: code.trim(),
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onSuccess: () => {
          setStep('success');
        },
      }
    );
  };

  // Resend code handler
  const handleResend = () => {
    if (resendTimer > 0) return;
    requestResetCode.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setResendTimer(60);
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1329] text-white p-4 sm:p-6 selection:bg-blue-600 selection:text-white relative overflow-hidden" dir="rtl">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Center Card */}
      <div className="w-full max-w-lg bg-[#0d1836]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Logo and Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to={ROUTES.PUBLIC.LANDING} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20 mb-4 hover:scale-105 transition-transform">
            <Compass className="w-8 h-8 text-white animate-spin-slow" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            استعادة كلمة المرور
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm">
            {step === 'email' && 'أدخل بريدك الإلكتروني المسجل لنرسل لك رمز التحقق المكون من 6 أرقام.'}
            {step === 'code' && `أدخل رمز التحقق المرسل إلى: ${email}`}
            {step === 'new-password' && 'أنشئ كلمة مرور جديدة وقوية لحسابك.'}
            {step === 'success' && 'تم استعادة حسابك بنجاح وبأمان.'}
          </p>

          {/* Stepper Dots */}
          {step !== 'success' && (
            <div className="flex items-center gap-2 mt-6">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'email' ? 'w-8 bg-blue-500' : 'w-2 bg-blue-500/30'}`} />
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'code' ? 'w-8 bg-blue-500' : 'w-2 bg-blue-500/30'}`} />
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'new-password' ? 'w-8 bg-blue-500' : 'w-2 bg-blue-500/30'}`} />
            </div>
          )}
        </div>

        {/* STEP 1: Email Request */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                البريد الإلكتروني المسجل <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pr-11 pl-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={requestResetCode.isPending}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {requestResetCode.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري إرسال الرمز...</span>
                </>
              ) : (
                <>
                  <span>إرسال رمز التحقق</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP Code */}
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block text-center">
                رمز التحقق (6 أرقام) <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full py-3.5 px-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="hover:text-blue-300 transition-colors"
              >
                تغيير البريد
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || requestResetCode.isPending}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${requestResetCode.isPending ? 'animate-spin' : ''}`} />
                <span>{resendTimer > 0 ? `إعادة الإرسال بعد (${resendTimer}s)` : 'إعادة إرسال الرمز'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={verifyResetCode.isPending || code.length !== 6}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {verifyResetCode.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق من الرمز...</span>
                </>
              ) : (
                <>
                  <span>التحقق والمتابعة</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Set New Password */}
        {step === 'new-password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                كلمة المرور الجديدة <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 أحرف على الأقل"
                  required
                  minLength={8}
                  className="w-full pr-11 pl-11 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                تأكيد كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  required
                  minLength={8}
                  className="w-full pr-11 pl-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={resetPassword.isPending}
              className="w-full py-3.5 px-6 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {resetPassword.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري حفظ كلمة المرور...</span>
                </>
              ) : (
                <>
                  <span>حفظ كلمة المرور الجديدة</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: Success Screen */}
        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">تم تغيير كلمة المرور بنجاح!</h3>
              <p className="text-sm text-slate-300 mt-2">
                يمكنك الآن تسجيل الدخول إلى حسابك بكلمة المرور الجديدة.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.PUBLIC.LOGIN)}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>تسجيل الدخول الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Back to Login footer */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
          <Link
            to={ROUTES.PUBLIC.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>تذكرت كلمة المرور؟ العودة لتسجيل الدخول</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
