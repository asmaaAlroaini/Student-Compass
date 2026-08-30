<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\Notification;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        if ($users->isEmpty()) return;

        $sampleNotifications = [
            [
                'title' => 'تذكير بالخطة الدراسية 📚',
                'message' => 'لديك 3 مهام متبقية في خطتك اليومية لمادة الفيزياء والرياضيات. خصص 30 دقيقة لإنجازها!',
                'type' => 'study_reminder',
            ],
            [
                'title' => 'انطلاق المسابقة التفاعلية الكبرى 🏆',
                'message' => 'مسابقة أوائل الطلبة في مادة الكيمياء متاحة الآن! شارك وتصدر قائمة الشرف.',
                'type' => 'competition',
            ],
            [
                'title' => 'بنك أسئلة وزارية جديدة 🎯',
                'message' => 'تمت إضافة نماذج الامتحانات الوزارية 2024 لجميع المواد مع الشروحات النموذجية.',
                'type' => 'new_content',
            ],
            [
                'title' => 'تنبيه موعد الاختبار التجريبي ⏱️',
                'message' => 'اختبار الوحدة الأولى لمادة الأحياء أصبح جاهزاً. اختبر مستواك وتعرف على نقاط قوتك.',
                'type' => 'exam_result',
            ],
            [
                'title' => 'إعلان من إدارة بوصلة الطالب 📢',
                'message' => 'تم تحديث ميزة رحلة التعلم الذكية وإتاحة الشروحات المفصلة لكل سؤال.',
                'type' => 'admin_announcement',
            ],
            [
                'title' => 'تذكير المراجعة الأسبوعية 🌟',
                'message' => 'راجع الأسئلة التي أخطأت بها سابقاً في قسم "مراجعة أخطائي" لتثبيت المعلومة.',
                'type' => 'study_reminder',
            ],
        ];

        foreach ($users as $user) {
            foreach ($sampleNotifications as $index => $notif) {
                Notification::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'title' => $notif['title'],
                    ],
                    [
                        'message' => $notif['message'],
                        'type' => $notif['type'],
                        'is_read' => $index > 3,
                        'created_at' => now()->subHours($index * 4),
                    ]
                );
            }
        }
    }
}
