import { useState } from 'react';
import {
  Settings,
  Save,
  Globe,
  Sliders,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SystemSettingsPage() {
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [platformName, setPlatformName] = useState('بوصلة الطالب — المنصة الأكاديمية');
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [requireSupervisorApproval, setRequireSupervisorApproval] = useState(false);
  const [strictExamTimer, setStrictExamTimer] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    toast.success('تم حفظ إعدادات النظام وتطبيقها بنجاح ✅');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-black text-white tracking-tight">إعدادات النظام والمنصة العامة</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              System Config
            </span>
          </div>
          <p className="text-sm text-slate-400">
            تخصيص العام الدراسي الحالي، سياسات التسجيل، وقواعد نشر الأسئلة والاختبارات.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          حفظ جميع الإعدادات
        </button>
      </div>

      {/* ── General Info ── */}
      <div className="p-6 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          الهوية والعام الدراسي
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">اسم المنصة الرسمي</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/60 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">العام الدراسي الفعال</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1e] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/60 transition cursor-pointer"
            >
              <option value="2025-2026">2025 / 2026 م (الحالي)</option>
              <option value="2024-2025">2024 / 2025 م</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Policies and Toggles ── */}
      <div className="p-6 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          السياسات وقواعد التشغيل
        </h2>

        <div className="space-y-3">
          {/* Registration toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <div className="text-xs font-bold text-white">فتح باب تسجيل الطلاب الجدد</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                السماح بإنشاء حسابات طلابية جديدة مباشرة من صفحة الهبوط والتطبيق
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRegistrationOpen(!registrationOpen)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                registrationOpen ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: registrationOpen ? '24px' : '4px' }}
              />
            </button>
          </div>

          {/* Supervisor Approval toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <div className="text-xs font-bold text-white">إلزامية مراجعة المشرف قبل نشر الأسئلة</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                تتطلب أسئلة المعلمين موافقة المشرف التربوي قبل إدراجها في بنك الأسئلة المركزي
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRequireSupervisorApproval(!requireSupervisorApproval)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                requireSupervisorApproval ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: requireSupervisorApproval ? '24px' : '4px' }}
              />
            </button>
          </div>

          {/* Strict Timer */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <div className="text-xs font-bold text-white">وضع المؤقت الصارم للاختبارات (Anti-Cheat Timer)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                تسليم الاختبار تلقائياً عند انتهاء الوقت ومنع التمديد
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStrictExamTimer(!strictExamTimer)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                strictExamTimer ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: strictExamTimer ? '24px' : '4px' }}
              />
            </button>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15">
            <div>
              <div className="text-xs font-bold text-rose-300">وضع الصيانة العامة (Maintenance Mode)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                تعليق وصول الطلاب مؤقتاً لعرض شاشة الصيانة أثناء التحديثات
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                maintenanceMode ? 'bg-rose-500' : 'bg-slate-600'
              }`}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: maintenanceMode ? '24px' : '4px' }}
              />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
