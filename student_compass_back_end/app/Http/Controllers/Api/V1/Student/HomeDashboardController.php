<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Application\UseCases\Student\GetStudentHomeDashboardUseCase;
use Illuminate\Http\Request;

class HomeDashboardController extends Controller
{
    public function __construct(
        private GetStudentHomeDashboardUseCase $getStudentHomeDashboardUseCase
    ) {}

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $dashboardData = $this->getStudentHomeDashboardUseCase->execute($userId);

        return response()->json([
            'success' => true,
            'data' => $dashboardData,
        ]);
    }
}
