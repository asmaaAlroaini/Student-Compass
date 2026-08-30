<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Application\UseCases\Student\GenerateCustomExamUseCase;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomExamController extends Controller
{
    public function __construct(
        private GenerateCustomExamUseCase $generateCustomExamUseCase
    ) {}

    public function generate(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|integer|exists:subjects,id',
            'lesson_ids' => 'nullable|array',
            'lesson_ids.*' => 'integer|exists:lessons,id',
            'difficulty' => 'nullable|string|in:easy,medium,hard',
            'question_count' => 'required|integer|min:3|max:50',
            'year' => 'nullable|integer',
        ]);

        $userId = $request->user()->id;

        try {
            $exam = $this->generateCustomExamUseCase->execute(
                $userId,
                (int) $request->input('subject_id'),
                $request->input('lesson_ids'),
                $request->input('difficulty'),
                (int) $request->input('question_count', 10),
                $request->input('year') ? (int) $request->input('year') : null
            );

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء وتنسيق الامتحان المخصص بنجاح.',
                'data' => $exam,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
