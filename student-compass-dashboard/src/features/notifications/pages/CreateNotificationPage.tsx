import { Bell } from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function CreateNotificationPage() {
  return (
    <PagePlaceholder
      title="إنشاء إشعار جديد"
      description="إرسال إشعار فوري أو مجدول مع تحديد الفئة المستهدفة بدقة."
      icon={Bell}
      features={[
        'اختيار نوع الإشعار (تذكير مذاكرة، إعلان امتحان، مسابقة جديدة، إعلان عام)',
        'تحديد الفئة المستهدفة (جميع الطلاب، فصل معين، مسار محدد، أفراد محددين)',
        'كتابة عنوان ومحتوى الإشعار',
        'الإرسال الفوري أو الجدولة لوقت مستقبلي',
        'إرفاق رابط خارجي أو مسار داخلي بالإشعار',
      ]}
    />
  );
}
