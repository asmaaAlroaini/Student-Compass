<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use Illuminate\Http\JsonResponse;

class EducationalOptionsController extends Controller
{
    /**
     * Get educational options (grade levels and tracks) for registration and filtering.
     */
    public function index(): JsonResponse
    {
        // الخيارات المعيارية للمراحل والمسارات الدراسية في النظام
        $defaultOptions = [
            [
                'id' => 'الثالث الثانوي',
                'name' => 'الثالث الثانوي',
                'tracks' => ['علمي', 'أدبي'],
            ],
            [
                'id' => 'الثاني الثانوي',
                'name' => 'الثاني الثانوي',
                'tracks' => ['علمي', 'أدبي'],
            ],
            [
                'id' => 'الأول الثانوي',
                'name' => 'الأول الثانوي',
                'tracks' => ['عام'],
            ],
        ];

        $tracks = [
            ['id' => 'علمي', 'name' => 'علمي'],
            ['id' => 'أدبي', 'name' => 'أدبي'],
            ['id' => 'عام', 'name' => 'عام'],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'grade_levels' => $defaultOptions,
                'tracks' => $tracks,
            ],
        ]);
    }
}
