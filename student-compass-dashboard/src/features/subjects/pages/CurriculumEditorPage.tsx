import { Layers } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function CurriculumEditorPage() {
  return (
    <PagePlaceholder
      title="محرر المنهج — الوحدات والدروس"
      description="إدارة الوحدات والدروس ورحلة التعلم الخماسية المراحل لهذه المادة."
      icon={Layers}
      badge="5 مراحل للتعلم"
      badgeColor="bg-violet-500/15 text-violet-300 border-violet-500/20"
      features={[
        'شجرة الوحدات والدروس التفاعلية مع Drag & Drop لإعادة الترتيب',
        'محرر الدرس المتكامل: (1) شرح الفيديو — (2) الملخص والـ PDF — (3) أسئلة التثبيت — (4) الكويز — (5) تحليل الأداء',
        'رفع ملفات PDF والملاحظات الذهنية',
        'ربط الدرس بروابط الفيديو (YouTube / Vimeo)',
        'معاينة رحلة تعلم الطالب من منظور لوحة التحكم',
      ]}
    />
  );
}
