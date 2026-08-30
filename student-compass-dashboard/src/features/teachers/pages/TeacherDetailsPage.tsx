import { UserCheck } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function TeacherDetailsPage() {
  return (
    <PagePlaceholder
      title="ملف المعلم التفصيلي"
      description="عرض بيانات المعلم والمواد المسندة إليه وسجل نشاطاته وإحصائياته الشاملة."
      icon={UserCheck}
      features={[
        'بيانات الحساب الشخصية (الاسم، البريد، الهاتف، التخصص)',
        'قائمة المواد المسندة مع صلاحية كل مادة (محرر / مشاهد)',
        'عدد الدروس والأسئلة والاختبارات التي أنشأها',
        'سجل آخر نشاطاته على المنصة',
        'تعيين مواد جديدة أو إلغاء تعيين مواد موجودة',
      ]}
    />
  );
}
