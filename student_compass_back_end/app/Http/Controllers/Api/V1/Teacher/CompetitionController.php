<?php

namespace App\Http\Controllers\Api\V1\Teacher;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\Competition;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompetitionController extends Controller
{
    public function index(Request $request)
    {
        $competitions = Competition::with(['subject:id,name', 'creator:id,name'])
            ->withCount(['questions', 'results'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $competitions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject_id' => 'nullable|integer|exists:subjects,id',
            'question_count' => 'required|integer|min:1|max:100',
            'duration_minutes' => 'required|integer|min:1|max:180',
            'points_reward' => 'required|integer|min:10',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'question_ids' => 'nullable|array',
            'question_ids.*' => 'integer|exists:questions,id',
        ]);

        $competition = Competition::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'subject_id' => $request->input('subject_id'),
            'question_count' => (int) $request->input('question_count', 10),
            'duration_minutes' => (int) $request->input('duration_minutes', 15),
            'points_reward' => (int) $request->input('points_reward', 100),
            'start_time' => $request->input('start_time'),
            'end_time' => $request->input('end_time'),
            'is_active' => true,
            'created_by' => $request->user()->id,
        ]);

        $questionIds = $request->input('question_ids', []);

        // إذا لم يتم تمرير أسئلة محددة، سيتم سحب أسئلة عشوائية بناءً على المادة
        if (empty($questionIds)) {
            $query = Question::query();
            if ($competition->subject_id) {
                $query->where('subject_id', $competition->subject_id);
            }
            $questionIds = $query->inRandomOrder()
                ->limit($competition->question_count)
                ->pluck('id')
                ->toArray();
        }

        if (!empty($questionIds)) {
            $pivotData = [];
            foreach ($questionIds as $index => $qId) {
                $pivotData[$qId] = ['order' => $index + 1];
            }
            $competition->questions()->attach($pivotData);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء المسابقة وإرفاق الأسئلة بنجاح.',
            'data' => $competition->load('questions'),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, int $id)
    {
        $competition = Competition::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'subject_id' => 'nullable|integer|exists:subjects,id',
            'duration_minutes' => 'sometimes|required|integer|min:1|max:180',
            'points_reward' => 'sometimes|required|integer|min:10',
            'is_active' => 'sometimes|required|boolean',
        ]);

        $competition->update($request->only([
            'title',
            'description',
            'subject_id',
            'duration_minutes',
            'points_reward',
            'is_active',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات المسابقة بنجاح.',
            'data' => $competition,
        ]);
    }

    public function destroy(int $id)
    {
        $competition = Competition::findOrFail($id);
        $competition->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المسابقة بنجاح.',
        ]);
    }
}
