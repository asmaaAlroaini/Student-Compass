<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Application\UseCases\Student\SubmitCompetitionAnswersUseCase;
use App\Infrastructure\Persistence\Eloquent\Models\Competition;
use App\Infrastructure\Persistence\Eloquent\Models\CompetitionResult;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CompetitionController extends Controller
{
    public function __construct(
        private SubmitCompetitionAnswersUseCase $submitCompetitionAnswersUseCase
    ) {}

    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $competitions = Competition::active()
            ->with(['subject:id,name,icon', 'results' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($comp) {
                $userResult = $comp->results->first();
                return [
                    'id' => $comp->id,
                    'title' => $comp->title,
                    'description' => $comp->description,
                    'subject' => $comp->subject,
                    'question_count' => $comp->question_count,
                    'duration_minutes' => $comp->duration_minutes,
                    'points_reward' => $comp->points_reward,
                    'start_time' => $comp->start_time,
                    'end_time' => $comp->end_time,
                    'is_completed' => $userResult !== null,
                    'user_result' => $userResult ? [
                        'score_percentage' => $userResult->score_percentage,
                        'points_earned' => $userResult->points_earned,
                        'completed_at' => $userResult->completed_at,
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $competitions,
        ]);
    }

    public function show(Request $request, int $id)
    {
        $userId = $request->user()->id;

        $competition = Competition::active()
            ->with(['subject:id,name', 'questions'])
            ->findOrFail($id);

        $existingResult = CompetitionResult::where('competition_id', $id)
            ->where('user_id', $userId)
            ->first();

        $questions = $competition->questions->map(function ($q) {
            return [
                'id' => $q->id,
                'question_text' => $q->question_text,
                'option_a' => $q->option_a,
                'option_b' => $q->option_b,
                'option_c' => $q->option_c,
                'option_d' => $q->option_d,
                'image_url' => $q->image_url,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $competition->id,
                'title' => $competition->title,
                'description' => $competition->description,
                'subject' => $competition->subject,
                'duration_minutes' => $competition->duration_minutes,
                'points_reward' => $competition->points_reward,
                'is_completed' => $existingResult !== null,
                'user_result' => $existingResult,
                'questions' => $questions,
            ]
        ]);
    }

    public function submit(Request $request, int $id)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|integer|exists:questions,id',
            'answers.*.student_answer' => 'nullable|string',
            'time_spent_seconds' => 'required|integer|min:0',
        ]);

        $userId = $request->user()->id;

        try {
            $result = $this->submitCompetitionAnswersUseCase->execute(
                $userId,
                $id,
                $request->input('answers'),
                (int) $request->input('time_spent_seconds')
            );

            return response()->json([
                'success' => true,
                'message' => 'تم تسليم المسابقة واحتساب النقاط بنجاح!',
                'data' => $result,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    public function leaderboard(Request $request, ?int $competitionId = null)
    {
        $userId = $request->user()->id;

        if ($competitionId) {
            // متصدرو مسابقة محددة
            $topParticipants = CompetitionResult::where('competition_id', $competitionId)
                ->with('student:id,name,avatar')
                ->orderBy('score_percentage', 'desc')
                ->orderBy('time_spent_seconds', 'asc')
                ->take(10)
                ->get()
                ->values()
                ->map(function ($item, $index) {
                    return [
                        'rank' => $index + 1,
                        'student_name' => $item->student ? $item->student->name : 'طالب',
                        'avatar' => $item->student ? $item->student->avatar : null,
                        'score_percentage' => $item->score_percentage,
                        'points_earned' => $item->points_earned,
                        'time_spent_seconds' => $item->time_spent_seconds,
                    ];
                });

            $userResult = CompetitionResult::where('competition_id', $competitionId)
                ->where('user_id', $userId)
                ->first();

            $userRank = null;
            if ($userResult) {
                $userRank = CompetitionResult::where('competition_id', $competitionId)
                    ->where(function ($q) use ($userResult) {
                        $q->where('score_percentage', '>', $userResult->score_percentage)
                          ->orWhere(function ($q2) use ($userResult) {
                              $q2->where('score_percentage', '=', $userResult->score_percentage)
                                 ->where('time_spent_seconds', '<', $userResult->time_spent_seconds);
                          });
                    })->count() + 1;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'top_students' => $topParticipants,
                    'user_standing' => $userResult ? [
                        'rank' => $userRank,
                        'score_percentage' => $userResult->score_percentage,
                        'points_earned' => $userResult->points_earned,
                    ] : null,
                ]
            ]);
        }

        // لوحة المتصدرين العامة بناءً على إجمالي النقاط المكتسبة من المسابقات
        $globalLeaderboard = DB::table('competition_results')
            ->join('users', 'competition_results.user_id', '=', 'users.id')
            ->select('users.id', 'users.name', 'users.avatar', DB::raw('SUM(points_earned) as total_points'), DB::raw('COUNT(competition_results.id) as competitions_count'))
            ->groupBy('users.id', 'users.name', 'users.avatar')
            ->orderBy('total_points', 'desc')
            ->take(10)
            ->get()
            ->values()
            ->map(function ($item, $index) {
                return [
                    'rank' => $index + 1,
                    'student_name' => $item->name,
                    'avatar' => $item->avatar,
                    'total_points' => (int) $item->total_points,
                    'competitions_count' => (int) $item->competitions_count,
                ];
            });

        // ترتيب الطالب الحالي
        $currentUserPoints = CompetitionResult::where('user_id', $userId)->sum('points_earned');
        $currentUserRank = DB::table('competition_results')
            ->select('user_id', DB::raw('SUM(points_earned) as total_points'))
            ->groupBy('user_id')
            ->having('total_points', '>', $currentUserPoints)
            ->get()
            ->count() + 1;

        return response()->json([
            'success' => true,
            'data' => [
                'top_students' => $globalLeaderboard,
                'user_standing' => [
                    'rank' => $currentUserRank,
                    'total_points' => (int) $currentUserPoints,
                ]
            ]
        ]);
    }
}
