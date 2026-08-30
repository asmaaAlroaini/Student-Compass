import { BarChart3 } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function ReportsAnalyticsPage() {
  return (
    <PagePlaceholder
      title="التقارير والتحليلات الشاملة"
      description="تقارير تفاعلية عن أداء المنصة الأكاديمية مع رسوم بيانية متقدمة ومؤشرات الأداء."
      icon={BarChart3}
      badge="Analytics Dashboard"
      badgeColor="bg-indigo-500/15 text-indigo-300 border-indigo-500/20"
      features={[
        'رسم بياني لمعدلات اجتياز الاختبارات وتوزيع الدرجات (Recharts)',
        'نشاط الطلاب اليومي والأسبوعي (أسئلة منجزة، دروس مكتملة)',
        'نسبة اكتمال المناهج والوحدات لكل مادة',
        'تقرير المعلمين الأكثر نشاطاً ومحتوىً مضافاً',
        'تصدير التقارير بصيغة PDF أو Excel',
      ]}
    />
  );
}
