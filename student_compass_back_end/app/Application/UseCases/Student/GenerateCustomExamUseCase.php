<?php

namespace App\Application\UseCases\Student;

use App\Infrastructure\Persistence\Eloquent\Models\Question;
use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use Illuminate\Support\Facades\DB;

class GenerateCustomExamUseCase
{
    public function execute(int $userId, int $subjectId, ?array $lessonIds = null, ?string $difficulty = null, int $questionCount = 10, ?int $year = null)
    {
        $query = Question::query()
            ->active()
            ->where('subject_id', $subjectId);

        if (!empty($lessonIds)) {
            $query->whereIn('lesson_id', $lessonIds);
        }

        if ($difficulty) {
            $query->where('difficulty', $difficulty);
        }

        if ($year) {
            $query->where('year', $year);
        }

        $questions = $query->inRandomOrder()->limit($questionCount)->get();

        if ($questions->isEmpty()) {
            throw new \Exception('لم يتم العثور على أسئلة تتوافق مع الشروط المحددة.');
        }

        // إنشاء الامتحان المخصص بـ Transaction
        return DB::transaction(function () use ($userId, $subjectId, $questions) {
            $exam = Exam::create([
                'subject_id' => $subjectId,
                'title' => 'اختبار مخصص - ' . now()->format('Y-m-d H:i'),
                'type' => 'practice',
                'duration_minutes' => count($questions) * 2,
                'total_marks' => $questions->sum('points'),
                'pass_marks' => (int) round($questions->sum('points') * 0.5),
                'is_randomized' => true,
                'is_published' => true,
                'created_by' => $userId,
            ]);

            $pivotData = [];
            foreach ($questions as $order => $question) {
                $pivotData[$question->id] = [
                    'marks' => $question->points,
                    'order' => $order + 1,
                ];
            }

            $exam->questions()->sync($pivotData);

            return $exam->load('questions');
        });
    }
}
