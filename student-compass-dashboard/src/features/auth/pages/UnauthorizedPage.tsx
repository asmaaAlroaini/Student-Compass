import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1329] text-white p-6 relative overflow-hidden" dir="rtl">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0e1838] border border-rose-500/20 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white">403 - غير مصرح</h1>
          <p className="text-sm text-slate-300">
            عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذا القسم.
          </p>
          {user && (
            <div className="inline-block px-3 py-1 mt-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
              الحساب الحالي: <span className="text-blue-300 font-semibold">{user.name}</span> ({user.role})
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(ROUTES.DASHBOARD.HOME)}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
          >
            <Home className="w-4 h-4" />
            <span>لوحة التحكم</span>
          </button>

          <button
            type="button"
            onClick={() => logout()}
            className="py-3 px-4 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-300 border border-white/10 hover:border-rose-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

      </div>

    </div>
  );
}
