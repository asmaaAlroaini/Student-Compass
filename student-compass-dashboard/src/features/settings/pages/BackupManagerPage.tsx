import { Database } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function BackupManagerPage() {
  return (
    <PagePlaceholder
      title="إدارة النسخ الاحتياطية"
      description="نسخ احتياطية لقاعدة البيانات وبنك الأسئلة مع إمكانية الاستعادة بنقرة واحدة."
      icon={Database}
      badge="خاص بالمدير العام"
      badgeColor="bg-rose-500/15 text-rose-300 border-rose-500/20"
      features={[
        'نسخ احتياطية يدوية بنقرة واحدة (One-Click Backup)',
        'جدولة النسخ الاحتياطية التلقائية (يومي / أسبوعي)',
        'تصدير بنك الأسئلة كاملاً بصيغة Excel',
        'استعادة النظام من نسخة احتياطية سابقة',
        'سجل عمليات النسخ الاحتياطي مع التواريخ والأحجام',
      ]}
    />
  );
}
