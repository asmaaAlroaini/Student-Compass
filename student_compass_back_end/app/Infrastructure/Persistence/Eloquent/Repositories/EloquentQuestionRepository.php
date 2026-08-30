<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Repositories\QuestionRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentQuestionRepository implements QuestionRepositoryInterface
{
    public function getQuestionsByLesson(int $lessonId, ?string $difficulty = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Question::query()
            ->active()
            ->byLesson($lessonId);

        if ($difficulty) {
            $query->byDifficulty($difficulty);
        }

        return $query->paginate($perPage);
    }

    public function createQuestion(array $data)
    {
        return Question::create($data);
    }

    public function updateQuestion(int $id, array $data)
    {
        $question = Question::findOrFail($id);
        $question->update($data);
        return $question;
    }

    public function findById(int $id)
    {
        return Question::findOrFail($id);
    }
}
