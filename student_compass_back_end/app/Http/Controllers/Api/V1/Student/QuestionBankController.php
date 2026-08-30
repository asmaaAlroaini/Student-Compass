<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Application\UseCases\Student\GetQuestionsByLessonUseCase;
use Illuminate\Http\Request;

class QuestionBankController extends Controller
{
    public function __construct(
        private GetQuestionsByLessonUseCase $getQuestionsUseCase
    ) {}

    public function getByLesson(Request $request, int $lessonId)
    {
        $difficulty = $request->query('difficulty');
        $perPage = (int) $request->query('per_page', 15);

        $questions = $this->getQuestionsUseCase->execute($lessonId, $difficulty, $perPage);

        return response()->json([
            'success' => true,
            'lesson_id' => $lessonId,
            'difficulty_filter' => $difficulty,
            'data' => $questions,
        ]);
    }
}
