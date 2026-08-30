import { UserCheck } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function TeachersListPage() {
  return (
    <PagePlaceholder
      title="إدارة المعلمين والمشرفين"
      description="قائمة شاملة بجميع المعلمين مع إمكانية إضافة وتعديل وتفعيل أو تجميد الحسابات."
      icon={UserCheck}
      badge="خاص بالمدير العام"
      badgeColor="bg-rose-500/15 text-rose-300 border-rose-500/20"
      features={[
        'جدول المعلمين مع عدد المواد المسندة والدروس والأسئلة المنشأة',
        'إضافة حساب معلم جديد (الاسم، البريد، الهاتف، التخصص)',
        'تعيين مواد دراسية لكل معلم (Assign Subjects)',
        'سجل نشاطات وتعديلات كل معلم',
        'تفعيل / تجميد الحسابات فوراً',
      ]}
    />
  );
}
