<?php

namespace App\Application\UseCases\Student;

use App\Infrastructure\Persistence\Eloquent\Models\StudentProgress;
use App\Infrastructure\Persistence\Eloquent\Models\Question;

class GetIncorrectQuestionsUseCase
{
    public function execute(int $userId)
    {
        // 1. جلب جميع الإجابات الخاطئة من محاولات الطالب الأخيرة
        $progresses = StudentProgress::where('user_id', $userId)
            ->whereNotNull('answers')
            ->latest()
            ->get();

        $incorrectQuestionIds = [];
        $failedDetailsMap = [];

        foreach ($progresses as $progress) {
            if (is_array($progress->answers)) {
                foreach ($progress->answers as $answer) {
                    if (isset($answer['is_correct']) && $answer['is_correct'] === false) {
                        $qId = $answer['question_id'];
                        $incorrectQuestionIds[] = $qId;
                        if (!isset($failedDetailsMap[$qId])) {
                            $failedDetailsMap[$qId] = [
                                'student_answer' => $answer['student_answer'] ?? null,
                                'correct_answer' => $answer['correct_answer'] ?? null,
                                'explanation' => $answer['explanation'] ?? null,
                            ];
                        }
                    }
                }
            }
        }

        $uniqueIds = array_unique($incorrectQuestionIds);

        $questions = Question::whereIn('id', $uniqueIds)
            ->with(['subject:id,name', 'lesson:id,title'])
            ->get();

        $result = $questions->map(function ($q) use ($failedDetailsMap) {
            $qArray = $q->toArray();
            $qArray['last_attempt_details'] = $failedDetailsMap[$q->id] ?? null;
            return $qArray;
        });

        return [
            'total_incorrect' => count($result),
            'questions' => $result,
        ];
    }
}
