<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Student\SubmitExamRequest;
use App\Application\UseCases\Student\SubmitExamAnswersUseCase;
use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use App\Infrastructure\Persistence\Eloquent\Models\StudentProgress;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function __construct(
        private SubmitExamAnswersUseCase $submitExamUseCase
    ) {}

    /**
     * قائمة الامتحانات المتاحة للطالب مع فحص حالة الأداء السابقة
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $subjectId = $request->query('subject_id');
        $type = $request->query('type'); // official, custom, unit, etc.

        $query = Exam::query()
            ->published()
            ->with(['subject:id,name,code,icon,grade_level,track', 'unit:id,title,unit_number', 'lesson:id,title'])
            ->withCount('questions');

        // فلترة بحسب المادة إذا تم تحديدها
        if ($subjectId) {
            $query->where('subject_id', $subjectId);
        } else {
            // فلترة بحسب صف ومسار الطالب
            $gradeLevel = $user->grade_level ?? 'الثالث الثانوي';
            $track = $user->track;

            $query->whereHas('subject', function ($q) use ($gradeLevel, $track) {
                $q->where('grade_level', $gradeLevel);
                if ($track) {
                    $q->where(function ($sub) use ($track) {
                        $sub->where('track', $track)->orWhereNull('track');
                    });
                }
            });
        }

        if ($type) {
            $query->where('type', $type);
        }

        $exams = $query->orderBy('id', 'desc')->get();

        // فحص هل الطالب قام بأداء أي من هذه الامتحانات سابقاً
        $userProgresses = StudentProgress::query()
            ->where('user_id', $user->id)
            ->whereIn('exam_id', $exams->pluck('id'))
            ->get()
            ->keyBy('exam_id');

        $examsData = $exams->map(function ($exam) use ($userProgresses) {
            $progress = $userProgresses->get($exam->id);
            $examArr = $exam->toArray();
            $examArr['has_taken'] = $progress !== null;
            $examArr['last_score'] = $progress ? $progress->score : null;
            $examArr['last_percentage'] = $progress ? $progress->percentage : null;
            $examArr['progress_status'] = $progress ? $progress->status : null;
            $examArr['progress_result'] = $progress ? [
                'exam_title' => $exam->title,
                'score' => (int) $progress->score,
                'total_possible_score' => (int) $progress->total_possible_score,
                'percentage' => (float) $progress->percentage,
                'status' => $progress->status,
                'time_spent_seconds' => (int) $progress->time_spent_seconds,
                'details' => $progress->answers ?? [],
            ] : null;

            return $examArr;
        });

        return response()->json([
            'success' => true,
            'data' => $examsData,
        ]);
    }

    /**
     * جلب تفاصيل الامتحان وأسئلته لبدء خوض الاختبار أو عرض النتيجة إن كان قد اختبر مسبقاً
     */
    public function show(Request $request, int $id)
    {
        $user = $request->user();

        $exam = Exam::query()
            ->published()
            ->with([
                'subject:id,name,code,icon',
                'unit:id,title,unit_number',
                'lesson:id,title',
                'questions' => function ($q) {
                    $q->where('is_active', true)
                      ->select(['questions.id', 'questions.subject_id', 'questions.unit_id', 'questions.lesson_id', 'questions.question_text', 'questions.type', 'questions.question_image', 'questions.options', 'questions.difficulty', 'questions.points']);
                }
            ])
            ->findOrFail($id);

        // التحقق هل أدى الامتحان مسبقاً
        $progress = StudentProgress::query()
            ->where('user_id', $user->id)
            ->where('exam_id', $id)
            ->latest()
            ->first();

        if ($progress) {
            return response()->json([
                'success' => true,
                'has_taken' => true,
                'message' => 'لقد قمت بأداء هذا الامتحان مسبقاً.',
                'data' => $exam,
                'result' => [
                    'exam_title' => $exam->title,
                    'score' => (int) $progress->score,
                    'total_possible_score' => (int) $progress->total_possible_score,
                    'percentage' => (float) $progress->percentage,
                    'status' => $progress->status,
                    'time_spent_seconds' => (int) $progress->time_spent_seconds,
                    'details' => $progress->answers ?? [],
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'has_taken' => false,
            'data' => $exam,
        ]);
    }

    /**
     * تسليم وتصحيح إجابات الامتحان مع منع تكرار المحاولة
     */
    public function submit(SubmitExamRequest $request, int $examId)
    {
        $userId = $request->user()->id;

        // منع إعادة أداء الامتحان إذا كان قد سلمه مسبقاً
        $alreadyTaken = StudentProgress::query()
            ->where('user_id', $userId)
            ->where('exam_id', $examId)
            ->exists();

        if ($alreadyTaken) {
            return response()->json([
                'success' => false,
                'has_taken' => true,
                'message' => 'عفواً، لقد قمت بأداء هذا الامتحان مسبقاً ولا يمكن إعادة المحاولة.',
            ], 422);
        }

        $validated = $request->validated();

        $result = $this->submitExamUseCase->execute(
            $userId,
            $examId,
            $validated['answers'],
            $validated['time_spent_seconds']
        );

        return response()->json([
            'success' => true,
            'message' => 'تم تسليم الامتحان وتصحيح الإجابات بنجاح.',
            'data' => $result,
        ]);
    }

    /**
     * جلب نتائج الطالب السابقة في هذا الامتحان
     */
    public function results(Request $request, int $examId)
    {
        $userId = $request->user()->id;

        $progressList = StudentProgress::query()
            ->where('user_id', $userId)
            ->where('exam_id', $examId)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $progressList,
        ]);
    }
}
