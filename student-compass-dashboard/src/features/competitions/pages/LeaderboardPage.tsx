import { Trophy } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function LeaderboardPage() {
  return (
    <PagePlaceholder
      title="لوحة الشرف المباشرة"
      description="عرض الترتيب الحي للمتسابقين مع إحصائيات المسابقة في الوقت الفعلي."
      icon={Trophy}
      badge="Live"
      badgeColor="bg-rose-500/15 text-rose-300 border-rose-500/20"
      features={[
        'ترتيب المتسابقين بالدرجات والوقت المستغرق',
        'عرض بارز لصناديق المراكز الأولى (ذهبي / فضي / برونزي)',
        'تحديث تلقائي في الوقت الفعلي (Real-time Polling)',
        'إحصائيات شاملة (عدد المشاركين، أعلى درجة، متوسط الأداء)',
        'تصدير نتائج لوحة الشرف',
      ]}
    />
  );
}
