import { HelpCircle } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function QuestionBankListPage() {
  return (
    <PagePlaceholder
      title="بنك الأسئلة المركزي (50,000+ سؤال)"
      description="استعراض والبحث المتقدم في كافة الأسئلة الوزارية والتقييمية مع خيارات الفلترة المتقدمة."
      icon={HelpCircle}
      badge="50,000+ سؤال وزاري"
      badgeColor="bg-amber-500/15 text-amber-300 border-amber-500/20"
      features={[
        'جدول الأسئلة فائق الأداء مع البحث اللحظي (Debounced Search)',
        'فلترة متعددة حسب المادة، الوحدة، الدرس، السنة الوزارية، ومستوى الصعوبة',
        'عرض السؤال مع خياراته وتفسير الإجابة الصحيحة',
        'إمكانية التعديل السريع، الحذف، والتصدير',
        'ربط الأسئلة بالنماذج الوزارية والتقييمات',
      ]}
    />
  );
}
