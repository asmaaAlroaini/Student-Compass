import { Shield } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function SystemSettingsPage() {
  return (
    <PagePlaceholder
      title="إعدادات النظام العامة"
      description="ضبط إعدادات المنصة الأكاديمية من التخزين ومفاتيح API وسجلات التدقيق."
      icon={Shield}
      badge="خاص بالمدير العام"
      badgeColor="bg-rose-500/15 text-rose-300 border-rose-500/20"
      features={[
        'إعدادات منصة التخزين والملفات والـ PDFs (S3 / Cloud)',
        'مفاتيح API الخارجية (Firebase، OneSignal للإشعارات)',
        'إعدادات العام الدراسي الحالي',
        'سجل العمليات والتدقيق الأمني (Audit Logs)',
        'إدارة صلاحيات الأدوار والمجموعات (RBAC)',
      ]}
    />
  );
}
