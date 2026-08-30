<?php

namespace App\Domain\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface QuestionRepositoryInterface
{
    public function getQuestionsByLesson(int $lessonId, ?string $difficulty = null, int $perPage = 15): LengthAwarePaginator;
    
    public function createQuestion(array $data);

    public function updateQuestion(int $id, array $data);

    public function findById(int $id);
}
