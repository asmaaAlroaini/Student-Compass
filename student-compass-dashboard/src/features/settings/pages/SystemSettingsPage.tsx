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
            <Settings className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black text-foreground tracking-tight">إعدادات النظام والمنصة العامة</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              System Config
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            تخصيص العام الدراسي الحالي، سياسات التسجيل، وقواعد نشر الأسئلة والاختبارات.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          حفظ جميع الإعدادات
        </button>
      </div>

      {/* ── General Info ── */}
      <div className="p-6 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          الهوية والعام الدراسي
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">اسم المنصة الرسمي</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">العام الدراسي الفعال</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
            >
              <option value="2025-2026">2025 / 2026 م (الحالي)</option>
              <option value="2024-2025">2024 / 2025 م</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Policies and Toggles ── */}
      <div className="p-6 rounded-3xl bg-card text-card-foreground border border-border space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-500" />
          السياسات وقواعد التشغيل
        </h2>

        <div className="space-y-3">
          {/* Registration toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground">فتح باب تسجيل الطلاب الجدد</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                السماح بإنشاء حسابات طلابية جديدة مباشرة من صفحة الهبوط والتطبيق
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRegistrationOpen(!registrationOpen)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                registrationOpen ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: registrationOpen ? '24px' : '4px' }}
              />
            </button>
          </div>

          {/* Supervisor Approval toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground">إلزامية مراجعة المشرف قبل نشر الأسئلة</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                تتطلب أسئلة المعلمين موافقة المشرف التربوي قبل إدراجها في بنك الأسئلة المركزي
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRequireSupervisorApproval(!requireSupervisorApproval)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                requireSupervisorApproval ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: requireSupervisorApproval ? '24px' : '4px' }}
              />
            </button>
          </div>

          {/* Strict Timer */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
            <div>
              <div className="text-xs font-bold text-foreground">وضع المؤقت الصارم للاختبارات (Anti-Cheat Timer)</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                تسليم الاختبار تلقائياً عند انتهاء الوقت ومنع التمديد
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStrictExamTimer(!strictExamTimer)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                strictExamTimer ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: strictExamTimer ? '24px' : '4px' }}
              />
            </button>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/20">
            <div>
              <div className="text-xs font-bold text-destructive">وضع الصيانة العامة (Maintenance Mode)</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                تعليق وصول الطلاب مؤقتاً لعرض شاشة الصيانة أثناء التحديثات
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                maintenanceMode ? 'bg-destructive' : 'bg-muted-foreground/30'
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
