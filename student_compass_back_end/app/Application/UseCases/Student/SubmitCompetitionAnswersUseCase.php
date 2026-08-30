<?php

namespace App\Application\UseCases\Student;

use App\Infrastructure\Persistence\Eloquent\Models\Competition;
use App\Infrastructure\Persistence\Eloquent\Models\CompetitionResult;

class SubmitCompetitionAnswersUseCase
{
    public function execute(int $userId, int $competitionId, array $submittedAnswers, int $timeSpentSeconds)
    {
        $competition = Competition::with('questions')->findOrFail($competitionId);

        $existingResult = CompetitionResult::where('competition_id', $competitionId)
            ->where('user_id', $userId)
            ->first();

        if ($existingResult) {
            throw new \Exception('لقد قمت بالمشاركة في هذه المسابقة مسبقاً.');
        }

        $totalQuestions = $competition->questions->count();
        $correctCount = 0;
        $processedAnswers = [];

        foreach ($competition->questions as $question) {
            $studentAnswerItem = collect($submittedAnswers)->firstWhere('question_id', $question->id);
            $studentAnswer = $studentAnswerItem['student_answer'] ?? null;

            $isCorrect = ($studentAnswer !== null && trim(mb_strtolower($studentAnswer)) === trim(mb_strtolower($question->correct_answer)));

            if ($isCorrect) {
                $correctCount++;
            }

            $processedAnswers[] = [
                'question_id' => $question->id,
                'question_text' => $question->question_text,
                'student_answer' => $studentAnswer,
                'correct_answer' => $question->correct_answer,
                'is_correct' => $isCorrect,
                'explanation' => $question->explanation,
            ];
        }

        $scorePercentage = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 2) : 0;
        
        // حساب النقاط المكتسبة (النقاط الأساسية حسب نسبة النجاح)
        $basePoints = round(($competition->points_reward * ($scorePercentage / 100)));
        
        // بونص السرعة إذا كانت النتيجة ممتازة وتم الحل في وقت وجيز
        $timeLimitSeconds = $competition->duration_minutes * 60;
        $speedBonus = 0;
        if ($scorePercentage >= 70 && $timeSpentSeconds < $timeLimitSeconds) {
            $savedRatio = ($timeLimitSeconds - $timeSpentSeconds) / $timeLimitSeconds;
            $speedBonus = round($basePoints * 0.20 * $savedRatio);
        }

        $pointsEarned = (int) ($basePoints + $speedBonus);

        $result = CompetitionResult::create([
            'competition_id' => $competitionId,
            'user_id' => $userId,
            'score_percentage' => $scorePercentage,
            'correct_answers' => $correctCount,
            'total_questions' => $totalQuestions,
            'time_spent_seconds' => $timeSpentSeconds,
            'points_earned' => $pointsEarned,
            'completed_at' => now(),
        ]);

        // حساب ترتيب الطالب في هذه المسابقة
        $rank = CompetitionResult::where('competition_id', $competitionId)
            ->where(function ($q) use ($scorePercentage, $timeSpentSeconds) {
                $q->where('score_percentage', '>', $scorePercentage)
                  ->orWhere(function ($q2) use ($scorePercentage, $timeSpentSeconds) {
                      $q2->where('score_percentage', '=', $scorePercentage)
                         ->where('time_spent_seconds', '<', $timeSpentSeconds);
                  });
            })->count() + 1;

        return [
            'result' => $result,
            'competition_title' => $competition->title,
            'score_percentage' => $scorePercentage,
            'correct_answers' => $correctCount,
            'total_questions' => $totalQuestions,
            'points_earned' => $pointsEarned,
            'rank' => $rank,
            'details' => $processedAnswers,
        ];
    }
}
