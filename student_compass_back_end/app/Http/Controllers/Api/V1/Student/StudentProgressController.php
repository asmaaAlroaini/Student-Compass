<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Application\UseCases\Student\GetStudentProgressUseCase;
use Illuminate\Http\Request;

class StudentProgressController extends Controller
{
    public function __construct(
        private GetStudentProgressUseCase $getStudentProgressUseCase
    ) {}

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $progress = $this->getStudentProgressUseCase->execute($userId);

        return response()->json([
            'success' => true,
            'data' => $progress,
        ]);
    }
}
