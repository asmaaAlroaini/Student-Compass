<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Repositories\ExamRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use Illuminate\Support\Facades\DB;

class EloquentExamRepository implements ExamRepositoryInterface
{
    public function findWithQuestions(int $examId)
    {
        return Exam::query()
            ->published()
            ->with(['questions' => function ($q) {
                $q->where('is_active', true);
            }])
            ->findOrFail($examId);
    }

    public function createExam(array $data, array $questionsWithMarks)
    {
        return DB::transaction(function () use ($data, $questionsWithMarks) {
            $exam = Exam::create($data);

            $pivotData = [];
            foreach ($questionsWithMarks as $order => $item) {
                $pivotData[$item['question_id']] = [
                    'marks' => $item['marks'] ?? 1,
                    'order' => $order + 1,
                ];
            }

            $exam->questions()->sync($pivotData);
            return $exam->load('questions');
        });
    }
}
