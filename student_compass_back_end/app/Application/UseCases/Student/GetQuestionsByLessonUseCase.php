<?php

namespace App\Application\UseCases\Student;

use App\Domain\Repositories\QuestionRepositoryInterface;

class GetQuestionsByLessonUseCase
{
    public function __construct(
        private QuestionRepositoryInterface $questionRepository
    ) {}

    public function execute(int $lessonId, ?string $difficulty = null, int $perPage = 15)
    {
        return $this->questionRepository->getQuestionsByLesson($lessonId, $difficulty, $perPage);
    }
}
