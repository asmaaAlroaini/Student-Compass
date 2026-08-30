import { BookOpen } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function SubjectDetailsPage() {
  return (
    <PagePlaceholder
      title="تفاصيل المادة ومحتواها"
      description="عرض تفاصيل المادة الكاملة مع وحداتها ودروسها وإمكانية تعديل المحتوى."
      icon={BookOpen}
      features={[
        'بيانات المادة (الاسم، الكود، الصف، المسار، المعلم المسؤول)',
        'قائمة الوحدات الدراسية مع أعداد الدروس لكل وحدة',
        'الانتقال لمحرر المنهج الكامل',
        'إحصائيات المادة (عدد الطلاب، عدد الأسئلة، معدل الإتقان)',
      ]}
    />
  );
}
