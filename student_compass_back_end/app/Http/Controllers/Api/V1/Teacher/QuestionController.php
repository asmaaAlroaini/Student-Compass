<?php

namespace App\Http\Controllers\Api\V1\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Teacher\StoreQuestionRequest;
use App\Domain\Repositories\QuestionRepositoryInterface;
use App\Infrastructure\Services\FileStorageService;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class QuestionController extends Controller
{
    public function __construct(
        private QuestionRepositoryInterface $questionRepository,
        private FileStorageService $fileStorageService
    ) {}

    /**
     * استعراض والبحث في بنك الأسئلة للوحة التحكم مع الفلترة الشاملة
     */
    public function index(Request $request)
    {
        $query = Question::with(['subject:id,name', 'unit:id,title', 'lesson:id,title']);

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }
        if ($request->filled('unit_id')) {
            $query->where('unit_id', $request->input('unit_id'));
        }
        if ($request->filled('lesson_id')) {
            $query->where('lesson_id', $request->input('lesson_id'));
        }
        if ($request->filled('year')) {
            $query->where('year', $request->input('year'));
        }
        if ($request->filled('source')) {
            $query->where('source', 'like', '%' . $request->input('source') . '%');
        }
        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->input('difficulty'));
        }
        if ($request->filled('search')) {
            $query->where('question_text', 'like', '%' . $request->input('search') . '%');
        }

        $questions = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $questions,
        ]);
    }

    /**
     * عرض تفاصيل سؤال محدد
     */
    public function show(int $id)
    {
        $question = Question::with(['subject:id,name', 'unit:id,title', 'lesson:id,title'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $question,
        ]);
    }

    public function store(StoreQuestionRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;

        if ($request->hasFile('question_image_file')) {
            $validated['question_image'] = $request->file('question_image_file')->store('questions/images', 'public');
        }

        $question = $this->questionRepository->createQuestion($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة السؤال إلى بنك الأسئلة بنجاح.',
            'data' => $question,
        ], Response::HTTP_CREATED);
    }

    /**
     * تحديث بيانات السؤال مع الفحص الذكي للصور
     */
    public function update(Request $request, int $id)
    {
        $question = Question::findOrFail($id);
        $data = $request->all();

        $imageFile = $request->file('question_image_file');
        if ($imageFile) {
            $data['question_image'] = $this->fileStorageService->updateOrKeepFile($imageFile, $question->question_image, 'questions/images');
        } else {
            unset($data['question_image']);
        }

        $updatedQuestion = $this->questionRepository->updateQuestion($id, $data);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات السؤال بنجاح.',
            'data' => $updatedQuestion,
        ]);
    }

    /**
     * حذف سؤال من بنك الأسئلة
     */
    public function destroy(int $id)
    {
        $question = Question::findOrFail($id);
        $question->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف السؤال من بنك الأسئلة بنجاح.',
        ]);
    }
}
