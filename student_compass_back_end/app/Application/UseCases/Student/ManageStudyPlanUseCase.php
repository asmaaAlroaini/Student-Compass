<?php

namespace App\Application\UseCases\Student;

use App\Infrastructure\Persistence\Eloquent\Models\StudyPlan;
use App\Infrastructure\Persistence\Eloquent\Models\StudyTask;

class ManageStudyPlanUseCase
{
    public function getTodayPlan(int $userId)
    {
        $today = now()->format('Y-m-d');

        $plan = StudyPlan::with(['tasks.subject:id,name', 'tasks.lesson:id,title'])
            ->firstOrCreate(
                ['user_id' => $userId, 'plan_date' => $today],
                ['total_tasks' => 0, 'completed_tasks' => 0, 'progress_percentage' => 0.00]
            );

        return $plan;
    }

    public function updateTaskStatus(int $userId, int $taskId, string $status)
    {
        $task = StudyTask::whereHas('plan', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->findOrFail($taskId);

        $task->status = $status;
        $task->save();

        // إعادة حساب نسبة إنجاز خطة اليوم
        $plan = $task->plan;
        $allTasks = $plan->tasks;
        $total = $allTasks->count();
        $completed = $allTasks->where('status', 'completed')->count();
        
        $plan->total_tasks = $total;
        $plan->completed_tasks = $completed;
        $plan->progress_percentage = $total > 0 ? round(($completed / $total) * 100, 2) : 0;
        $plan->save();

        return [
            'task' => $task,
            'plan_summary' => $plan,
        ];
    }
}
