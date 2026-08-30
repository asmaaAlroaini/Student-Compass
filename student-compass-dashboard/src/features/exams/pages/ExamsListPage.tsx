import { FileCheck2 } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function ExamsListPage() {
  return (
    <PagePlaceholder
      title="إدارة الاختبارات والتقييمات"
      description="عرض وإدارة كافة الاختبارات الوزارية والتقييمية واختبارات الوحدات والدروس."
      icon={FileCheck2}
      badge="اختبارات وزارية وتقييمية"
      badgeColor="bg-violet-500/15 text-violet-300 border-violet-500/20"
      features={[
        'جدول الاختبارات مع الفلترة بالنوع (وزاري / تقييمي / كويز)',
        'عرض حالة كل اختبار (نشط / منتهي / مسودة)',
        'عرض عدد المشاركين ومتوسط الدرجات',
        'الانتقال السريع لنتائج وتحليلات أي اختبار',
        'منشئ الاختبارات التفاعلي مع توليد عشوائي للأسئلة',
      ]}
    />
  );
}
