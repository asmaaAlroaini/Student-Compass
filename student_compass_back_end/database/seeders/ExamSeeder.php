<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\Unit;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::where('role', 'teacher')->first();
        $subjects = Subject::all();

        if ($subjects->isEmpty()) return;

        foreach ($subjects as $subject) {
            $questions = Question::where('subject_id', $subject->id)->get();
            if ($questions->isEmpty()) {
                $questions = Question::take(10)->get();
            }

            if ($questions->isEmpty()) continue;

            // 1. امتحان وزاري شامل للمادة
            $exam = Exam::firstOrCreate(
                [
                    'subject_id' => $subject->id,
                    'title' => "امتحان {$subject->name} الشامل التجريبي 2024",
                ],
                [
                    'type' => 'ministerial',
                    'duration_minutes' => 45,
                    'total_marks' => $questions->sum('points') > 0 ? $questions->sum('points') : 20,
                    'pass_marks' => 10,
                    'is_randomized' => true,
                    'is_published' => true,
                    'created_by' => $teacher ? $teacher->id : null,
                ]
            );

            $pivotData = [];
            foreach ($questions as $index => $q) {
                $pivotData[$q->id] = [
                    'marks' => $q->points ?: 2,
                    'order' => $index + 1,
                ];
            }
            $exam->questions()->sync($pivotData);

            // 2. اختبار تقييمي للوحدة الأولى
            $unit = Unit::where('subject_id', $subject->id)->first();
            if ($unit) {
                $unitQuestions = Question::where('unit_id', $unit->id)->get();
                if ($unitQuestions->isEmpty()) {
                    $unitQuestions = $questions->take(5);
                }

                $unitExam = Exam::firstOrCreate(
                    [
                        'subject_id' => $subject->id,
                        'unit_id' => $unit->id,
                        'title' => "اختبار تقييم {$unit->title}",
                    ],
                    [
                        'type' => 'assessment',
                        'duration_minutes' => 30,
                        'total_marks' => $unitQuestions->sum('points') > 0 ? $unitQuestions->sum('points') : 10,
                        'pass_marks' => 5,
                        'is_randomized' => false,
                        'is_published' => true,
                        'created_by' => $teacher ? $teacher->id : null,
                    ]
                );

                $unitPivot = [];
                foreach ($unitQuestions as $index => $uq) {
                    $unitPivot[$uq->id] = [
                        'marks' => $uq->points ?: 2,
                        'order' => $index + 1,
                    ];
                }
                $unitExam->questions()->sync($unitPivot);
            }
        }
    }
}
