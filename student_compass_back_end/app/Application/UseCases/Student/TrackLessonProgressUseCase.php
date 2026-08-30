<?php

namespace App\Application\UseCases\Student;

use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use App\Infrastructure\Persistence\Eloquent\Models\LessonStudentProgress;

class TrackLessonProgressUseCase
{
    /**
     * تحديث وتسجيل مرحلة رحلة التعلم للدرس للطالب
     */
    public function updateProgress(int $userId, int $lessonId, int $stage, bool $markAsCompleted = false): array
    {
        $lesson = Lesson::findOrFail($lessonId);

        $progress = LessonStudentProgress::firstOrCreate(
            ['user_id' => $userId, 'lesson_id' => $lessonId],
            [
                'current_stage' => 1,
                'completed_stages' => [],
                'progress_percentage' => 0,
                'is_completed' => false,
            ]
        );

        $completedStages = $progress->completed_stages ?? [];
        if (!in_array($stage, $completedStages)) {
            $completedStages[] = $stage;
            sort($completedStages);
        }

        // حساب نسبة الإنجاز في رحلة التعلم من 5 مراحل
        $progressPercentage = (int) round((count($completedStages) / 5) * 100);
        $isCompleted = $markAsCompleted || count($completedStages) >= 5 || $stage >= 5;

        $progress->update([
            'current_stage' => min($stage + 1, 5),
            'completed_stages' => $completedStages,
            'progress_percentage' => min($progressPercentage, 100),
            'is_completed' => $isCompleted,
            'last_accessed_at' => now(),
        ]);

        return [
            'lesson_id' => $lessonId,
            'current_stage' => $progress->current_stage,
            'completed_stages' => $progress->completed_stages,
            'progress_percentage' => $progress->progress_percentage,
            'is_completed' => $progress->is_completed,
            'stages_meta' => [
                1 => ['name' => 'فيديو الشرح', 'is_completed' => in_array(1, $completedStages)],
                2 => ['name' => 'الملخص والـ PDF', 'is_completed' => in_array(2, $completedStages)],
                3 => ['name' => 'أسئلة التثبيت', 'is_completed' => in_array(3, $completedStages)],
                4 => ['name' => 'الاختبار القصير', 'is_completed' => in_array(4, $completedStages)],
                5 => ['name' => 'تحليل النتيجة والأخطاء', 'is_completed' => in_array(5, $completedStages)],
            ],
        ];
    }

    /**
     * جلب حالة رحلة التعلم الحالية للطالب في الدرس
     */
    public function getProgress(int $userId, int $lessonId): array
    {
        $progress = LessonStudentProgress::where('user_id', $userId)
            ->where('lesson_id', $lessonId)
            ->first();

        $completedStages = $progress?->completed_stages ?? [];

        return [
            'current_stage' => $progress?->current_stage ?? 1,
            'completed_stages' => $completedStages,
            'progress_percentage' => $progress?->progress_percentage ?? 0,
            'is_completed' => $progress?->is_completed ?? false,
            'last_accessed_at' => $progress?->last_accessed_at,
            'stages_meta' => [
                1 => ['id' => 1, 'name' => 'فيديو الشرح', 'type' => 'video', 'is_completed' => in_array(1, $completedStages)],
                2 => ['id' => 2, 'name' => 'ملخص الدرس', 'type' => 'summary_pdf', 'is_completed' => in_array(2, $completedStages)],
                3 => ['id' => 3, 'name' => 'أسئلة التثبيت', 'type' => 'practice_questions', 'is_completed' => in_array(3, $completedStages)],
                4 => ['id' => 4, 'name' => 'اختبار الدرس', 'type' => 'short_quiz', 'is_completed' => in_array(4, $completedStages)],
                5 => ['id' => 5, 'name' => 'تحليل النتيجة', 'type' => 'result_analysis', 'is_completed' => in_array(5, $completedStages)],
            ],
        ];
    }
}
