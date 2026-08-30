<?php

namespace App\Application\UseCases\Student;

use App\Domain\Repositories\ExamRepositoryInterface;
use App\Domain\Repositories\StudentProgressRepositoryInterface;

class SubmitExamAnswersUseCase
{
    public function __construct(
        private ExamRepositoryInterface $examRepository,
        private StudentProgressRepositoryInterface $progressRepository
    ) {}

    public function execute(int $userId, int $examId, array $submittedAnswers, int $timeSpentSeconds)
    {
        $exam = $this->examRepository->findWithQuestions($examId);
        
        $totalPossibleScore = 0;
        $score = 0;
        $processedAnswers = [];

        foreach ($exam->questions as $question) {
            $questionMarks = $question->pivot->marks ?? $question->points;
            $totalPossibleScore += $questionMarks;

            // اختيار إجابة الطالب لهذا السؤال
            $studentAnswerItem = collect($submittedAnswers)->firstWhere('question_id', $question->id);
            $studentAnswer = $studentAnswerItem['student_answer'] ?? null;

            $isCorrect = ($studentAnswer !== null && trim(mb_strtolower($studentAnswer)) === trim(mb_strtolower($question->correct_answer)));

            if ($isCorrect) {
                $score += $questionMarks;
            }

            $processedAnswers[] = [
                'question_id' => $question->id,
                'question_text' => $question->question_text,
                'student_answer' => $studentAnswer,
                'correct_answer' => $question->correct_answer,
                'is_correct' => $isCorrect,
                'marks_awarded' => $isCorrect ? $questionMarks : 0,
                'explanation' => $question->explanation,
            ];
        }

        $percentage = $totalPossibleScore > 0 ? round(($score / $totalPossibleScore) * 100, 2) : 0;
        $status = ($score >= $exam->pass_marks) ? 'passed' : 'failed';

        // تسجيل المحاولة بداخل مستودع تقدم الطالب
        $progress = $this->progressRepository->recordProgress([
            'user_id' => $userId,
            'exam_id' => $exam->id,
            'lesson_id' => $exam->lesson_id,
            'score' => $score,
            'total_possible_score' => $totalPossibleScore,
            'percentage' => $percentage,
            'time_spent_seconds' => $timeSpentSeconds,
            'answers' => $processedAnswers,
            'status' => $status,
            'completed_at' => now(),
        ]);

        return [
            'progress' => $progress,
            'exam_title' => $exam->title,
            'score' => $score,
            'total_possible_score' => $totalPossibleScore,
            'percentage' => $percentage,
            'status' => $status,
            'details' => $processedAnswers,
        ];
    }
}
