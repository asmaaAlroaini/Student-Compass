<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Application\UseCases\Student\ManageStudyPlanUseCase;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use App\Infrastructure\Persistence\Eloquent\Models\StudyPlan;
use App\Infrastructure\Persistence\Eloquent\Models\StudyTask;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudyPlanController extends Controller
{
    public function __construct(
        private ManageStudyPlanUseCase $managePlanUseCase
    ) {}

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $plan = $this->managePlanUseCase->getTodayPlan($userId);

        return response()->json([
            'success' => true,
            'data' => $plan,
        ]);
    }

    /**
     * التهيئة الأولى Onboarding للطالب وإعداد خطة الدراسة
     */
    public function onboarding(Request $request)
    {
        if ($request->has('subject_ids')) {
            $rawSubjectIds = $request->input('subject_ids');
            if (is_string($rawSubjectIds)) {
                $decoded = json_decode($rawSubjectIds, true);
                if (is_array($decoded)) {
                    $request->merge(['subject_ids' => array_map('intval', $decoded)]);
                } else {
                    $request->merge(['subject_ids' => array_map('intval', explode(',', $rawSubjectIds))]);
                }
            } elseif (is_array($rawSubjectIds)) {
                $request->merge(['subject_ids' => array_map('intval', $rawSubjectIds)]);
            }
        }

        $request->validate([
            'subject_ids' => 'required|array|min:1',
            'subject_ids.*' => 'integer|exists:subjects,id',
            'days_until_exam' => 'nullable|integer|min:1',
            'daily_study_hours' => 'nullable|integer|min:1|max:16',
        ]);

        $userId = $request->user()->id;
        $subjectIds = $request->input('subject_ids');

        // جلب الدروس للمواد المختارة لبناء الخطة الدراسية
        $lessons = Lesson::whereIn('subject_id', $subjectIds)
            ->orWhereHas('unit', function ($q) use ($subjectIds) {
                $q->whereIn('subject_id', $subjectIds);
            })
            ->take(12)
            ->get();

        if ($lessons->isEmpty()) {
            $lessons = Lesson::take(10)->get();
        }

        $today = now()->format('Y-m-d');
        $plan = StudyPlan::firstOrCreate(
            ['user_id' => $userId, 'plan_date' => $today],
            ['total_tasks' => 0, 'completed_tasks' => 0, 'progress_percentage' => 0.00]
        );

        foreach ($lessons as $index => $lesson) {
            StudyTask::firstOrCreate([
                'study_plan_id' => $plan->id,
                'subject_id' => $lesson->subject_id,
                'lesson_id' => $lesson->id,
                'task_name' => 'دراسة ومراجعة: ' . $lesson->title,
            ], [
                'estimated_minutes' => 45,
                'status' => 'not_started',
            ]);
        }

        $allTasks = $plan->tasks()->get();
        $plan->total_tasks = $allTasks->count();
        $plan->save();

        return response()->json([
            'success' => true,
            'message' => 'تم تهيئة الخطة الدراسية بنجاح!',
            'data' => $plan->load('tasks.subject', 'tasks.lesson'),
        ], Response::HTTP_CREATED);
    }

    /**
     * تحديث وإعادة ترتيب الخطة الدراسية ديناميكياً عند تفويت مهام
     */
    public function recalculate(Request $request)
    {
        $userId = $request->user()->id;
        $today = now()->format('Y-m-d');

        // جلب خطط وأقسام الأيام السابقة غير المكتملة
        $overduePlans = StudyPlan::where('user_id', $userId)
            ->where('plan_date', '<', $today)
            ->with(['tasks' => function ($q) {
                $q->where('status', '!=', 'completed');
            }])
            ->get();

        $todayPlan = $this->managePlanUseCase->getTodayPlan($userId);
        $transferredCount = 0;

        foreach ($overduePlans as $oldPlan) {
            foreach ($oldPlan->tasks as $task) {
                $task->study_plan_id = $todayPlan->id;
                $task->save();
                $transferredCount++;
            }
        }

        $todayPlan->refresh();
        $allTasks = $todayPlan->tasks;
        $todayPlan->total_tasks = $allTasks->count();
        $completed = $allTasks->where('status', 'completed')->count();
        $todayPlan->completed_tasks = $completed;
        $todayPlan->progress_percentage = $todayPlan->total_tasks > 0 ? round(($completed / $todayPlan->total_tasks) * 100, 2) : 0;
        $todayPlan->save();

        return response()->json([
            'success' => true,
            'message' => "تم تحديث الخطة وترتيب $transferredCount مهمة مفوتة بنجاح.",
            'data' => $todayPlan->load('tasks.subject', 'tasks.lesson'),
        ]);
    }

    public function updateTaskStatus(Request $request, int $taskId)
    {
        $request->validate([
            'status' => 'required|in:not_started,in_progress,completed',
        ]);

        $userId = $request->user()->id;
        $result = $this->managePlanUseCase->updateTaskStatus($userId, $taskId, $request->input('status'));

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة المهمة بنجاح.',
            'data' => $result,
        ]);
    }
}
