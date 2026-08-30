import { BarChart3 } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function ExamResultsPage() {
  return (
    <PagePlaceholder
      title="تحليلات نتائج الاختبار"
      description="عرض تفصيلي لنتائج الطلاب في هذا الاختبار مع تحليل نقاط الضعف والأخطاء الشائعة."
      icon={BarChart3}
      badge="نتائج وتحليلات"
      badgeColor="bg-blue-500/15 text-blue-300 border-blue-500/20"
      features={[
        'توزيع درجات الطلاب ومعدل الاجتياز والرسوب',
        'أكثر الأسئلة خطأً بين الطلاب (Weakness Analysis)',
        'مقارنة أداء الفصول المختلفة',
        'تصدير نتائج الاختبار إلى Excel',
        'عرض حلول كل طالب بالتفصيل',
      ]}
    />
  );
}
