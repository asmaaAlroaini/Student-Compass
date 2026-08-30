import { Bell } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function NotificationsManagerPage() {
  return (
    <PagePlaceholder
      title="مركز الإشعارات والرسائل"
      description="إدارة جميع الإشعارات المرسلة وعرض سجل التاريخ مع إحصائيات الفتح والتفاعل."
      icon={Bell}
      badge="إشعارات فورية ومجدولة"
      badgeColor="bg-cyan-500/15 text-cyan-300 border-cyan-500/20"
      features={[
        'سجل الإشعارات المرسلة مع تاريخ الإرسال ونسبة الفتح',
        'فلترة الإشعارات بالنوع (تذكير / إعلان / تنبيه / مسابقة)',
        'عرض الإشعارات المجدولة المعلقة',
        'إحصائيات التفاعل مع كل إشعار',
        'إنشاء إشعار جديد فوري أو مجدول',
      ]}
    />
  );
}
