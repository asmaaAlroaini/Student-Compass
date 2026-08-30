import { Users } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function StudentsListPage() {
  return (
    <PagePlaceholder
      title="إدارة الطلاب والمتابعة الأكاديمية"
      description="دليل شامل لجميع الطلاب المسجلين مع التصفية والبحث المتقدم وعرض التقدم الأكاديمي."
      icon={Users}
      badge="دليل الطلاب"
      badgeColor="bg-blue-500/15 text-blue-300 border-blue-500/20"
      features={[
        'جدول الطلاب مع التصفية بالفصل والمسار وحالة الحساب',
        'البحث السريع بالاسم أو البريد الإلكتروني',
        'عرض نسبة إنجاز كل طالب في موادّه',
        'الانتقال للملف الأكاديمي التفصيلي لكل طالب',
        'إعادة تعيين كلمة المرور أو تعديل الفصل',
      ]}
    />
  );
}
