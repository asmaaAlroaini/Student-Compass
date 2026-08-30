<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\GradeLevel;
use Illuminate\Http\JsonResponse;

class EducationalOptionsController extends Controller
{
    /**
     * Get educational options (grade levels and tracks) for registration, filtering and dropdowns.
     */
    public function index(): JsonResponse
    {
        $gradeLevels = GradeLevel::query()
            ->active()
            ->ordered()
            ->get();

        // في حال لم تكن قاعدة البيانات تحتوي على صفوف، نضمن إرجاع قيم افتراضية متوافقة
        if ($gradeLevels->isEmpty()) {
            $defaultGradeLevels = [
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
                    'grade_levels' => $defaultGradeLevels,
                    'tracks' => $tracks,
                ],
            ]);
        }

        $allTracks = [];
        $formattedGrades = $gradeLevels->map(function ($g) use (&$allTracks) {
            $tracksList = is_array($g->tracks) ? $g->tracks : (json_decode($g->tracks, true) ?: ['عام']);
            foreach ($tracksList as $t) {
                if (!in_array($t, $allTracks)) {
                    $allTracks[] = $t;
                }
            }
            return [
                'id' => $g->name,
                'name' => $g->name,
                'code' => $g->code,
                'tracks' => $tracksList,
            ];
        });

        $formattedTracks = array_map(function ($trackName) {
            return [
                'id' => $trackName,
                'name' => $trackName,
            ];
        }, $allTracks);

        return response()->json([
            'success' => true,
            'data' => [
                'grade_levels' => $formattedGrades,
                'tracks' => $formattedTracks,
            ],
        ]);
    }
}
