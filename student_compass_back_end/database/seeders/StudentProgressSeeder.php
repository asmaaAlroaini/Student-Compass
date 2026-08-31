<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use App\Infrastructure\Persistence\Eloquent\Models\QuestionReport;
use App\Infrastructure\Persistence\Eloquent\Models\StudentProgress;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class StudentProgressSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $exams = Exam::with('questions')->get();
        $questions = Question::all();

        if ($students->isEmpty() || $exams->isEmpty()) {
            return;
        }

        // 1. إنشاء محاولات تقديم امتحانات واقعية لجميع الطلاب
        foreach ($students as $student) {
            // كل طالب يقدم 2-4 اختبارات بدرجات متفاوتة
            $selectedExams = $exams->random(min(count($exams), rand(2, 4)));

            foreach ($selectedExams as $exam) {
                $totalScore = $exam->total_marks ?: 100;
                $earnedPercentage = rand(55, 98); // درجات اجتياز جيدة
                $earnedScore = round(($earnedPercentage / 100) * $totalScore, 1);
                $isPass = $earnedPercentage >= ($exam->pass_marks ? ($exam->pass_marks / $totalScore) * 100 : 50);

                StudentProgress::updateOrCreate(
                    [
                        'user_id' => $student->id,
                        'exam_id' => $exam->id,
                    ],
                    [
                        'score' => $earnedScore,
                        'total_possible_score' => $totalScore,
                        'percentage' => $earnedPercentage,
                        'time_spent_seconds' => rand(600, 1800),
                        'status' => $isPass ? 'passed' : 'failed',
                        'completed_at' => Carbon::now()->subHours(rand(1, 48)),
                    ]
                );
            }
        }

        // 2. إنشاء بلاغات جودة محتوى عن الأسئلة
        if ($questions->isNotEmpty()) {
            $sampleQuestions = $questions->random(min(count($questions), 5));
            $reasons = [
                'الخيارات غير واضحة وتتطلب توضيحاً إضافياً في الصياغة.',
                'يرجى مراجعة التفسير العلمي للإجابة لتطابقه مع طبعة الكتاب الوزاري 2024.',
                'الرسم التوضيحي يحتاج لجودة أعلى.',
                'سؤال ممتاز وشامل للفصل.',
            ];

            foreach ($sampleQuestions as $idx => $q) {
                $st = $students->random();
                QuestionReport::firstOrCreate(
                    [
                        'user_id' => $st->id,
                        'question_id' => $q->id,
                    ],
                    [
                        'report_type' => 'content_issue',
                        'description' => $reasons[$idx % count($reasons)],
                        'status' => $idx === 0 ? 'resolved' : ($idx === 1 ? 'dismissed' : 'pending'),
                        'admin_notes' => $idx === 0 ? 'تمت مراجعة السؤال واعتماده مع النموذج الوزاري.' : null,
                    ]
                );
            }
        }
    }
}
