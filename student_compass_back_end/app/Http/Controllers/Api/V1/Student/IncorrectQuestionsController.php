<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Application\UseCases\Student\GetIncorrectQuestionsUseCase;
use Illuminate\Http\Request;

class IncorrectQuestionsController extends Controller
{
    public function __construct(
        private GetIncorrectQuestionsUseCase $getIncorrectUseCase
    ) {}

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $result = $this->getIncorrectUseCase->execute($userId);

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}
