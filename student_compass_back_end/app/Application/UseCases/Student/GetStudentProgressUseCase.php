<?php

namespace App\Application\UseCases\Student;

use App\Domain\Repositories\StudentProgressRepositoryInterface;

class GetStudentProgressUseCase
{
    public function __construct(
        private StudentProgressRepositoryInterface $progressRepository
    ) {}

    public function execute(int $userId)
    {
        $history = $this->progressRepository->getStudentHistory($userId);

        $totalExams = $history->count();
        $passedExams = $history->where('status', 'passed')->count();
        $averagePercentage = $totalExams > 0 ? round($history->avg('percentage'), 2) : 0;

        return [
            'summary' => [
                'total_exams_taken' => $totalExams,
                'passed_exams' => $passedExams,
                'failed_exams' => $totalExams - $passedExams,
                'average_score_percentage' => $averagePercentage,
            ],
            'history' => $history,
        ];
    }
}
