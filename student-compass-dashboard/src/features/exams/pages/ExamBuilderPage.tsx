import { FileCheck2 } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function ExamBuilderPage() {
  return (
    <PagePlaceholder
      title="منشئ الاختبارات التفاعلي"
      description="إنشاء اختبار جديد أو تعديل اختبار موجود مع خيار الاختيار اليدوي أو التوليد التلقائي العشوائي للأسئلة."
      icon={FileCheck2}
      badge="Exam Builder"
      badgeColor="bg-violet-500/15 text-violet-300 border-violet-500/20"
      features={[
        'اختيار الأسئلة يدوياً من بنك الأسئلة مع البحث والفلترة',
        'التوليد التلقائي العشوائي حسب مستوى الصعوبة والعدد',
        'تحديد وقت الاختبار، درجة النجاح، وعدد المحاولات المسموحة',
        'تبديل ترتيب الأسئلة والخيارات عشوائياً لكل طالب',
        'تحديد الفصل المستهدف وتاريخ بدء وانتهاء الاختبار',
      ]}
    />
  );
}
