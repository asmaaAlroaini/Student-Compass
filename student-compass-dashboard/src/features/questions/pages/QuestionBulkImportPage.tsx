import { Import } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function QuestionBulkImportPage() {
  return (
    <PagePlaceholder
      title="الاستيراد الجماعي للأسئلة (Excel / CSV)"
      description="استيراد آلاف الأسئلة الوزارية دفعة واحدة من ملف Excel أو CSV مع فحص البيانات ومنع التكرار."
      icon={Import}
      badge="50,000+ سؤال"
      badgeColor="bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
      features={[
        'رفع ملف Excel / CSV ومعاينة البيانات فورياً',
        'محرك التحقق الصارم من البيانات (Validation Engine)',
        'كشف الأسئلة المكررة وتحديدها قبل الاستيراد',
        'مراجعة وتعديل الأسئلة يدوياً قبل التأكيد النهائي',
        'الاستيراد الدُفعي (Batch Insert) لضمان الأداء العالي',
      ]}
    />
  );
}
