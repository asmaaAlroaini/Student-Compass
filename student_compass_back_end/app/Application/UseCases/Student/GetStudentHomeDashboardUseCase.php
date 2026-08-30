<?php

namespace App\Application\UseCases\Student;

use App\Infrastructure\Persistence\Eloquent\Models\Competition;
use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use App\Infrastructure\Persistence\Eloquent\Models\LessonStudentProgress;
use App\Infrastructure\Persistence\Eloquent\Models\StudentProgress;
use App\Infrastructure\Persistence\Eloquent\Models\StudyPlan;
use App\Infrastructure\Persistence\Eloquent\Models\User;

class GetStudentHomeDashboardUseCase
{
    public function execute(int $userId): array
    {
        $user = User::find($userId);
        $today = now()->format('Y-m-d');
        $hour = (int) now()->format('H');

        // 1. الترحيب المخصص بحسب الوقت واسم الطالب
        $greetingPrefix = ($hour >= 5 && $hour < 12) ? 'صباح الخير' : (($hour >= 12 && $hour < 17) ? 'طاب يومك' : 'مساء الخير');
        $greeting = "{$greetingPrefix} يا {$user->name} 👋";

        // 2. خطة اليوم والمهام المجدولة
        $todayPlan = StudyPlan::where('user_id', $userId)
            ->where('plan_date', $today)
            ->with(['tasks.subject:id,name,icon', 'tasks.lesson:id,title'])
            ->first();

        // فحص المهام المفوتة من الأيام السابقة
        $missedTasksCount = StudyPlan::where('user_id', $userId)
            ->where('plan_date', '<', $today)
            ->whereHas('tasks', function ($q) {
                $q->where('status', '!=', 'completed');
            })
            ->withCount(['tasks' => function ($q) {
                $q->where('status', '!=', 'completed');
            }])
            ->get()
            ->sum('tasks_count');

        // 3. الاختبارات القادمة والمتاحة مع متطلبات التحضير والعد التنازلي
        $gradeLevel = $user->grade_level ?? 'الثالث الثانوي';
        $track = $user->track;

        $upcomingExams = Exam::query()
            ->published()
            ->whereHas('subject', function ($q) use ($gradeLevel, $track) {
                $q->where('grade_level', $gradeLevel);
                if ($track) {
                    $q->where(function ($sub) use ($track) {
                        $sub->where('track', $track)->orWhereNull('track');
                    });
                }
            })
            ->with(['subject:id,name,icon', 'unit:id,title', 'lesson:id,title'])
            ->withCount('questions')
            ->orderBy('id', 'desc')
            ->take(4)
            ->get()
            ->map(function ($exam) use ($userId) {
                $hasTaken = StudentProgress::where('user_id', $userId)
                    ->where('exam_id', $exam->id)
                    ->exists();

                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'type' => $exam->type,
                    'subject' => $exam->subject,
                    'unit' => $exam->unit,
                    'lesson' => $exam->lesson,
                    'duration_minutes' => $exam->duration_minutes,
                    'questions_count' => $exam->questions_count,
                    'has_taken' => $hasTaken,
                    'required_preparation' => $exam->lesson ? "مراجعة درس {$exam->lesson->title}" : "مراجعة الوحدة كاملة",
                ];
            });

        // 4. المسابقات التفاعلية النشطة
        $activeCompetitions = Competition::active()
            ->with(['subject:id,name,icon', 'results' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }])
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($comp) {
                $userResult = $comp->results->first();
                return [
                    'id' => $comp->id,
                    'title' => $comp->title,
                    'subject' => $comp->subject,
                    'points_reward' => $comp->points_reward,
                    'duration_minutes' => $comp->duration_minutes,
                    'is_completed' => $userResult !== null,
                    'start_time' => $comp->start_time,
                    'end_time' => $comp->end_time,
                ];
            });

        // 5. المؤشرات التراكمية السريعة
        $examProgress = StudentProgress::where('user_id', $userId)->get();
        $totalExamsTaken = $examProgress->count();
        $averageScorePercentage = $totalExamsTaken > 0 ? round($examProgress->avg('percentage'), 1) : 0;
        $completedLessonsCount = LessonStudentProgress::where('user_id', $userId)->where('is_completed', true)->count();

        return [
            'greeting' => $greeting,
            'student_info' => [
                'name' => $user->name,
                'avatar' => $user->avatar,
                'grade_level' => $user->grade_level,
                'track' => $user->track,
            ],
            'today_plan' => $todayPlan ? [
                'id' => $todayPlan->id,
                'plan_date' => $todayPlan->plan_date,
                'total_tasks' => $todayPlan->total_tasks,
                'completed_tasks' => $todayPlan->completed_tasks,
                'progress_percentage' => (float) $todayPlan->progress_percentage,
                'tasks' => $todayPlan->tasks,
            ] : null,
            'missed_tasks_alert' => [
                'has_missed' => $missedTasksCount > 0,
                'missed_count' => $missedTasksCount,
                'message' => $missedTasksCount > 0 ? "لديك {$missedTasksCount} مهام مفوتة من الأيام السابقة. هل ترغب في إعادة ترتيب خطتك؟" : null,
            ],
            'upcoming_exams' => $upcomingExams,
            'active_competitions' => $activeCompetitions,
            'progress_summary' => [
                'total_exams_taken' => $totalExamsTaken,
                'average_score_percentage' => $averageScorePercentage,
                'completed_lessons_count' => $completedLessonsCount,
            ],
        ];
    }
}
