<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\Competition;
use App\Infrastructure\Persistence\Eloquent\Models\CompetitionResult;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Database\Seeder;

class CompetitionSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = Subject::all();
        $phySubject = Subject::where('code', 'PHY301')->first() ?? $subjects->first();
        $chmSubject = Subject::where('code', 'CHM301')->first() ?? $subjects->skip(1)->first() ?? $phySubject;
        $mthSubject = Subject::where('code', 'MTH301')->first() ?? $subjects->skip(2)->first() ?? $phySubject;

        $teacher = User::where('role', 'teacher')->first();
        $teacherId = $teacher ? $teacher->id : null;

        $student1 = User::where('email', 'student@studentcompass.com')->first();
        $studentSara = User::where('email', 'sara@studentcompass.com')->first();
        $studentOmar = User::where('email', 'omar@studentcompass.com')->first();
        $studentFatima = User::where('email', 'fatima@studentcompass.com')->first();
        $studentAbdulrahman = User::where('email', 'abdulrahman@studentcompass.com')->first();
        $studentMariam = User::where('email', 'mariam@studentcompass.com')->first();
        $studentYoussef = User::where('email', 'youssef@studentcompass.com')->first();

        // 1. مسابقة الفيزياء الكبرى
        $comp1 = Competition::updateOrCreate(
            ['title' => 'تحدي الفيزياء والكهربية الوزاري 2026'],
            [
                'description' => 'مسابقة تفاعلية سريعة تهدف لاختبار استيعاب المفاهيم الأساسية في الكهربية وقوانين أوم وكيرشوف.',
                'subject_id' => $phySubject ? $phySubject->id : null,
                'question_count' => 5,
                'duration_minutes' => 15,
                'points_reward' => 200,
                'start_time' => now()->subDays(2),
                'end_time' => now()->addDays(5),
                'is_active' => true,
                'created_by' => $teacherId,
            ]
        );

        // 2. ماراثون الكيمياء العضوية
        $comp2 = Competition::updateOrCreate(
            ['title' => 'ماراثون الكيمياء والتفاعلات السريعة'],
            [
                'description' => 'تحدي السرعة في تسمية المركبات العضوية وتحديد نواتج التفاعلات الكيميائية.',
                'subject_id' => $chmSubject ? $chmSubject->id : null,
                'question_count' => 4,
                'duration_minutes' => 10,
                'points_reward' => 150,
                'start_time' => now()->subDays(1),
                'end_time' => now()->addDays(6),
                'is_active' => true,
                'created_by' => $teacherId,
            ]
        );

        // 3. أولمبياد الرياضيات والتفاضل والتكامل
        $comp3 = Competition::updateOrCreate(
            ['title' => 'أولمبياد التفاضل والتكامل للأوائل'],
            [
                'description' => 'أقوى المسابقات التنافسية لحساب النهايات والمشتقات والتكاملات القياسية.',
                'subject_id' => $mthSubject ? $mthSubject->id : null,
                'question_count' => 5,
                'duration_minutes' => 20,
                'points_reward' => 300,
                'start_time' => now()->subHours(12),
                'end_time' => now()->addDays(8),
                'is_active' => true,
                'created_by' => $teacherId,
            ]
        );

        // ربط الأسئلة بالمسابقات
        $phyQuestions = Question::where('subject_id', $phySubject?->id)->limit(5)->get();
        if ($phyQuestions->isNotEmpty()) {
            $syncData = [];
            foreach ($phyQuestions as $i => $q) {
                $syncData[$q->id] = ['order' => $i + 1];
            }
            $comp1->questions()->sync($syncData);
        }

        $chmQuestions = Question::where('subject_id', $chmSubject?->id)->limit(4)->get();
        if ($chmQuestions->isNotEmpty()) {
            $syncData = [];
            foreach ($chmQuestions as $i => $q) {
                $syncData[$q->id] = ['order' => $i + 1];
            }
            $comp2->questions()->sync($syncData);
        }

        // إنشاء لوحة متصدرين حية وغنية (Live Leaderboard Data)
        $leaderboardRecords = [
            [
                'user' => $studentSara,
                'score_percentage' => 100.00,
                'correct_answers' => 5,
                'total_questions' => 5,
                'time_spent_seconds' => 180,
                'points_earned' => 250, // 200 + 50 speed bonus
            ],
            [
                'user' => $studentOmar,
                'score_percentage' => 100.00,
                'correct_answers' => 5,
                'total_questions' => 5,
                'time_spent_seconds' => 210,
                'points_earned' => 230,
            ],
            [
                'user' => $studentFatima,
                'score_percentage' => 95.00,
                'correct_answers' => 4,
                'total_questions' => 5,
                'time_spent_seconds' => 240,
                'points_earned' => 210,
            ],
            [
                'user' => $student1, // الطالب المسجل
                'score_percentage' => 90.00,
                'correct_answers' => 4,
                'total_questions' => 5,
                'time_spent_seconds' => 280,
                'points_earned' => 190,
            ],
            [
                'user' => $studentAbdulrahman,
                'score_percentage' => 85.00,
                'correct_answers' => 4,
                'total_questions' => 5,
                'time_spent_seconds' => 310,
                'points_earned' => 170,
            ],
            [
                'user' => $studentMariam,
                'score_percentage' => 80.00,
                'correct_answers' => 3,
                'total_questions' => 5,
                'time_spent_seconds' => 350,
                'points_earned' => 150,
            ],
            [
                'user' => $studentYoussef,
                'score_percentage' => 75.00,
                'correct_answers' => 3,
                'total_questions' => 5,
                'time_spent_seconds' => 400,
                'points_earned' => 130,
            ],
        ];

        foreach ($leaderboardRecords as $rec) {
            if ($rec['user']) {
                CompetitionResult::updateOrCreate(
                    [
                        'competition_id' => $comp1->id,
                        'user_id' => $rec['user']->id,
                    ],
                    [
                        'score_percentage' => $rec['score_percentage'],
                        'correct_answers' => $rec['correct_answers'],
                        'total_questions' => $rec['total_questions'],
                        'time_spent_seconds' => $rec['time_spent_seconds'],
                        'points_earned' => $rec['points_earned'],
                        'completed_at' => now()->subHours(rand(1, 48)),
                    ]
                );

                // نتائج للمسابقة الثانية
                CompetitionResult::updateOrCreate(
                    [
                        'competition_id' => $comp2->id,
                        'user_id' => $rec['user']->id,
                    ],
                    [
                        'score_percentage' => $rec['score_percentage'],
                        'correct_answers' => $rec['correct_answers'],
                        'total_questions' => 4,
                        'time_spent_seconds' => $rec['time_spent_seconds'] - 30,
                        'points_earned' => (int) ($rec['points_earned'] * 0.8),
                        'completed_at' => now()->subHours(rand(1, 24)),
                    ]
                );
            }
        }
    }
}
