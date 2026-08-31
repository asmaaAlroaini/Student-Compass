<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Application\UseCases\Student\TrackLessonProgressUseCase;
use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\Unit;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SubjectController extends Controller
{
    private TrackLessonProgressUseCase $trackLessonProgressUseCase;

    public function __construct(
        ?TrackLessonProgressUseCase $trackLessonProgressUseCase = null
    ) {
        $this->trackLessonProgressUseCase = $trackLessonProgressUseCase ?? new TrackLessonProgressUseCase();
    }

    /**
     * قائمة المواد بحسب الصف الدراسي والمسار للطالب المسجل
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $gradeLevel = $request->query('grade_level', $user?->grade_level ?? 'الثالث الثانوي');
        $track = $request->query('track', $user?->track);

        $query = Subject::query()->active();

        if ($gradeLevel && $gradeLevel !== 'all') {
            $query->forGrade($gradeLevel, $track);
        }

        $subjects = $query
            ->withCount(['units', 'lessons', 'questions'])
            ->get();

        return response()->json([
            'success' => true,
            'grade_level' => $gradeLevel,
            'track' => $track,
            'data' => $subjects,
        ]);
    }

    /**
     * جلب وحدات مادة معينة مع عدد الدروس
     */
    public function units(Request $request, $subjectId)
    {
        $subject = Subject::findOrFail($subjectId);

        $units = Unit::query()
            ->where('subject_id', $subject->id)
            ->withCount('lessons')
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $units,
        ]);
    }

    /**
     * جلب دروس وحدة معينة مع حالة رحلة التعلم لكل درس
     */
    public function lessons(Request $request, $subjectId, $unitId)
    {
        $userId = $request->user()->id;
        $unit = Unit::where('subject_id', $subjectId)->findOrFail($unitId);

        $lessons = Lesson::query()
            ->where('unit_id', $unit->id)
            ->withCount('questions')
            ->with(['studentJourneyProgress' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }])
            ->orderBy('order', 'asc')
            ->get()
            ->map(function ($lesson) {
                $progress = $lesson->studentJourneyProgress->first();
                $arr = $lesson->toArray();
                $arr['current_stage'] = $progress ? $progress->current_stage : 1;
                $arr['progress_percentage'] = $progress ? $progress->progress_percentage : 0;
                $arr['is_completed'] = $progress ? (bool) $progress->is_completed : false;
                unset($arr['student_journey_progress']);
                return $arr;
            });

        return response()->json([
            'success' => true,
            'data' => $lessons,
        ]);
    }

    /**
     * جلب تفاصيل درس محدد ومحتوى الـ 5 مراحل ورحلة التعلم
     */
    public function lessonDetails(Request $request, $lessonId)
    {
        $userId = $request->user()->id;

        $lesson = Lesson::query()
            ->with(['unit.subject'])
            ->withCount('questions')
            ->findOrFail($lessonId);

        // جلب الاختبار القصير المخصص لهذا الدرس إن وجد
        $lessonExam = Exam::where('lesson_id', $lessonId)
            ->published()
            ->select(['id', 'title', 'duration_minutes', 'total_marks'])
            ->first();

        $journeyProgress = $this->trackLessonProgressUseCase->getProgress($userId, $lesson->id);

        return response()->json([
            'success' => true,
            'data' => [
                'lesson' => $lesson,
                'short_exam' => $lessonExam,
                'learning_journey' => $journeyProgress,
            ],
        ]);
    }

    /**
     * تحديث مرحلة رحلة التعلم للدرس
     */
    public function updateLessonProgress(Request $request, $lessonId)
    {
        $request->validate([
            'stage' => 'required|integer|min:1|max:5',
            'is_completed' => 'nullable|boolean',
        ]);

        $userId = $request->user()->id;
        $result = $this->trackLessonProgressUseCase->updateProgress(
            $userId,
            (int) $lessonId,
            (int) $request->input('stage'),
            (bool) $request->input('is_completed', false)
        );

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث مرحلة رحلة التعلم للدرس بنجاح.',
            'data' => $result,
        ]);
    }
}
