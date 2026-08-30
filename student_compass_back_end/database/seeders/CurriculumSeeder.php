<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\Unit;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use Illuminate\Database\Seeder;

class CurriculumSeeder extends Seeder
{
    public function run(): void
    {
        // قائمة المواد الأساسية لجميع المراحل والمسارات
        $subjectsData = [
            // --- الثالث الثانوي (علمي وأدبي ومشترك) ---
            ['name' => 'الفيزياء', 'code' => 'PHY301', 'grade_level' => 'الثالث الثانوي', 'track' => 'علمي', 'icon' => 'physics.png'],
            ['name' => 'الكيمياء', 'code' => 'CHM301', 'grade_level' => 'الثالث الثانوي', 'track' => 'علمي', 'icon' => 'chemistry.png'],
            ['name' => 'الأحياء', 'code' => 'BIO301', 'grade_level' => 'الثالث الثانوي', 'track' => 'علمي', 'icon' => 'biology.png'],
            ['name' => 'الرياضيات التفاضل والتكامل', 'code' => 'MTH301', 'grade_level' => 'الثالث الثانوي', 'track' => 'علمي', 'icon' => 'math.png'],
            ['name' => 'اللغة الإنجليزية', 'code' => 'ENG301', 'grade_level' => 'الثالث الثانوي', 'track' => null, 'icon' => 'english.png'],
            ['name' => 'اللغة العربية', 'code' => 'ARB301', 'grade_level' => 'الثالث الثانوي', 'track' => null, 'icon' => 'arabic.png'],
            ['name' => 'التربية الإسلامية', 'code' => 'ISL301', 'grade_level' => 'الثالث الثانوي', 'track' => null, 'icon' => 'islamic.png'],
            ['name' => 'التاريخ', 'code' => 'HIS301', 'grade_level' => 'الثالث الثانوي', 'track' => 'أدبي', 'icon' => 'history.png'],
            ['name' => 'الجغرافيا', 'code' => 'GEO301', 'grade_level' => 'الثالث الثانوي', 'track' => 'أدبي', 'icon' => 'geography.png'],
            ['name' => 'الفلسفة والمنطق', 'code' => 'PHI301', 'grade_level' => 'الثالث الثانوي', 'track' => 'أدبي', 'icon' => 'philosophy.png'],

            // --- الثاني الثانوي (علمي وأدبي ومشترك) ---
            ['name' => 'الفيزياء', 'code' => 'PHY201', 'grade_level' => 'الثاني الثانوي', 'track' => 'علمي', 'icon' => 'physics.png'],
            ['name' => 'الكيمياء', 'code' => 'CHM201', 'grade_level' => 'الثاني الثانوي', 'track' => 'علمي', 'icon' => 'chemistry.png'],
            ['name' => 'الأحياء', 'code' => 'BIO201', 'grade_level' => 'الثاني الثانوي', 'track' => 'علمي', 'icon' => 'biology.png'],
            ['name' => 'الرياضيات التطبيقية', 'code' => 'MTH201', 'grade_level' => 'الثاني الثانوي', 'track' => 'علمي', 'icon' => 'math.png'],
            ['name' => 'اللغة الإنجليزية', 'code' => 'ENG201', 'grade_level' => 'الثاني الثانوي', 'track' => null, 'icon' => 'english.png'],
            ['name' => 'اللغة العربية', 'code' => 'ARB201', 'grade_level' => 'الثاني الثانوي', 'track' => null, 'icon' => 'arabic.png'],

            // --- الأول الثانوي (مسار عام) ---
            ['name' => 'الفيزياء العامة', 'code' => 'PHY101', 'grade_level' => 'الأول الثانوي', 'track' => 'عام', 'icon' => 'physics.png'],
            ['name' => 'الكيمياء العامة', 'code' => 'CHM101', 'grade_level' => 'الأول الثانوي', 'track' => 'عام', 'icon' => 'chemistry.png'],
            ['name' => 'الأحياء العامة', 'code' => 'BIO101', 'grade_level' => 'الأول الثانوي', 'track' => 'عام', 'icon' => 'biology.png'],
            ['name' => 'الرياضيات العامة', 'code' => 'MTH101', 'grade_level' => 'الأول الثانوي', 'track' => 'عام', 'icon' => 'math.png'],
            ['name' => 'اللغة العربية', 'code' => 'ARB101', 'grade_level' => 'الأول الثانوي', 'track' => 'عام', 'icon' => 'arabic.png'],
            ['name' => 'اللغة الإنجليزية', 'code' => 'ENG101', 'grade_level' => 'الأول الثانوي', 'track' => 'عام', 'icon' => 'english.png'],
        ];

        foreach ($subjectsData as $s) {
            $subject = Subject::updateOrCreate(['code' => $s['code']], $s);

            // 1. الوحدة الأولى
            $unit1 = Unit::updateOrCreate(
                ['subject_id' => $subject->id, 'unit_number' => 1],
                [
                    'title' => 'الوحدة الأولى: المفاهيم والقوانين الأساسية لمادة ' . $s['name'],
                    'order' => 1,
                    'description' => 'دراسة شاملة لأساسيات ونظريات مادة ' . $s['name'] . ' مع التطبيقات الوزارية.',
                ]
            );

            // دروس الوحدة الأولى
            Lesson::updateOrCreate(
                ['unit_id' => $unit1->id, 'lesson_number' => 1],
                [
                    'subject_id' => $subject->id,
                    'title' => 'الدرس الأول: مدخل ومفاهيم أساسية',
                    'order' => 1,
                    'summary' => 'مقدمة شاملة ومفاهيم محورية تبسط مادة ' . $s['name'] . ' وتعزز استيعاب الطالب للقوانين.',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'pdf_path' => 'lessons/pdfs/lesson1.pdf',
                ]
            );

            Lesson::updateOrCreate(
                ['unit_id' => $unit1->id, 'lesson_number' => 2],
                [
                    'subject_id' => $subject->id,
                    'title' => 'الدرس الثاني: النظريات وتطبيقاتها النموذجية',
                    'order' => 2,
                    'summary' => 'شرح معمق للنظريات الأساسية مع استعراض خطوات حل المسائل الرياضية والنظرية.',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'pdf_path' => 'lessons/pdfs/lesson2.pdf',
                ]
            );

            Lesson::updateOrCreate(
                ['unit_id' => $unit1->id, 'lesson_number' => 3],
                [
                    'subject_id' => $subject->id,
                    'title' => 'الدرس الثالث: حل النماذج والتطبيقات الوزارية',
                    'order' => 3,
                    'summary' => 'تدريب مكثف على نماذج الأسئلة الوزارية السابقة وأكثر الأفكار تكراراً في الامتحانات.',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'pdf_path' => 'lessons/pdfs/lesson3.pdf',
                ]
            );

            // 2. الوحدة الثانية
            $unit2 = Unit::updateOrCreate(
                ['subject_id' => $subject->id, 'unit_number' => 2],
                [
                    'title' => 'الوحدة الثانية: المسائل المتقدمة والتعليلات',
                    'order' => 2,
                    'description' => 'تطبيقات عملية وأسئلة علل والاستنتاجات العلمية لمادة ' . $s['name'],
                ]
            );

            // دروس الوحدة الثانية
            Lesson::updateOrCreate(
                ['unit_id' => $unit2->id, 'lesson_number' => 1],
                [
                    'subject_id' => $subject->id,
                    'title' => 'الدرس الأول: الاستنتاجات العلمية والتعليلات',
                    'order' => 1,
                    'summary' => 'مراجعة أدق التعليلات والاستنتاجات وفق سلم التصحيح الوزاري المعتمد.',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'pdf_path' => 'lessons/pdfs/lesson4.pdf',
                ]
            );

            Lesson::updateOrCreate(
                ['unit_id' => $unit2->id, 'lesson_number' => 2],
                [
                    'subject_id' => $subject->id,
                    'title' => 'الدرس الثاني: مسائل القدرات وحساب النتائج',
                    'order' => 2,
                    'summary' => 'حل المسائل الحسابية خطوة بخطوة مع توضيح مفاتيح الحل السريع والدقيق.',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'pdf_path' => 'lessons/pdfs/lesson5.pdf',
                ]
            );

            // 3. الوحدة الثالثة
            $unit3 = Unit::updateOrCreate(
                ['subject_id' => $subject->id, 'unit_number' => 3],
                [
                    'title' => 'الوحدة الثالثة: المراجعة الشاملة ونماذج الأتمتة',
                    'order' => 3,
                    'description' => 'مراجعة ختامية ونماذج اختبارات أتمتة تحاكي النظام الوزاري الحديث.',
                ]
            );

            Lesson::updateOrCreate(
                ['unit_id' => $unit3->id, 'lesson_number' => 1],
                [
                    'subject_id' => $subject->id,
                    'title' => 'الدرس الأول: بنك أسئلة الأتمتة والخيارات الذكية',
                    'order' => 1,
                    'summary' => 'شرح استراتيجيات التعامل مع أسئلة الأتمتة واستبعاد الخيارات الخاطئة بسرعة.',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'pdf_path' => 'lessons/pdfs/lesson6.pdf',
                ]
            );
        }
    }
}
