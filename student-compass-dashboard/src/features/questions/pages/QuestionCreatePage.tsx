import { HelpCircle } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function QuestionCreatePage() {
  return (
    <PagePlaceholder
      title="منشئ الأسئلة المتقدم"
      description="إضافة سؤال جديد مع دعم الصيغ والمعادلات الرياضية، الخيارات، والإجابة النموذجية."
      icon={HelpCircle}
      badge="Question Builder"
      badgeColor="bg-blue-500/15 text-blue-300 border-blue-500/20"
      features={[
        'كتابة نص السؤال مع دعم المعادلات الرياضية والصيغ العلمية (LaTeX / MathJax)',
        'إرفاق صور ورسومات توضيحية للسؤال',
        'تحديد الخيارات الأربعة وتعيين الإجابة الصحيحة',
        'كتابة التفسير والشرح المفصل للحل النموذجي',
        'تصنيف السؤال (المادة، الوحدة، الدرس، الصعوبة، السنة الوزارية)',
      ]}
    />
  );
}
