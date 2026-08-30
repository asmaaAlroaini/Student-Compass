import { Users } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function StudentProfilePage() {
  return (
    <PagePlaceholder
      title="الملف الأكاديمي للطالب"
      description="عرض تفصيلي لأداء الطالب الأكاديمي ونتائجه وتحليل نقاط قوته وضعفه."
      icon={Users}
      badge="الدوسيه الأكاديمي"
      badgeColor="bg-indigo-500/15 text-indigo-300 border-indigo-500/20"
      features={[
        'نسبة إنجاز المواد وعدد الدروس المكتملة',
        'سجل نتائج الاختبارات والدرجات التفصيلية',
        'تحليل الأسئلة الأكثر خطأً ونقاط الضعف',
        'سجل جلسات التعلم وآخر نشاط على المنصة',
        'إعادة تعيين كلمة المرور أو تحويل الطالب لفصل آخر',
      ]}
    />
  );
}
