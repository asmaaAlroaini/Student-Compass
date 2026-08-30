<?php

namespace App\Domain\Repositories;

interface ExamRepositoryInterface
{
    public function findWithQuestions(int $examId);

    public function createExam(array $data, array $questionsWithMarks);
}
