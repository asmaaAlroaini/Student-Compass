<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\StudyPlan;
use App\Infrastructure\Persistence\Eloquent\Models\StudyTask;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Database\Seeder;

class StudyPlanSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::where('role', 'student')->first();
        if (!$student) return;

        $subject = Subject::where('code', 'PHY301')->first();
        $lesson = Lesson::first();
        $today = now()->format('Y-m-d');

        $plan = StudyPlan::updateOrCreate(
            ['user_id' => $student->id, 'plan_date' => $today],
            [
                'total_tasks' => 4,
                'completed_tasks' => 1,
                'progress_percentage' => 25.00,
            ]
        );

        StudyTask::updateOrCreate(
            ['study_plan_id' => $plan->id, 'task_name' => 'مراجعة الدرس الأول — قانون أوم (فيزياء)'],
            [
                'subject_id' => $subject ? $subject->id : null,
                'lesson_id' => $lesson ? $lesson->id : null,
                'task_type' => 'review_lesson',
                'estimated_minutes' => 25,
                'status' => 'completed',
            ]
        );

        StudyTask::updateOrCreate(
            ['study_plan_id' => $plan->id, 'task_name' => 'مشاهدة الفيديو التعليمي — الفيزياء'],
            [
                'subject_id' => $subject ? $subject->id : null,
                'lesson_id' => $lesson ? $lesson->id : null,
                'task_type' => 'watch_video',
                'estimated_minutes' => 30,
                'status' => 'in_progress',
            ]
        );

        StudyTask::updateOrCreate(
            ['study_plan_id' => $plan->id, 'task_name' => 'حل أسئلة تثبيت الدرس الأول'],
            [
                'subject_id' => $subject ? $subject->id : null,
                'lesson_id' => $lesson ? $lesson->id : null,
                'task_type' => 'solve_questions',
                'estimated_minutes' => 20,
                'status' => 'not_started',
            ]
        );

        StudyTask::updateOrCreate(
            ['study_plan_id' => $plan->id, 'task_name' => 'مراجعة أخطاء الامتحانات السابقة'],
            [
                'subject_id' => $subject ? $subject->id : null,
                'lesson_id' => $lesson ? $lesson->id : null,
                'task_type' => 'review_errors',
                'estimated_minutes' => 15,
                'status' => 'not_started',
            ]
        );
    }
}
