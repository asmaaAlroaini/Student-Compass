import { Trophy } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function CompetitionBuilderPage() {
  return (
    <PagePlaceholder
      title="إنشاء مسابقة جديدة"
      description="تصميم مسابقة تنافسية جديدة مع تحديد جميع الإعدادات والأسئلة والجوائز."
      icon={Trophy}
      features={[
        'اسم المسابقة، الوصف، والمادة المستهدفة',
        'تاريخ البدء والانتهاء مع حساب الوقت التنازلي',
        'اختيار الأسئلة يدوياً أو توليدها تلقائياً',
        'تحديد نظام النقاط والتسريع (أسرع إجابة = نقاط إضافية)',
        'تحديد الفئات المشاركة (فصل معين، مرحلة، أو الكل)',
      ]}
    />
  );
}
