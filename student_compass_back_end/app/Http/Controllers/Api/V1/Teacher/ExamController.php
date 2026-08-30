<?php

namespace App\Http\Controllers\Api\V1\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Teacher\StoreExamRequest;
use App\Domain\Repositories\ExamRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ExamController extends Controller
{
    public function __construct(
        private ExamRepositoryInterface $examRepository
    ) {}

    /**
     * قائمة الامتحانات لمعلم/مشرف المنصة
     */
    public function index(Request $request)
    {
        $query = Exam::with(['subject:id,name', 'unit:id,title', 'lesson:id,title', 'creator:id,name'])
            ->withCount(['questions', 'progressEntries']);

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }

        $exams = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $exams,
        ]);
    }

    /**
     * عرض تفاصيل الاختبار وأسئلته
     */
    public function show(int $id)
    {
        $exam = Exam::with(['subject:id,name', 'unit:id,title', 'lesson:id,title', 'questions'])
            ->withCount('progressEntries')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $exam,
        ]);
    }

    /**
     * إنشاء وتصميم امتحان جديد
     */
    public function store(StoreExamRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;

        $exam = $this->examRepository->createExam($validated, $validated['questions']);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء وتصميم الامتحان وتخصيص أسئلته بنجاح.',
            'data' => $exam,
        ], Response::HTTP_CREATED);
    }

    /**
     * تحديث بيانات الامتحان
     */
    public function update(Request $request, int $id)
    {
        $exam = Exam::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:practice,assessment,ministerial',
            'duration_minutes' => 'sometimes|required|integer|min:1',
            'total_marks' => 'sometimes|required|integer|min:1',
            'pass_marks' => 'sometimes|required|integer|min:1',
            'is_published' => 'sometimes|required|boolean',
            'questions' => 'nullable|array',
            'questions.*.question_id' => 'required_with:questions|integer|exists:questions,id',
            'questions.*.marks' => 'nullable|integer',
            'questions.*.order' => 'nullable|integer',
        ]);

        $exam->update($request->only([
            'title',
            'type',
            'duration_minutes',
            'total_marks',
            'pass_marks',
            'is_published',
        ]));

        if (isset($validated['questions']) && is_array($validated['questions'])) {
            $pivotData = [];
            foreach ($validated['questions'] as $q) {
                $pivotData[$q['question_id']] = [
                    'marks' => $q['marks'] ?? 1,
                    'order' => $q['order'] ?? 1,
                ];
            }
            $exam->questions()->sync($pivotData);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات الامتحان بنجاح.',
            'data' => $exam->load('questions'),
        ]);
    }

    /**
     * حذف الامتحان
     */
    public function destroy(int $id)
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الامتحان بنجاح.',
        ]);
    }
}
