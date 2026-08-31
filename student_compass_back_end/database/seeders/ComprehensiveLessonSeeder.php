<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\Unit;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use Illuminate\Database\Seeder;

class ComprehensiveLessonSeeder extends Seeder
{
    public function run(): void
    {
        $units = Unit::with('subject')->get();

        $lessonTemplates = [
            1 => [
                'title' => 'الدرس الأول: المفاهيم والأسس النظرية',
                'summary' => "### مقدمة ومفاهيم الدرس الأول\n\nيعتبر هذا الدرس حجر الأساس لفهم الموضوع بعمق. يغطي التعريفات العلمية الأساسية، النظريات الأولية، والمصطلحات المعتمدة وزارياً.\n\n#### أهم النقاط التعليمية:\n- تحديد المفاهيم الرئيسية بدقة وفق المنهاج.\n- الربط بين المفهوم النظري والتطبيق الحياتي.\n- ملاحظات وتنبيهات على أكثر الأخطاء الشائعة بين الطلاب.",
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'pdf_path' => 'lessons/pdfs/summary_lesson_1.pdf',
            ],
            2 => [
                'title' => 'الدرس الثاني: القوانين والعلاقات الرياضية والتحليل',
                'summary' => "### القوانين والعلاقات الرياضية\n\nيستعرض هذا الدرس القوانين الأساسية والمشتقة، مع بيان وحدات القياس، وطريقة استنتاج العلاقات طردياً وعكسياً.\n\n#### القوانين المحورية:\n- القانون العام وتحويل الوحدات القياسية.\n- المخططات البيانية وتفسير المنحنيات.\n- استراتيجية استخراج المعطيات وحل المسائل في خطوات بسيطة.",
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'pdf_path' => 'lessons/pdfs/summary_lesson_2.pdf',
            ],
            3 => [
                'title' => 'الدرس الثالث: التطبيقات العملية وحل النماذج الوزارية',
                'summary' => "### التطبيقات والمسائل الوزارية\n\nتدريب عملي ومكثف على نماذج أسئلة الامتحانات الوزارية للسنوات السابقة.\n\n#### أساليب الحل السريع:\n- استبعاد الخيارات الخاطئة فوراً بنظام الأتمتة الحديث.\n- التركيز على الكلمات المفتاحية في نص السؤال.\n- نماذج أسئلة قدرات عليا وتحليل معمق لخطوات الحل النموذجية.",
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'pdf_path' => 'lessons/pdfs/summary_lesson_3.pdf',
            ],
            4 => [
                'title' => 'الدرس الرابع: ملخص شامل وبنك أسئلة الأتمتة',
                'summary' => "### الملخص الختامي وبنك الأتمتة\n\nمراجعة مكثفة لأهم خرائط المفاهيم والتعليلات العلمية التي تتكرر في الاختبارات.\n\n#### حصاد الوحدة:\n- خريطة ذهنية شاملة تربط أجزاء الوحدة ببعضها.\n- أسئلة علل والاستنتاجات وفق سلالم التصحيح الرسمية.\n- نصائح ذهبية لإدارة الوقت أثناء الامتحان.",
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'pdf_path' => 'lessons/pdfs/summary_lesson_4.pdf',
            ],
        ];

        foreach ($units as $unit) {
            $existingLessonsCount = Lesson::where('unit_id', $unit->id)->count();

            // إذا كانت الوحدة تحتوي على أقل من 3 دروس، نكملها
            for ($num = 1; $num <= 4; $num++) {
                $template = $lessonTemplates[$num];
                $subjectName = $unit->subject ? $unit->subject->name : 'المقرر';

                $lesson = Lesson::firstOrCreate(
                    [
                        'unit_id' => $unit->id,
                        'lesson_number' => $num,
                    ],
                    [
                        'subject_id' => $unit->subject_id,
                        'title' => "{$template['title']} - {$unit->title}",
                        'order' => $num,
                        'summary' => $template['summary'] . "\n\n*خاص بمقرر: {$subjectName}*",
                        'video_url' => $template['video_url'],
                        'pdf_path' => $template['pdf_path'],
                    ]
                );

                // التأكد من وجود أسئلة تثبيت لكل درس
                $questionCount = Question::where('lesson_id', $lesson->id)->count();
                if ($questionCount < 3) {
                    for ($q = 1; $q <= 3; $q++) {
                        Question::create([
                            'subject_id' => $unit->subject_id,
                            'unit_id' => $unit->id,
                            'lesson_id' => $lesson->id,
                            'question_text' => "سؤال تطبيقي رقم ($q) على {$lesson->title}: ما النتيجة الصحيحة المترتبة على تطبيق القاعدة الأساسية في هذا الموضوع؟",
                            'type' => 'mcq',
                            'difficulty' => $q == 1 ? 'easy' : ($q == 2 ? 'medium' : 'hard'),
                            'options' => [
                                'أ) الإجابة النموذجية الأولى وفقاً للقاعدة العلمية',
                                'ب) خيار بديل غير دقيق في هذه الحالة',
                                'ج) تطبيق غير مطابق لشروط المنهاج',
                                'د) قيمة مغايرة تماماً للمعطيات',
                            ],
                            'correct_answer' => 'أ) الإجابة النموذجية الأولى وفقاً للقاعدة العلمية',
                            'explanation' => "التفسير العلمي: وفقاً للقوانين المعتمدة في المنهاج، فإن الخيار (أ) هو الصحيح لأنه يحقق المعادلة والشروط النموذجية.",
                            'source' => 'وزاري 2025/2026',
                            'is_active' => true,
                        ]);
                    }
                }
            }
        }
    }
}
