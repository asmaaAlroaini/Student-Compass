<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\Question;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\Unit;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Database\Seeder;

class QuestionBankSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::where('role', 'teacher')->first();
        $teacherId = $teacher ? $teacher->id : 1;

        $subjects = Subject::with('units.lessons')->get();

        foreach ($subjects as $subject) {
            foreach ($subject->units as $unit) {
                foreach ($unit->lessons as $lesson) {
                    // إنشاء باقة أسئلة لكل درس لضمان وجود أسئلة تثبيت واختبارات لجميع المواد
                    $questionsData = [
                        [
                            'subject_id' => $subject->id,
                            'unit_id' => $unit->id,
                            'lesson_id' => $lesson->id,
                            'question_text' => 'ما هو المفهوم الأساسي الذي يعبر عنه ' . $lesson->title . ' في مادة ' . $subject->name . '؟',
                            'type' => 'mcq',
                            'options' => [
                                'العلاقة التناسبية الطردية بين المتغيرات',
                                'ثبات الطاقة الكلية وتحولها من شكل لآخر',
                                'القانون العام للتوازن الديناميكي',
                                'معدل التغير الزمني لكمية الحركة'
                            ],
                            'correct_answer' => 'العلاقة التناسبية الطردية بين المتغيرات',
                            'explanation' => 'وفق المنهج الوزاري المعتمد، يمثل هذا المفهوم حجر الأساس لفهم تطبيقات ' . $subject->name . '.',
                            'difficulty' => 'easy',
                            'year' => 2024,
                            'source' => 'امتحان وزاري 2024',
                            'points' => 1,
                            'is_active' => true,
                            'created_by' => $teacherId,
                        ],
                        [
                            'subject_id' => $subject->id,
                            'unit_id' => $unit->id,
                            'lesson_id' => $lesson->id,
                            'question_text' => 'تعتبر جميع التطبيقات النظرية في هذا الدرس متوافقة مع القوانين القياسية للوزارة.',
                            'type' => 'true_false',
                            'options' => ['صح', 'خطأ'],
                            'correct_answer' => 'صح',
                            'explanation' => 'العبارة صحيحة تماماً وتتوافق مع المعايير والأدلة العلمية المقررة.',
                            'difficulty' => 'easy',
                            'year' => 2023,
                            'source' => 'نماذج تقويم الطالب 2023',
                            'points' => 1,
                            'is_active' => true,
                            'created_by' => $teacherId,
                        ],
                        [
                            'subject_id' => $subject->id,
                            'unit_id' => $unit->id,
                            'lesson_id' => $lesson->id,
                            'question_text' => 'عند مضاعفة القيمة الابتدائية في تجربة ' . $lesson->title . '، فإن الناتج النهائي:',
                            'type' => 'mcq',
                            'options' => [
                                'يتضاعف إلى أربعة أمثاله',
                                'يقل إلى النصف',
                                'يظل ثابتاً دون تغير',
                                'يزداد بمقدار الضعف فقط'
                            ],
                            'correct_answer' => 'يتضاعف إلى أربعة أمثاله',
                            'explanation' => 'لأن العلاقة طردية مع مربع الكمية في القانون الرياضي المعتمد.',
                            'difficulty' => 'medium',
                            'year' => 2024,
                            'source' => 'بنك التميز الوزاري',
                            'points' => 2,
                            'is_active' => true,
                            'created_by' => $teacherId,
                        ],
                        [
                            'subject_id' => $subject->id,
                            'unit_id' => $unit->id,
                            'lesson_id' => $lesson->id,
                            'question_text' => 'أي من العوامل التالية يؤثر تأثيراً مباشراً وحاسماً في نتائج ' . $lesson->title . '؟',
                            'type' => 'mcq',
                            'options' => [
                                'درجة الحرارة وثبات الضغط',
                                'طبيعة المادة وحجم العينة',
                                'نوع الوسط المادي وسرعة التفاعل',
                                'جميع ما سبق صحيح'
                            ],
                            'correct_answer' => 'جميع ما سبق صحيح',
                            'explanation' => 'جميع هذه العوامل تؤثر مجتمعة بحسب ما هو موضح في التجارب والاستنتاجات الوزارية.',
                            'difficulty' => 'hard',
                            'year' => 2022,
                            'source' => 'نماذج أوائل الجمهورية',
                            'points' => 2,
                            'is_active' => true,
                            'created_by' => $teacherId,
                        ],
                    ];

                    foreach ($questionsData as $q) {
                        Question::updateOrCreate(
                            [
                                'subject_id' => $q['subject_id'],
                                'lesson_id' => $q['lesson_id'],
                                'question_text' => $q['question_text'],
                            ],
                            $q
                        );
                    }
                }
            }
        }
    }
}
