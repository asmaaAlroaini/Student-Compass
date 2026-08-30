import { Trophy } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function CompetitionsListPage() {
  return (
    <PagePlaceholder
      title="المسابقات التنافسية ولوحة الشرف"
      description="إنشاء وإدارة المسابقات التنافسية بين الطلاب وعرض لوحة الشرف المباشرة."
      icon={Trophy}
      badge="Live Leaderboard"
      badgeColor="bg-amber-500/15 text-amber-300 border-amber-500/20"
      features={[
        'قائمة المسابقات (نشطة / منتهية / مجدولة)',
        'إنشاء مسابقة جديدة مع تحديد المادة والأسئلة والنقاط',
        'لوحة الشرف المباشرة (المركز الأول والثاني والثالث)',
        'إحصائيات المشاركة (عدد المشاركين، متوسط الدرجات)',
        'جوائز افتراضية وشارات الإنجاز',
      ]}
    />
  );
}
