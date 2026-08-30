import { Settings } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function ProfileSettingsPage() {
  return (
    <PagePlaceholder
      title="إعدادات الملف الشخصي"
      description="تعديل بياناتك الشخصية وكلمة المرور وتفضيلات الحساب."
      icon={Settings}
      badge="إعدادات الحساب"
      badgeColor="bg-slate-500/15 text-slate-300 border-slate-500/20"
      features={[
        'تعديل الاسم الكامل والبريد الإلكتروني ورقم الهاتف',
        'رفع صورة شخصية (Profile Picture)',
        'تغيير كلمة المرور مع التحقق من القديمة',
        'تفضيلات الإشعارات والرسائل',
        'إعدادات اللغة والتوقيت',
      ]}
    />
  );
}
